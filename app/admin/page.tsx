"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, Check, CheckCircle2, ChevronRight, Clipboard, Clock3, Edit3, ExternalLink, Eye, LayoutDashboard, Link2, MapPin, Menu, MoreHorizontal, Plus, Search, Sparkles, Trash2, Users, X, XCircle } from "lucide-react";
import { defaultEventDetails } from "@/data/event";
import { invitationService } from "@/services/invitationService";
import type { EventDetails, Invitation, InvitationStats, InvitationStatus } from "@/types/invitation";

type Section = "resumen" | "invitaciones" | "previsualizacion";
const nav: { id: Section; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "resumen", label: "Resumen", icon: LayoutDashboard }, { id: "invitaciones", label: "Invitaciones", icon: Link2 },
  { id: "previsualizacion", label: "Previsualización", icon: Eye },
];
const statusLabel: Record<InvitationStatus, string> = { sent: "Enviada", pending: "Pendiente", confirmed: "Confirmada", declined: "No asistirá" };

export default function AdminPage() {
  const [section, setSection] = useState<Section>("resumen");
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [stats, setStats] = useState<InvitationStats | null>(null);
  const event: EventDetails = defaultEventDetails;
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | InvitationStatus>("all");
  const [menuOpen, setMenuOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [allowedGuests, setAllowedGuests] = useState(2);
  const [copied, setCopied] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [siteUrl, setSiteUrl] = useState("http://localhost:3000");
  // Edit modal state
  const [editOpen, setEditOpen] = useState(false);
  const [editToken, setEditToken] = useState("");
  const [editName, setEditName] = useState("");
  const [editGuests, setEditGuests] = useState(2);
  // Delete confirm state
  const [deleteToken, setDeleteToken] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState("");

  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(null), 2600); };
  const load = async (force = false) => { const { invitations: list, stats: summary } = await invitationService.getDashboard(force); setInvitations(list); setStats(summary); setLoading(false); };
  useEffect(() => {
    void invitationService.getDashboard().then(({ invitations: list, stats: summary }) => {
      setInvitations(list); setStats(summary); setLoading(false);
    }).catch(() => setLoading(false));
    void fetch("/api/config").then((response) => response.json()).then((config: { siteUrl: string }) => setSiteUrl(config.siteUrl)).catch(() => undefined);
  }, []);
  const filtered = useMemo(() => invitations.filter((inv) => inv.guestName.toLowerCase().includes(query.toLowerCase()) && (filter === "all" || inv.status === filter)), [invitations, query, filter]);
  const createInvitation = async (e: FormEvent) => { e.preventDefault(); await invitationService.createInvitation({ guestName, allowedGuests }); setGuestName(""); setAllowedGuests(2); setCreateOpen(false); await load(true); notify("Invitación creada y enlace listo para compartir"); };
  const copyLink = async (token: string) => { await navigator.clipboard.writeText(`${siteUrl}/invitacion/${token}`); setCopied(token); notify("Enlace privado copiado"); window.setTimeout(() => setCopied(null), 1800); };
  const selectSection = (value: Section) => { setSection(value); setMenuOpen(false); };
  const previewInvitation = invitations[0];

  // Edit handlers
  const openEdit = (inv: Invitation) => { setEditToken(inv.token); setEditName(inv.guestName); setEditGuests(inv.allowedGuests); setEditOpen(true); };
  const submitEdit = async (e: FormEvent) => {
    e.preventDefault();
    await invitationService.editInvitation(editToken, { guestName: editName, allowedGuests: editGuests });
    setEditOpen(false); await load(true); notify("Invitación actualizada");
  };

  // Delete handlers
  const openDelete = (inv: Invitation) => { setDeleteToken(inv.token); setDeleteName(inv.guestName); };
  const confirmDelete = async () => {
    if (!deleteToken) return;
    await invitationService.deleteInvitation(deleteToken);
    setDeleteToken(null); await load(true); notify("Invitación eliminada");
  };

  return <div className="admin-shell">
    <aside className={`admin-sidebar ${menuOpen ? "is-open" : ""}`}>
      <div className="brand"><span className="brand-mark"><Sparkles size={18}/></span><div><strong>Invita</strong><small>Estudio de eventos</small></div></div>
      <nav aria-label="Navegación principal">{nav.map((item) => <button key={item.id} onClick={() => selectSection(item.id)} className={section === item.id ? "active" : ""}><item.icon size={18}/><span>{item.label}</span></button>)}</nav>
      <div className="sidebar-note"><span>Base conectada</span><p>Invitados, cupos y respuestas se guardan de forma segura en PostgreSQL.</p></div>
      <div className="sidebar-profile"><span>SL</span><div><strong>Sergio Luis</strong><small>Administrador</small></div><MoreHorizontal size={18}/></div>
    </aside>
    <div className="admin-main">
      <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menú"><Menu size={21}/></button>
      <main className="admin-content">
        {loading ? <div className="admin-loading"><span/><p>Preparando tu panel…</p></div> : null}
        {!loading && section === "resumen" && <><PageHeading eyebrow="Vista general" title="Todo listo para tu celebración" text="Controla los cupos, las respuestas y tus enlaces privados desde un solo lugar." action={<button className="button primary" onClick={() => setCreateOpen(true)}><Plus size={17}/> Crear invitación</button>}/><div className="stat-grid"><Stat icon={Users} label="Invitados autorizados" value={stats?.totalAllowedGuests ?? 0} note={`${stats?.totalInvitations ?? 0} invitaciones`} tone="sand"/><Stat icon={CheckCircle2} label="Asistentes confirmados" value={stats?.totalConfirmedGuests ?? 0} note={`${stats?.confirmedInvitations ?? 0} respuestas`} tone="green"/><Stat icon={Clock3} label="Pendientes" value={stats?.pendingInvitations ?? 0} note="Por responder" tone="blue"/><Stat icon={XCircle} label="No asistirán" value={stats?.declinedInvitations ?? 0} note="Invitaciones" tone="rose"/></div><div className="dashboard-grid"><section className="panel"><PanelTitle title="Actividad de invitaciones" text="Estado actual de tus enlaces" action={<button onClick={() => setSection("invitaciones")}>Ver todas <ChevronRight size={15}/></button>}/><InvitationTable items={invitations.slice(0,5)} onCopy={copyLink} copied={copied} onEdit={openEdit} onDelete={openDelete}/></section><section className="panel quick-panel"><PanelTitle title="Tu evento" text="Información visible para los invitados"/><div className="event-mini"><div className="event-date"><strong>{new Date(event.date).getDate()}</strong><span>{new Date(event.date).toLocaleDateString("es", {month:"short"})}</span></div><div><strong>{event.venueName}</strong><span><CalendarDays size={14}/>{event.time}</span><span><MapPin size={14}/>{event.venueAddress}</span></div></div><div className="preview-card"><span>INVITACIÓN ACTIVA</span><h3>Una noche<br/><em>inolvidable</em></h3><p>Vista del enlace para invitados</p><button onClick={() => setSection("previsualizacion")}><Eye size={15}/> Previsualizar</button></div></section></div></>}
        {!loading && section === "invitaciones" && <><PageHeading eyebrow="Gestión" title="Invitaciones" text="Crea un enlace privado por persona o familia y controla su respuesta." action={<button className="button primary" onClick={() => setCreateOpen(true)}><Plus size={17}/> Nueva invitación</button>}/><section className="panel"><div className="toolbar"><label className="search"><Search size={17}/><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Buscar invitado o token…"/></label><select value={filter} onChange={(e)=>setFilter(e.target.value as typeof filter)}><option value="all">Todos los estados</option><option value="pending">Pendientes</option><option value="confirmed">Confirmadas</option><option value="declined">No asistirán</option></select></div><InvitationTable items={filtered} onCopy={copyLink} copied={copied} onEdit={openEdit} onDelete={openDelete}/></section></>}
        {!loading && section === "previsualizacion" && <><PageHeading eyebrow="Vista previa" title="Previsualización de la invitación" text="Esta es la misma experiencia que recibirán tus invitados, usando un enlace real." action={previewInvitation ? <Link href={`/invitacion/${previewInvitation.token}`} target="_blank" className="button primary"><ExternalLink size={16}/> Abrir invitación completa</Link> : null}/>{previewInvitation ? <section className="live-preview"><div className="live-preview-bar"><span>Vista interactiva</span><strong>{previewInvitation.guestName}</strong><small>{previewInvitation.allowedGuests} {previewInvitation.allowedGuests === 1 ? "cupo" : "cupos"}</small></div><iframe key={previewInvitation.token} src={`/invitacion/${previewInvitation.token}`} title={`Invitación de ${previewInvitation.guestName}`} allow="fullscreen" /></section> : <div className="panel empty">Crea una invitación para habilitar la vista previa.</div>}</>}
      </main>
    </div>
    {menuOpen && <button className="sidebar-backdrop" onClick={()=>setMenuOpen(false)} aria-label="Cerrar menú"/>}{toast && <div className="toast"><CheckCircle2 size={18}/>{toast}</div>}
    {createOpen && <div className="modal-backdrop"><form className="modal-card" onSubmit={createInvitation}><button type="button" className="modal-close" onClick={()=>setCreateOpen(false)}><X size={18}/></button><span className="modal-icon"><Link2 size={20}/></span><h2>Nueva invitación</h2><p>Genera un enlace privado para una persona o familia.</p><label>Nombre del invitado o familia<input autoFocus required value={guestName} onChange={(e)=>setGuestName(e.target.value)} placeholder="Ej. Familia Mendoza"/></label><label>Cupo autorizado<input type="number" min={1} max={30} required value={allowedGuests} onChange={(e)=>setAllowedGuests(Number(e.target.value))}/></label><div className="modal-actions"><button type="button" className="button secondary" onClick={()=>setCreateOpen(false)}>Cancelar</button><button className="button primary" type="submit"><Sparkles size={16}/> Generar enlace</button></div></form></div>}
    {editOpen && <div className="modal-backdrop"><form className="modal-card" onSubmit={submitEdit}><button type="button" className="modal-close" onClick={()=>setEditOpen(false)}><X size={18}/></button><span className="modal-icon"><Edit3 size={20}/></span><h2>Editar invitación</h2><p>Modifica el nombre o el cupo de esta invitación.</p><label>Nombre del invitado o familia<input autoFocus required value={editName} onChange={(e)=>setEditName(e.target.value)}/></label><label>Cupo autorizado<input type="number" min={1} max={30} required value={editGuests} onChange={(e)=>setEditGuests(Number(e.target.value))}/></label><div className="modal-actions"><button type="button" className="button secondary" onClick={()=>setEditOpen(false)}>Cancelar</button><button className="button primary" type="submit"><Check size={16}/> Guardar cambios</button></div></form></div>}
    {deleteToken && <div className="modal-backdrop"><div className="modal-card"><button type="button" className="modal-close" onClick={()=>setDeleteToken(null)}><X size={18}/></button><span className="modal-icon delete-icon"><Trash2 size={20}/></span><h2>Eliminar invitación</h2><p>¿Estás seguro de que deseas eliminar la invitación de <strong>{deleteName}</strong>? Esta acción no se puede deshacer.</p><div className="modal-actions"><button type="button" className="button secondary" onClick={()=>setDeleteToken(null)}>Cancelar</button><button className="button danger" onClick={confirmDelete}><Trash2 size={16}/> Eliminar</button></div></div></div>}
  </div>;
}

