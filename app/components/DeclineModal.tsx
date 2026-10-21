"use client";

import React, { useState } from "react";
import { X, AlertCircle, Heart, Loader2 } from "lucide-react";
import { Invitation, RsvpDeclinePayload } from "@/types/invitation";
import { invitationService } from "@/services/invitationService";

interface DeclineModalProps {
  isOpen: boolean;
  onClose: () => void;
  invitation: Invitation;
  celebrantName: string;
  onSuccess: (updated: Invitation) => void;
}

export function DeclineModal({
  isOpen,
  onClose,
  invitation,
  celebrantName,
  onSuccess,
}: DeclineModalProps) {
  const [note, setNote] = useState<string>(invitation.note || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDecline = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload: RsvpDeclinePayload = {
        note: note.trim(),
      };
      const updated = await invitationService.declineRsvp(
        invitation.token,
        payload,
      );
      onSuccess(updated);
      onClose();
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "No fue posible registrar tu respuesta. Intenta de nuevo.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="decline-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md rounded-3xl glass-panel p-6 sm:p-7 border-[#D4AF37]/30 shadow-2xl">
        <button
          onClick={onClose}
          type="button"
          aria-label="Cerrar modal"
          className="absolute top-4 right-4 p-2 rounded-full text-[#EFC7CF]/70 hover:text-[#FAF6F0] hover:bg-[#441328]/50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <form onSubmit={handleDecline} className="space-y-4">
          <div className="text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#441328]/60 border border-[#D4AF37]/30 flex items-center justify-center mx-auto text-[#D4AF37] mb-3">
              <Heart className="w-6 h-6" />
            </div>
            <h3
              id="decline-modal-title"
              className="font-serif-cormorant text-2xl font-bold text-[#FAF6F0]"
            >
              ¿No podrás acompañarnos?
            </h3>
            <p className="text-xs sm:text-sm text-[#EFC7CF] mt-2 leading-relaxed">
              Lamentamos que no puedas asistir al cumpleaños de {celebrantName},
              pero agradecemos enormemente que nos avises para organizar los
              lugares.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/50 flex items-center gap-2 text-xs text-rose-200"
            >
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5 pt-2">
            <label
              htmlFor="decline-note"
              className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold block"
            >
              Dedicatoria o Mensaje para {celebrantName} (Opcional)
            </label>
            <textarea
              id="decline-note"
              rows={3}
              placeholder="Deja un saludo o palabras de felicitación..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#18040C] border border-[#D4AF37]/25 text-[#FAF6F0] placeholder-[#FAF6F0]/30 text-xs focus:outline-none focus:border-[#D4AF37] transition-colors resize-none"
            />
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-5 rounded-full bg-[#3B1324] hover:bg-[#521B32] text-[#F7E2E6] font-medium text-xs sm:text-sm border border-[#D4AF37]/30 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Registrando respuesta...</span>
                </>
              ) : (
                <span>Confirmar que no podré asistir</span>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="py-2 text-xs text-[#EFC7CF]/70 hover:text-[#FAF6F0] transition-colors"
            >
              Volver a la invitación
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
