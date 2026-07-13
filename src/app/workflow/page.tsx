"use client";

import { useState } from "react";
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

interface WorkflowNode {
  id: string;
  type: NodeType;
  label: string;
  icon: React.ElementType;
  color: string;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  status: "active" | "draft" | "paused";
  category: string;
  triggersCount: number;
  lastRun: string;
  nodes: WorkflowNode[];
}

const workflows: Workflow[] = [
  {
    id: "wf1",
    name: "Escalade SLA VIP",
    description: "Alerte automatique et réassignation quand un ticket VIP risque de dépasser le SLA",
    status: "active",
    category: "SLA",
    triggersCount: 47,
    lastRun: "Il y a 12 min",
    nodes: [
      { id: "n1", type: "trigger", label: "SLA à 1h restante", icon: Clock, color: "primary" },
      { id: "n2", type: "condition", label: "Client est VIP ?", icon: GitBranch, color: "accent" },
      { id: "n3", type: "action", label: "Notifier Manager (Slack)", icon: MessageSquare, color: "emerald" },
      { id: "n4", type: "action", label: "Assigner Agent Senior", icon: Users, color: "emerald" },
    ],
  },
  {
    id: "wf2",
    name: "Auto-réponse Reset MDP",
    description: "Résolution automatique des demandes de réinitialisation de mot de passe via la base de connaissances IA",
    status: "active",
    category: "IA",
    triggersCount: 124,
    lastRun: "Il y a 3 min",
    nodes: [
      { id: "n1", type: "trigger", label: "Ticket créé - Intent: Reset MDP", icon: Zap, color: "primary" },
      { id: "n2", type: "condition", label: "Confiance IA > 85% ?", icon: GitBranch, color: "accent" },
      { id: "n3", type: "action", label: "Envoyer réponse automatique", icon: Mail, color: "emerald" },
      { id: "n4", type: "action", label: "Fermer ticket auto", icon: CheckCircle2, color: "emerald" },
    ],
  },
  {
    id: "wf3",
    name: "Alerte Sentiment Négatif",
    description: "Détecte les conversations à risque et prévient le superviseur en temps réel",
    status: "active",
    category: "Sentiment",
    triggersCount: 18,
    lastRun: "Il y a 1h",
    nodes: [
      { id: "n1", type: "trigger", label: "Sentiment frustration > 80%", icon: AlertTriangle, color: "primary" },
      { id: "n2", type: "action", label: "Notifier Superviseur", icon: Users, color: "orange" },
      { id: "n3", type: "delay", label: "Attendre 10 min", icon: Clock, color: "slate" },
      { id: "n4", type: "condition", label: "Ticket résolu ?", icon: GitBranch, color: "accent" },
    ],
  },
  {
    id: "wf4",
    name: "Relance tickets inactifs",
    description: "Relance automatique des tickets sans réponse client depuis 48h",
    status: "paused",
    category: "Suivi",
    triggersCount: 0,
    lastRun: "Jamais",
    nodes: [
      { id: "n1", type: "trigger", label: "Ticket sans réponse 48h", icon: Clock, color: "primary" },
      { id: "n2", type: "action", label: "Envoyer email de relance", icon: Mail, color: "emerald" },
      { id: "n3", type: "delay", label: "Attendre 24h", icon: Clock, color: "slate" },
      { id: "n4", type: "action", label: "Clôturer si pas de réponse", icon: CheckCircle2, color: "slate" },
    ],
  },
];

const nodeColorMap: Record<string, { bg: string; border: string; text: string; icon: string }> = {
  primary: { bg: "bg-[#017764]/8",  border: "border-[#017764]/25", text: "text-[#017764]",  icon: "text-[#017764]" },
  accent:  { bg: "bg-[#b0aa34]/8",  border: "border-[#b0aa34]/25", text: "text-[#8a852a]",  icon: "text-[#8a852a]" },
  emerald: { bg: "bg-emerald-50",    border: "border-emerald-200",  text: "text-emerald-700", icon: "text-emerald-600" },
  orange:  { bg: "bg-orange-50",     border: "border-orange-200",   text: "text-orange-700",  icon: "text-orange-500" },
  slate:   { bg: "bg-gray-50",       border: "border-gray-200",     text: "text-gray-600",    icon: "text-gray-500" },
};

const statusConfig = {
  active: { label: "Actif",      color: "text-[#017764] bg-[#017764]/10 border-[#017764]/25" },
  draft:  { label: "Brouillon",  color: "text-gray-500 bg-gray-100 border-gray-200" },
  paused: { label: "En pause",   color: "text-orange-600 bg-orange-50 border-orange-200" },
};

const nodeTypeLabel: Record<NodeType, string> = {
  trigger: "DÉCLENCHEUR",
  condition: "CONDITION",
  action: "ACTION",
  delay: "DÉLAI",
};

const paletteItems = [
  { type: "trigger" as NodeType, icon: Zap, label: "Ticket créé", color: "primary" },
  { type: "trigger" as NodeType, icon: Clock, label: "SLA à risque", color: "primary" },
  { type: "trigger" as NodeType, icon: AlertTriangle, label: "Sentiment élevé", color: "primary" },
  { type: "condition" as NodeType, icon: GitBranch, label: "Si/Sinon", color: "accent" },
  { type: "condition" as NodeType, icon: GitBranch, label: "Client VIP ?", color: "accent" },
  { type: "action" as NodeType, icon: Mail, label: "Envoyer email", color: "emerald" },
  { type: "action" as NodeType, icon: MessageSquare, label: "Notif Slack", color: "emerald" },
  { type: "action" as NodeType, icon: Users, label: "Assigner agent", color: "emerald" },
  { type: "delay" as NodeType, icon: Clock, label: "Délai", color: "slate" },
];

