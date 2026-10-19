-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('SENT', 'PENDING', 'CONFIRMED', 'DECLINED');

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "celebrantName" TEXT NOT NULL,
    "celebrantTitle" TEXT NOT NULL DEFAULT 'Mis Quince Años',
    "celebrantAge" INTEGER NOT NULL DEFAULT 15,
    "date" TIMESTAMP(3) NOT NULL,
    "displayTime" TEXT NOT NULL,
    "venueName" TEXT NOT NULL,
    "venueAddress" TEXT NOT NULL,
    "googleMapsUrl" TEXT,
    "dressCode" TEXT,
    "dressCodeDetails" TEXT,
    "welcomeMessage" TEXT NOT NULL,
    "emotionalQuote" TEXT,
    "parentsNames" JSONB,
    "godparentsNames" TEXT,
    "itinerary" JSONB NOT NULL,
    "giftsInfo" JSONB NOT NULL,
    "rsvpDeadline" TEXT,
    "contactPhone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invitation" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "guestName" TEXT NOT NULL,
    "allowedGuests" INTEGER NOT NULL,
    "status" "InvitationStatus" NOT NULL DEFAULT 'PENDING',
    "confirmedGuests" INTEGER NOT NULL DEFAULT 0,
    "attendees" TEXT[],
    "note" TEXT,
    "sentAt" TIMESTAMP(3),
    "respondedAt" TIMESTAMP(3),
    "eventId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invitation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Event_slug_key" ON "Event"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Invitation_token_key" ON "Invitation"("token");

-- CreateIndex
CREATE INDEX "Invitation_eventId_status_idx" ON "Invitation"("eventId", "status");

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
