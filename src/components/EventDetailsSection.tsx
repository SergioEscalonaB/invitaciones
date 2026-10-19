"use client";

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  CalendarPlus,
  Shirt,
  Church,
  HeartHandshake,
} from "lucide-react";
import { EventDetails } from "@/types/invitation";

interface EventDetailsSectionProps {
  event: EventDetails;
  onOpenRsvpConfirm: () => void;
  onOpenRsvpDecline: () => void;
}

export function EventDetailsSection({
  event,
  onOpenRsvpConfirm,
  onOpenRsvpDecline,
}: EventDetailsSectionProps) {
  const [copiedAddress, setCopiedAddress] = useState(false);

  // Formato en español para la fecha
  const formattedDate = new Date(event.date).toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const capitalizedDate =
    formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(`${event.venueName}, ${event.venueAddress}`);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2500);
    } catch {
      // Fallback
    }
  };

  // Generador de enlace a Google Calendar
  const getGoogleCalendarUrl = () => {
    const startDate = new Date(event.date);
    // Asumir duración de 6 horas
    const endDate = new Date(startDate.getTime() + 6 * 60 * 60 * 1000);

    const formatGCal = (d: Date) =>
      d.toISOString().replace(/-|:|\.\d\d\d/g, "");

    const title = encodeURIComponent(`XV Años de ${event.celebrantName}`);
    const details = encodeURIComponent(
      `Celebración de Quince Años de ${event.celebrantName}.\nLugar: ${event.venueName}\nCódigo de vestimenta: ${event.dressCode}`
    );
    const location = encodeURIComponent(`${event.venueName}, ${event.venueAddress}`);

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formatGCal(
      startDate
    )}/${formatGCal(endDate)}&details=${details}&location=${location}`;
  };

  // Descarga de archivo .ics para Apple Calendar / Outlook
  const handleDownloadIcs = () => {
    const startDate = new Date(event.date);
    const endDate = new Date(startDate.getTime() + 6 * 60 * 60 * 1000);

    const pad = (n: number) => (n < 10 ? "0" + n : n);
    const formatIcs = (d: Date) =>
      `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(
        d.getUTCHours()
      )}${pad(d.getUTCMinutes())}00Z`;

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Invitacion Quince Años//ES",
      "BEGIN:VEVENT",
      `UID:${Date.now()}@invitacion.quinceanera`,
      `DTSTAMP:${formatIcs(new Date())}`,
      `DTSTART:${formatIcs(startDate)}`,
      `DTEND:${formatIcs(endDate)}`,
      `SUMMARY:XV Años de ${event.celebrantName}`,
      `DESCRIPTION:Celebración de Quince Años de ${event.celebrantName}\\nCódigo de Vestimenta: ${event.dressCode}`,
      `LOCATION:${event.venueName}, ${event.venueAddress}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", `XV-Anos-${event.celebrantName.replace(/\s+/g, "-")}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="detalles-evento" className="w-full max-w-4xl mx-auto px-4 py-12 scroll-mt-6">
      <div className="text-center mb-10">
        <span className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-medium flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          Coordenadas de la Celebración
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
        </span>
        <h2 className="font-serif-cormorant text-3xl sm:text-4xl md:text-5xl font-bold text-[#FAF6F0] mt-2">
          Detalles del Evento
        </h2>
        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-4" />
      </div>

      {/* Cuadrícula de tarjetas con detalles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Fecha y Hora */}
        <div className="glass-panel p-6 sm:p-7 rounded-3xl relative overflow-hidden group hover:border-[#D4AF37]/50 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-[#441328]/80 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] mb-4">
            <Calendar className="w-6 h-6" />
          </div>
          <span className="text-xs uppercase tracking-wider text-[#EFC7CF] font-medium block">
            Cuándo
          </span>
          <h3 className="font-serif-cormorant text-2xl font-bold text-[#FAF6F0] mt-1 mb-2">
            {capitalizedDate}
          </h3>
          <div className="flex items-center gap-2 text-[#D4AF37] font-medium text-base mb-5">
            <Clock className="w-4 h-4" />
            <span>{event.time}</span>
          </div>

          <div className="flex flex-wrap gap-2.5 pt-4 border-t border-[#D4AF37]/15">
            <a
              href={getGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium bg-[#2C0B18] text-[#F3E5AB] border border-[#D4AF37]/30 hover:border-[#D4AF37]/70 hover:bg-[#441328] transition-colors"
            >
              <CalendarPlus className="w-3.5 h-3.5" />
              <span>Google Calendar</span>
            </a>
            <button
              onClick={handleDownloadIcs}
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium bg-[#1D060F] text-[#EFC7CF] border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 hover:text-[#FAF6F0] transition-colors"
            >
              <span>Apple / Outlook (.ics)</span>
            </button>
          </div>
        </div>

        {/* Lugar y Ubicación */}
        <div className="glass-panel p-6 sm:p-7 rounded-3xl relative overflow-hidden group hover:border-[#D4AF37]/50 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-[#441328]/80 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] mb-4">
            <MapPin className="w-6 h-6" />
          </div>
          <span className="text-xs uppercase tracking-wider text-[#EFC7CF] font-medium block">
            Dónde
          </span>
          <h3 className="font-serif-cormorant text-2xl font-bold text-[#FAF6F0] mt-1 mb-2">
            {event.venueName}
          </h3>
          <p className="text-sm text-[#FAF6F0]/85 mb-5 leading-relaxed">
            {event.venueAddress}
          </p>

          <div className="flex flex-wrap gap-2.5 pt-4 border-t border-[#D4AF37]/15">
            {event.googleMapsUrl && (
              <a
                href={event.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium bg-gradient-to-r from-[#D7B56E] to-[#B3832B] text-[#14040A] font-semibold hover:brightness-110 transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Abrir en Google Maps</span>
              </a>
            )}
            <button
              onClick={handleCopyAddress}
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium bg-[#2C0B18] text-[#F3E5AB] border border-[#D4AF37]/30 hover:border-[#D4AF37]/60 transition-colors"
            >
              {copiedAddress ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">¡Dirección copiada!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Dirección</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Código de Vestimenta */}
        <div className="glass-panel p-6 sm:p-7 rounded-3xl relative overflow-hidden md:col-span-2 group hover:border-[#D4AF37]/50 transition-all">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#441328]/80 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                <Shirt className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-[#EFC7CF] font-medium block">
                  Dress Code
                </span>
                <h3 className="font-serif-cormorant text-2xl font-bold text-[#FAF6F0]">
                  {event.dressCode}
                </h3>
              </div>
            </div>

            {/* Guía de colores */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1D060F]/80 border border-[#D4AF37]/20 text-xs text-[#EFC7CF]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#5C1A35] border border-[#D4AF37]/40" />
              <span>Reserva tonos borgoña para Valentina</span>
            </div>
          </div>

          <p className="text-sm text-[#FAF6F0]/85 leading-relaxed">
            {event.dressCodeDetails}
          </p>
        </div>

        {/* Padres y Padrinos */}
        {(event.parentsNames || event.godparentsNames) && (
          <div className="glass-panel p-6 sm:p-7 rounded-3xl relative overflow-hidden md:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {event.parentsNames && (
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#D4AF37] font-medium block mb-1">
                    Con la bendición de mis padres:
                  </span>
                  <p className="font-serif-cormorant text-xl font-semibold text-[#FAF6F0]">
                    {event.parentsNames.father} & {event.parentsNames.mother}
                  </p>
                </div>
              )}
              {event.godparentsNames && (
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#D4AF37] font-medium block mb-1">
                    Mis queridos padrinos:
                  </span>
                  <p className="font-serif-cormorant text-xl font-semibold text-[#FAF6F0]">
                    {event.godparentsNames}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Botones de acción rápida RSVP */}
      <div className="my-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#2C0B18]/90 to-[#1A050E]/95 border border-[#D4AF37]/40 shadow-2xl text-center">
        <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold block mb-2">
          Tu presencia hace la diferencia
        </span>
        <h3 className="font-serif-cormorant text-2xl sm:text-3xl font-bold text-[#FAF6F0] mb-3">
          ¿Nos acompañas en esta noche de cuento de hadas?
        </h3>
        <p className="text-xs sm:text-sm text-[#EFC7CF] max-w-md mx-auto mb-6">
          Agradecemos confirmar antes del{" "}
          <strong className="text-[#F3E5AB]">{event.rsvpDeadline}</strong> para preparar tu
          lugar especial.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
          <button
            onClick={onOpenRsvpConfirm}
            type="button"
            className="w-full sm:w-auto flex-1 py-3.5 px-6 rounded-full bg-gradient-to-r from-[#D7B56E] via-[#CCA044] to-[#B3832B] text-[#14040A] font-bold text-sm tracking-wide shadow-xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Confirmar Asistencia</span>
          </button>
          <button
            onClick={onOpenRsvpDecline}
            type="button"
            className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#1D060F] hover:bg-[#2C0B18] text-[#EFC7CF] hover:text-[#FAF6F0] border border-[#D4AF37]/25 text-sm font-medium transition-colors"
          >
            <span>No podré asistir</span>
          </button>
        </div>
      </div>
    </section>
  );
}
