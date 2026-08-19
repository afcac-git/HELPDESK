"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import TopBar from "@/components/layout/TopBar";
import { cn, formatSLA, formatRelativeTime } from "@/lib/utils";
import { useTickets } from "@/context/TicketsContext";
import {
  Search,
  SortDesc,
  ChevronRight,
  RefreshCw,
  Inbox,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import type { Priority, Status, Channel } from "@/data/mock";
import type { Locale } from "@/i18n/config";

const priorityColor: Record<Priority, string> = {
  P1: "bg-red-500/15 text-red-600 border-red-400/30",
  P2: "bg-orange-500/15 text-orange-600 border-orange-400/30",
  P3: "bg-[#b0aa34]/15 text-[#8a852a] border-[#b0aa34]/30",
  P4: "bg-gray-100 text-gray-500 border-gray-300",
};

const statusIcon: Record<Status, React.ElementType> = {
  open: Inbox,
  pending: Clock,
  resolved: CheckCircle2,
  closed: XCircle,
};

const statusIconColor: Record<Status, string> = {
  open: "text-[#017764]",
  pending: "text-orange-500",
  resolved: "text-emerald-600",
  closed: "text-gray-400",
};

const channelIcon: Record<Channel, string> = {
  whatsapp: "💬",
  email: "📧",
  slack: "🔷",
  teams: "🔵",
  web: "🌐",
  phone: "📞",
};

const sentimentEmoji: Record<string, string> = {
  frustrated: "😤",
  urgent: "🚨",
  neutral: "😐",
  positive: "😊",
};

const tierColor: Record<string, string> = {
  VIP: "text-[#8a852a] bg-[#b0aa34]/10 border-[#b0aa34]/25",
  Enterprise: "text-[#017764] bg-[#017764]/10 border-[#017764]/25",
  SMB: "text-gray-600 bg-gray-100 border-gray-200",
  Starter: "text-gray-500 bg-gray-100 border-gray-200",
};

type FilterStatus = "all" | Status;

export default function TicketsPage() {
  const t = useTranslations("tickets");
  const tCommon = useTranslations("common");
  const tTime = useTranslations("time");
  const locale = useLocale() as Locale;
  const { tickets } = useTickets();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [filterPriority, setFilterPriority] = useState<"all" | Priority>("all");

  const filtered = tickets.filter((tk) => {
    const matchSearch =
      !search ||
      tk.title[locale].toLowerCase().includes(search.toLowerCase()) ||
      tk.contact.name.toLowerCase().includes(search.toLowerCase()) ||
      tk.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || tk.status === filterStatus;
    const matchPriority = filterPriority === "all" || tk.priority === filterPriority;
    return matchSearch && matchStatus && matchPriority;
  });

  const counts = {
    all: tickets.length,
    open: tickets.filter(tk => tk.status === "open").length,
    pending: tickets.filter(tk => tk.status === "pending").length,
    resolved: tickets.filter(tk => tk.status === "resolved").length,
    closed: tickets.filter(tk => tk.status === "closed").length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar title={t("title")} subtitle={t("subtitle", { count: filtered.length })} />
      <div className="p-6">
        {/* Filters */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 outline-none text-xs"
            />
          </div>
          <select
            value={filterPriority}
            onChange={e => setFilterPriority(e.target.value as "all" | Priority)}
            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-700 outline-none cursor-pointer shadow-sm"
          >
            <option value="all">{tCommon("priority.all")}</option>
            <option value="P1">{tCommon("priority.P1")}</option>
            <option value="P2">{tCommon("priority.P2")}</option>
            <option value="P3">{tCommon("priority.P3")}</option>
            <option value="P4">{tCommon("priority.P4")}</option>
          </select>
          <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-500 hover:text-gray-800 transition-colors shadow-sm">
            <SortDesc className="w-3.5 h-3.5" /> {t("sort")}
          </button>
          <button className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-gray-800 transition-colors shadow-sm">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Status tabs */}
        <div className="flex gap-1 mb-5 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
          {(["all", "open", "pending", "resolved", "closed"] as const).map((s) => {
            const count = counts[s];
            return (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all",
                  filterStatus === s
                    ? "bg-[#017764]/10 text-[#017764] border border-[#017764]/30"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                {tCommon(`status.${s}`)}
                <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-bold",
                  filterStatus === s ? "bg-[#017764]/15 text-[#017764]" : "bg-gray-100 text-gray-400"
                )}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Ticket List */}
        <div className="space-y-2">
          {filtered.map((ticket) => {
            const sla = formatSLA(ticket.slaMinutesLeft, tTime);
            const StatusIcon = statusIcon[ticket.status];
            return (
              <a
                key={ticket.id}
                href={`/tickets/${ticket.id}`}
                className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:border-[#017764]/30 hover:bg-gray-50 transition-all group shadow-sm"
              >
                <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded border shrink-0", priorityColor[ticket.priority])}>
                  {ticket.priority}
                </span>
                <span className="text-xl shrink-0">{channelIcon[ticket.channel]}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] text-gray-400 font-mono">#{ticket.id}</span>
                    <span className="text-xs font-medium text-gray-800 truncate">{ticket.title[locale]}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn("text-[10px] border px-1.5 py-0.5 rounded", tierColor[ticket.contact.tier])}>
                      {ticket.contact.tier}
                    </span>
                    <span className="text-[10px] text-gray-500">{ticket.contact.name}</span>
                    <span className="text-[10px] text-gray-300">·</span>
                    <span className="text-[10px] text-gray-500">{ticket.contact.company}</span>
                    {ticket.tags.slice(0, 2).map(tag => (
                      <span key={tag.fr} className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                        {tag[locale]}
                      </span>
                    ))}
                  </div>
                </div>
                {ticket.assignedAgent ? (
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#017764] to-[#b0aa34] flex items-center justify-center text-[9px] font-bold text-white">
                      {ticket.assignedAgent.avatar}
                    </div>
                    <span className="text-[11px] text-gray-500">{ticket.assignedAgent.name.split(" ")[0]}</span>
                  </div>
                ) : (
                  <span className="text-[10px] text-gray-400 shrink-0">{t("unassigned")}</span>
                )}
                <span className="text-lg shrink-0">{sentimentEmoji[ticket.sentiment]}</span>
                {ticket.status !== "resolved" && ticket.status !== "closed" ? (
                  <div className="text-right shrink-0">
                    <p className={cn("text-xs font-bold tabular-nums", sla.color)}>{sla.text}</p>
                    <p className="text-[10px] text-gray-400">{t("sla")}</p>
                  </div>
                ) : (
                  <div className="text-right shrink-0">
                    <p className="text-xs text-gray-400">{formatRelativeTime(ticket.updatedAt, tTime)}</p>
                  </div>
                )}
                <div className={cn("flex items-center gap-1 shrink-0", statusIconColor[ticket.status])}>
                  <StatusIcon className="w-3.5 h-3.5" />
                  <span className="text-[11px]">{tCommon(`status.${ticket.status}`)}</span>
                </div>
                <div className="text-right shrink-0">
                  <div className={cn("text-[10px] font-medium",
                    ticket.aiConfidence >= 0.85 ? "text-[#017764]" :
                    ticket.aiConfidence >= 0.6 ? "text-[#8a852a]" : "text-gray-400"
                  )}>
                    {tCommon("aiPrefix")} {Math.round(ticket.aiConfidence * 100)}%
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#017764] shrink-0 transition-colors" />
              </a>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <Inbox className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">{t("noResults")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
