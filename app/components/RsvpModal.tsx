"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Sparkles,
  Users,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Heart,
  Plus,
  Minus,
} from "lucide-react";
import confetti from "canvas-confetti";
import { Invitation, RsvpConfirmationPayload } from "@/types/invitation";
import { invitationService } from "@/services/invitationService";

interface RsvpModalProps {
  isOpen: boolean;
  onClose: () => void;
  invitation: Invitation;
  celebrantName: string;
  onSuccess: (updated: Invitation) => void;
}

export function RsvpModal({
  isOpen,
  onClose,
  invitation,
  celebrantName,
  onSuccess,
}: RsvpModalProps) {
  const [confirmedGuests, setConfirmedGuests] = useState<number>(
    invitation.confirmedGuests > 0
      ? invitation.confirmedGuests
      : Math.min(1, invitation.allowedGuests),
  );
  const [attendees, setAttendees] = useState<string[]>(
    invitation.attendees && invitation.attendees.length > 0
      ? invitation.attendees
      : [invitation.guestName],
  );
  const [note, setNote] = useState<string>(invitation.note || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Sincronizar estado cuando la invitación cambia
  useEffect(() => {
    if (invitation) {
      const initialGuests =
        invitation.confirmedGuests > 0
          ? invitation.confirmedGuests
          : Math.min(1, invitation.allowedGuests);
      setConfirmedGuests(initialGuests);

      // Generar array de asistentes según initialGuests
      const initialAttendees =
        invitation.attendees && invitation.attendees.length > 0
          ? [...invitation.attendees]
          : [invitation.guestName];

      while (initialAttendees.length < initialGuests) {
        initialAttendees.push("");
      }
      setAttendees(initialAttendees.slice(0, initialGuests));
      setNote(invitation.note || "");
      setIsSuccess(false);
      setError(null);
    }
  }, [invitation, isOpen]);

  if (!isOpen) return null;

  const handleGuestsCountChange = (count: number) => {
    if (count < 1 || count > invitation.allowedGuests) return;
    setConfirmedGuests(count);

    // Ajustar campos de nombres de asistentes
    const updatedAttendees = [...attendees];
    if (count > updatedAttendees.length) {
      while (updatedAttendees.length < count) {
        updatedAttendees.push("");
      }
    } else {
      updatedAttendees.length = count;
    }
    setAttendees(updatedAttendees);
  };

  const handleAttendeeNameChange = (index: number, name: string) => {
    const updated = [...attendees];
    updated[index] = name;
    setAttendees(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validación preventiva
    if (confirmedGuests > invitation.allowedGuests) {
      setError(
        `No es posible confirmar más de ${invitation.allowedGuests} personas.`,
      );
      return;
    }

    if (confirmedGuests < 1) {
      setError("Por favor indica al menos 1 asistente.");
      return;
    }

    setLoading(true);

    try {
      const payload: RsvpConfirmationPayload = {
        confirmedGuests,
        attendees: attendees.filter((a) => a.trim().length > 0),
        note: note.trim(),
      };

      const updated = await invitationService.confirmRsvp(
        invitation.token,
        payload,
      );

      // Disparar confeti mágico de celebración
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#D4AF37", "#F7E2E6", "#C59A41", "#FAF7F2"],
        });
      } catch {
        // En caso de entorno sin canvas
      }

      setIsSuccess(true);
      onSuccess(updated);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Ocurrió un error al enviar tu confirmación. Intenta de nuevo.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="rsvp-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg rounded-3xl glass-panel p-6 sm:p-8 border-[#D4AF37]/50 shadow-[0_20px_60px_rgba(0,0,0,0.8)] max-h-[90vh] overflow-y-auto">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Cerrar ventana"
          className="absolute top-5 right-5 p-2 rounded-full text-[#EFC7CF]/70 hover:text-[#FAF6F0] hover:bg-[#441328]/50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-300">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-semibold block">
              ¡Confirmación Recibida!
            </span>
            <h3 className="font-serif-cormorant text-3xl font-bold text-[#FAF6F0]">
              ¡Qué alegría tenerte con nosotros!
            </h3>

            <p className="text-sm text-[#EFC7CF] leading-relaxed">
              Hemos reservado con mucho cariño{" "}
              <strong className="text-[#F3E5AB]">
                {confirmedGuests} {confirmedGuests === 1 ? "pase" : "pases"}
              </strong>{" "}
              para {invitation.guestName}.
            </p>

            <div className="p-4 rounded-2xl bg-[#1D060F]/80 border border-[#D4AF37]/20 text-xs text-[#FAF6F0]/80">
              <p>
                Si requieres realizar algún cambio antes de la fecha límite,
                puedes volver a abrir tu enlace en cualquier momento.
              </p>
            </div>

            <button
              onClick={onClose}
              type="button"
              className="w-full py-3 px-6 rounded-full bg-gradient-to-r from-[#D7B56E] via-[#CCA044] to-[#B3832B] text-[#14040A] font-bold text-sm tracking-wide shadow-lg hover:brightness-110 transition-all mt-4"
            >
              Cerrar y ver invitación
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#441328]/60 border border-[#D4AF37]/30 text-xs text-[#F3E5AB] mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Confirmar Asistencia</span>
              </div>
              <h3
                id="rsvp-modal-title"
                className="font-serif-cormorant text-2xl sm:text-3xl font-bold text-[#FAF6F0]"
              >
                {invitation.guestName}
              </h3>
              <p className="text-xs sm:text-sm text-[#EFC7CF]/80 mt-1">
                Cupo reservado para tu invitación:{" "}
                <strong className="text-[#F3E5AB]">
                  hasta {invitation.allowedGuests}{" "}
                  {invitation.allowedGuests === 1 ? "persona" : "personas"}
                </strong>
                .
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="p-3.5 rounded-2xl bg-rose-950/70 border border-rose-500/50 flex items-start gap-2.5 text-xs text-rose-200"
              >
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Selector de número de asistentes */}
            <div className="p-4 rounded-2xl bg-[#1D060F]/80 border border-[#D4AF37]/25 space-y-2">
              <label className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold block">
                ¿Cuántas personas asistirán?
              </label>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-[#EFC7CF]">
                  Pases a utilizar (máx. {invitation.allowedGuests})
                </span>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleGuestsCountChange(confirmedGuests - 1)}
                    disabled={confirmedGuests <= 1}
                    aria-label="Disminuir asistentes"
                    className="w-8 h-8 rounded-full bg-[#2C0B18] border border-[#D4AF37]/30 text-[#FAF6F0] flex items-center justify-center hover:bg-[#441328] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>

                  <span className="font-display-cinzel text-xl font-bold text-[#F3E5AB] w-6 text-center">
                    {confirmedGuests}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleGuestsCountChange(confirmedGuests + 1)}
                    disabled={confirmedGuests >= invitation.allowedGuests}
                    aria-label="Aumentar asistentes"
                    className="w-8 h-8 rounded-full bg-[#2C0B18] border border-[#D4AF37]/30 text-[#FAF6F0] flex items-center justify-center hover:bg-[#441328] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Nombres de los asistentes */}
            <div className="space-y-3">
              <label className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold block">
                Nombres de los asistentes (Opcional)
              </label>

              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {Array.from({ length: confirmedGuests }).map((_, idx) => (
                  <div key={idx} className="relative">
                    <input
                      type="text"
                      placeholder={`Nombre del asistente #${idx + 1}`}
                      value={attendees[idx] || ""}
                      onChange={(e) =>
                        handleAttendeeNameChange(idx, e.target.value)
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#18040C] border border-[#D4AF37]/25 text-[#FAF6F0] placeholder-[#FAF6F0]/30 text-xs focus:outline-none focus:border-[#D4AF37] transition-colors"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Mensaje con buenos deseos */}
            <div className="space-y-2">
              <label
                htmlFor="rsvp-note"
                className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold flex items-center gap-1.5"
              >
                <Heart className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Dedicatoria o Mensaje Especial (Opcional)</span>
              </label>
              <textarea
                id="rsvp-note"
                rows={3}
                placeholder={`Escribe unas palabras para ${celebrantName} o su familia...`}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#18040C] border border-[#D4AF37]/25 text-[#FAF6F0] placeholder-[#FAF6F0]/30 text-xs focus:outline-none focus:border-[#D4AF37] transition-colors resize-none"
              />
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#D7B56E] via-[#CCA044] to-[#B3832B] text-[#14040A] font-bold text-sm tracking-wide shadow-xl hover:brightness-110 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Guardando confirmación...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>
                      Confirmar {confirmedGuests}{" "}
                      {confirmedGuests === 1 ? "Lugar" : "Lugares"}
                    </span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="py-2.5 text-xs text-[#EFC7CF]/70 hover:text-[#FAF6F0] transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
