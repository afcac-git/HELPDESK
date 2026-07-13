"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { tickets } from "@/data/mock";
import { cn, formatSLA, formatRelativeTime } from "@/lib/utils";
import {
  ArrowLeft,
  CheckCircle2,
  ArrowUp,
  Clock,
  Merge,
  Send,
  Paperclip,
  Smile,
  LayoutTemplate,
  Bot,
  BookOpen,
  Users,
  Cpu,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Edit3,
  Star,
  Ticket,
  ExternalLink,
  AtSign,
  Plus,
} from "lucide-react";
import type { Channel } from "@/data/mock";

const channelIcon: Record<Channel, string> = {
  whatsapp: "💬",
  email: "📧",
  slack: "🔷",
  teams: "🔵",
  web: "🌐",
  phone: "📞",
};

const priorityColor: Record<string, string> = {
  P1: "bg-red-500/15 text-red-600 border-red-400/30",
  P2: "bg-orange-500/15 text-orange-600 border-orange-400/30",
  P3: "bg-[#b0aa34]/15 text-[#8a852a] border-[#b0aa34]/30",
  P4: "bg-gray-100 text-gray-500 border-gray-300",
};

const tierColor: Record<string, string> = {
  VIP: "text-[#8a852a] bg-[#b0aa34]/10 border-[#b0aa34]/25",
  Enterprise: "text-[#017764] bg-[#017764]/10 border-[#017764]/20",
  SMB: "text-gray-600 bg-gray-100 border-gray-200",
  Starter: "text-gray-500 bg-gray-100 border-gray-200",
};

const sentimentConfig: Record<string, { emoji: string; label: string; bar: string; text: string }> = {
  frustrated: { emoji: "😤", label: "Frustration", bar: "bg-red-500",    text: "text-red-600" },
  urgent:     { emoji: "🚨", label: "Urgent",      bar: "bg-orange-500", text: "text-orange-600" },
  neutral:    { emoji: "😐", label: "Neutre",       bar: "bg-gray-400",   text: "text-gray-500" },
  positive:   { emoji: "😊", label: "Positif",      bar: "bg-[#017764]",  text: "text-[#017764]" },
};

