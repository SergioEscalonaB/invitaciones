import type {
  EventDetails,
  Invitation,
  InvitationStats,
  RsvpConfirmationPayload,
  RsvpDeclinePayload,
} from "@/types/invitation";

export interface IInvitationService {
  getEventDetails(): Promise<EventDetails>;
  getInvitationByToken(token: string): Promise<Invitation | null>;
  confirmRsvp(
    token: string,
    payload: RsvpConfirmationPayload,
  ): Promise<Invitation>;
  declineRsvp(token: string, payload?: RsvpDeclinePayload): Promise<Invitation>;
  getAllInvitations(): Promise<Invitation[]>;
  createInvitation(
    data: Pick<Invitation, "guestName" | "allowedGuests">,
  ): Promise<Invitation>;
  deleteInvitation(token: string): Promise<void>;
  editInvitation(
    token: string,
    data: { guestName?: string; allowedGuests?: number },
  ): Promise<Invitation>;
  getStats(): Promise<InvitationStats>;
  getDashboard(
    force?: boolean,
  ): Promise<{ invitations: Invitation[]; stats: InvitationStats }>;
  resetToDefaults(): Promise<void>;
}

type DashboardData = { invitations: Invitation[]; stats: InvitationStats };
let dashboardRequest: Promise<DashboardData> | null = null;

async function api<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  const data = await response.json();
  if (!response.ok)
    throw new Error(data.error || "Ocurrió un error inesperado.");
  return data as T;
}

class ApiInvitationService implements IInvitationService {
  async getEventDetails() {
    return api<EventDetails>("/api/event");
  }
  async getInvitationByToken(token: string) {
    try {
      return await api<Invitation>(
        `/api/invitations/${encodeURIComponent(token)}`,
      );
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "Invitación no encontrada."
      )
        return null;
      throw error;
    }
  }
  async confirmRsvp(token: string, payload: RsvpConfirmationPayload) {
    return api<Invitation>(`/api/invitations/${encodeURIComponent(token)}`, {
      method: "PATCH",
      body: JSON.stringify({ action: "confirm", ...payload }),
    });
  }
  async declineRsvp(token: string, payload?: RsvpDeclinePayload) {
    return api<Invitation>(`/api/invitations/${encodeURIComponent(token)}`, {
      method: "PATCH",
      body: JSON.stringify({ action: "decline", note: payload?.note }),
    });
  }
  async getAllInvitations() {
    return (await api<{ invitations: Invitation[] }>("/api/invitations"))
      .invitations;
  }
  async createInvitation(
    data: Pick<Invitation, "guestName" | "allowedGuests">,
  ) {
    return api<Invitation>("/api/invitations", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
  async deleteInvitation(token: string) {
    await api<{ ok: boolean }>(
      `/api/invitations/${encodeURIComponent(token)}`,
      { method: "DELETE" },
    );
  }
  async editInvitation(
    token: string,
    data: { guestName?: string; allowedGuests?: number },
  ) {
    return api<Invitation>(`/api/invitations/${encodeURIComponent(token)}`, {
      method: "PATCH",
      body: JSON.stringify({ action: "edit", ...data }),
    });
  }
  async getStats() {
    return (await api<{ stats: InvitationStats }>("/api/invitations")).stats;
  }
  async getDashboard(force = false) {
    if (force) dashboardRequest = null;
    dashboardRequest ??= api<DashboardData>("/api/invitations").finally(() => {
      window.setTimeout(() => {
        dashboardRequest = null;
      }, 250);
    });
    return dashboardRequest;
  }
  async resetToDefaults() {
    throw new Error(
      "El restablecimiento no está disponible con la base de datos conectada.",
    );
  }
}

export const invitationService: IInvitationService = new ApiInvitationService();
