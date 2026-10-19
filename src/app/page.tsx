import Link from "next/link";
import {
  Sparkles,
  Heart,
  Crown,
  Calendar,
  Users,
  Settings,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { FairyDust } from "@/components/FairyDust";
import { MusicPlayer } from "@/components/MusicPlayer";
import { defaultEventDetails, defaultMockInvitations } from "@/data/event";

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#14040A] text-[#FAF6F0] selection:bg-[#cca044]/30 flex flex-col justify-between">
      <FairyDust />
      <MusicPlayer />

      {/* Header sutil */}
      <header className="relative z-10 w-full px-4 py-5 max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Crown className="w-5 h-5 text-[#D4AF37]" />
          <span className="font-serif-cormorant text-xl font-bold tracking-wide text-gold-gradient">
            XV Años &bull; Valentina Sofía
          </span>
        </div>

        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#2C0B18] text-[#F3E5AB] border border-[#D4AF37]/30 text-xs font-semibold hover:border-[#D4AF37]/70 hover:bg-[#441328] transition-colors"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Panel Administrativo</span>
        </Link>
      </header>

      {/* Hero Central */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 py-12 text-center space-y-8 my-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel-subtle border-[#D4AF37]/30 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span className="font-display-cinzel text-xs tracking-[0.25em] uppercase text-[#F3E5AB]">
            Invitación Digital Interactiva
          </span>
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
        </div>

        <h1 className="font-serif-cormorant text-5xl sm:text-6xl md:text-7xl font-bold text-gold-gradient tracking-tight leading-tight">
          Una Noche de Cuento de Hadas
        </h1>

        <p className="font-serif-cormorant italic text-xl sm:text-2xl text-[#FAF7F2]/90 max-w-2xl mx-auto leading-relaxed">
          {defaultEventDetails.welcomeMessage}
        </p>

        {/* Tarjeta de Acceso Rápido a Invitaciones de Ejemplo */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-2xl mx-auto border-[#D4AF37]/40 shadow-2xl text-left space-y-5">
          <div className="flex items-center justify-between border-b border-[#D4AF37]/15 pb-4">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold block">
                Demostración de Experiencia de Invitado
              </span>
              <h2 className="font-serif-cormorant text-2xl font-bold text-[#FAF6F0] mt-0.5">
                Selecciona una Invitación Personalizada
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#441328] text-xs text-[#F3E5AB] border border-[#D4AF37]/30 font-medium">
              /invitacion/[token]
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#EFC7CF] leading-relaxed">
            Cada invitado o familia recibe su propio enlace exclusivo por WhatsApp. Haz clic en cualquiera de las siguientes para probar el flujo real de confirmación:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {defaultMockInvitations.slice(0, 4).map((inv) => (
              <Link
                key={inv.id}
                href={`/invitacion/${inv.token}`}
                className="group p-4 rounded-2xl bg-[#1D060F]/80 hover:bg-[#2C0B18] border border-[#D4AF37]/25 hover:border-[#D4AF37]/60 transition-all flex items-center justify-between"
              >
                <div>
                  <h3 className="font-semibold text-xs sm:text-sm text-[#FAF6F0] group-hover:text-[#FFF3D6] transition-colors">
                    {inv.guestName}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-[#FAF6F0]/60 mt-1">
                    <span>Cupo: {inv.allowedGuests} {inv.allowedGuests === 1 ? "persona" : "personas"}</span>
                    <span>&bull;</span>
                    <span
                      className={
                        inv.status === "confirmed"
                          ? "text-emerald-400 font-medium"
                          : inv.status === "declined"
                          ? "text-rose-400 font-medium"
                          : "text-[#F3E5AB]"
                      }
                    >
                      {inv.status === "confirmed"
                        ? "Confirmada"
                        : inv.status === "declined"
                        ? "Declinada"
                        : "Pendiente"}
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-[#D4AF37]/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#EFC7CF]/80">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Validación de cupo estricta y protección de privacidad</span>
            </div>

            <Link
              href="/admin"
              className="text-[#D4AF37] hover:underline font-semibold flex items-center gap-1"
            >
              <span>Ir al Panel de Gestión</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-8 px-4 border-t border-[#D4AF37]/15 text-center text-xs text-[#FAF6F0]/60">
        <p>
          Invitaciones Digitales de Quince Años &bull; Diseñado con elegancia nocturna, calidez y romanticismo.
        </p>
      </footer>
    </div>
  );
}
