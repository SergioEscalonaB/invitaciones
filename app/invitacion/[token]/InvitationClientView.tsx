"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  Heart,
  Users,
  Edit3,
} from "lucide-react";
import { Invitation, EventDetails } from "@/types/invitation";
import { invitationService } from "@/services/invitationService";
import { FairyDust } from "@/components/FairyDust";
import { MusicPlayer } from "@/components/MusicPlayer";
import { WaxSealHero } from "@/components/WaxSealHero";
import { CountdownTimer } from "@/components/CountdownTimer";
import { EventDetailsSection } from "@/components/EventDetailsSection";
import { ItineraryTimeline } from "@/components/ItineraryTimeline";
import { GiftsSection } from "@/components/GiftsSection";
import { RsvpModal } from "@/components/RsvpModal";
import { DeclineModal } from "@/components/DeclineModal";
import { InvitationNotFound } from "@/components/InvitationNotFound";

interface InvitationClientViewProps {
  initialToken: string;
}

export function InvitationClientView({ initialToken }: InvitationClientViewProps) {
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [event, setEvent] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState(true);

  // Modales
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [eventData, invitationData] = await Promise.all([
          invitationService.getEventDetails(),
          invitationService.getInvitationByToken(initialToken),
        ]);
        setEvent(eventData);
        setInvitation(invitationData);
      } catch (err) {
        console.error("Error al cargar la invitación:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [initialToken]);

  const handleUpdateSuccess = (updated: Invitation) => {
    setInvitation(updated);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#14040A]">
        <FairyDust />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-[#D4AF37]/30 border-t-[#D4AF37] animate-spin" />
          <p className="font-serif-cormorant text-xl text-[#F3E5AB] tracking-widest uppercase">
            Cargando Invitación Real...
          </p>
        </div>
      </div>
    );
  }

  if (!invitation || !event) {
    return <InvitationNotFound />;
  }

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden selection:bg-[#cca044]/30">
      <FairyDust />
      <MusicPlayer />

      {/* Barra de estado actual superior */}
      <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-[#18050E]/80 border-b border-[#D4AF37]/15 px-4 py-2.5">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="font-serif-cormorant text-sm sm:text-base text-[#FAF6F0] font-medium hidden xs:inline">
              XV Años de {event.celebrantName}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {invitation.status === "confirmed" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/70 text-emerald-300 border border-emerald-500/40 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Confirmada ({invitation.confirmedGuests} {invitation.confirmedGuests === 1 ? "pase" : "pases"})</span>
              </span>
            )}
            {invitation.status === "declined" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900/80 text-rose-300 border border-rose-500/30 font-medium">
                <XCircle className="w-3.5 h-3.5" />
                <span>No podrás asistir</span>
              </span>
            )}
            {(invitation.status === "pending" || invitation.status === "sent") && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#441328]/70 text-[#F3E5AB] border border-[#D4AF37]/30 font-medium">
                <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Confirmación pendiente</span>
              </span>
            )}

            <button
              onClick={() => setIsConfirmModalOpen(true)}
              className="p-1 rounded-lg text-[#D4AF37] hover:text-[#FFF3D6] hover:bg-[#441328]/50 transition-colors"
              title="Cambiar respuesta de confirmación"
              aria-label="Cambiar respuesta de confirmación"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Portada Hero con Sello de Cera y Saludo Personalizado */}
      <WaxSealHero
        celebrantName={event.celebrantName}
        guestName={invitation.guestName}
        allowedGuests={invitation.allowedGuests}
        emotionalQuote={event.emotionalQuote}
        welcomeMessage={event.welcomeMessage}
        onOpenInvitation={() => {}}
      />

      {/* Banner de Estado de la Invitación */}
      <section className="w-full max-w-2xl mx-auto px-4 my-4">
        {invitation.status === "confirmed" && (
          <div className="p-5 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-emerald-300 font-semibold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>¡Asistencia Confirmada para {invitation.confirmedGuests} {invitation.confirmedGuests === 1 ? "persona" : "personas"}!</span>
            </div>
            {invitation.attendees && invitation.attendees.length > 0 && (
              <p className="text-xs text-emerald-200/80">
                Asistentes registrados: {invitation.attendees.join(", ")}
              </p>
            )}
            {invitation.note && (
              <p className="text-xs italic text-[#EFC7CF] border-t border-emerald-500/20 pt-2 mt-2">
                «{invitation.note}»
              </p>
            )}
            <button
              onClick={() => setIsConfirmModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs text-[#D4AF37] underline hover:text-[#FFF3D6] pt-1"
            >
              <Edit3 className="w-3 h-3" />
              <span>Modificar número de asistentes o dedicatoria</span>
            </button>
          </div>
        )}

        {invitation.status === "declined" && (
          <div className="p-5 rounded-2xl bg-stone-900/60 border border-rose-500/30 text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-rose-300 font-medium text-sm">
              <XCircle className="w-4 h-4" />
              <span>Registraste que no podrás asistir a la celebración</span>
            </div>
            {invitation.note && (
              <p className="text-xs italic text-[#EFC7CF]/80">
                «{invitation.note}»
              </p>
            )}
            <button
              onClick={() => setIsConfirmModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs text-[#D4AF37] underline hover:text-[#FFF3D6] pt-1"
            >
              <span>¿Cambiaste de planes? Confirmar asistencia ahora</span>
            </button>
          </div>
        )}
      </section>

      {/* Contador regresivo */}
      <CountdownTimer
        targetDateStr={event.date}
        celebrantName={event.celebrantName}
      />

      {/* Detalles del evento, mapa, calendario */}
      <EventDetailsSection
        event={event}
        onOpenRsvpConfirm={() => setIsConfirmModalOpen(true)}
        onOpenRsvpDecline={() => setIsDeclineModalOpen(true)}
      />

      {/* Cronograma / Itinerario */}
      <ItineraryTimeline items={event.itinerary} />

      {/* Lluvia de sobres */}
      <GiftsSection giftsInfo={event.giftsInfo} />

      {/* Cierre cálido y Pie de página */}
      <footer className="w-full mt-auto py-12 px-4 border-t border-[#D4AF37]/20 bg-[#120308]/90 text-center relative z-10">
        <div className="max-w-md mx-auto space-y-4">
          <div className="flex justify-center">
            <Heart className="w-5 h-5 text-[#D4AF37] fill-[#D4AF37]/40 animate-pulse" />
          </div>

          <h4 className="font-serif-cormorant text-2xl font-bold text-[#FAF6F0]">
            Una Noche Inolvidable
          </h4>

          <p className="text-xs text-[#EFC7CF] leading-relaxed">
            Esta invitación es personal e intransferible, reservada especialmente para{" "}
            <strong className="text-[#F3E5AB]">{invitation.guestName}</strong>.
          </p>

          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent mx-auto my-2" />

          <p className="text-[11px] text-[#FAF6F0]/50 tracking-wider">
            Celebración de los Quince Años de {event.celebrantName} &bull; Diciembre 2026
          </p>
        </div>
      </footer>

      {/* Modales de RSVP */}
      <RsvpModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        invitation={invitation}
        celebrantName={event.celebrantName}
        onSuccess={handleUpdateSuccess}
      />

      <DeclineModal
        isOpen={isDeclineModalOpen}
        onClose={() => setIsDeclineModalOpen(false)}
        invitation={invitation}
        celebrantName={event.celebrantName}
        onSuccess={handleUpdateSuccess}
      />
    </div>
  );
}
