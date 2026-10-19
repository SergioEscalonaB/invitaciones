export type InvitationStatus = "sent" | "pending" | "confirmed" | "declined";

export interface Invitation {
  id: string;
  token: string;
  guestName: string;
  allowedGuests: number;
  status: InvitationStatus;
  confirmedGuests: number;
  attendees?: string[];
  note?: string;
  sentAt?: string;
  respondedAt?: string;
}

export interface ItineraryItem {
  time: string;
  title: string;
  description: string;
  iconName: "church" | "sparkles" | "music" | "utensils" | "party";
}

export interface EventDetails {
  celebrantName: string;
  celebrantTitle: string;
  celebrantAge: number;
  date: string; // ISO 8601 string, e.g. "2026-12-19T19:30:00"
  time: string;
  venueName: string;
  venueAddress: string;
  googleMapsUrl: string;
  dressCode: string;
  dressCodeDetails: string;
  welcomeMessage: string;
  emotionalQuote: string;
  parentsNames?: {
    father: string;
    mother: string;
  };
  godparentsNames?: string;
  itinerary: ItineraryItem[];
  giftsInfo: {
    type: "envelope" | "registry" | "mixed";
    title: string;
    description: string;
    bankDetails?: string;
  };
  rsvpDeadline: string;
  contactPhone?: string;
}

export interface RsvpConfirmationPayload {
  confirmedGuests: number;
  attendees?: string[];
  note?: string;
}

export interface RsvpDeclinePayload {
  note?: string;
}

export interface InvitationStats {
  totalInvitations: number;
  totalAllowedGuests: number;
  totalConfirmedGuests: number;
  totalDeclinedGuests: number;
  pendingInvitations: number;
  confirmedInvitations: number;
  declinedInvitations: number;
}
