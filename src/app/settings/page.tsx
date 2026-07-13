"use client";

import { useState } from "react";
import TopBar from "@/components/layout/TopBar";
import {
  Bot,
  Bell,
  Shield,
  Users,
  Plug,
  Palette,
  Save,
  Cpu,
  Zap,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

const settingsSections = [
  { id: "ai", icon: Bot, label: "Intelligence Artificielle" },
  { id: "notifications", icon: Bell, label: "Notifications" },
  { id: "security", icon: Shield, label: "Sécurité & Accès" },
  { id: "team", icon: Users, label: "Équipes & Agents" },
  { id: "integrations", icon: Plug, label: "Intégrations" },
  { id: "appearance", icon: Palette, label: "Apparence" },
  { id: "sla", icon: Zap, label: "SLA & Workflows" },
];

const integrations = [
  { name: "Slack", icon: "🔷", status: "connected", desc: "Notifications & tickets depuis Slack" },
  { name: "Microsoft Teams", icon: "🔵", status: "connected", desc: "Intégration bidirectionnelle" },
  { name: "WhatsApp Business", icon: "💬", status: "connected", desc: "Via Meta Cloud API" },
  { name: "Jira Software", icon: "🎯", status: "connected", desc: "Synchronisation tickets/issues" },
  { name: "Salesforce", icon: "☁️", status: "disconnected", desc: "CRM & données clients" },
  { name: "PagerDuty", icon: "🚨", status: "disconnected", desc: "Incidents & alertes on-call" },
  { name: "GitHub", icon: "⚫", status: "disconnected", desc: "Issues & PR liées aux tickets" },
  { name: "HubSpot", icon: "🟠", status: "disconnected", desc: "CRM marketing & ventes" },
];

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
        enabled ? "bg-[#017764]" : "bg-gray-200"
      )}
    >
      <span className={cn("inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform", enabled ? "translate-x-4" : "translate-x-0.5")} />
    </button>
  );
}

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("ai");

  const [aiSettings, setAiSettings] = useState({
    autoResolve: true,
    draftSuggestions: true,
    sentimentAnalysis: true,
    ragEnabled: true,
    confidenceThreshold: 85,
    model: "claude-sonnet-4-6",
    language: "fr",
    feedbackLoop: true,
  });

  const [notifications, setNotifications] = useState({
    slaAlert: true,
    sentimentAlert: true,
    newTicket: false,
    agentMention: true,
    dailyDigest: true,
    slackNotifs: true,
    emailNotifs: true,
  });

  const toggle = (obj: Record<string, boolean>, key: string, setter: (v: Record<string, boolean>) => void) => {
    setter({ ...obj, [key]: !obj[key] });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar title="Paramètres" subtitle="Configuration de la plateforme NEXUS DESK" />

      <div className="flex h-[calc(100vh-56px)]">
        {/* Sidebar */}
        <div className="w-56 border-r border-gray-200 bg-white p-3">
          <nav className="space-y-0.5">
            {settingsSections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left transition-colors",
                  activeSection === section.id
                    ? "bg-[#017764]/10 text-[#017764] border border-[#017764]/30"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                )}
              >
                <section.icon className="w-4 h-4 shrink-0" />
                <span className="text-xs">{section.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeSection === "ai" && (
            <div className="max-w-2xl space-y-6">
              <div>
                <h2 className="text-base font-semibold text-gray-900 mb-1">Intelligence Artificielle</h2>
                <p className="text-xs text-gray-400">Configurez le comportement du moteur IA RAG de NEXUS DESK</p>
              </div>

              {/* Model Selection */}
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#017764]" /> Modèle LLM
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "claude-sonnet-4-6", name: "Claude Sonnet 4.6", desc: "Recommandé · Équilibre performance/coût", badge: "Actif" },
                    { id: "claude-haiku-4-5", name: "Claude Haiku 4.5", desc: "Ultra-rapide pour le triage", badge: "Triage" },
                    { id: "claude-opus-4-7", name: "Claude Opus 4.7", desc: "Maximum de précision · Coût élevé", badge: "Premium" },
                  ].map(model => (
                    <button
                      key={model.id}
                      onClick={() => setAiSettings(s => ({ ...s, model: model.id }))}
                      className={cn(
                        "p-3 rounded-xl border text-left transition-all",
                        aiSettings.model === model.id
                          ? "border-[#017764]/35 bg-[#017764]/8"
                          : "border-gray-200 bg-gray-50 hover:border-gray-300"
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] bg-[#017764]/15 text-[#017764] px-1.5 py-0.5 rounded font-medium">{model.badge}</span>
                        {aiSettings.model === model.id && <Check className="w-3 h-3 text-[#017764] ml-auto" />}
                      </div>
                      <p className="text-[11px] font-semibold text-gray-800">{model.name}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5 leading-relaxed">{model.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Features toggles */}
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-800 mb-4">Fonctionnalités IA</h3>
                <div className="space-y-4">
                  {[
                    { key: "autoResolve", label: "Résolution autonome", desc: "L'IA résout automatiquement les tickets si la confiance est suffisante" },
                    { key: "draftSuggestions", label: "Brouillons de réponses", desc: "Génère des suggestions de réponses pour chaque ticket" },
                    { key: "sentimentAnalysis", label: "Analyse des sentiments", desc: "Analyse le sentiment client en temps réel sur chaque message" },
                    { key: "ragEnabled", label: "RAG — Base de connaissances", desc: "Recherche sémantique dans la KB pour enrichir les réponses IA" },
                    { key: "feedbackLoop", label: "Apprentissage continu", desc: "Les tickets résolus alimentent automatiquement la base RAG" },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-medium text-gray-800">{item.label}</p>
                        <p className="text-[11px] text-gray-400">{item.desc}</p>
                      </div>
                      <Toggle
                        enabled={aiSettings[item.key as keyof typeof aiSettings] as boolean}
                        onToggle={() => setAiSettings(s => ({ ...s, [item.key]: !s[item.key as keyof typeof aiSettings] }))}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Confidence Threshold */}
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-800 mb-1">Seuil de confiance — Résolution autonome</h3>
                <p className="text-[11px] text-gray-400 mb-4">En dessous de ce seuil, un brouillon est présenté à l&apos;agent au lieu d&apos;une résolution automatique</p>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={50}
                    max={100}
                    value={aiSettings.confidenceThreshold}
                    onChange={e => setAiSettings(s => ({ ...s, confidenceThreshold: parseInt(e.target.value) }))}
                    className="flex-1 accent-[#017764]"
                  />
                  <span className="text-lg font-bold text-[#017764] w-12 text-right">{aiSettings.confidenceThreshold}%</span>
                </div>
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>50% — Permissif</span>
                  <span>100% — Très strict</span>
                </div>
              </div>

              <button className="flex items-center gap-2 px-4 py-2 bg-[#017764] hover:bg-[#015a4d] text-white text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-[#017764]/20">
                <Save className="w-4 h-4" /> Sauvegarder les paramètres IA
              </button>
            </div>
          )}

          {activeSection === "notifications" && (
            <div className="max-w-2xl space-y-6">
              <div>
                <h2 className="text-base font-semibold text-gray-900 mb-1">Notifications</h2>
                <p className="text-xs text-gray-400">Gérez quand et comment vous êtes alerté</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-800 mb-4">Alertes en temps réel</h3>
                <div className="space-y-4">
                  {[
                    { key: "slaAlert", label: "Alerte SLA à risque", desc: "Notification 1h avant expiration du SLA" },
                    { key: "sentimentAlert", label: "Sentiment critique", desc: "Alerte quand le score de frustration dépasse 80%" },
                    { key: "newTicket", label: "Nouveau ticket", desc: "Notification pour chaque nouveau ticket (déconseillé)" },
                    { key: "agentMention", label: "Mention @agent", desc: "Notification quand vous êtes mentionné dans un ticket" },
                    { key: "dailyDigest", label: "Résumé quotidien", desc: "Récapitulatif de la journée par email à 18h" },
                    { key: "slackNotifs", label: "Notifications Slack", desc: "Envoyer les alertes sur votre canal Slack" },
                    { key: "emailNotifs", label: "Notifications email", desc: "Recevoir les alertes critiques par email" },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-medium text-gray-800">{item.label}</p>
                        <p className="text-[11px] text-gray-400">{item.desc}</p>
                      </div>
                      <Toggle
                        enabled={notifications[item.key as keyof typeof notifications]}
                        onToggle={() => toggle(notifications as unknown as Record<string, boolean>, item.key, (v) => setNotifications(v as typeof notifications))}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === "integrations" && (
            <div className="max-w-2xl space-y-6">
              <div>
                <h2 className="text-base font-semibold text-gray-900 mb-1">Intégrations</h2>
                <p className="text-xs text-gray-400">Connectez NEXUS DESK à votre écosystème d&apos;outils</p>
              </div>
              <div className="space-y-3">
                {integrations.map(integration => (
                  <div key={integration.name} className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                    <span className="text-2xl">{integration.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-medium text-gray-800">{integration.name}</span>
                        <span className={cn("text-[10px] px-1.5 py-0.5 rounded border font-medium",
                          integration.status === "connected"
                            ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                            : "text-gray-500 bg-gray-100 border-gray-200"
                        )}>
                          {integration.status === "connected" ? "Connecté" : "Non connecté"}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400">{integration.desc}</p>
                    </div>
                    <button className={cn(
                      "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors",
                      integration.status === "connected"
                        ? "bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500 border border-gray-200"
                        : "bg-[#017764] text-white hover:bg-[#015a4d]"
                    )}>
                      {integration.status === "connected" ? "Déconnecter" : "Connecter"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "security" && (
            <div className="max-w-2xl space-y-6">
              <div>
                <h2 className="text-base font-semibold text-gray-900 mb-1">Sécurité & Accès</h2>
                <p className="text-xs text-gray-400">Configuration SSO, RBAC et conformité RGPD</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-semibold text-gray-800">Single Sign-On (SSO)</h3>
                {[
                  { name: "Azure Active Directory", status: "active", icon: "🔵" },
                  { name: "Google Workspace", status: "inactive", icon: "🟡" },
                  { name: "Okta", status: "inactive", icon: "🔴" },
                ].map(sso => (
                  <div key={sso.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2">
                      <span>{sso.icon}</span>
                      <span className="text-xs text-gray-700">{sso.name}</span>
                    </div>
                    <span className={cn("text-[10px] px-1.5 py-0.5 rounded border",
                      sso.status === "active" ? "text-emerald-700 bg-emerald-50 border-emerald-200" : "text-gray-500 bg-gray-100 border-gray-200"
                    )}>
                      {sso.status === "active" ? "Actif" : "Inactif"}
                    </span>
                  </div>
                ))}
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Conformité RGPD</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Rétention des données</span>
                    <select className="bg-white text-gray-700 border border-gray-200 rounded px-2 py-0.5 text-xs outline-none">
                      <option>2 ans</option>
                      <option>5 ans</option>
                      <option>7 ans</option>
                    </select>
                  </div>
                  <div className="flex justify-between text-xs items-center">
                    <span className="text-gray-500">Anonymisation automatique</span>
                    <Toggle enabled={true} onToggle={() => {}} />
                  </div>
                  <div className="flex justify-between text-xs items-center">
                    <span className="text-gray-500">Export DSAR (72h)</span>
                    <button className="text-[#017764] text-xs hover:text-[#015a4d] transition-colors">Configurer</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
