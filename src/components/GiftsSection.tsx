"use client";

import React, { useState } from "react";
import { Mail, Sparkles, Copy, Check, Heart } from "lucide-react";
import { EventDetails } from "@/types/invitation";

interface GiftsSectionProps {
  giftsInfo: EventDetails["giftsInfo"];
}

export function GiftsSection({ giftsInfo }: GiftsSectionProps) {
  const [copiedBank, setCopiedBank] = useState(false);

  const handleCopyBank = async () => {
    if (!giftsInfo.bankDetails) return;
    try {
      await navigator.clipboard.writeText(giftsInfo.bankDetails);
      setCopiedBank(true);
      setTimeout(() => setCopiedBank(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <section className="w-full max-w-2xl mx-auto px-4 py-12">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl text-center relative overflow-hidden border-[#D4AF37]/30 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-[#441328]/80 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] mx-auto mb-4 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
          <Mail className="w-7 h-7" />
        </div>

        <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold block mb-1">
          Sugerencia de Presente
        </span>
        <h3 className="font-serif-cormorant text-2xl sm:text-3xl font-bold text-[#FAF6F0] mb-3">
          {giftsInfo.title}
        </h3>

        <p className="text-sm text-[#EFC7CF] leading-relaxed max-w-lg mx-auto mb-6">
          {giftsInfo.description}
        </p>

        {giftsInfo.bankDetails && (
          <div className="p-4 rounded-2xl bg-[#1D060F]/80 border border-[#D4AF37]/25 text-left max-w-lg mx-auto mb-6">
            <span className="text-[11px] uppercase tracking-wider text-[#D4AF37] font-semibold block mb-1">
              Datos para transferencia bancaria
            </span>
            <p className="text-xs sm:text-sm text-[#FAF6F0] font-mono select-all break-all mb-3">
              {giftsInfo.bankDetails}
            </p>
            <button
              onClick={handleCopyBank}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#2C0B18] text-[#F3E5AB] border border-[#D4AF37]/30 hover:border-[#D4AF37]/70 hover:bg-[#441328] transition-colors"
            >
              {copiedBank ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">¡Datos copiados!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar datos de cuenta</span>
                </>
              )}
            </button>
          </div>
        )}

        <div className="pt-4 border-t border-[#D4AF37]/15 flex items-center justify-center gap-2 text-xs text-[#EFC7CF]/80">
          <Heart className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]/60" />
          <span>¡Gracias de todo corazón por ser parte de este sueño!</span>
        </div>
      </div>
    </section>
  );
}
