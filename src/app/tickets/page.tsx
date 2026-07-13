"use client";

import { useState } from "react";
import TopBar from "@/components/layout/TopBar";
import { tickets } from "@/data/mock";
import { cn, formatSLA, formatRelativeTime } from "@/lib/utils";
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

const priorityColor: Record<Priority, string> = {
  P1: "bg-red-500/15 text-red-600 border-red-400/30",
  P2: "bg-orange-500/15 text-orange-600 border-orange-400/30",
  P3: "bg-[#b0aa34]/15 text-[#8a852a] border-[#b0aa34]/30",
  P4: "bg-gray-100 text-gray-500 border-gray-300",
};

const statusConfig: Record<Status, { label: string; icon: React.ElementType; color: string }> = {
  open: { label: "Ouvert", icon: Inbox, color: "text-[#017764]" },
  pending: { label: "En attente", icon: Clock, color: "text-orange-500" },
  resolved: { label: "Résolu", icon: CheckCircle2, color: "text-emerald-600" },
  closed: { label: "Fermé", icon: XCircle, color: "text-gray-400" },
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
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [filterPriority, setFilterPriority] = useState<"all" | Priority>("all");

  const filtered = tickets.filter((t) => {
    const matchSearch =
      !search ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.contact.name.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || t.status === filterStatus;
    const matchPriority = filterPriority === "all" || t.priority === filterPriority;
    return matchSearch && matchStatus && matchPriority;
  });

  const counts = {
    all: tickets.length,
    open: tickets.filter(t => t.status === "open").length,
    pending: tickets.filter(t => t.status === "pending").length,
    resolved: tickets.filter(t => t.status === "resolved").length,
    closed: tickets.filter(t => t.status === "closed").length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar title="Tickets" subtitle={`${filtered.length} ticket${filtered.length > 1 ? 's' : ''} · Trié par urgence SLA`} />

      <div className="p-6">
        {/* Filters */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Rechercher par titre, contact, ID..."
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
            <option value="all">Toutes priorités</option>
            <option value="P1">P1 — Critique</option>
            <option value="P2">P2 — Haute</option>
            <option value="P3">P3 — Normale</option>
            <option value="P4">P4 — Basse</option>
          </select>
          <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-500 hover:text-gray-800 transition-colors shadow-sm">
            <SortDesc className="w-3.5 h-3.5" /> Trier
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
                {s === "all" ? "Tous" : statusConfig[s as Status].label}
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
            const sla = formatSLA(ticket.slaMinutesLeft);
            const StatusIcon = statusConfig[ticket.status].icon;
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
                    <span className="text-xs font-medium text-gray-800 truncate">{ticket.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn("text-[10px] border px-1.5 py-0.5 rounded", tierColor[ticket.contact.tier])}>
                      {ticket.contact.tier}
                    </span>
                    <span className="text-[10px] text-gray-500">{ticket.contact.name}</span>
                    <span className="text-[10px] text-gray-300">·</span>
                    <span className="text-[10px] text-gray-500">{ticket.contact.company}</span>
                    {ticket.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                        {tag}
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
                  <span className="text-[10px] text-gray-400 shrink-0">Non assigné</span>
                )}
                <span className="text-lg shrink-0">{sentimentEmoji[ticket.sentiment]}</span>
                {ticket.status !== "resolved" && ticket.status !== "closed" ? (
                  <div className="text-right shrink-0">
                    <p className={cn("text-xs font-bold tabular-nums", sla.color)}>{sla.text}</p>
                    <p className="text-[10px] text-gray-400">SLA</p>
                  </div>
                ) : (
                  <div className="text-right shrink-0">
                    <p className="text-xs text-gray-400">{formatRelativeTime(ticket.updatedAt)}</p>
                  </div>
                )}
                <div className={cn("flex items-center gap-1 shrink-0", statusConfig[ticket.status].color)}>
                  <StatusIcon className="w-3.5 h-3.5" />
                  <span className="text-[11px]">{statusConfig[ticket.status].label}</span>
                </div>
                <div className="text-right shrink-0">
                  <div className={cn("text-[10px] font-medium",
                    ticket.aiConfidence >= 0.85 ? "text-[#017764]" :
                    ticket.aiConfidence >= 0.6 ? "text-[#8a852a]" : "text-gray-400"
                  )}>
                    IA {Math.round(ticket.aiConfidence * 100)}%
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#017764] shrink-0 transition-colors" />
              </a>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <Inbox className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Aucun ticket ne correspond à votre recherche</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
