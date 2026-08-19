"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import TopBar from "@/components/layout/TopBar";
import {
  Plus,
  Play,
  Pause,
  Copy,
  Trash2,
  ChevronRight,
  Zap,
  GitBranch,
  Clock,
  Mail,
  MessageSquare,
  Users,
  AlertTriangle,
  CheckCircle2,
  ArrowDown,
  Settings,
  MoreVertical,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NodeType = "trigger" | "condition" | "action" | "delay";
type WorkflowStatus = "active" | "draft" | "paused";
type NodeColor = "primary" | "accent" | "emerald" | "orange" | "slate";

interface NodeDef {
  id: string;
  type: NodeType;
  icon: React.ElementType;
  color: NodeColor;
}

interface WorkflowDef {
  id: string;
  status: WorkflowStatus;
  triggersCount: number;
  hasRun: boolean;
  nodes: NodeDef[];
}

const workflowDefs: WorkflowDef[] = [
  {
    id: "wf1",
    status: "active",
    triggersCount: 47,
    hasRun: true,
    nodes: [
      { id: "n1", type: "trigger", icon: Clock, color: "primary" },
      { id: "n2", type: "condition", icon: GitBranch, color: "accent" },
      { id: "n3", type: "action", icon: MessageSquare, color: "emerald" },
      { id: "n4", type: "action", icon: Users, color: "emerald" },
    ],
  },
  {
    id: "wf2",
    status: "active",
    triggersCount: 124,
    hasRun: true,
    nodes: [
      { id: "n1", type: "trigger", icon: Zap, color: "primary" },
      { id: "n2", type: "condition", icon: GitBranch, color: "accent" },
      { id: "n3", type: "action", icon: Mail, color: "emerald" },
      { id: "n4", type: "action", icon: CheckCircle2, color: "emerald" },
    ],
  },
  {
    id: "wf3",
    status: "active",
    triggersCount: 18,
    hasRun: true,
    nodes: [
      { id: "n1", type: "trigger", icon: AlertTriangle, color: "primary" },
      { id: "n2", type: "action", icon: Users, color: "orange" },
      { id: "n3", type: "delay", icon: Clock, color: "slate" },
      { id: "n4", type: "condition", icon: GitBranch, color: "accent" },
    ],
  },
  {
    id: "wf4",
    status: "paused",
    triggersCount: 0,
    hasRun: false,
    nodes: [
      { id: "n1", type: "trigger", icon: Clock, color: "primary" },
      { id: "n2", type: "action", icon: Mail, color: "emerald" },
      { id: "n3", type: "delay", icon: Clock, color: "slate" },
      { id: "n4", type: "action", icon: CheckCircle2, color: "slate" },
    ],
  },
];

const nodeColorMap: Record<NodeColor, { bg: string; border: string; text: string; icon: string }> = {
  primary: { bg: "bg-[#017764]/8",  border: "border-[#017764]/25", text: "text-[#017764]",  icon: "text-[#017764]" },
  accent:  { bg: "bg-[#b0aa34]/8",  border: "border-[#b0aa34]/25", text: "text-[#8a852a]",  icon: "text-[#8a852a]" },
  emerald: { bg: "bg-emerald-50",    border: "border-emerald-200",  text: "text-emerald-700", icon: "text-emerald-600" },
  orange:  { bg: "bg-orange-50",     border: "border-orange-200",   text: "text-orange-700",  icon: "text-orange-500" },
  slate:   { bg: "bg-gray-50",       border: "border-gray-200",     text: "text-gray-600",    icon: "text-gray-500" },
};

const statusColor: Record<WorkflowStatus, string> = {
  active: "text-[#017764] bg-[#017764]/10 border-[#017764]/25",
  draft:  "text-gray-500 bg-gray-100 border-gray-200",
  paused: "text-orange-600 bg-orange-50 border-orange-200",
};

const paletteDefs = [
  { key: "ticketCreated", type: "trigger" as NodeType, icon: Zap, color: "primary" as NodeColor },
  { key: "slaAtRisk", type: "trigger" as NodeType, icon: Clock, color: "primary" as NodeColor },
  { key: "sentimentHigh", type: "trigger" as NodeType, icon: AlertTriangle, color: "primary" as NodeColor },
  { key: "ifElse", type: "condition" as NodeType, icon: GitBranch, color: "accent" as NodeColor },
  { key: "vipClient", type: "condition" as NodeType, icon: GitBranch, color: "accent" as NodeColor },
  { key: "sendEmail", type: "action" as NodeType, icon: Mail, color: "emerald" as NodeColor },
  { key: "slackNotif", type: "action" as NodeType, icon: MessageSquare, color: "emerald" as NodeColor },
  { key: "assignAgent", type: "action" as NodeType, icon: Users, color: "emerald" as NodeColor },
  { key: "delay", type: "delay" as NodeType, icon: Clock, color: "slate" as NodeColor },
];

export default function WorkflowPage() {
  const t = useTranslations("workflow");
  const [view, setView] = useState<"list" | "builder">("list");

  const workflows = workflowDefs.map(wf => ({
    ...wf,
    name: t(`workflows.${wf.id}.name`),
    description: t(`workflows.${wf.id}.description`),
    lastRun: wf.hasRun ? t(`workflows.${wf.id}.lastRun`) : t("never"),
    nodes: wf.nodes.map((n, i) => ({ ...n, label: t(`workflows.${wf.id}.nodes.n${i + 1}`) })),
  }));

  const [selectedWorkflowId, setSelectedWorkflowId] = useState(workflows[0]?.id ?? null);
  const selectedWorkflow = workflows.find(wf => wf.id === selectedWorkflowId) ?? null;

  const stats = [
    { label: t("stats.active"), value: "3", icon: Play, color: "#017764" },
    { label: t("stats.executionsToday"), value: "189", icon: Zap, color: "#01c4a3" },
    { label: t("stats.automatedTickets"), value: "43", icon: CheckCircle2, color: "#b0aa34" },
    { label: t("stats.successRate"), value: "98.2%", icon: GitBranch, color: "#8a852a" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar
        title={t("title")}
        subtitle={t("subtitle")}
        actions={
          <button
            onClick={() => setView(view === "list" ? "builder" : "list")}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-600 text-xs font-medium rounded-lg transition-colors"
          >
            {view === "list" ? <><GitBranch className="w-3.5 h-3.5" /> {t("builderView")}</> : <><ChevronRight className="w-3.5 h-3.5 rotate-180" /> {t("listView")}</>}
          </button>
        }
      />

      {view === "list" ? (
        <div className="p-6">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {stats.map(stat => (
              <div key={stat.label} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <stat.icon className="w-4 h-4 mb-2" style={{ color: stat.color }} />
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Search + New */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm">
              <Search className="w-4 h-4 text-gray-400" />
              <input placeholder={t("searchPlaceholder")} className="flex-1 bg-transparent text-xs text-gray-700 placeholder-gray-400 outline-none" />
            </div>
            <button
              onClick={() => setView("builder")}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#017764] hover:bg-[#015a4d] text-white text-xs font-semibold rounded-lg transition-colors shadow-lg shadow-[#017764]/20"
            >
              <Plus className="w-3.5 h-3.5" /> {t("newWorkflow")}
            </button>
          </div>

          {/* Workflow Grid */}
          <div className="grid grid-cols-2 gap-4">
            {workflows.map(wf => (
              <div
                key={wf.id}
                className={cn(
                  "bg-white border rounded-xl p-5 cursor-pointer transition-all shadow-sm",
                  selectedWorkflowId === wf.id ? "border-[#017764]/35 bg-[#017764]/3" : "border-gray-200 hover:border-gray-300"
                )}
                onClick={() => setSelectedWorkflowId(wf.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-gray-900">{wf.name}</span>
                      <span className={cn("text-[10px] border px-1.5 py-0.5 rounded font-medium", statusColor[wf.status])}>
                        {t(`status.${wf.status}`)}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 leading-relaxed">{wf.description}</p>
                  </div>
                  <button className="p-1.5 rounded text-gray-400 hover:text-gray-600 transition-colors ml-3 shrink-0">
                    <MoreVertical className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Mini node flow */}
                <div className="flex items-center gap-1 mb-4 overflow-x-auto pb-1">
                  {wf.nodes.map((node, i) => {
                    const colors = nodeColorMap[node.color];
                    return (
                      <div key={node.id} className="flex items-center gap-1 shrink-0">
                        <div className={cn("flex items-center gap-1 px-2 py-1 rounded-lg border text-[9px]", colors.bg, colors.border, colors.text)}>
                          <node.icon className={cn("w-2.5 h-2.5", colors.icon)} />
                          <span className="max-w-[60px] truncate">{node.label}</span>
                        </div>
                        {i < wf.nodes.length - 1 && <ChevronRight className="w-3 h-3 text-gray-300 shrink-0" />}
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-4">
                    <span className="text-[10px] text-gray-400">
                      <span className="text-gray-700 font-medium">{wf.triggersCount}</span> {t("executions")}
                    </span>
                    <span className="text-[10px] text-gray-400">{t("lastRun", { value: wf.lastRun })}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-1 rounded text-gray-400 hover:text-gray-600 transition-colors"><Copy className="w-3 h-3" /></button>
                    {wf.status === "active" ? (
                      <button className="p-1 rounded text-orange-500 hover:text-orange-600 transition-colors"><Pause className="w-3 h-3" /></button>
                    ) : (
                      <button className="p-1 rounded text-[#017764] hover:text-[#015a4d] transition-colors"><Play className="w-3 h-3" /></button>
                    )}
                    <button className="p-1 rounded text-red-400/50 hover:text-red-500 transition-colors"><Trash2 className="w-3 h-3" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* BUILDER VIEW */
        <div className="flex h-[calc(100vh-56px)]">
          {/* Palette */}
          <div className="w-56 border-r border-gray-200 bg-white overflow-y-auto p-4">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">{t("components")}</p>
            <div className="space-y-1">
              {(["trigger", "condition", "action", "delay"] as NodeType[]).map(type => {
                const items = paletteDefs.filter(p => p.type === type);
                return (
                  <div key={type} className="mb-3">
                    <p className="text-[9px] font-bold text-gray-300 uppercase tracking-wider mb-1.5 px-1">
                      {t(`nodeTypes.${type}`)}
                    </p>
                    <div className="space-y-1">
                      {items.map(item => {
                        const colors = nodeColorMap[item.color];
                        return (
                          <div
                            key={item.key}
                            draggable
                            className={cn("flex items-center gap-2 px-2.5 py-2 rounded-lg border cursor-grab active:cursor-grabbing transition-all hover:scale-[1.02]", colors.bg, colors.border)}
                          >
                            <item.icon className={cn("w-3.5 h-3.5 shrink-0", colors.icon)} />
                            <span className={cn("text-[11px]", colors.text)}>{t(`paletteItems.${item.key}`)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 relative overflow-auto bg-[radial-gradient(circle_at_1px_1px,#d1d5db_1px,transparent_0)] bg-[size:24px_24px]">
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
              <input
                defaultValue={selectedWorkflow?.name || t("newWorkflow")}
                className="bg-transparent text-sm font-semibold text-gray-900 outline-none border-b border-transparent focus:border-[#017764]/50 pb-0.5"
              />
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 text-xs rounded-lg transition-colors shadow-sm">
                  <Settings className="w-3.5 h-3.5" /> {t("builder.settings")}
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#017764] hover:bg-[#015a4d] text-white text-xs font-semibold rounded-lg transition-colors shadow-lg shadow-[#017764]/20">
                  <Play className="w-3.5 h-3.5" /> {t("builder.activate")}
                </button>
              </div>
            </div>

            {/* Visual Flow */}
            <div className="flex flex-col items-center justify-center min-h-full py-20 px-8 gap-0">
              {selectedWorkflow?.nodes.map((node, i) => {
                const colors = nodeColorMap[node.color];
                return (
                  <div key={node.id} className="flex flex-col items-center">
                    <div className={cn(
                      "relative flex items-center gap-3 px-5 py-3.5 rounded-2xl border-2 cursor-pointer transition-all hover:scale-105 shadow-md min-w-[220px]",
                      colors.bg, colors.border
                    )}>
                      <div className={cn("p-2 rounded-xl",
                        node.color === "primary" ? "bg-[#017764]/15" :
                        node.color === "accent" ? "bg-[#b0aa34]/15" :
                        node.color === "emerald" ? "bg-emerald-100" : "bg-gray-100"
                      )}>
                        <node.icon className={cn("w-4 h-4", colors.icon)} />
                      </div>
                      <div>
                        <p className={cn("text-[9px] font-bold uppercase tracking-wider opacity-60", colors.text)}>{t(`nodeTypes.${node.type}`)}</p>
                        <p className={cn("text-sm font-semibold", colors.text)}>{node.label}</p>
                      </div>
                    </div>
                    {selectedWorkflow && i < selectedWorkflow.nodes.length - 1 && (
                      <div className="flex flex-col items-center my-1">
                        <div className="w-0.5 h-5 bg-gray-300" />
                        <ArrowDown className="w-4 h-4 text-gray-400" />
                        <div className="w-0.5 h-5 bg-gray-300" />
                      </div>
                    )}
                  </div>
                );
              })}
              <div className="flex flex-col items-center mt-4">
                <div className="w-0.5 h-6 bg-gray-300" />
                <button className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-xl text-gray-400 hover:text-[#017764] hover:border-[#017764]/40 transition-all text-sm bg-white/80">
                  <Plus className="w-4 h-4" /> {t("builder.addNode")}
                </button>
              </div>
            </div>
          </div>

          {/* Properties Panel */}
          <div className="w-64 border-l border-gray-200 bg-white p-4 overflow-y-auto">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-4">{t("builder.nodeProperties")}</p>
            {selectedWorkflow?.nodes[0] && (
              <div className="space-y-4">
                <div>
                  <label className="text-[11px] text-gray-500 mb-1 block">{t("builder.name")}</label>
                  <input
                    defaultValue={selectedWorkflow.nodes[0].label}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 outline-none focus:border-[#017764]/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-gray-500 mb-1 block">{t("builder.trigger")}</label>
                  <select className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 outline-none">
                    <option>{t("builder.triggerOptions.ticketCreated")}</option>
                    <option>{t("builder.triggerOptions.slaAtRisk")}</option>
                    <option>{t("builder.triggerOptions.sentimentHigh")}</option>
                    <option>{t("builder.triggerOptions.fieldChanged")}</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-gray-500 mb-1 block">{t("builder.condition")}</label>
                  <div className="space-y-2">
                    <select className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 outline-none">
                      <option>{t("builder.conditionFieldOptions.priorityIs")}</option>
                      <option>{t("builder.conditionFieldOptions.tierIs")}</option>
                      <option>{t("builder.conditionFieldOptions.slaRemaining")}</option>
                    </select>
                    <select className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 outline-none">
                      <option>P1</option>
                      <option>P2</option>
                      <option>VIP</option>
                    </select>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <button className="w-full py-2 bg-[#017764] hover:bg-[#015a4d] text-white text-xs font-semibold rounded-lg transition-colors">
                    {t("builder.save")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
