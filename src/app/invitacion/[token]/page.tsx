import { Suspense } from "react";
import { Metadata } from "next";
import { defaultMockInvitations } from "@/data/event";
import { invitationService } from "@/services/invitationService";
import { InvitationClientView } from "./InvitationClientView";

interface PageProps {
  params: Promise<{ token: string }>;
}

export function generateStaticParams() {
  return defaultMockInvitations.map((inv) => ({
    token: inv.token,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { token } = await params;
  const invitation = await invitationService.getInvitationByToken(token);
  const event = await invitationService.getEventDetails();

  if (!invitation) {
    return {
      title: "Invitación No Encontrada | Quince Años",
      description: "Invitación no encontrada.",
    };
  }

  return {
    title: `Invitación para ${invitation.guestName} | XV Años de ${event.celebrantName}`,
    description: `Una noche mágica para celebrar los quince años de ${event.celebrantName}.`,
  };
}

async function InvitationContent({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return <InvitationClientView initialToken={token} />;
}

export default function InvitationPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#14040A]">
          <div className="w-10 h-10 rounded-full border-2 border-[#D4AF37]/30 border-t-[#D4AF37] animate-spin" />
        </div>
      }
    >
      <InvitationContent params={params} />
    </Suspense>
  );
}
