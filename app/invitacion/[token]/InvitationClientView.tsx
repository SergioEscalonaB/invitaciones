"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { EventDetails, Invitation } from "@/types/invitation";
import { invitationService } from "@/services/invitationService";
import { InvitationNotFound } from "@/components/InvitationNotFound";
import styles from "./invitation.module.css";

interface Props {
  initialToken: string;
}
type Modal = "confirm" | "decline" | "success" | null;

const chapterNames = [
  "Portada",
  "Hace quince años",
  "Mientras crecía",
  "Se acerca el gran día",
  "La revelación",
  "La invitación",
  "Tu respuesta",
];
const botanical = (
  <svg className={styles.botanical} viewBox="0 0 280 360" aria-hidden="true">
    <path d="M30 350C47 286 70 224 132 170C174 133 194 85 204 18" />
    <path d="M91 211C54 205 35 181 30 151C64 149 87 170 91 211ZM132 170C117 135 125 106 151 86C170 118 162 148 132 170ZM174 117C173 82 190 59 217 49C225 80 208 105 174 117ZM59 276C29 264 15 241 17 215C47 219 64 238 59 276Z" />
    <circle cx="205" cy="29" r="11" />
    <path d="M205 18C194 2 177 13 186 27C173 31 177 48 193 42C199 56 216 48 212 35C228 39 233 22 218 18C216 5 204 6 205 18Z" />
  </svg>
);

