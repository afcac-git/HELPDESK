import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import "./globals.css";
import { TicketsProvider } from "@/context/TicketsContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AFCAC Helpdesk Portal",
  description: "Plateforme helpdesk AI-First avec RAG, workflows no-code et analytics prédictif",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="antialiased bg-slate-950 text-slate-100 h-full">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <TicketsProvider>{children}</TicketsProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
