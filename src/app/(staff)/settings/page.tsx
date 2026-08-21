"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
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
import TeamAgentsSection from "@/components/settings/TeamAgentsSection";

const settingsSections = [
  { id: "ai", icon: Bot, key: "ai" },
  { id: "notifications", icon: Bell, key: "notifications" },
  { id: "security", icon: Shield, key: "security" },
  { id: "team", icon: Users, key: "team" },
  { id: "integrations", icon: Plug, key: "integrations" },
  { id: "appearance", icon: Palette, key: "appearance" },
  { id: "sla", icon: Zap, key: "sla" },
] as const;

const integrations = [
  { name: "Slack", icon: "🔷", status: "connected", key: "slackDesc" },
  { name: "Microsoft Teams", icon: "🔵", status: "connected", key: "teamsDesc" },
  { name: "WhatsApp Business", icon: "💬", status: "connected", key: "whatsappDesc" },
  { name: "Jira Software", icon: "🎯", status: "connected", key: "jiraDesc" },
  { name: "Salesforce", icon: "☁️", status: "disconnected", key: "salesforceDesc" },
  { name: "PagerDuty", icon: "🚨", status: "disconnected", key: "pagerdutyDesc" },
  { name: "GitHub", icon: "⚫", status: "disconnected", key: "githubDesc" },
  { name: "HubSpot", icon: "🟠", status: "disconnected", key: "hubspotDesc" },
] as const;

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
  const t = useTranslations("settings");
  const tCommon = useTranslations("common");
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

  const models = [
    { id: "claude-sonnet-4-6", nameKey: "sonnetName", descKey: "sonnetDesc", badgeKey: "sonnetBadge" },
    { id: "claude-haiku-4-5", nameKey: "haikuName", descKey: "haikuDesc", badgeKey: "haikuBadge" },
    { id: "claude-opus-4-7", nameKey: "opusName", descKey: "opusDesc", badgeKey: "opusBadge" },
  ] as const;

  const aiFeatures = [
    { key: "autoResolve", labelKey: "autoResolveLabel", descKey: "autoResolveDesc" },
    { key: "draftSuggestions", labelKey: "draftLabel", descKey: "draftDesc" },
    { key: "sentimentAnalysis", labelKey: "sentimentLabel", descKey: "sentimentDesc" },
    { key: "ragEnabled", labelKey: "ragLabel", descKey: "ragDesc" },
    { key: "feedbackLoop", labelKey: "feedbackLabel", descKey: "feedbackDesc" },
  ] as const;

  const notificationItems = [
    { key: "slaAlert", labelKey: "slaAlertLabel", descKey: "slaAlertDesc" },
    { key: "sentimentAlert", labelKey: "sentimentAlertLabel", descKey: "sentimentAlertDesc" },
    { key: "newTicket", labelKey: "newTicketLabel", descKey: "newTicketDesc" },
    { key: "agentMention", labelKey: "agentMentionLabel", descKey: "agentMentionDesc" },
    { key: "dailyDigest", labelKey: "dailyDigestLabel", descKey: "dailyDigestDesc" },
    { key: "slackNotifs", labelKey: "slackNotifsLabel", descKey: "slackNotifsDesc" },
    { key: "emailNotifs", labelKey: "emailNotifsLabel", descKey: "emailNotifsDesc" },
  ] as const;

  const toggle = (obj: Record<string, boolean>, key: string, setter: (v: Record<string, boolean>) => void) => {
    setter({ ...obj, [key]: !obj[key] });
  };

  const appName = tCommon("appName");

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar title={t("title")} subtitle={t("subtitle", { appName })} />

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
                <span className="text-xs">{t(`sections.${section.key}`)}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeSection === "ai" && (
            <div className="max-w-2xl space-y-6">
              <div>
                <h2 className="text-base font-semibold text-gray-900 mb-1">{t("sections.ai")}</h2>
                <p className="text-xs text-gray-400">{t("ai.subtitle", { appName })}</p>
              </div>

              {/* Model Selection */}
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#017764]" /> {t("ai.modelTitle")}
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {models.map(model => (
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
                        <span className="text-[10px] bg-[#017764]/15 text-[#017764] px-1.5 py-0.5 rounded font-medium">{t(`ai.models.${model.badgeKey}`)}</span>
                        {aiSettings.model === model.id && <Check className="w-3 h-3 text-[#017764] ml-auto" />}
                      </div>
                      <p className="text-[11px] font-semibold text-gray-800">{t(`ai.models.${model.nameKey}`)}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5 leading-relaxed">{t(`ai.models.${model.descKey}`)}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Features toggles */}
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-800 mb-4">{t("ai.featuresTitle")}</h3>
                <div className="space-y-4">
                  {aiFeatures.map(item => (
                    <div key={item.key} className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-medium text-gray-800">{t(`ai.features.${item.labelKey}`)}</p>
                        <p className="text-[11px] text-gray-400">{t(`ai.features.${item.descKey}`)}</p>
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
                <h3 className="text-sm font-semibold text-gray-800 mb-1">{t("ai.thresholdTitle")}</h3>
                <p className="text-[11px] text-gray-400 mb-4">{t("ai.thresholdDesc")}</p>
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
                  <span>{t("ai.thresholdLow")}</span>
                  <span>{t("ai.thresholdHigh")}</span>
                </div>
              </div>

              <button className="flex items-center gap-2 px-4 py-2 bg-[#017764] hover:bg-[#015a4d] text-white text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-[#017764]/20">
                <Save className="w-4 h-4" /> {t("ai.save")}
              </button>
            </div>
          )}

          {activeSection === "notifications" && (
            <div className="max-w-2xl space-y-6">
              <div>
                <h2 className="text-base font-semibold text-gray-900 mb-1">{t("sections.notifications")}</h2>
                <p className="text-xs text-gray-400">{t("notifications.subtitle")}</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-800 mb-4">{t("notifications.realtimeTitle")}</h3>
                <div className="space-y-4">
                  {notificationItems.map(item => (
                    <div key={item.key} className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-medium text-gray-800">{t(`notifications.items.${item.labelKey}`)}</p>
                        <p className="text-[11px] text-gray-400">{t(`notifications.items.${item.descKey}`)}</p>
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

          {activeSection === "team" && <TeamAgentsSection />}

          {activeSection === "integrations" && (
            <div className="max-w-2xl space-y-6">
              <div>
                <h2 className="text-base font-semibold text-gray-900 mb-1">{t("sections.integrations")}</h2>
                <p className="text-xs text-gray-400">{t("integrations.subtitle", { appName })}</p>
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
                          {integration.status === "connected" ? t("integrations.connected") : t("integrations.disconnected")}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400">{t(`integrations.items.${integration.key}`)}</p>
                    </div>
                    <button className={cn(
                      "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors",
                      integration.status === "connected"
                        ? "bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500 border border-gray-200"
                        : "bg-[#017764] text-white hover:bg-[#015a4d]"
                    )}>
                      {integration.status === "connected" ? t("integrations.disconnect") : t("integrations.connect")}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "security" && (
            <div className="max-w-2xl space-y-6">
              <div>
                <h2 className="text-base font-semibold text-gray-900 mb-1">{t("sections.security")}</h2>
                <p className="text-xs text-gray-400">{t("security.subtitle")}</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-semibold text-gray-800">{t("security.ssoTitle")}</h3>
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
                      {sso.status === "active" ? t("security.ssoActive") : t("security.ssoInactive")}
                    </span>
                  </div>
                ))}
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">{t("security.gdprTitle")}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">{t("security.retention")}</span>
                    <select className="bg-white text-gray-700 border border-gray-200 rounded px-2 py-0.5 text-xs outline-none">
                      <option>{t("security.retention2y")}</option>
                      <option>{t("security.retention5y")}</option>
                      <option>{t("security.retention7y")}</option>
                    </select>
                  </div>
                  <div className="flex justify-between text-xs items-center">
                    <span className="text-gray-500">{t("security.autoAnonymize")}</span>
                    <Toggle enabled={true} onToggle={() => {}} />
                  </div>
                  <div className="flex justify-between text-xs items-center">
                    <span className="text-gray-500">{t("security.dsarExport")}</span>
                    <button className="text-[#017764] text-xs hover:text-[#015a4d] transition-colors">{t("security.configure")}</button>
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