function PageHeading({eyebrow,title,text,action}:{eyebrow:string;title:string;text:string;action?:React.ReactNode}) { return <div className="page-heading"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{text}</p></div>{action}</div>; }
function Stat({icon:Icon,label,value,note,tone}:{icon:typeof Users;label:string;value:number;note:string;tone:string}) { return <article className="stat-card"><span className={`stat-icon ${tone}`}><Icon size={19}/></span><div><p>{label}</p><strong>{value}</strong><span>{note}</span></div></article>; }
function PanelTitle({title,text,action}:{title:string;text:string;action?:React.ReactNode}) { return <div className="panel-title"><div><h2>{title}</h2><p>{text}</p></div>{action}</div>; }
function StatusBadge({status}:{status:InvitationStatus}) { return <span className={`status ${status}`}>{status === "confirmed" ? <CheckCircle2 size={13}/> : status === "declined" ? <XCircle size={13}/> : <Clock3 size={13}/>} {statusLabel[status]}</span>; }
function InvitationTable({items,onCopy,copied,onEdit,onDelete}:{items:Invitation[];onCopy:(token:string)=>void;copied:string|null;onEdit:(inv:Invitation)=>void;onDelete:(inv:Invitation)=>void}) { return <div className="table-scroll"><table><thead><tr><th>Invitado</th><th>Cupo</th><th>Estado</th><th>Respuesta</th><th/></tr></thead><tbody>{items.length === 0 ? <tr><td colSpan={5} className="empty">No encontramos invitaciones con esos filtros.</td></tr> : items.map((inv)=><tr key={inv.id}><td><div className="guest-cell"><span>{inv.guestName.charAt(0)}</span><div><strong>{inv.guestName}</strong><small>Enlace privado ·••••{inv.token.slice(-6)}</small></div></div></td><td>{inv.confirmedGuests} / {inv.allowedGuests}</td><td><StatusBadge status={inv.status}/></td><td>{inv.respondedAt ? new Date(inv.respondedAt).toLocaleDateString("es",{day:"2-digit",month:"short"}) : "—"}</td><td><div className="row-actions"><button onClick={()=>onEdit(inv)} title="Editar"><Edit3 size={16}/></button><button onClick={()=>onCopy(inv.token)} title="Copiar enlace">{copied === inv.token ? <Check size={16}/> : <Clipboard size={16}/>}</button><Link href={`/invitacion/${inv.token}`} target="_blank" title="Abrir invitación"><ExternalLink size={16}/></Link><button onClick={()=>onDelete(inv)} title="Eliminar" className="delete-btn"><Trash2 size={16}/></button></div></td></tr>)}</tbody></table></div>; }
