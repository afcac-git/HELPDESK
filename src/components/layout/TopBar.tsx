"use client";

import { Bell, Cpu } from "lucide-react";
import { useTranslations } from "next-intl";
import NewTicketModal from "@/components/tickets/NewTicketModal";

interface TopBarProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function TopBar({ title, subtitle, actions }: TopBarProps) {
  const tc = useTranslations("common");
  return (
    <header className="h-14 border-b border-gray-200 bg-white/90 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-30">
      <div>
        <h1 className="text-sm font-semibold text-gray-900">{title}</h1>
        {subtitle && <p className="text-[11px] text-gray-400">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {actions}

        {/* AI status */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#017764]/10 border border-[#017764]/30 rounded-lg">
          <Cpu className="w-3.5 h-3.5 text-[#017764]" />
          <span className="text-[11px] text-[#017764] font-medium">{tc("aiActive")}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#017764] animate-pulse" />
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
        </button>

        {/* New ticket */}
        <NewTicketModal />
      </div>
    </header>
  );
}