export default function WorkflowPage() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(workflows[0]);
  const [view, setView] = useState<"list" | "builder">("list");

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar
        title="Workflows No-Code"
        subtitle="Automatisation visuelle · Aucune compétence en programmation requise"
        actions={
          <button
            onClick={() => setView(view === "list" ? "builder" : "list")}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-600 text-xs font-medium rounded-lg transition-colors"
          >
            {view === "list" ? <><GitBranch className="w-3.5 h-3.5" /> Constructeur</> : <><ChevronRight className="w-3.5 h-3.5 rotate-180" /> Liste</>}
          </button>
        }
      />

      {view === "list" ? (
        <div className="p-6">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: "Workflows actifs", value: "3", icon: Play, color: "#017764" },
              { label: "Exécutions aujourd'hui", value: "189", icon: Zap, color: "#01c4a3" },
              { label: "Tickets automatisés", value: "43", icon: CheckCircle2, color: "#b0aa34" },
              { label: "Taux de succès", value: "98.2%", icon: GitBranch, color: "#8a852a" },
            ].map(stat => (
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
              <input placeholder="Rechercher un workflow..." className="flex-1 bg-transparent text-xs text-gray-700 placeholder-gray-400 outline-none" />
            </div>
            <button
              onClick={() => setView("builder")}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#017764] hover:bg-[#015a4d] text-white text-xs font-semibold rounded-lg transition-colors shadow-lg shadow-[#017764]/20"
            >
              <Plus className="w-3.5 h-3.5" /> Nouveau workflow
            </button>
          </div>

          {/* Workflow Grid */}
          <div className="grid grid-cols-2 gap-4">
            {workflows.map(wf => (
              <div
                key={wf.id}
                className={cn(
                  "bg-white border rounded-xl p-5 cursor-pointer transition-all shadow-sm",
                  selectedWorkflow?.id === wf.id ? "border-[#017764]/35 bg-[#017764]/3" : "border-gray-200 hover:border-gray-300"
                )}
                onClick={() => setSelectedWorkflow(wf)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-gray-900">{wf.name}</span>
                      <span className={cn("text-[10px] border px-1.5 py-0.5 rounded font-medium", statusConfig[wf.status].color)}>
                        {statusConfig[wf.status].label}
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
                      <span className="text-gray-700 font-medium">{wf.triggersCount}</span> exécutions
                    </span>
                    <span className="text-[10px] text-gray-400">Dernier : {wf.lastRun}</span>
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
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Composants</p>
            <div className="space-y-1">
              {(["trigger", "condition", "action", "delay"] as NodeType[]).map(type => {
                const items = paletteItems.filter(p => p.type === type);
                return (
                  <div key={type} className="mb-3">
                    <p className="text-[9px] font-bold text-gray-300 uppercase tracking-wider mb-1.5 px-1">
                      {nodeTypeLabel[type]}
                    </p>
                    <div className="space-y-1">
                      {items.map(item => {
                        const colors = nodeColorMap[item.color];
                        return (
                          <div
                            key={item.label}
                            draggable
                            className={cn("flex items-center gap-2 px-2.5 py-2 rounded-lg border cursor-grab active:cursor-grabbing transition-all hover:scale-[1.02]", colors.bg, colors.border)}
                          >
                            <item.icon className={cn("w-3.5 h-3.5 shrink-0", colors.icon)} />
                            <span className={cn("text-[11px]", colors.text)}>{item.label}</span>
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
                defaultValue={selectedWorkflow?.name || "Nouveau workflow"}
                className="bg-transparent text-sm font-semibold text-gray-900 outline-none border-b border-transparent focus:border-[#017764]/50 pb-0.5"
              />
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 text-xs rounded-lg transition-colors shadow-sm">
                  <Settings className="w-3.5 h-3.5" /> Paramètres
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#017764] hover:bg-[#015a4d] text-white text-xs font-semibold rounded-lg transition-colors shadow-lg shadow-[#017764]/20">
                  <Play className="w-3.5 h-3.5" /> Activer
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
                        <p className={cn("text-[9px] font-bold uppercase tracking-wider opacity-60", colors.text)}>{nodeTypeLabel[node.type]}</p>
                        <p className={cn("text-sm font-semibold", colors.text)}>{node.label}</p>
                      </div>
                    </div>
                    {i < selectedWorkflow.nodes.length - 1 && (
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
                  <Plus className="w-4 h-4" /> Ajouter un nœud
                </button>
              </div>
            </div>
          </div>

          {/* Properties Panel */}
          <div className="w-64 border-l border-gray-200 bg-white p-4 overflow-y-auto">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-4">Propriétés du nœud</p>
            {selectedWorkflow?.nodes[0] && (
              <div className="space-y-4">
                <div>
                  <label className="text-[11px] text-gray-500 mb-1 block">Nom</label>
                  <input
                    defaultValue={selectedWorkflow.nodes[0].label}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 outline-none focus:border-[#017764]/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-gray-500 mb-1 block">Déclencheur</label>
                  <select className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 outline-none">
                    <option>Ticket créé</option>
                    <option>SLA à risque</option>
                    <option>Sentiment élevé</option>
                    <option>Champ modifié</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-gray-500 mb-1 block">Condition</label>
                  <div className="space-y-2">
                    <select className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 outline-none">
                      <option>Priorité est</option>
                      <option>Client tier est</option>
                      <option>SLA restant</option>
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
                    Sauvegarder
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
