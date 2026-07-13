"use client";

import { useTranslations } from "next-intl";
import TopBar from "@/components/layout/TopBar";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Clock,
  Bot,
  Star,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { cn } from "@/lib/utils";
import { volumeForecast, type CategorySlug } from "@/data/mock";

const channelDistribution = [
  { name: "Email",     value: 38, color: "#017764" },
  { name: "Slack",     value: 22, color: "#01c4a3" },
  { name: "WhatsApp",  value: 18, color: "#b0aa34" },
  { name: "Teams",     value: 14, color: "#d4cd52" },
  { name: "Web",       value: 8,  color: "#9ca3af" },
];

const agentPerformance = [
  { name: "Sophie M.", resolved: 45, aht: 8.2,  csat: 4.7, fcr: 82 },
  { name: "Lucas B.",  resolved: 38, aht: 12.1, csat: 4.3, fcr: 74 },
  { name: "Emma D.",   resolved: 51, aht: 6.8,  csat: 4.9, fcr: 91 },
  { name: "Théo M.",   resolved: 29, aht: 15.3, csat: 4.1, fcr: 68 },
  { name: "Chloé P.",  resolved: 42, aht: 9.4,  csat: 4.5, fcr: 78 },
];

const resolutionByCategory: { category: CategorySlug; tickets: number; autoRate: number; avgTime: number }[] = [
  { category: "network", tickets: 234, autoRate: 28, avgTime: 45  },
  { category: "auth",    tickets: 189, autoRate: 78, avgTime: 8   },
  { category: "api",     tickets: 142, autoRate: 12, avgTime: 120 },
  { category: "admin",   tickets: 98,  autoRate: 45, avgTime: 30  },
  { category: "security",tickets: 76,  autoRate: 5,  avgTime: 180 },
];

const burnoutRisk = [
  { subjectKey: "volume",            A: 85, fullMark: 100 },
  { subjectKey: "sentimentReceived", A: 62, fullMark: 100 },
  { subjectKey: "overtime",          A: 45, fullMark: 100 },
  { subjectKey: "fcr",               A: 78, fullMark: 100 },
  { subjectKey: "complexity",        A: 70, fullMark: 100 },
];

const hourlyLoad = [
  { hour: "00h", load: 12 }, { hour: "02h", load: 8  }, { hour: "04h", load: 5  },
  { hour: "06h", load: 15 }, { hour: "08h", load: 48 }, { hour: "09h", load: 87 },
  { hour: "10h", load: 92 }, { hour: "11h", load: 78 }, { hour: "12h", load: 55 },
  { hour: "13h", load: 62 }, { hour: "14h", load: 89 }, { hour: "15h", load: 95 },
  { hour: "16h", load: 73 }, { hour: "17h", load: 58 }, { hour: "18h", load: 34 },
  { hour: "20h", load: 22 }, { hour: "22h", load: 15 },
];

const tooltipStyle = {
  backgroundColor: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  fontSize: "12px",
  color: "#374151",
};

