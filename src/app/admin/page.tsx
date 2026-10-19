"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  Copy,
  Check,
  ExternalLink,
  Plus,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  Heart,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { Invitation, InvitationStats, InvitationStatus } from "@/types/invitation";
import { invitationService } from "@/services/invitationService";
import { FairyDust } from "@/components/FairyDust";

export default function AdminPage() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [stats, setStats] = useState<InvitationStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Filtros y búsqueda
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Estado de copiado
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Modal para agregar nueva invitación
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newGuestName, setNewGuestName] = useState("");
  const [newAllowedGuests, setNewAllowedGuests] = useState<number>(2);
  const [newTokenSlug, setNewTokenSlug] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  // Toast general
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [list, calculatedStats] = await Promise.all([
        invitationService.getAllInvitations(),
        invitationService.getStats(),
      ]);
      setInvitations(list);
      setStats(calculatedStats);
    } catch (err) {
      console.error("Error al cargar datos administrativos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCopyLink = async (token: string) => {
    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const url = `${origin}/invitacion/${token}`;
      await navigator.clipboard.writeText(url);
      setCopiedToken(token);
      showToast("¡Enlace copiado al portapapeles!");
      setTimeout(() => setCopiedToken(null), 2500);
    } catch {
      showToast("No se pudo copiar el enlace.");
    }
  };

  const handleResetData = async () => {
    if (
      window.confirm(
        "¿Restablecer los datos de ejemplo a su estado original? Se perderán las confirmaciones de prueba guardadas en este navegador."
      )
    ) {
      await invitationService.resetToDefaults();
      await loadData();
      showToast("Datos restablecidos a los valores predeterminados.");
    }
  };

  const handleCreateInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim()) return;

    setAddLoading(true);
    try {
      await invitationService.createInvitation({
        guestName: newGuestName.trim(),
        allowedGuests: Number(newAllowedGuests),
        token: newTokenSlug.trim() || undefined,
      });

      setNewGuestName("");
      setNewAllowedGuests(2);
      setNewTokenSlug("");
      setIsAddModalOpen(false);
      await loadData();
      showToast("¡Invitación creada con éxito!");
    } catch (err) {
      console.error(err);
      showToast("Error al crear la invitación.");
    } finally {
      setAddLoading(false);
    }
  };

  const filteredInvitations = invitations.filter((inv) => {
    const matchesSearch =
      inv.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.token.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inv.attendees &&
        inv.attendees.some((att) =>
          att.toLowerCase().includes(searchQuery.toLowerCase())
        ));

    if (statusFilter === "all") return matchesSearch;
    if (statusFilter === "pending")
      return matchesSearch && (inv.status === "pending" || inv.status === "sent");
    return matchesSearch && inv.status === statusFilter;
  });

  const getStatusBadge = (status: InvitationStatus) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/70 text-emerald-300 border border-emerald-500/40">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Confirmada</span>
          </span>
        );
      case "declined":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-950/70 text-rose-300 border border-rose-500/30">
            <XCircle className="w-3.5 h-3.5" />
            <span>Rechazada</span>
          </span>
        );
      case "sent":
      case "pending":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#441328]/70 text-[#F3E5AB] border border-[#D4AF37]/30">
            <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Pendiente</span>
          </span>
        );
    }
  };

  return (
    <div className="relative min-h-screen bg-[#14040A] text-[#FAF6F0] selection:bg-[#cca044]/30 pb-20">
      <FairyDust />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full bg-[#2C0B18] text-[#F3E5AB] border border-[#D4AF37]/50 shadow-2xl text-xs font-medium animate-in fade-in flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Cabecera Administrativa */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-[#18050E]/90 border-b border-[#D4AF37]/20 px-4 py-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#441328] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif-cormorant text-2xl font-bold text-[#FAF6F0] flex items-center gap-2">
                <span>Panel de Control de Invitaciones</span>
                <span className="text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#F3E5AB] border border-[#D4AF37]/30 font-sans font-semibold">
                  MVP Demo
                </span>
              </h1>
              <p className="text-xs text-[#EFC7CF]/80">
                Gestión de cupos, confirmaciones y enlaces para los Quince Años de Valentina Sofía
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsAddModalOpen(true)}
              type="button"
              className="px-4 py-2 rounded-full bg-gradient-to-r from-[#D7B56E] to-[#B3832B] text-[#14040A] text-xs font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Invitación</span>
            </button>

            <button
              onClick={handleResetData}
              type="button"
              title="Restablecer datos de ejemplo"
              className="p-2 rounded-full bg-[#2C0B18] border border-[#D4AF37]/30 text-[#EFC7CF] hover:text-[#FAF6F0] hover:bg-[#441328] transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <Link
              href="/"
              className="px-3.5 py-2 rounded-full bg-[#18040C] border border-[#D4AF37]/20 text-xs text-[#EFC7CF] hover:text-[#FAF6F0] hover:border-[#D4AF37]/40 transition-colors"
            >
              Ver Portada
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 relative z-10 space-y-8">
        {/* Aviso de entorno de demostración */}
        <div className="p-4 rounded-2xl bg-[#2C0B18]/70 border border-[#D4AF37]/30 flex items-start sm:items-center justify-between gap-3 text-xs text-[#EFC7CF]">
          <div className="flex items-start sm:items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <p className="font-semibold text-[#F3E5AB]">
                Modo Demostración Activo (Sin Backend Permanente Conectado)
              </p>
              <p className="text-[#FAF6F0]/80">
                Las confirmaciones y nuevas invitaciones se guardan localmente en tu sesión. Para producción, el servicio <code>IInvitationService</code> está preparado para vincularse directamente con Supabase o Google Sheets.
              </p>
            </div>
          </div>
        </div>

        {/* Tarjetas KPI de Resumen */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            <div className="glass-panel p-4 rounded-2xl">
              <span className="text-[11px] uppercase tracking-wider text-[#EFC7CF] font-medium block">
                Total Invitaciones
              </span>
              <p className="font-display-cinzel text-2xl sm:text-3xl font-bold text-gold-gradient mt-1">
                {stats.totalInvitations}
              </p>
              <span className="text-[10px] text-[#FAF6F0]/60 mt-1 block">Familias registradas</span>
            </div>

            <div className="glass-panel p-4 rounded-2xl">
              <span className="text-[11px] uppercase tracking-wider text-[#EFC7CF] font-medium block">
                Cupo Total
              </span>
              <p className="font-display-cinzel text-2xl sm:text-3xl font-bold text-[#FAF6F0] mt-1">
                {stats.totalAllowedGuests}
              </p>
              <span className="text-[10px] text-[#FAF6F0]/60 mt-1 block">Pases autorizados</span>
            </div>

            <div className="glass-panel p-4 rounded-2xl border-emerald-500/30">
              <span className="text-[11px] uppercase tracking-wider text-emerald-300 font-medium block">
                Confirmados
              </span>
              <p className="font-display-cinzel text-2xl sm:text-3xl font-bold text-emerald-400 mt-1">
                {stats.totalConfirmedGuests}
              </p>
              <span className="text-[10px] text-emerald-200/70 mt-1 block">
                {stats.confirmedInvitations} invitaciones listas
              </span>
            </div>

            <div className="glass-panel p-4 rounded-2xl border-rose-500/25">
              <span className="text-[11px] uppercase tracking-wider text-rose-300 font-medium block">
                Declinados
              </span>
              <p className="font-display-cinzel text-2xl sm:text-3xl font-bold text-rose-400 mt-1">
                {stats.totalDeclinedGuests}
              </p>
              <span className="text-[10px] text-rose-200/70 mt-1 block">
                {stats.declinedInvitations} no podrán asistir
              </span>
            </div>

            <div className="glass-panel p-4 rounded-2xl col-span-2 lg:col-span-1">
              <span className="text-[11px] uppercase tracking-wider text-[#D4AF37] font-medium block">
                Pendientes
              </span>
              <p className="font-display-cinzel text-2xl sm:text-3xl font-bold text-[#F3E5AB] mt-1">
                {stats.pendingInvitations}
              </p>
              <span className="text-[10px] text-[#FAF6F0]/60 mt-1 block">Sin respuesta aún</span>
            </div>
          </div>
        )}

        {/* Barra de Filtros y Búsqueda */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#D4AF37] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar por nombre de persona, familia o token..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#1D060F] border border-[#D4AF37]/30 text-xs sm:text-sm text-[#FAF6F0] placeholder-[#FAF6F0]/30 focus:outline-none focus:border-[#D4AF37] transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#D4AF37] shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3.5 py-2.5 rounded-2xl bg-[#1D060F] border border-[#D4AF37]/30 text-xs sm:text-sm text-[#FAF6F0] focus:outline-none focus:border-[#D4AF37] transition-colors"
            >
              <option value="all">Todos los estados ({invitations.length})</option>
              <option value="confirmed">Confirmadas</option>
              <option value="pending">Pendientes</option>
              <option value="declined">Rechazadas</option>
            </select>
          </div>
        </div>

        {/* Tabla / Lista de Invitaciones */}
        <div className="glass-panel rounded-3xl overflow-hidden border-[#D4AF37]/30">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#2C0B18]/80 text-[#D4AF37] uppercase tracking-wider font-semibold border-b border-[#D4AF37]/20">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Persona o Familia</th>
                  <th className="py-3.5 px-4">Cupo / Asistentes</th>
                  <th className="py-3.5 px-4">Estado</th>
                  <th className="py-3.5 px-4">Respuesta</th>
                  <th className="py-3.5 px-4 text-right">Enlace & Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D4AF37]/10">
                {filteredInvitations.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-[#EFC7CF]/70">
                      No se encontraron invitaciones que coincidan con la búsqueda.
                    </td>
                  </tr>
                ) : (
                  filteredInvitations.map((inv) => (
                    <tr
                      key={inv.id}
                      className="hover:bg-[#441328]/30 transition-colors group"
                    >
                      <td className="py-4 px-4 sm:px-6">
                        <div className="font-semibold text-sm text-[#FAF6F0]">
                          {inv.guestName}
                        </div>
                        <div className="text-[11px] text-[#FAF6F0]/50 font-mono mt-0.5">
                          token: {inv.token}
                        </div>
                        {inv.attendees && inv.attendees.length > 0 && (
                          <div className="text-[11px] text-emerald-300/80 mt-1">
                            Asistentes: {inv.attendees.join(", ")}
                          </div>
                        )}
                        {inv.note && (
                          <div className="text-[11px] italic text-[#EFC7CF]/80 mt-1 max-w-xs truncate">
                            «{inv.note}»
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-medium text-sm">
                          <span
                            className={
                              inv.status === "confirmed"
                                ? "text-emerald-400 font-bold"
                                : "text-[#FAF6F0]"
                            }
                          >
                            {inv.confirmedGuests}
                          </span>
                          <span className="text-[#FAF6F0]/50">/</span>
                          <span>{inv.allowedGuests}</span>
                          <span className="text-[10px] text-[#FAF6F0]/50">pases</span>
                        </div>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        {getStatusBadge(inv.status)}
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap text-[11px] text-[#EFC7CF]/80">
                        {inv.respondedAt ? (
                          new Date(inv.respondedAt).toLocaleDateString("es-ES", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        ) : (
                          <span className="text-[#FAF6F0]/40">Sin respuesta</span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleCopyLink(inv.token)}
                            type="button"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#1D060F] hover:bg-[#2C0B18] text-[#F3E5AB] border border-[#D4AF37]/30 transition-colors text-xs font-medium"
                            title="Copiar enlace personalizado"
                          >
                            {copiedToken === inv.token ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-300">¡Copiado!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copiar</span>
                              </>
                            )}
                          </button>

                          <Link
                            href={`/invitacion/${inv.token}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-full bg-[#1D060F] hover:bg-[#441328] text-[#D4AF37] hover:text-[#FFF3D6] border border-[#D4AF37]/30 transition-colors"
                            title="Abrir invitación en nueva pestaña"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal para Crear Nueva Invitación */}
      {isAddModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
        >
          <div className="w-full max-w-md rounded-3xl glass-panel p-6 sm:p-7 border-[#D4AF37]/40 shadow-2xl relative">
            <h3 className="font-serif-cormorant text-2xl font-bold text-[#FAF6F0] mb-1">
              Nueva Invitación Personalizada
            </h3>
            <p className="text-xs text-[#EFC7CF] mb-4">
              Crea un enlace exclusivo para una persona o familia.
            </p>

            <form onSubmit={handleCreateInvitation} className="space-y-4">
              <div>
                <label className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold block mb-1">
                  Nombre de la Persona o Familia
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Familia Morales Castro"
                  value={newGuestName}
                  onChange={(e) => {
                    setNewGuestName(e.target.value);
                    if (!newTokenSlug) {
                      // Sugerir slug automático
                      const auto = e.target.value
                        .toLowerCase()
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/(^-|-$)/g, "");
                      setNewTokenSlug(auto);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#18040C] border border-[#D4AF37]/30 text-xs sm:text-sm text-[#FAF6F0] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold block mb-1">
                  Cupo de Asistentes Permitido
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  required
                  value={newAllowedGuests}
                  onChange={(e) => setNewAllowedGuests(parseInt(e.target.value) || 1)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#18040C] border border-[#D4AF37]/30 text-xs sm:text-sm text-[#FAF6F0] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold block mb-1">
                  Identificador / Token URL (Opcional)
                </label>
                <div className="flex items-center rounded-xl bg-[#18040C] border border-[#D4AF37]/30 px-3 py-2 text-xs">
                  <span className="text-[#FAF6F0]/40 select-none">/invitacion/</span>
                  <input
                    type="text"
                    placeholder="familia-morales"
                    value={newTokenSlug}
                    onChange={(e) => setNewTokenSlug(e.target.value)}
                    className="w-full bg-transparent text-[#FAF6F0] focus:outline-none font-mono text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 flex flex-col gap-2">
                <button
                  type="submit"
                  disabled={addLoading}
                  className="w-full py-3 rounded-full bg-gradient-to-r from-[#D7B56E] to-[#B3832B] text-[#14040A] font-bold text-xs sm:text-sm tracking-wide shadow-lg hover:brightness-110 disabled:opacity-50 transition-all"
                >
                  {addLoading ? "Creando..." : "Generar Invitación"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="py-2 text-xs text-[#EFC7CF]/70 hover:text-[#FAF6F0] transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
