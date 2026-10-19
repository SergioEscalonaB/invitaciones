"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, HelpCircle, ArrowLeft } from "lucide-react";
import { FairyDust } from "./FairyDust";

export function InvitationNotFound() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <FairyDust />

      <div className="relative z-10 max-w-md w-full glass-panel p-8 rounded-3xl border-[#D4AF37]/30 shadow-2xl space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-[#441328]/70 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] mx-auto shadow-[0_0_20px_rgba(212,175,55,0.2)]">
          <HelpCircle className="w-7 h-7" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1D060F] border border-[#D4AF37]/25 text-xs text-[#D4AF37]">
          <Sparkles className="w-3 h-3" />
          <span>Enlace no localizado</span>
        </div>

        <h1 className="font-serif-cormorant text-3xl font-bold text-[#FAF6F0]">
          Invitación No Encontrada
        </h1>

        <p className="text-sm text-[#EFC7CF] leading-relaxed">
          No pudimos localizar una invitación asociada a este enlace. Puede que el vínculo haya sido escrito de forma incompleta o ya no esté disponible.
        </p>

        <div className="p-4 rounded-2xl bg-[#18040C]/80 border border-[#D4AF37]/15 text-xs text-[#EFC7CF]/80 text-left">
          <p className="font-medium text-[#FAF6F0] mb-1">¿Qué puedes hacer?</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Verifica haber abierto el enlace completo recibido por mensaje.</li>
            <li>Ponte en contacto con la familia anfitriona para confirmar tu enlace personalizado.</li>
          </ul>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 w-full py-3 px-5 rounded-full bg-[#2C0B18] hover:bg-[#441328] text-[#F3E5AB] border border-[#D4AF37]/30 text-xs font-semibold tracking-wide transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Ir a la página principal</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
