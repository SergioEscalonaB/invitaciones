import type { Event as DbEvent, Invitation as DbInvitation } from "@/generated/prisma/client";
import type { EventDetails, Invitation, InvitationStatus } from "@/types/invitation";

const statusFromDb: Record<DbInvitation["status"], InvitationStatus> = {
  SENT: "sent", PENDING: "pending", CONFIRMED: "confirmed", DECLINED: "declined",
};

export function mapInvitation(record: DbInvitation): Invitation {
  return {
    id: record.id, token: record.token, guestName: record.guestName,
    allowedGuests: record.allowedGuests, status: statusFromDb[record.status],
    confirmedGuests: record.confirmedGuests, attendees: record.attendees,
    note: record.note ?? undefined, sentAt: record.sentAt?.toISOString(),
    respondedAt: record.respondedAt?.toISOString(),
  };
}

export function mapEvent(record: DbEvent): EventDetails {
  return {
    celebrantName: record.celebrantName, celebrantTitle: record.celebrantTitle,
    celebrantAge: record.celebrantAge, date: record.date.toISOString(),
    time: record.displayTime, venueName: record.venueName, venueAddress: record.venueAddress,
    googleMapsUrl: record.googleMapsUrl ?? "", dressCode: record.dressCode ?? "",
    dressCodeDetails: record.dressCodeDetails ?? "", welcomeMessage: record.welcomeMessage,
    emotionalQuote: record.emotionalQuote ?? "",
    parentsNames: (record.parentsNames as EventDetails["parentsNames"]) ?? undefined,
    godparentsNames: record.godparentsNames ?? undefined,
    itinerary: record.itinerary as unknown as EventDetails["itinerary"],
    giftsInfo: record.giftsInfo as unknown as EventDetails["giftsInfo"],
    rsvpDeadline: record.rsvpDeadline ?? "", contactPhone: record.contactPhone ?? undefined,
  };
}
