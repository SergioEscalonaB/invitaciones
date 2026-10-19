"use client";

import React, { useState } from "react";
import { Sparkles, Heart, ChevronDown } from "lucide-react";

interface WaxSealHeroProps {
  celebrantName: string;
  guestName: string;
  allowedGuests: number;
  emotionalQuote: string;
  welcomeMessage: string;
  onOpenInvitation?: () => void;
}

export function WaxSealHero({
  celebrantName,
  guestName,
  allowedGuests,
  emotionalQuote,
  welcomeMessage,
  onOpenInvitation,
}: WaxSealHeroProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    if (onOpenInvitation) onOpenInvitation();

    // Scroll suave a los detalles
    setTimeout(() => {
      const detailsElement = document.getElementById("detalles-evento");
      if (detailsElement) {
        detailsElement.scrollIntoView({ behavior: "smooth" });
      }
    }, 400);
  };

  return (
    <section className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-4 py-16 overflow-hidden">
      {/* Marco ornamental de esquinas doradas */}
      <div className="pointer-events-none absolute inset-4 sm:inset-8 border border-[#D4AF37]/20 rounded-3xl z-10">
        <div className="absolute -top-1.5 -left-1.5 w-6 h-6 border-t-2 border-l-2 border-[#D4AF37]/60" />
        <div className="absolute -top-1.5 -right-1.5 w-6 h-6 border-t-2 border-r-2 border-[#D4AF37]/60" />
        <div className="absolute -bottom-1.5 -left-1.5 w-6 h-6 border-b-2 border-l-2 border-[#D4AF37]/60" />
        <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 border-b-2 border-r-2 border-[#D4AF37]/60" />
      </div>

      <div className="max-w-2xl mx-auto relative z-20 flex flex-col items-center">
        {/* Insignia superior */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel-subtle border-[#D4AF37]/30 mb-6">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span className="font-display-cinzel text-xs tracking-[0.25em] uppercase text-[#F3E5AB]">
            Invitación Especial
          </span>
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
        </div>

        {/* Título de la quinceañera */}
        <p className="text-sm sm:text-base font-light tracking-[0.2em] uppercase text-[#EFC7CF] mb-2">
          Una noche mágica para celebrar los quince años de
        </p>
        <h1 className="font-serif-cormorant text-5xl sm:text-6xl md:text-7xl font-bold text-gold-gradient tracking-tight leading-none mb-4 drop-shadow-[0_4px_16px_rgba(212,175,55,0.3)]">
          {celebrantName}
        </h1>

        {/* Cita emotiva */}
        <blockquote className="font-serif-cormorant italic text-lg sm:text-xl text-[#FAF7F2]/90 max-w-lg mb-8 leading-relaxed">
          {emotionalQuote}
        </blockquote>

        {/* Sello de cera interactivo / Tarjeta real de invitado */}
        <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl glass-panel relative border-[#D4AF37]/40 shadow-2xl transition-all duration-500 hover:border-[#D4AF37]/60">
          {/* Sello de cera dorado */}
          <div className="relative -mt-14 sm:-mt-16 mb-5 flex justify-center">
            <button
              onClick={handleOpen}
              type="button"
              aria-label="Abrir invitación y ver detalles"
              className="group relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#E6D09F] via-[#C59A41] to-[#8C6418] p-1 shadow-[0_8px_25px_rgba(212,175,55,0.45)] border-2 border-[#FFF3D6] cursor-pointer hover:scale-105 active:scale-95 transition-transform animate-wax-pulse"
            >
              <div className="w-full h-full rounded-full border border-[#FFF3D6]/40 flex flex-col items-center justify-center bg-gradient-to-tr from-[#9B7322] via-[#C59A41] to-[#DDB766]">
                <span className="font-display-cinzel text-base sm:text-xl font-bold text-[#1F0712] tracking-widest drop-shadow-sm">
                  XV
                </span>
                <span className="text-[8px] uppercase tracking-tighter text-[#1F0712]/80 font-bold -mt-0.5">
                  Abrir
                </span>
              </div>
            </button>
          </div>

          <div className="space-y-3">
            <span className="text-xs uppercase tracking-[0.2em] text-[#EFC7CF]/80 block">
              Con mucho cariño, invitamos a:
            </span>
            <h2 className="font-serif-cormorant text-2xl sm:text-3xl font-semibold text-[#FAF6F0] leading-snug">
              {guestName}
            </h2>

            <div className="inline-block px-3 py-1 rounded-full bg-[#441328]/60 border border-[#D4AF37]/30 text-xs text-[#F5E8D8]">
              {allowedGuests === 1
                ? "Invitación válida para 1 persona"
                : `Cupo reservado para hasta ${allowedGuests} personas`}
            </div>

            <p className="text-sm text-[#EFC7CF]/90 pt-3 leading-relaxed border-t border-[#D4AF37]/15">
              {welcomeMessage}
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-2.5">
            <button
              onClick={handleOpen}
              className="w-full py-3 px-6 rounded-full bg-gradient-to-r from-[#D7B56E] via-[#CCA044] to-[#B3832B] text-[#14040A] font-semibold text-sm tracking-wide shadow-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span>Ver Detalles de la Celebración</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Indicador de desplazamiento inferior */}
      <div className="absolute bottom-4 inset-x-0 flex justify-center z-20">
        <button
          onClick={handleOpen}
          aria-label="Desplazarse a los detalles"
          className="text-[#D4AF37]/70 hover:text-[#D4AF37] transition-colors flex flex-col items-center gap-1 text-xs"
        >
          <span className="text-[10px] uppercase tracking-widest text-[#EFC7CF]/70">
            Desliza para explorar
          </span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </button>
      </div>
    </section>
  );
}
