import { prisma } from "@/lib/prisma";
import { defaultEventDetails, defaultMockInvitations } from "@/data/event";
import { mapInvitation } from "@/lib/invitation-mappers";
import type { EventDetails, InvitationStats, RsvpConfirmationPayload } from "@/types/invitation";
import type { Prisma } from "@/generated/prisma/client";
import { generateInvitationToken, isValidInvitationToken } from "@/lib/invitation-token";

const EVENT_SLUG = "evento-principal";
const asJson = (value: unknown) => JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;

export async function ensureEvent() {
  return prisma.event.upsert({
    where: { slug: EVENT_SLUG }, update: {},
    create: {
      slug: EVENT_SLUG, celebrantName: defaultEventDetails.celebrantName,
      celebrantTitle: defaultEventDetails.celebrantTitle, celebrantAge: defaultEventDetails.celebrantAge,
      date: new Date(defaultEventDetails.date), displayTime: defaultEventDetails.time,
      venueName: defaultEventDetails.venueName, venueAddress: defaultEventDetails.venueAddress,
      googleMapsUrl: defaultEventDetails.googleMapsUrl, dressCode: defaultEventDetails.dressCode,
      dressCodeDetails: defaultEventDetails.dressCodeDetails, welcomeMessage: defaultEventDetails.welcomeMessage,
      emotionalQuote: defaultEventDetails.emotionalQuote, parentsNames: defaultEventDetails.parentsNames,
      godparentsNames: defaultEventDetails.godparentsNames, itinerary: asJson(defaultEventDetails.itinerary),
      giftsInfo: asJson(defaultEventDetails.giftsInfo), rsvpDeadline: defaultEventDetails.rsvpDeadline,
      contactPhone: defaultEventDetails.contactPhone,
    },
  });
}

export async function seedDemoInvitations(eventId: string) {
  const count = await prisma.invitation.count({ where: { eventId } });
  if (count > 0) return;
  await prisma.invitation.createMany({ data: defaultMockInvitations.map((item) => ({
    eventId, token: generateInvitationToken(), guestName: item.guestName, allowedGuests: item.allowedGuests,
    status: item.status.toUpperCase() as "SENT" | "PENDING" | "CONFIRMED" | "DECLINED",
    confirmedGuests: item.confirmedGuests, attendees: item.attendees ?? [], note: item.note,
    sentAt: item.sentAt ? new Date(item.sentAt) : null, respondedAt: item.respondedAt ? new Date(item.respondedAt) : null,
  })) });
}

export async function getEventDetails(): Promise<EventDetails> { return structuredClone(defaultEventDetails); }

export async function getAllInvitations() {
  return (await prisma.invitation.findMany({
    where: { event: { slug: EVENT_SLUG } },
    orderBy: { createdAt: "desc" },
  })).map(mapInvitation);
}

export async function getInvitation(token: string) {
  if (!isValidInvitationToken(token)) return null;
  const record = await prisma.invitation.findUnique({ where: { token } });
  return record ? mapInvitation(record) : null;
}

export async function createInvitation(guestName: string, allowedGuests: number) {
  const event = await ensureEvent();
  const token = generateInvitationToken();
  return mapInvitation(await prisma.invitation.create({ data: { eventId: event.id, token, guestName: guestName.trim(), allowedGuests, sentAt: new Date() } }));
}

export async function confirmInvitation(token: string, payload: RsvpConfirmationPayload) {
  if (!isValidInvitationToken(token)) throw new Error("Invitación no encontrada.");
  const current = await prisma.invitation.findUnique({ where: { token } });
  if (!current) throw new Error("Invitación no encontrada.");
  if (!Number.isInteger(payload.confirmedGuests) || payload.confirmedGuests < 1 || payload.confirmedGuests > current.allowedGuests) throw new Error(`El número de asistentes debe estar entre 1 y ${current.allowedGuests}.`);
  return mapInvitation(await prisma.invitation.update({ where: { token }, data: { status: "CONFIRMED", confirmedGuests: payload.confirmedGuests, attendees: payload.attendees ?? [], note: payload.note?.trim() || null, respondedAt: new Date() } }));
}

export async function declineInvitation(token: string, note?: string) {
  if (!isValidInvitationToken(token)) throw new Error("Invitación no encontrada.");
  const current = await prisma.invitation.findUnique({ where: { token } });
  if (!current) throw new Error("Invitación no encontrada.");
  return mapInvitation(await prisma.invitation.update({ where: { token }, data: { status: "DECLINED", confirmedGuests: 0, attendees: [], note: note?.trim() || null, respondedAt: new Date() } }));
}

export function calculateStats(list: Awaited<ReturnType<typeof getAllInvitations>>): InvitationStats {
  return { totalInvitations:list.length, totalAllowedGuests:list.reduce((n,i)=>n+i.allowedGuests,0), totalConfirmedGuests:list.reduce((n,i)=>n+i.confirmedGuests,0), totalDeclinedGuests:list.filter(i=>i.status==="declined").reduce((n,i)=>n+i.allowedGuests,0), pendingInvitations:list.filter(i=>i.status==="pending"||i.status==="sent").length, confirmedInvitations:list.filter(i=>i.status==="confirmed").length, declinedInvitations:list.filter(i=>i.status==="declined").length };
}

export async function getStats(): Promise<InvitationStats> {
  return calculateStats(await getAllInvitations());
}
