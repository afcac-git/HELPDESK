"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  LayoutDashboard,
  Ticket,
  GitBranch,
  BarChart3,
  BookOpen,
  Settings,
  Search,
  ChevronDown,
  LogOut,
  Wifi,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { agents } from "@/data/mock";
import afcacLogo from "@/images/afcac_logo.png";
import LocaleSwitcher from "@/components/layout/LocaleSwitcher";
import { useTickets } from "@/context/TicketsContext";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, key: "dashboard" },
  { href: "/tickets", icon: Ticket, key: "tickets" },
  { href: "/workflow", icon: GitBranch, key: "workflows" },
  { href: "/analytics", icon: BarChart3, key: "analytics" },
  { href: "/knowledge", icon: BookOpen, key: "knowledge" },
  { href: "/settings", icon: Settings, key: "settings" },
] as const;

const statusColor: Record<string, string> = {
  online: "bg-emerald-400",
  busy: "bg-orange-400",
  away: "bg-yellow-400",
  offline: "bg-gray-400",
};

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("sidebar");
  const { tickets } = useTickets();
  const openTicketsCount = tickets.filter((tk) => tk.status === "open").length;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Image src={afcacLogo} alt="AFCAC" className="w-8 h-8 object-contain shrink-0" priority />

          <div>
            <span className="text-gray-900 font-bold text-base tracking-tight">AFCAC</span>
            <span className="text-[#017764] font-bold text-base tracking-tight"> Helpdesk Portal</span>
          </div>
        </div>
      </div>

      {/* Language switcher */}
      <div className="px-5 pt-3">
        <LocaleSwitcher />
      </div>

      {/* Search */}
      <div className="px-3 pt-3 pb-2">
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-gray-400 text-sm cursor-pointer hover:border-[#017764]/50 transition-colors">
          <Search className="w-3.5 h-3.5" />
          <span className="flex-1 text-xs">{t("searchPlaceholder")}</span>
          <kbd className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-400">⌘K</kbd>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5">
        {navItems.map(({ href, icon: Icon, key }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                active
                  ? "bg-[#017764]/10 text-[#017764] border border-[#017764]/30"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              )}
            >
              <Icon className={cn("w-4 h-4 shrink-0", active ? "text-[#017764]" : "")} />
              {t(`nav.${key}`)}
              {href === "/tickets" && (
                <span className="ml-auto bg-[#017764] text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {openTicketsCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Online agents */}
      <div className="px-3 py-3 border-t border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{t("agents")}</span>
          <span className="text-[11px] text-[#017764] flex items-center gap-1">
            <Wifi className="w-3 h-3" /> {t("onlineCount", { count: 18 })}
          </span>
        </div>
        <div className="space-y-1">
          {agents.slice(0, 3).map((agent) => (
            <div key={agent.id} className="flex items-center gap-2 px-1 py-1">
              <div className="relative">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-[9px] font-bold text-gray-600">
                  {agent.avatar}
                </div>
                <span className={cn("absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-white", statusColor[agent.status])} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-gray-700 truncate">{agent.name}</p>
                <p className="text-[10px] text-gray-400">{t("ticketsCount", { count: agent.ticketsOpen })}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current user */}
      <div className="px-3 py-3 border-t border-gray-200">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#017764] to-[#b0aa34] flex items-center justify-center text-xs font-bold text-white">
                  AD
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-xs font-medium text-gray-800">{t("currentUser")}</p>
                <p className="text-[10px] text-gray-400">{t("currentUserRole")}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              side="top"
              align="end"
              sideOffset={6}
              className="min-w-[180px] bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50"
            >
              <DropdownMenu.Item
                onSelect={() => router.push("/")}
                className="flex items-center gap-2 px-3 py-2 text-xs text-gray-600 hover:bg-gray-50 hover:text-red-600 cursor-pointer outline-none transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                {t("logout")}
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </aside>
  );
}
