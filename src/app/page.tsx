"use client";

import Link from "next/link";
import TopBar from "@/components/layout/TopBar";
import {
  TicketCheck,
  Bot,
  Clock,
  Star,
  AlertTriangle,
  Users,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Zap,
  Activity,
  ArrowUpRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  dashboardStats,
  sentimentTrend,
  volumeForecast,
  teamPerformance,
  tickets,
} from "@/data/mock";
import { cn, formatSLA } from "@/lib/utils";

const priorityColor: Record<string, string> = {
  P1: "bg-red-500/15 text-red-600 border-red-400/30",
  P2: "bg-orange-500/15 text-orange-600 border-orange-400/30",
  P3: "bg-[#b0aa34]/15 text-[#8a852a] border-[#b0aa34]/30",
  P4: "bg-gray-100 text-gray-500 border-gray-300",
};

const channelIcon: Record<string, string> = {
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

const tooltipStyle = {
  backgroundColor: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  fontSize: "12px",
  color: "#374151",
};

function StatCard({
  icon: Icon,
  label,
  value,
  delta,
  deltaLabel,
  color = "primary",
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  delta?: number;
  deltaLabel?: string;
  color?: string;
}) {
  const colorMap: Record<string, string> = {
    primary: "from-[#017764]/10 to-[#017764]/5 border-[#017764]/20 text-[#017764]",
    emerald: "from-emerald-500/10 to-emerald-600/5 border-emerald-400/20 text-emerald-600",
    accent: "from-[#b0aa34]/10 to-[#b0aa34]/5 border-[#b0aa34]/20 text-[#8a852a]",
    orange: "from-orange-500/10 to-orange-600/5 border-orange-400/20 text-orange-600",
    red: "from-red-500/10 to-red-600/5 border-red-400/20 text-red-600",
    blue: "from-[#017764]/8 to-[#017764]/3 border-[#017764]/15 text-[#017764]",
  };

  return (
    <div className={cn("rounded-xl border bg-gradient-to-br p-4 bg-white", colorMap[color] || colorMap.primary)}>
      <div className="flex items-start justify-between mb-3">
        <Icon className="w-4 h-4" />
        {delta !== undefined && (
          <div className={cn("flex items-center gap-1 text-[11px]", delta >= 0 ? "text-emerald-600" : "text-red-500")}>
            {delta >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(delta)}%
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-0.5">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
      {deltaLabel && <div className="text-[10px] text-gray-400 mt-0.5">{deltaLabel}</div>}
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar title="Command Center" subtitle="Vue temps réel · Mis à jour il y a 12s" />

      <div className="p-6 space-y-6">
        {/* Alert Banner */}
        <div className="flex items-center gap-3 px-4 py-3 bg-orange-50 border border-orange-200 rounded-xl">
          <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0" />
          <div className="flex-1">
            <span className="text-orange-600 text-sm font-medium">Alerte prédictive : </span>
            <span className="text-gray-700 text-sm">
              Volume prédit +23% dans les 4 prochaines heures. Équipe Réseau à risque de saturation à 14h30.
            </span>
          </div>
          <button className="flex items-center gap-1 text-orange-600 text-xs font-medium hover:text-orange-700 transition-colors shrink-0">
            Actions suggérées <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard icon={TicketCheck} label="Tickets ouverts" value={dashboardStats.openTickets} delta={-8} deltaLabel="vs hier" color="primary" />
          <StatCard icon={Bot} label="Résolus par IA" value={dashboardStats.aiResolvedAuto} delta={12} deltaLabel="auto aujourd'hui" color="emerald" />
          <StatCard icon={Clock} label="Temps réponse" value={dashboardStats.avgResponseTime} color="blue" />
          <StatCard icon={Star} label="CSAT moyen" value={dashboardStats.csat} delta={3} deltaLabel="sur 5.0" color="accent" />
          <StatCard icon={AlertTriangle} label="Breaches SLA" value={dashboardStats.slaBreaches} delta={-2} deltaLabel="vs hier" color="red" />
          <StatCard icon={Users} label="Agents en ligne" value={`${dashboardStats.agentsOnline}/24`} color="blue" />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-3 gap-6">
          {/* Volume Forecast */}
          <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Volume tickets — Prévision ML</h3>
                <p className="text-[11px] text-gray-400">Horizon 7 jours · Modèle Prophet</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-[11px] text-gray-500">
                  <span className="w-3 h-2 rounded inline-block" style={{ backgroundColor: "#017764" }} /> Réel
                </span>
                <span className="flex items-center gap-1.5 text-[11px] text-gray-500">
                  <span className="w-3 h-2 rounded inline-block opacity-70" style={{ backgroundColor: "#b0aa34" }} /> Prédit
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={volumeForecast} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "#111827" }} />
                <Bar dataKey="actual" fill="#017764" radius={[4, 4, 0, 0]} name="Réel" />
                <Bar dataKey="predicted" fill="#b0aa34" radius={[4, 4, 0, 0]} name="Prédit" opacity={0.75} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* AI Actions Panel */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">IA — Actions suggérées</h3>
            <p className="text-[11px] text-gray-400 mb-4">Basées sur l&apos;analyse prédictive</p>
            <div className="space-y-3">
              <div className="p-3 bg-[#017764]/8 border border-[#017764]/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <Zap className="w-3.5 h-3.5 text-[#017764] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[11px] font-medium text-[#017764]">Activer réponse auto &quot;Reset MDP&quot;</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">Économie estimée : ~120 tickets/sem</p>
                  </div>
                </div>
                <button className="mt-2 w-full text-[10px] py-1 bg-[#017764]/15 text-[#017764] rounded hover:bg-[#017764]/25 transition-colors">Appliquer</button>
              </div>
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Users className="w-3.5 h-3.5 text-orange-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[11px] font-medium text-orange-600">Renfort Équipe Réseau</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">3 agents disponibles à mobiliser</p>
                  </div>
                </div>
                <button className="mt-2 w-full text-[10px] py-1 bg-orange-100 text-orange-600 rounded hover:bg-orange-200 transition-colors">Notifier</button>
              </div>
              <div className="p-3 bg-[#b0aa34]/8 border border-[#b0aa34]/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <Activity className="w-3.5 h-3.5 text-[#8a852a] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[11px] font-medium text-[#8a852a]">Ajuster SLA P2 — Lundi matin</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">Pic historique détecté 9h–11h</p>
                  </div>
                </div>
                <button className="mt-2 w-full text-[10px] py-1 bg-[#b0aa34]/15 text-[#8a852a] rounded hover:bg-[#b0aa34]/25 transition-colors">Configurer</button>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-3 gap-6">
          {/* Sentiment */}
          <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-900">Sentiment client — Temps réel</h3>
              <p className="text-[11px] text-gray-400">Analyse NLP par message · Aujourd&apos;hui</p>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={sentimentTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="positive" stackId="1" stroke="#017764" fill="#017764" fillOpacity={0.25} name="Positif" />
                <Area type="monotone" dataKey="neutral" stackId="1" stroke="#9ca3af" fill="#9ca3af" fillOpacity={0.2} name="Neutre" />
                <Area type="monotone" dataKey="negative" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} name="Négatif" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Team Performance */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Performance équipes</h3>
            <p className="text-[11px] text-gray-400 mb-4">Aujourd&apos;hui</p>
            <div className="space-y-3">
              {teamPerformance.map((team) => (
                <div key={team.team}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-gray-700">{team.team}</span>
                    <span className={cn("text-[10px] font-bold",
                      team.slaOk >= 95 ? "text-[#017764]" : team.slaOk >= 85 ? "text-[#8a852a]" : "text-red-500"
                    )}>
                      {team.slaOk}% SLA
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full transition-all"
                      style={{
                        width: `${team.slaOk}%`,
                        backgroundColor: team.slaOk >= 95 ? "#017764" : team.slaOk >= 85 ? "#b0aa34" : "#ef4444"
                      }}
                    />
                  </div>
                  <div className="flex gap-2 mt-0.5">
                    <span className="text-[10px] text-[#017764]">{team.resolved} résolus</span>
                    <span className="text-[10px] text-gray-300">·</span>
                    <span className="text-[10px] text-orange-500">{team.pending} en attente</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Tickets */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Tickets critiques — En cours</h3>
              <p className="text-[11px] text-gray-400">Triés par urgence SLA · Mise à jour en temps réel</p>
            </div>
            <Link href="/tickets" className="flex items-center gap-1 text-[11px] text-[#017764] hover:text-[#015a4d] transition-colors">
              Voir tous <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {tickets.filter(t => t.status === "open").slice(0, 4).map((ticket) => {
              const sla = formatSLA(ticket.slaMinutesLeft);
              return (
                <Link
                  key={ticket.id}
                  href={`/tickets/${ticket.id}`}
                  className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border border-transparent hover:border-[#017764]/15 group"
                >
                  <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded border", priorityColor[ticket.priority])}>
                    {ticket.priority}
                  </span>
                  <span className="text-lg shrink-0">{channelIcon[ticket.channel]}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800 truncate">{ticket.title}</p>
                    <p className="text-[10px] text-gray-400">{ticket.contact.name} · {ticket.contact.company}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={cn("text-xs font-bold tabular-nums", sla.color)}>{sla.text}</p>
                    <p className="text-[10px] text-gray-400">SLA restant</p>
                  </div>
                  <span className="text-xl shrink-0">{sentimentEmoji[ticket.sentiment]}</span>
                  <div className="text-right shrink-0 min-w-[60px]">
                    <p className={cn("text-[10px] font-medium",
                      ticket.aiConfidence >= 0.85 ? "text-[#017764]" :
                      ticket.aiConfidence >= 0.6 ? "text-[#8a852a]" : "text-gray-400"
                    )}>
                      IA {Math.round(ticket.aiConfidence * 100)}%
                    </p>
                    <p className="text-[10px] text-gray-400">confiance</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#017764] transition-colors shrink-0" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
