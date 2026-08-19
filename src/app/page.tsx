"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { TicketPlus, ShieldCheck, ArrowRight } from "lucide-react";
import NewTicketModal from "@/components/tickets/NewTicketModal";
import LocaleSwitcher from "@/components/layout/LocaleSwitcher";
import afcacLogo from "@/images/afcac_logo.png";

export default function Home() {
  const t = useTranslations("home");

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 sm:px-10">
        <div className="flex items-center gap-3">
          <Image src={afcacLogo} alt="AFCAC" className="w-9 h-9 object-contain shrink-0" priority />
          <div>
            <span className="text-gray-900 font-bold text-base tracking-tight">AFCAC</span>
            <span className="text-[#017764] font-bold text-base tracking-tight"> Helpdesk</span>
          </div>
        </div>
        <LocaleSwitcher />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="text-center max-w-xl mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">{t("title")}</h1>
          <p className="text-sm text-gray-500 mt-2">{t("subtitle")}</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 w-full max-w-3xl">
          <NewTicketModal
            trigger={
              <button className="group flex flex-col items-start text-left p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg hover:border-[#017764]/40 transition-all">
                <div className="w-12 h-12 rounded-xl bg-[#017764]/10 flex items-center justify-center mb-4 group-hover:bg-[#017764]/15 transition-colors">
                  <TicketPlus className="w-6 h-6 text-[#017764]" />
                </div>
                <h2 className="text-base font-semibold text-gray-900 mb-1">{t("ticketCard.title")}</h2>
                <p className="text-xs text-gray-500 mb-4">{t("ticketCard.description")}</p>
                <span className="mt-auto flex items-center gap-1 text-xs font-semibold text-[#017764]">
                  {t("ticketCard.cta")}
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </button>
            }
          />

          <Link
            href="/login"
            className="group flex flex-col items-start text-left p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg hover:border-[#b0aa34]/50 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-[#b0aa34]/15 flex items-center justify-center mb-4 group-hover:bg-[#b0aa34]/25 transition-colors">
              <ShieldCheck className="w-6 h-6 text-[#8a852a]" />
            </div>
            <h2 className="text-base font-semibold text-gray-900 mb-1">{t("staffCard.title")}</h2>
            <p className="text-xs text-gray-500 mb-4">{t("staffCard.description")}</p>
            <span className="mt-auto flex items-center gap-1 text-xs font-semibold text-[#8a852a]">
              {t("staffCard.cta")}
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>
        </div>
      </main>

      <footer className="text-center text-[11px] text-gray-400 py-6">
        {t("footer", { year: new Date().getFullYear() })}
      </footer>
    </div>
  );
}
