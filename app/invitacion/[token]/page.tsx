import { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import { InvitationClientView } from "./InvitationClientView";

interface PageProps {
  params: Promise<{ token: string }>;
}

export const metadata: Metadata = {
  title: "La noche de Valentina · Mis quince",
  description:
    "Una invitación de quince años contada como una pequeña historia.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#102119",
};

async function InvitationContent({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Italiana&display=swap"
        rel="stylesheet"
      />
      <InvitationClientView initialToken={token} />
    </>
  );
}

export default function InvitationPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
            background: "#102119",
          }}
        >
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "50%",
              border: "1px solid rgba(205,174,114,0.3)",
              borderTopColor: "#cdae72",
              animation: "spin 0.8s linear infinite",
            }}
          />
        </div>
      }
    >
      <InvitationContent params={params} />
    </Suspense>
  );
}