export function InvitationClientView({ initialToken }: Props) {
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [event, setEvent] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [scene, setScene] = useState(0);
  const [modal, setModal] = useState<Modal>(null);
  const [guests, setGuests] = useState(1);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successText, setSuccessText] = useState("");
  const [sparkKey, setSparkKey] = useState(0);
  const [leavingScene, setLeavingScene] = useState<number | null>(null);
  const [toastMsg, setToastMsg] = useState("");
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStart = useRef(0);

  useEffect(() => {
    let active = true;
    Promise.all([
      invitationService.getEventDetails(),
      invitationService.getInvitationByToken(initialToken),
    ])
      .then(([eventData, invitationData]) => {
        if (!active) return;
        setEvent(eventData);
        setInvitation(invitationData);
        if (invitationData) {
          setGuests(invitationData.confirmedGuests || 1);
          setNote(invitationData.note || "");
        }
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [initialToken]);

  const eventDate = useMemo(
    () => (event ? new Date(event.date) : null),
    [event],
  );
  const dateParts = useMemo(() => {
    if (!eventDate) return { weekday: "", day: "", month: "", year: "" };
    return {
      weekday: eventDate
        .toLocaleDateString("es-MX", { weekday: "long" })
        .replace(/^\w/, (c) => c.toUpperCase()),
      day: eventDate.toLocaleDateString("es-MX", { day: "numeric" }),
      month: eventDate.toLocaleDateString("es-MX", { month: "long" }),
      year: eventDate.toLocaleDateString("es-MX", { year: "numeric" }),
    };
  }, [eventDate]);

  const go = useCallback(
    (target: number) => {
      const next = Math.max(0, Math.min(target, chapterNames.length - 1));
      if (next === scene) return;
      if (leaveTimer.current) clearTimeout(leaveTimer.current);
      setLeavingScene(scene);
      setScene(next);
      setSparkKey((key) => key + 1);
      leaveTimer.current = setTimeout(() => setLeavingScene(null), 750);
    },
    [scene],
  );

  useEffect(
    () => () => {
      if (leaveTimer.current) clearTimeout(leaveTimer.current);
    },
    [],
  );

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest("button,a,input,select,textarea"))
        return;
      if (["ArrowRight", "PageDown", " ", "Enter"].includes(e.key)) {
        e.preventDefault();
        go(scene + 1);
      }
      if (["ArrowLeft", "PageUp"].includes(e.key)) {
        e.preventDefault();
        go(scene - 1);
      }
    };
    const pointer = (e: PointerEvent) => {
      document.documentElement.style.setProperty(
        "--invite-x",
        String(e.clientX / innerWidth - 0.5),
      );
      document.documentElement.style.setProperty(
        "--invite-y",
        String(e.clientY / innerHeight - 0.5),
      );
    };
    document.addEventListener("keydown", key);
    document.addEventListener("pointermove", pointer, { passive: true });
    return () => {
      document.removeEventListener("keydown", key);
      document.removeEventListener("pointermove", pointer);
    };
  }, [go, scene]);

  const toast = (message: string) => {
    setToastMsg(message);
    setTimeout(() => setToastMsg(""), 2400);
  };

  const openConfirm = () => {
    if (!invitation) return;
    setGuests(invitation.confirmedGuests || 1);
    setNote(invitation.note || "");
    setError("");
    setModal("confirm");
  };
  const openDecline = () => {
    setError("");
    setNote(invitation?.note || "");
    setModal("decline");
  };

  const submitConfirm = async (e: FormEvent) => {
    e.preventDefault();
    if (!invitation) return;
    setSaving(true);
    setError("");
    try {
      const updated = await invitationService.confirmRsvp(invitation.token, {
        confirmedGuests: guests,
        note: note.trim(),
      });
      setInvitation(updated);
      setSuccessText(
        guests === 1
          ? "Te esperamos con mucho cariño."
          : `Esperamos a las ${guests} personas con mucho cariño.`,
      );
      setModal("success");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No pudimos guardar la respuesta.",
      );
    } finally {
      setSaving(false);
    }
  };

  const submitDecline = async () => {
    if (!invitation) return;
    setSaving(true);
    setError("");
    try {
      const updated = await invitationService.declineRsvp(invitation.token, {
        note: note.trim(),
      });
      setInvitation(updated);
      setSuccessText("Gracias por avisarnos. Tu respuesta quedó registrada.");
      setModal("success");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No pudimos guardar la respuesta.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className={styles.loading}>
        <span />
        <p>Preparando tu invitación…</p>
      </div>
    );
  if (!invitation || !event) return <InvitationNotFound />;

  const isLight = [1, 2, 4, 5].includes(scene);
  const cupoText =
    invitation.allowedGuests === 1
      ? "1 cupo reservado"
      : `${invitation.allowedGuests} cupos reservados`;
  const confirmationText =
    invitation.allowedGuests === 1 ? (
      <>
        <strong>{invitation.guestName}</strong>, cuéntanos si nos acompañarás.
        Esta invitación tiene <strong>{cupoText}</strong>.
      </>
    ) : (
      <>
        <strong>{invitation.guestName}</strong>, cuéntanos cuántas personas nos
        acompañarán. Esta invitación tiene <strong>{cupoText}</strong>.
      </>
    );

  const handleMapClick = (e: React.MouseEvent) => {
    if (!event.googleMapsUrl) {
      e.preventDefault();
      toast("Aquí irá el enlace a la ubicación.");
    }
  };

  return (
    <div
      className={`${styles.shell} ${isLight ? styles.onLight : ""}`}
      onDoubleClick={(e) => e.preventDefault()}
      onTouchStart={(e) => {
        touchStart.current = e.changedTouches[0].clientX;
      }}
      onTouchEnd={(e) => {
        const distance = e.changedTouches[0].clientX - touchStart.current;
        if (Math.abs(distance) > 55) go(scene + (distance < 0 ? 1 : -1));
      }}
    >
      <div className={styles.progress}>
        <span
          style={{ width: `${(scene / (chapterNames.length - 1)) * 100}%` }}
        />
      </div>
      {sparkKey > 0 && (
        <span
          key={sparkKey}
          className={styles.transitionSpark}
          aria-hidden="true"
        />
      )}
      <header className={styles.topbar}>
        <span className={styles.monogram}>
          {event.celebrantName.charAt(0)}.
        </span>
        <span>{chapterNames[scene]}</span>
      </header>

      <main className={styles.presentation} aria-live="polite">
        {/* Scene 0 — Portada (dark): stars + orb + small orb */}
        <Scene active={scene === 0} leaving={leavingScene === 0} dark>
          <div className={styles.stars} />
          <div className={styles.orb} />
          <div className={`${styles.orb} ${styles.small}`} />
          <Motes scene={0} />
          <div className={`${styles.content} ${styles.narrow}`}>
            <p className={`${styles.kicker} ${styles.reveal}`}>
              Una historia está por comenzar
            </p>
            <h1
              className={styles.reveal}
              style={{ "--delay": ".32s" } as React.CSSProperties}
            >
              Había una vez
              <br />
              <em>una noche</em>
            </h1>
            <p
              className={`${styles.lead} ${styles.reveal}`}
              style={{ "--delay": ".52s" } as React.CSSProperties}
            >
              Una de esas noches que el tiempo guarda para siempre.
            </p>
            <div
              className={`${styles.forYou} ${styles.reveal}`}
              style={{ "--delay": ".68s" } as React.CSSProperties}
            >
              Preparada para <strong>{invitation.guestName}</strong>
            </div>
          </div>
        </Scene>

        {/* Scene 1 — Hace quince años (light): leaves + botanical */}
        <Scene active={scene === 1} leaving={leavingScene === 1}>
          <LeafDecor />
          <FloralDecor scene={1} />
          <div className={`${styles.content} ${styles.narrow}`}>
            <span className={`${styles.chapter} ${styles.reveal}`}>I</span>
            <p
              className={`${styles.kicker} ${styles.reveal}`}
              style={{ "--delay": ".22s" } as React.CSSProperties}
            >
              Hace quince años
            </p>
            <h2
              className={styles.reveal}
              style={{ "--delay": ".35s" } as React.CSSProperties}
            >
              Llegó una pequeña
              <br />
              <em>estrella</em>
            </h2>
            <p
              className={`${styles.story} ${styles.reveal}`}
              style={{ "--delay": ".52s" } as React.CSSProperties}
            >
              Trajo consigo una luz nueva, una risa capaz de alegrar la casa y
              un montón de sueños todavía por descubrir.
            </p>
            <span
              className={`${styles.flourish} ${styles.reveal}`}
              style={{ "--delay": ".68s" } as React.CSSProperties}
            >
              ✦ ✧ ✦
            </span>
          </div>
        </Scene>

        {/* Scene 2 — Mientras crecía (rose): botanical only */}
        <Scene active={scene === 2} leaving={leavingScene === 2} rose>
          <FloralDecor scene={2} />
          <div className={`${styles.content} ${styles.narrow}`}>
            <span className={`${styles.chapter} ${styles.reveal}`}>II</span>
            <p
              className={`${styles.kicker} ${styles.reveal}`}
              style={{ "--delay": ".22s" } as React.CSSProperties}
            >
              Y el tiempo pasó
            </p>
            <h2
              className={styles.reveal}
              style={{ "--delay": ".35s" } as React.CSSProperties}
            >
              Entre risas, abrazos
              <br />y <em>nuevos sueños</em>
            </h2>
            <p
              className={`${styles.story} ${styles.reveal}`}
              style={{ "--delay": ".52s" } as React.CSSProperties}
            >
              La niña fue encontrando su voz, su camino y esa manera tan suya de
              hacer más bonito todo lo que toca.
            </p>
          </div>
        </Scene>

        {/* Scene 3 — Se acerca el gran día (dark): stars + orb (NO small orb) */}
        <Scene active={scene === 3} leaving={leavingScene === 3} dark>
          <div className={styles.stars} />
          <div className={styles.orb} />
          <Motes scene={3} />
          <div className={`${styles.content} ${styles.narrow}`}>
            <span className={`${styles.chapter} ${styles.reveal}`}>III</span>
            <p
              className={`${styles.kicker} ${styles.reveal}`}
              style={{ "--delay": ".22s" } as React.CSSProperties}
            >
              Ahora
            </p>
            <h2
              className={styles.reveal}
              style={{ "--delay": ".35s" } as React.CSSProperties}
            >
              Se acerca una noche
              <br />
              de <em>mil destellos</em>
            </h2>
            <p
              className={`${styles.lead} ${styles.reveal}`}
              style={{ "--delay": ".52s" } as React.CSSProperties}
            >
              Una noche para celebrar lo vivido, brindar por lo que viene y
              convertir un instante en recuerdo.
            </p>
          </div>
        </Scene>

        {/* Scene 4 — La revelación (light): leaves + botanical */}
        <Scene active={scene === 4} leaving={leavingScene === 4}>
          <LeafDecor />
          <FloralDecor scene={4} />
          <div className={`${styles.content} ${styles.narrow}`}>
            <p className={`${styles.kicker} ${styles.reveal}`}>
              Y esta historia tiene un nombre
            </p>
            <h2
              className={styles.reveal}
              style={{ "--delay": ".3s" } as React.CSSProperties}
            >
              <span>{event.celebrantName}</span>
              <br />
              <em>cumple quince</em>
            </h2>
            <p
              className={`${styles.story} ${styles.reveal}`}
              style={{ "--delay": ".5s" } as React.CSSProperties}
            >
              Pero ningún capítulo importante se escribe a solas. Por eso
              queremos que tú seas parte de esta noche.
            </p>
            <span
              className={`${styles.flourish} ${styles.reveal}`}
              style={{ "--delay": ".68s" } as React.CSSProperties}
            >
              ✦ ✧ ✦
            </span>
          </div>
        </Scene>

        {/* Scene 5 — La invitación (rose): card with event details */}
        <Scene active={scene === 5} leaving={leavingScene === 5} rose>
          <FloralDecor scene={5} />
          <article className={`${styles.card} ${styles.reveal}`}>
            <p className={styles.kicker}>Con mucha alegría</p>
            <h2>{event.celebrantName}</h2>
            <p className={styles.subtitle}>
              te invita a celebrar sus quince años
            </p>
            <div className={styles.facts}>
              <div>
                <span className={styles.factLabel}>Día</span>
                <span className={styles.factValue}>
                  {dateParts.weekday}
                  <br />
                  {dateParts.day} de {dateParts.month}
                </span>
              </div>
              <div>
                <span className={styles.factLabel}>Año</span>
                <span className={styles.factValue}>{dateParts.year}</span>
              </div>
              <div>
                <span className={styles.factLabel}>Hora</span>
                <span className={styles.factValue}>{event.time}</span>
              </div>
              <div>
                <span className={styles.factLabel}>Lugar</span>
                <span className={styles.factValue}>{event.venueName}</span>
              </div>
            </div>
            <a
              className={styles.map}
              href={event.googleMapsUrl || "#"}
              target={event.googleMapsUrl ? "_blank" : undefined}
              rel="noreferrer"
              onClick={handleMapClick}
            >
              Ver ubicación en el mapa ↗
            </a>
          </article>
        </Scene>

        {/* Scene 6 — Tu respuesta (dark): stars ONLY (no orbs) */}
        <Scene active={scene === 6} leaving={leavingScene === 6} dark>
          <div className={styles.stars} />
          <Motes scene={6} />
          <div className={`${styles.content} ${styles.narrow}`}>
            <p className={`${styles.kicker} ${styles.reveal}`}>
              El último detalle eres tú
            </p>
            <h2
              className={styles.reveal}
              style={{ "--delay": ".28s" } as React.CSSProperties}
            >
              ¿Nos acompañas
              <br />a vivir <em>esta historia?</em>
            </h2>
            {invitation.status === "confirmed" ? (
              <Status
                message={`Asistencia confirmada para ${invitation.confirmedGuests} ${invitation.confirmedGuests === 1 ? "persona" : "personas"}.`}
              />
            ) : invitation.status === "declined" ? (
              <Status message="Registraste que no podrás acompañarnos." />
            ) : (
              <p
                className={`${styles.lead} ${styles.reveal}`}
                style={{ "--delay": ".46s" } as React.CSSProperties}
              >
                Tu presencia hará que esta noche brille un poquito más.
              </p>
            )}
            <div
              className={`${styles.actions} ${styles.reveal}`}
              style={{ "--delay": ".6s" } as React.CSSProperties}
            >
              <button onClick={openConfirm}>Sí, allí estaré</button>
              <button className={styles.secondary} onClick={openDecline}>
                Esta vez no podré
              </button>
            </div>
            <p
              className={`${styles.private} ${styles.reveal}`}
              style={{ "--delay": ".72s" } as React.CSSProperties}
            >
              Invitación preparada para <strong>{invitation.guestName}</strong>
            </p>
          </div>
        </Scene>
      </main>

      <p className={styles.hint}>
        {scene === chapterNames.length - 1
          ? "Fin de la historia"
          : "Presiona siguiente para descubrir"}
      </p>
      <nav className={styles.controls} aria-label="Controles de la historia">
        <button
          onClick={() => go(scene - 1)}
          disabled={scene === 0}
          aria-label="Escena anterior"
        >
          ←
        </button>
        <span>
          {String(scene + 1).padStart(2, "0")} —{" "}
          {String(chapterNames.length).padStart(2, "0")}
        </span>
        <button
          onClick={() => go(scene + 1)}
          disabled={scene === chapterNames.length - 1}
          aria-label="Escena siguiente"
        >
          →
        </button>
      </nav>

      {modal && (
        <div
          className={styles.backdrop}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setModal(null);
          }}
        >
          <div className={styles.modal}>
            <button
              className={styles.close}
              onClick={() => setModal(null)}
              aria-label="Cerrar"
            >
              ×
            </button>
            {modal === "confirm" && (
              <form onSubmit={submitConfirm}>
                <p className={styles.kicker}>Qué alegría</p>
                <h3 id="modal-title">¡Te esperamos!</h3>
                <p>{confirmationText}</p>
                <label>
                  Número de asistentes
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                  >
                    {Array.from(
                      { length: invitation.allowedGuests },
                      (_, index) => (
                        <option key={index + 1} value={index + 1}>
                          {index + 1} {index === 0 ? "persona" : "personas"}
                        </option>
                      ),
                    )}
                  </select>
                </label>
                <label>
                  Déjanos un mensaje (opcional)
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Escribe aquí…"
                  />
                </label>
                {error && <p className={styles.error}>{error}</p>}
                <button className={styles.submit} disabled={saving}>
                  {saving ? "Guardando…" : "Confirmar asistencia"}
                </button>
              </form>
            )}
            {modal === "decline" && (
              <div>
                <p className={styles.kicker}>Gracias por avisarnos</p>
                <h3 id="modal-title">¿Confirmas que no podrás venir?</h3>
                <p>
                  Sentiremos que no estés, pero agradecemos mucho que nos
                  cuentes.
                </p>
                {error && <p className={styles.error}>{error}</p>}
                <button
                  className={styles.submit}
                  onClick={submitDecline}
                  disabled={saving}
                >
                  {saving ? "Guardando…" : "Sí, confirmar"}
                </button>
              </div>
            )}
            {modal === "success" && (
              <div className={styles.success}>
                <span>✦</span>
                <h3 id="modal-title">¡Qué emoción!</h3>
                <p>{successText}</p>
                <button
                  className={styles.submit}
                  onClick={() => setModal(null)}
                >
                  Cerrar
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className={`${styles.toast} ${toastMsg ? styles.toastShow : ""}`}>
        {toastMsg}
      </div>
    </div>
  );
}

function Scene({
  active,
  leaving,
  dark = false,
  rose = false,
  children,
}: {
  active: boolean;
  leaving: boolean;
  dark?: boolean;
  rose?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`${styles.scene} ${dark ? styles.dark : rose ? styles.rose : styles.light} ${active ? styles.active : ""} ${leaving ? styles.leaving : ""}`}
      aria-hidden={!active}
    >
      {children}
    </section>
  );
}

function Motes({ scene }: { scene: number }) {
  return (
    <div className={styles.ambient} aria-hidden="true">
      {Array.from({ length: 9 }, (_, i) => (
        <i
          key={i}
          className={styles.mote}
          style={
            {
              "--x": `${((i * 29 + scene * 17) % 94) + 3}%`,
              "--y": `${((i * 47 + scene * 23) % 82) + 7}%`,
              "--s": `${(i % 3) + 2}px`,
              "--speed": `${5 + (i % 4) * 1.3}s`,
              "--wait": `${-i * 0.7}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
function FloralDecor({ scene }: { scene: number }) {
  return (
    <>
      <span className={styles.floralLeft}>{botanical}</span>
      <span className={styles.floralRight}>{botanical}</span>
      <Motes scene={scene} />
    </>
  );
}
function LeafDecor() {
  return (
    <>
      <span className={`${styles.leaf} ${styles.leafLeft}`} aria-hidden="true">
        ❧
      </span>
      <span className={`${styles.leaf} ${styles.leafRight}`} aria-hidden="true">
        ❧
      </span>
    </>
  );
}
function Status({ message }: { message: string }) {
  return (
    <div className={`${styles.status} ${styles.reveal}`}>✦　{message}</div>
  );
}
