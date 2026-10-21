import type { Metadata } from "next";
import { Cormorant_Garamond, Cinzel, DM_Sans, Italiana, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const invitationSans = DM_Sans({
  variable: "--font-invitation-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const invitationSerif = Italiana({
  variable: "--font-invitation-serif",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Atelier de Invitaciones",
  description: "Gestión de invitaciones digitales y confirmaciones.",
  icons: {
    icon: "/favicon.ico",
  },
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${cormorant.variable} ${cinzel.variable} ${jakarta.variable} ${invitationSans.variable} ${invitationSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans selection:bg-[#eadfd2] selection:text-[#292521]">
        {children}
      </body>
    </html>
  );
}