export default function TicketDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const ticket = tickets.find(t => t.id === id);
  const [message, setMessage] = useState("");
  const [draftEditing, setDraftEditing] = useState(false);
  const [draft, setDraft] = useState(ticket?.aiDraft || "");
  const [activeTab, setActiveTab] = useState<"ai" | "kb" | "collab">("ai");

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Ticket introuvable</p>
          <button onClick={() => router.push("/tickets")} className="text-[#017764] text-sm hover:text-[#015a4d]">
            ← Retour aux tickets
          </button>
        </div>
      </div>
    );
  }

  const sla = formatSLA(ticket.slaMinutesLeft);
  const sentiment = sentimentConfig[ticket.sentiment];
  const slaPercent = Math.max(0, Math.min(100, (ticket.slaMinutesLeft / 120) * 100));

  return (
    <div className="h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="px-5 py-3 border-b border-gray-200 bg-white flex items-center gap-4 shrink-0">
        <button onClick={() => router.push("/tickets")} className="p-1.5 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="text-[11px] text-gray-400 font-mono shrink-0">#{ticket.id}</span>
          <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded border shrink-0", priorityColor[ticket.priority])}>
            {ticket.priority}
          </span>
          <span className="text-xl shrink-0">{channelIcon[ticket.channel]}</span>
          <h1 className="text-sm font-semibold text-gray-900 truncate">{ticket.title}</h1>
          {ticket.contact.tier === "VIP" && (
            <span className="shrink-0 flex items-center gap-1 px-2 py-0.5 bg-[#b0aa34]/10 border border-[#b0aa34]/25 rounded text-[10px] text-[#8a852a] font-bold">
              <Star className="w-3 h-3" /> VIP
            </span>
          )}
        </div>

        {/* SLA Countdown */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <Clock className={cn("w-4 h-4", sla.color)} />
            <div>
              <p className={cn("text-sm font-bold tabular-nums", sla.color)}>{sla.text}</p>
              <div className="w-24 bg-gray-200 rounded-full h-1 mt-0.5">
                <div
                  className="h-1 rounded-full transition-all"
                  style={{
                    width: `${slaPercent}%`,
                    backgroundColor: ticket.slaMinutesLeft <= 30 ? "#ef4444" : ticket.slaMinutesLeft <= 60 ? "#f97316" : "#017764"
                  }}
                />
              </div>
            </div>
          </div>

          {/* Sentiment */}
          <div className={cn("flex items-center gap-1.5 px-2 py-1 rounded-lg bg-gray-100", sentiment.text)}>
            <span className="text-base">{sentiment.emoji}</span>
            <div>
              <p className="text-[10px] font-medium">{sentiment.label}</p>
              <div className="w-12 bg-gray-200 rounded-full h-1 mt-0.5">
                <div className={cn("h-1 rounded-full", sentiment.bar)} style={{ width: `${Math.round(ticket.sentimentScore * 100)}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#017764] hover:bg-[#015a4d] text-white text-[11px] font-semibold rounded-lg transition-colors shadow-lg shadow-[#017764]/20">
            <CheckCircle2 className="w-3.5 h-3.5" /> Résoudre
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-[11px] font-medium rounded-lg transition-colors border border-gray-200">
            <ArrowUp className="w-3.5 h-3.5" /> Escalader
          </button>
          <button className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors border border-gray-200">
            <Clock className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors border border-gray-200">
            <Merge className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3-Column Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT — Context Panel */}
        <div className="w-60 border-r border-gray-200 overflow-y-auto bg-gray-50 flex-shrink-0">
          <div className="p-4 space-y-5">
            {/* Contact */}
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Contact</p>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#017764] to-[#b0aa34] flex items-center justify-center text-xs font-bold text-white">
                  {ticket.contact.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-800">{ticket.contact.name}</p>
                  <p className="text-[10px] text-gray-400">{ticket.contact.company}</p>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-gray-400">Tier</span>
                  <span className={cn("text-[10px] border px-1.5 py-0.5 rounded font-medium", tierColor[ticket.contact.tier])}>
                    {ticket.contact.tier}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-gray-400">Health Score</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-12 bg-gray-200 rounded-full h-1">
                      <div
                        className="h-1 rounded-full"
                        style={{
                          width: `${ticket.contact.healthScore}%`,
                          backgroundColor: ticket.contact.healthScore >= 80 ? "#017764" : ticket.contact.healthScore >= 60 ? "#b0aa34" : "#ef4444"
                        }}
                      />
                    </div>
                    <span className="text-[10px] text-gray-600">{ticket.contact.healthScore}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-gray-400">CSAT</span>
                  <span className="text-[10px] text-[#8a852a] font-medium">★ {ticket.contact.csat}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-gray-400">Total tickets</span>
                  <span className="text-[10px] text-gray-600">{ticket.contact.totalTickets}</span>
                </div>
              </div>
            </div>

            {/* Assets */}
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Assets</p>
              <div className="space-y-2">
                <div className="p-2 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[11px] text-gray-700 font-medium">VPN Corp</span>
                    <span className="text-[9px] text-orange-500 font-bold">Expire 2j</span>
                  </div>
                  <p className="text-[10px] text-gray-400">Cisco AnyConnect v4.8</p>
                </div>
                <div className="p-2 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[11px] text-gray-700 font-medium">Laptop</span>
                    <span className="text-[9px] text-[#017764] font-bold">OK</span>
                  </div>
                  <p className="text-[10px] text-gray-400">ThinkPad X1 Carbon</p>
                </div>
              </div>
            </div>

            {/* Related Tickets */}
            {ticket.relatedTickets.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Tickets liés</p>
                <div className="space-y-1.5">
                  {ticket.relatedTickets.map(rid => (
                    <a key={rid} href={`/tickets/${rid}`} className="flex items-center gap-2 p-2 bg-white rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                      <Ticket className="w-3 h-3 text-gray-400" />
                      <span className="text-[11px] text-[#017764] font-mono">#{rid}</span>
                      <ExternalLink className="w-2.5 h-2.5 text-gray-300 ml-auto" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata */}
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Détails</p>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-gray-400">Catégorie</span>
                  <span className="text-[10px] text-gray-600">{ticket.category}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-gray-400">Créé</span>
                  <span className="text-[10px] text-gray-600">{formatRelativeTime(ticket.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-gray-400">Mis à jour</span>
                  <span className="text-[10px] text-gray-600">{formatRelativeTime(ticket.updatedAt)}</span>
                </div>
                {ticket.assignedAgent && (
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-400">Assigné à</span>
                    <span className="text-[10px] text-gray-600">{ticket.assignedAgent.name.split(" ")[0]}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Tags</p>
              <div className="flex flex-wrap gap-1">
                {ticket.tags.map(tag => (
                  <span key={tag} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded border border-gray-200">
                    {tag}
                  </span>
                ))}
                <button className="text-[10px] text-gray-400 hover:text-gray-600 px-1 py-0.5 rounded border border-dashed border-gray-300 transition-colors">
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER — Conversation */}
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {ticket.messages.map((msg) => (
              <div
                key={msg.id}
                className={cn("flex gap-3", msg.sender === "agent" || msg.sender === "ai" ? "flex-row-reverse" : "flex-row")}
              >
                <div className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0",
                  msg.sender === "contact" ? "bg-gray-200 text-gray-600" :
                  msg.sender === "ai" ? "bg-gradient-to-br from-[#017764] to-[#b0aa34] text-white" :
                  "bg-[#017764] text-white"
                )}>
                  {msg.sender === "contact" ? ticket.contact.name.slice(0, 2).toUpperCase() :
                   msg.sender === "ai" ? <Cpu className="w-3.5 h-3.5" /> :
                   ticket.assignedAgent?.avatar || "AG"}
                </div>

                <div className={cn("max-w-[70%] space-y-1 flex flex-col", msg.sender !== "contact" ? "items-end" : "items-start")}>
                  <div className={cn(
                    "px-4 py-3 rounded-2xl text-xs leading-relaxed",
                    msg.sender === "contact"
                      ? "bg-white text-gray-800 rounded-tl-sm border border-gray-200 shadow-sm"
                      : msg.sender === "ai"
                      ? "bg-[#017764]/10 text-[#017764] rounded-tr-sm border border-[#017764]/20"
                      : "bg-[#017764] text-white rounded-tr-sm shadow-sm"
                  )}>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  <div className={cn("flex items-center gap-2 px-1", msg.sender !== "contact" ? "flex-row-reverse" : "")}>
                    <span className="text-[10px] text-gray-400">{formatRelativeTime(msg.timestamp)}</span>
                    {msg.sentiment && msg.sender === "contact" && (
                      <span className="text-[10px] text-gray-400">{sentimentConfig[msg.sentiment]?.emoji}</span>
                    )}
                    {msg.sender === "ai" && <span className="text-[10px] text-[#017764]/50">IA · RAG</span>}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600 shrink-0">
                {ticket.contact.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="px-4 py-3 bg-white rounded-2xl rounded-tl-sm border border-gray-200 shadow-sm">
                <div className="flex items-center gap-1">
                  {[0, 1, 2].map(i => (
                    <span key={i} className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Reply Box */}
          <div className="border-t border-gray-200 p-4 bg-white">
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden focus-within:border-[#017764]/50 transition-colors shadow-sm">
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder={`Répondre à ${ticket.contact.name}...`}
                rows={3}
                className="w-full p-3 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none resize-none"
              />
              <div className="flex items-center gap-2 px-3 py-2 border-t border-gray-200">
                <button className="p-1.5 rounded text-gray-400 hover:text-gray-600 transition-colors"><Paperclip className="w-4 h-4" /></button>
                <button className="p-1.5 rounded text-gray-400 hover:text-gray-600 transition-colors"><Smile className="w-4 h-4" /></button>
                <button className="flex items-center gap-1 p-1.5 rounded text-gray-400 hover:text-gray-600 transition-colors text-xs">
                  <LayoutTemplate className="w-4 h-4" /> Template
                </button>
                <div className="flex-1" />
                <button className="flex items-center gap-1.5 px-4 py-1.5 bg-[#017764] hover:bg-[#015a4d] text-white text-xs font-semibold rounded-lg transition-colors shadow-md shadow-[#017764]/20">
                  <Send className="w-3.5 h-3.5" /> Envoyer
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — AI Panel */}
        <div className="w-72 border-l border-gray-200 flex flex-col overflow-hidden bg-white flex-shrink-0">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            {([
              { id: "ai", icon: Bot, label: "IA" },
              { id: "kb", icon: BookOpen, label: "Sources" },
              { id: "collab", icon: Users, label: "Collab" },
            ] as const).map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-3 text-[11px] font-medium transition-colors border-b-2",
                  activeTab === tab.id
                    ? "border-[#017764] text-[#017764]"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                )}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === "ai" && (
              <div className="space-y-4">
                {/* AI Confidence */}
                <div className="p-3 bg-[#017764]/8 border border-[#017764]/20 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-[#017764]" />
                      <span className="text-[11px] font-semibold text-[#017764]">Confiance IA</span>
                    </div>
                    <span className={cn("text-sm font-bold",
                      ticket.aiConfidence >= 0.85 ? "text-[#017764]" :
                      ticket.aiConfidence >= 0.6 ? "text-[#8a852a]" : "text-red-500"
                    )}>
                      {Math.round(ticket.aiConfidence * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${ticket.aiConfidence * 100}%`,
                        backgroundColor: ticket.aiConfidence >= 0.85 ? "#017764" : ticket.aiConfidence >= 0.6 ? "#b0aa34" : "#ef4444"
                      }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1.5">
                    {ticket.aiConfidence >= 0.85 ? "Résolution autonome recommandée" :
                     ticket.aiConfidence >= 0.6 ? "Revue humaine suggérée" : "Expertise humaine requise"}
                  </p>
                </div>

                {/* AI Draft */}
                {draft && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-gray-700 flex items-center gap-1.5">
                        <Bot className="w-3.5 h-3.5 text-[#017764]" /> Brouillon IA
                      </span>
                      <button onClick={() => setDraftEditing(!draftEditing)} className="text-[10px] text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1">
                        <Edit3 className="w-3 h-3" /> {draftEditing ? "Annuler" : "Éditer"}
                      </button>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                      {draftEditing ? (
                        <textarea
                          value={draft}
                          onChange={e => setDraft(e.target.value)}
                          rows={8}
                          className="w-full p-3 bg-transparent text-[11px] text-gray-700 outline-none resize-none"
                        />
                      ) : (
                        <p className="p-3 text-[11px] text-gray-600 leading-relaxed whitespace-pre-wrap">{draft}</p>
                      )}
                      <div className="flex gap-2 p-2 border-t border-gray-200">
                        <button
                          onClick={() => setMessage(draft)}
                          className="flex-1 text-[10px] py-1.5 bg-[#017764]/10 text-[#017764] rounded-lg hover:bg-[#017764]/20 transition-colors flex items-center justify-center gap-1"
                        >
                          <Copy className="w-3 h-3" /> Utiliser
                        </button>
                        <button className="flex items-center gap-1 text-[10px] py-1.5 px-2 bg-[#017764] text-white rounded-lg hover:bg-[#015a4d] transition-colors">
                          <Send className="w-3 h-3" /> Envoyer
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 flex items-center justify-center gap-1 py-1.5 text-[10px] text-gray-500 hover:text-[#017764] bg-gray-50 rounded-lg hover:bg-[#017764]/8 transition-all border border-gray-200">
                        <ThumbsUp className="w-3 h-3" /> Utile
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-1 py-1.5 text-[10px] text-gray-500 hover:text-red-500 bg-gray-50 rounded-lg hover:bg-red-50 transition-all border border-gray-200">
                        <ThumbsDown className="w-3 h-3" /> Régénérer
                      </button>
                    </div>
                  </div>
                )}

                {!draft && (
                  <div className="text-center py-4">
                    <Bot className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-[11px] text-gray-400 mb-3">Aucun brouillon IA disponible</p>
                    <button className="flex items-center gap-1.5 px-3 py-2 bg-[#017764]/10 text-[#017764] text-[11px] rounded-lg hover:bg-[#017764]/20 transition-colors mx-auto">
                      <RefreshCw className="w-3.5 h-3.5" /> Générer une suggestion
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "kb" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-gray-700">Sources RAG</span>
                  <span className="text-[10px] text-gray-400">3 articles pertinents</span>
                </div>
                {[
                  { id: "kb1", title: "Résolution VPN Cisco AnyConnect", relevance: 0.94, category: "Réseau" },
                  { id: "kb5", title: "Problèmes d'authentification VPN", relevance: 0.78, category: "Réseau" },
                  { id: "kb3", title: "Configuration SSO et certificats", relevance: 0.61, category: "Sécurité" },
                ].map(article => (
                  <div key={article.id} className="p-3 bg-gray-50 border border-gray-200 rounded-xl hover:border-[#017764]/25 transition-colors">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <p className="text-[11px] font-medium text-gray-700 leading-snug">{article.title}</p>
                      <span className={cn("text-[10px] font-bold shrink-0",
                        article.relevance >= 0.85 ? "text-[#017764]" : article.relevance >= 0.7 ? "text-[#8a852a]" : "text-gray-400"
                      )}>
                        {Math.round(article.relevance * 100)}%
                      </span>
                    </div>
                    <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded border border-gray-200">{article.category}</span>
                    <div className="flex gap-2 mt-2">
                      <button className="flex-1 text-[10px] py-1 bg-gray-100 text-gray-500 rounded hover:bg-gray-200 transition-colors">Voir</button>
                      <button className="flex-1 text-[10px] py-1 bg-[#017764]/10 text-[#017764] rounded hover:bg-[#017764]/20 transition-colors">Insérer</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "collab" && (
              <div className="space-y-4">
                <div>
                  <p className="text-[11px] font-semibold text-gray-700 mb-3">Impliquer un expert</p>
                  <div className="space-y-2">
                    {[
                      { name: "Théo Moreau", team: "DevOps", status: "online" },
                      { name: "Emma Dubois", team: "Sécurité", status: "busy" },
                    ].map(expert => (
                      <div key={expert.name} className="flex items-center gap-2 p-2.5 bg-gray-50 border border-gray-200 rounded-xl">
                        <div className="relative">
                          <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600">
                            {expert.name.split(" ").map(n => n[0]).join("")}
                          </div>
                          <span className={cn("absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-white", expert.status === "online" ? "bg-emerald-400" : "bg-orange-400")} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-medium text-gray-700">{expert.name}</p>
                          <p className="text-[10px] text-gray-400">{expert.team}</p>
                        </div>
                        <button className="p-1.5 rounded-lg bg-[#017764]/10 text-[#017764] hover:bg-[#017764]/20 transition-colors">
                          <AtSign className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[11px] font-semibold text-gray-700 mb-2">Note interne</p>
                  <textarea
                    rows={3}
                    placeholder="Note visible uniquement par l'équipe..."
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-[11px] text-gray-700 placeholder-gray-400 outline-none resize-none focus:border-[#017764]/50 transition-colors"
                  />
                  <button className="mt-2 w-full text-[11px] py-2 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200 transition-colors border border-gray-200">
                    Ajouter la note
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