export default function AnalyticsPage() {
  const t = useTranslations("analytics");
  const tCommon = useTranslations("common");

  const volumeForecastLocalized = volumeForecast.map(d => ({ ...d, dayLabel: tCommon(`days.${d.day}`) }));
  const burnoutRiskLocalized = burnoutRisk.map(b => ({ ...b, subject: t(`burnout.subjects.${b.subjectKey}`) }));

  const kpis = [
    { label: t("kpi.fcr"),           value: "76.4%",  delta: "+3.2%", up: true, icon: TrendingUp, colorClass: "text-[#017764]" },
    { label: t("kpi.aht"),           value: "9m 47s", delta: "-1.3m", up: true, icon: Clock,       colorClass: "text-[#017764]" },
    { label: t("kpi.aiAutoResolve"), value: "34.2%",  delta: "+8.1%", up: true, icon: Bot,         colorClass: "text-[#8a852a]" },
    { label: t("kpi.globalCsat"),    value: "4.6/5",  delta: "+0.2",  up: true, icon: Star,        colorClass: "text-[#8a852a]" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar title={t("title")} subtitle={t("subtitle")} />

      <div className="p-6 space-y-6">
        {/* Prediction Alerts */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-orange-700 mb-1">{t("bottleneckTitle")}</p>
              <p className="text-xs text-gray-600">{t("bottleneckDesc")}</p>
              <div className="flex gap-2 mt-3">
                <button className="text-[11px] px-3 py-1.5 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors">{t("mobilize")}</button>
                <button className="text-[11px] px-3 py-1.5 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200 transition-colors">{t("dismiss")}</button>
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-[#017764]/8 border border-[#017764]/20 rounded-xl">
            <Bot className="w-5 h-5 text-[#017764] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-[#017764] mb-1">{t("knowledgeGapTitle")}</p>
              <p className="text-xs text-gray-600">{t("knowledgeGapDesc")}</p>
              <div className="flex gap-2 mt-3">
                <button className="text-[11px] px-3 py-1.5 bg-[#017764]/15 text-[#017764] rounded-lg hover:bg-[#017764]/25 transition-colors">{t("createAiArticle")}</button>
                <button className="text-[11px] px-3 py-1.5 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200 transition-colors">{t("later")}</button>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-4 gap-4">
          {kpis.map(kpi => (
            <div key={kpi.label} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <kpi.icon className={cn("w-4 h-4", kpi.colorClass)} />
                <span className={cn("text-[11px] font-medium flex items-center gap-0.5", kpi.up ? "text-emerald-600" : "text-red-500")}>
                  {kpi.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {kpi.delta}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{kpi.label}</p>
            </div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-3 gap-6">
          {/* Hourly Load */}
          <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">{t("hourlyLoad.title")}</h3>
            <p className="text-[11px] text-gray-400 mb-4">{t("hourlyLoad.subtitle")}</p>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={hourlyLoad}>
                <defs>
                  <linearGradient id="loadGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#017764" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#017764" stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="load" stroke="#017764" fill="url(#loadGrad)" strokeWidth={2} name={t("hourlyLoad.series")} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Channel Pie */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">{t("channelDistribution.title")}</h3>
            <p className="text-[11px] text-gray-400 mb-4">{t("channelDistribution.subtitle")}</p>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width={150} height={150}>
                <PieChart>
                  <Pie data={channelDistribution} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value">
                    {channelDistribution.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1.5 mt-2">
              {channelDistribution.map(c => (
                <div key={c.name} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                  <span className="text-[11px] text-gray-500 flex-1">{c.name}</span>
                  <span className="text-[11px] text-gray-700 font-medium">{c.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-2 gap-6">
          {/* Agent Performance */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">{t("agentPerformance.title")}</h3>
            <p className="text-[11px] text-gray-400 mb-4">{t("agentPerformance.subtitle")}</p>
            <div className="space-y-2">
              <div className="flex items-center gap-3 pb-2 border-b border-gray-200 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                <span className="flex-1">{t("agentPerformance.agent")}</span>
                <span className="w-12 text-right">{t("agentPerformance.resolved")}</span>
                <span className="w-12 text-right">AHT</span>
                <span className="w-12 text-right">CSAT</span>
                <span className="w-12 text-right">FCR</span>
              </div>
              {agentPerformance.sort((a, b) => b.csat - a.csat).map((agent, i) => (
                <div key={agent.name} className="flex items-center gap-3 py-1.5 hover:bg-gray-50 rounded-lg px-1 transition-colors">
                  <div className="flex items-center gap-2 flex-1">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#017764] to-[#b0aa34] flex items-center justify-center text-[9px] font-bold text-white">
                      {agent.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <span className="text-[11px] text-gray-700">{agent.name}</span>
                    {i === 0 && <span className="text-[9px] text-[#8a852a]">{t("agentPerformance.top")}</span>}
                  </div>
                  <span className="w-12 text-right text-[11px] text-gray-700">{agent.resolved}</span>
                  <span className="w-12 text-right text-[11px] text-gray-700">{agent.aht}m</span>
                  <span className={cn("w-12 text-right text-[11px] font-medium", agent.csat >= 4.5 ? "text-[#017764]" : "text-[#8a852a]")}>
                    ★ {agent.csat}
                  </span>
                  <span className={cn("w-12 text-right text-[11px]", agent.fcr >= 80 ? "text-[#017764]" : "text-orange-500")}>
                    {agent.fcr}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Resolution by category */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">{t("resolutionByCategory.title")}</h3>
            <p className="text-[11px] text-gray-400 mb-4">{t("resolutionByCategory.subtitle")}</p>
            <div className="space-y-3">
              {resolutionByCategory.map(cat => (
                <div key={cat.category}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-gray-700">{t(`categories.${cat.category}`)}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-400">{cat.tickets} {t("resolutionByCategory.tickets")}</span>
                      <span className={cn("text-[10px] font-bold",
                        cat.autoRate >= 50 ? "text-[#017764]" : cat.autoRate >= 20 ? "text-[#8a852a]" : "text-gray-400"
                      )}>
                        {cat.autoRate}{t("resolutionByCategory.aiSuffix")}
                      </span>
                    </div>
                  </div>
                  <div className="relative w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${cat.autoRate}%`,
                        background: `linear-gradient(to right, #017764, #b0aa34)`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Burnout + Volume Trend */}
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">{t("burnout.title")}</h3>
            <p className="text-[11px] text-gray-400 mb-2">{t("burnout.subtitle")}</p>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={burnoutRiskLocalized}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "#9ca3af" }} />
                <Radar name="Score" dataKey="A" stroke="#017764" fill="#017764" fillOpacity={0.15} />
              </RadarChart>
            </ResponsiveContainer>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[11px] text-gray-400">{t("burnout.globalScore")}</span>
              <span className="text-sm font-bold text-[#8a852a]">{t("burnout.value")}</span>
            </div>
          </div>

          <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">{t("volumeTrend.title")}</h3>
            <p className="text-[11px] text-gray-400 mb-4">{t("volumeTrend.subtitle")}</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={volumeForecastLocalized}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="dayLabel" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="actual" stroke="#017764" strokeWidth={2.5} dot={{ fill: "#017764", r: 3 }} name={t("volumeTrend.actual")} connectNulls={false} />
                <Line type="monotone" dataKey="predicted" stroke="#b0aa34" strokeWidth={2} strokeDasharray="5 5" dot={false} name={t("volumeTrend.predicted")} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
