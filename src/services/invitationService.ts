import {
  EventDetails,
  Invitation,
  InvitationStats,
  RsvpConfirmationPayload,
  RsvpDeclinePayload,
} from "@/types/invitation";
import { defaultEventDetails, defaultMockInvitations } from "@/data/event";

const STORAGE_KEY = "quinceanera_invitations_v1";

/**
 * Interfaz formal para el servicio de invitaciones.
 * Implementaciones futuras:
 * - SupabaseInvitationService
 * - GoogleSheetsInvitationService
 * - FirebaseInvitationService
 */
export interface IInvitationService {
  getEventDetails(): Promise<EventDetails>;
  getInvitationByToken(token: string): Promise<Invitation | null>;
  confirmRsvp(token: string, payload: RsvpConfirmationPayload): Promise<Invitation>;
  declineRsvp(token: string, payload?: RsvpDeclinePayload): Promise<Invitation>;
  getAllInvitations(): Promise<Invitation[]>;
  createInvitation(
    data: Pick<Invitation, "guestName" | "allowedGuests"> & { token?: string }
  ): Promise<Invitation>;
  getStats(): Promise<InvitationStats>;
  resetToDefaults(): Promise<void>;
}

class MockInvitationService implements IInvitationService {
  private isBrowser(): boolean {
    return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
  }

  private loadInvitations(): Invitation[] {
    if (!this.isBrowser()) {
      return [...defaultMockInvitations];
    }

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultMockInvitations));
        return [...defaultMockInvitations];
      }
      return JSON.parse(stored) as Invitation[];
    } catch {
      return [...defaultMockInvitations];
    }
  }

  private saveInvitations(invitations: Invitation[]): void {
    if (this.isBrowser()) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(invitations));
      } catch (err) {
        console.warn("No se pudo guardar en localStorage", err);
      }
    }
  }

  async getEventDetails(): Promise<EventDetails> {
    // Retorna configuración del evento
    return { ...defaultEventDetails };
  }

  async getInvitationByToken(token: string): Promise<Invitation | null> {
    const list = this.loadInvitations();
    const cleanToken = token.trim().toLowerCase();
    const found = list.find((inv) => inv.token.toLowerCase() === cleanToken);
    return found ? { ...found } : null;
  }

  async confirmRsvp(token: string, payload: RsvpConfirmationPayload): Promise<Invitation> {
    const list = this.loadInvitations();
    const cleanToken = token.trim().toLowerCase();
    const index = list.findIndex((inv) => inv.token.toLowerCase() === cleanToken);

    if (index === -1) {
      throw new Error("Invitación no encontrada con el token proporcionado.");
    }

    const invitation = list[index];

    // Validación estricta de cupo asignado
    if (payload.confirmedGuests > invitation.allowedGuests) {
      throw new Error(
        `El número de asistentes (${payload.confirmedGuests}) supera el cupo máximo permitido (${invitation.allowedGuests}).`
      );
    }

    if (payload.confirmedGuests < 1) {
      throw new Error("Debes indicar al menos un asistente para confirmar.");
    }

    const updated: Invitation = {
      ...invitation,
      status: "confirmed",
      confirmedGuests: payload.confirmedGuests,
      attendees: payload.attendees || [],
      note: payload.note?.trim() || invitation.note || "",
      respondedAt: new Date().toISOString(),
    };

    list[index] = updated;
    this.saveInvitations(list);
    return { ...updated };
  }

  async declineRsvp(token: string, payload?: RsvpDeclinePayload): Promise<Invitation> {
    const list = this.loadInvitations();
    const cleanToken = token.trim().toLowerCase();
    const index = list.findIndex((inv) => inv.token.toLowerCase() === cleanToken);

    if (index === -1) {
      throw new Error("Invitación no encontrada con el token proporcionado.");
    }

    const invitation = list[index];

    const updated: Invitation = {
      ...invitation,
      status: "declined",
      confirmedGuests: 0,
      attendees: [],
      note: payload?.note?.trim() || invitation.note || "",
      respondedAt: new Date().toISOString(),
    };

    list[index] = updated;
    this.saveInvitations(list);
    return { ...updated };
  }

  async getAllInvitations(): Promise<Invitation[]> {
    return this.loadInvitations();
  }

  async createInvitation(
    data: Pick<Invitation, "guestName" | "allowedGuests"> & { token?: string }
  ): Promise<Invitation> {
    const list = this.loadInvitations();

    const slug =
      data.token?.trim().toLowerCase() ||
      data.guestName
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const newInvitation: Invitation = {
      id: `inv-${Date.now()}`,
      token: slug || `inv-${Math.random().toString(36).substring(2, 7)}`,
      guestName: data.guestName.trim(),
      allowedGuests: Math.max(1, data.allowedGuests),
      status: "pending",
      confirmedGuests: 0,
      attendees: [],
      sentAt: new Date().toISOString(),
    };

    list.push(newInvitation);
    this.saveInvitations(list);
    return { ...newInvitation };
  }

  async getStats(): Promise<InvitationStats> {
    const list = this.loadInvitations();

    const totalInvitations = list.length;
    const totalAllowedGuests = list.reduce((sum, inv) => sum + inv.allowedGuests, 0);
    const totalConfirmedGuests = list.reduce((sum, inv) => sum + (inv.confirmedGuests || 0), 0);
    const pendingInvitations = list.filter((inv) => inv.status === "pending" || inv.status === "sent").length;
    const confirmedInvitations = list.filter((inv) => inv.status === "confirmed").length;
    const declinedInvitations = list.filter((inv) => inv.status === "declined").length;
    const totalDeclinedGuests = list
      .filter((inv) => inv.status === "declined")
      .reduce((sum, inv) => sum + inv.allowedGuests, 0);

    return {
      totalInvitations,
      totalAllowedGuests,
      totalConfirmedGuests,
      totalDeclinedGuests,
      pendingInvitations,
      confirmedInvitations,
      declinedInvitations,
    };
  }

  async resetToDefaults(): Promise<void> {
    if (this.isBrowser()) {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }
}

// Instancia singleton del servicio por defecto
export const invitationService: IInvitationService = new MockInvitationService();
