import { Suspense } from "react";
import { Metadata } from "next";
import { defaultMockInvitations } from "@/data/event";
import { InvitationClientView } from "./InvitationClientView";

interface PageProps {
  params: Promise<{ token: string }>;
}

export function generateStaticParams() {
  return defaultMockInvitations.map((inv) => ({
    token: inv.token,
  }));
}

export const metadata: Metadata = {
  title: "Invitación privada | Quince Años",
  description: "Una invitación personal para una noche inolvidable.",
};

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
