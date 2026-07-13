"use client";

import { useState } from "react";
import TopBar from "@/components/layout/TopBar";
import { knowledgeArticles } from "@/data/mock";
import { cn, formatRelativeTime } from "@/lib/utils";
import {
  Search,
  Plus,
  BookOpen,
  Eye,
  ThumbsUp,
  Edit3,
  Trash2,
  Bot,
  Tag,
  ChevronRight,
  FileText,
  Lightbulb,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

const categories = ["Tous", "Réseau", "Authentification", "API", "Sécurité", "Administration", "Application"];

const categoryColor: Record<string, string> = {
  Réseau:          "text-[#017764] bg-[#017764]/10 border-[#017764]/20",
  Authentification: "text-emerald-700 bg-emerald-50 border-emerald-200",
  API:             "text-[#8a852a] bg-[#b0aa34]/10 border-[#b0aa34]/20",
  Sécurité:        "text-red-600 bg-red-50 border-red-200",
  Administration:  "text-orange-600 bg-orange-50 border-orange-200",
  Application:     "text-gray-600 bg-gray-100 border-gray-200",
};

const suggestedArticles = [
  { reason: "12 tickets non résolus cette semaine", title: "Erreurs SSL lors de la connexion VPN", category: "Réseau", confidence: 0.91 },
  { reason: "Pic de demandes lundi matin", title: "Guide: Accès après expiration de compte", category: "Authentification", confidence: 0.84 },
];

export default function KnowledgePage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [selectedArticle, setSelectedArticle] = useState<typeof knowledgeArticles[0] | null>(null);

  const filtered = knowledgeArticles.filter(a => {
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === "Tous" || a.category === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar
        title="Base de Connaissances"
        subtitle={`${knowledgeArticles.length} articles · Alimentée par RAG`}
        actions={
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#017764] hover:bg-[#015a4d] text-white text-xs font-semibold rounded-lg transition-colors shadow-lg shadow-[#017764]/20">
            <Plus className="w-3.5 h-3.5" /> Nouvel article
          </button>
        }
      />

      <div className="flex h-[calc(100vh-56px)]">
        {/* LEFT */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* AI Suggestions Banner */}
          <div className="mb-6 p-4 bg-[#017764]/8 border border-[#017764]/20 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <Bot className="w-4 h-4 text-[#017764]" />
              <span className="text-sm font-semibold text-[#017764]">IA — Articles suggérés à créer</span>
              <span className="text-[10px] text-[#017764] bg-[#017764]/10 px-2 py-0.5 rounded-full border border-[#017764]/20">Knowledge Gap détecté</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {suggestedArticles.map(article => (
                <div key={article.title} className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-xl shadow-sm">
                  <Lightbulb className="w-4 h-4 text-[#8a852a] shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800 mb-0.5">{article.title}</p>
                    <p className="text-[10px] text-gray-400 mb-2">{article.reason}</p>
                    <div className="flex items-center gap-2">
                      <span className={cn("text-[10px] border px-1.5 py-0.5 rounded", categoryColor[article.category])}>
                        {article.category}
                      </span>
                      <span className="text-[10px] text-[#017764]">IA {Math.round(article.confidence * 100)}%</span>
                    </div>
                  </div>
                  <button className="px-2 py-1 bg-[#017764]/10 text-[#017764] text-[10px] rounded-lg hover:bg-[#017764]/20 transition-colors shrink-0 border border-[#017764]/20">
                    Générer
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="flex gap-3 mb-4">
            <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Rechercher dans la base de connaissances..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-xs text-gray-800 placeholder-gray-400 outline-none"
              />
            </div>
          </div>

          {/* Category tabs */}
          <div className="flex gap-1.5 mb-5 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border",
                  selectedCategory === cat
                    ? "bg-[#017764]/10 text-[#017764] border-[#017764]/30"
                    : "bg-white text-gray-500 border-gray-200 hover:text-gray-700 hover:border-gray-300 shadow-sm"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Articles */}
          <div className="space-y-3">
            {filtered.map(article => (
              <div
                key={article.id}
                onClick={() => setSelectedArticle(article)}
                className={cn(
                  "p-4 bg-white border rounded-xl cursor-pointer transition-all group shadow-sm",
                  selectedArticle?.id === article.id
                    ? "border-[#017764]/35 bg-[#017764]/3"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <div className="flex items-start gap-3">
                  <FileText className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-800 group-hover:text-gray-900 transition-colors">{article.title}</span>
                      <span className={cn("text-[10px] border px-1.5 py-0.5 rounded shrink-0", categoryColor[article.category])}>
                        {article.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1 text-[11px] text-gray-400">
                        <Eye className="w-3 h-3" /> {article.views.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-[#017764]">
                        <ThumbsUp className="w-3 h-3" /> {article.helpful}%
                      </span>
                      <span className="text-[11px] text-gray-400">Mis à jour {formatRelativeTime(article.lastUpdated)}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-1">
                        <div
                          className="h-1 rounded-full"
                          style={{ width: `${article.helpful}%`, background: "linear-gradient(to right, #017764, #01c4a3)" }}
                        />
                      </div>
                      <span className="text-[10px] text-gray-400">{article.helpful}% utile</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button className="p-1.5 rounded text-gray-400 hover:text-gray-600 transition-colors"><Edit3 className="w-3.5 h-3.5" /></button>
                    <button className="p-1.5 rounded text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#017764] transition-colors shrink-0" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Preview */}
        <div className="w-96 border-l border-gray-200 bg-white overflow-y-auto">
          {selectedArticle ? (
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <span className={cn("text-[11px] border px-2 py-1 rounded", categoryColor[selectedArticle.category])}>
                  {selectedArticle.category}
                </span>
                <div className="flex items-center gap-1">
                  <button className="p-1.5 rounded text-gray-400 hover:text-gray-600 transition-colors"><Edit3 className="w-3.5 h-3.5" /></button>
                  <button className="p-1.5 rounded text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>

              <h2 className="text-sm font-bold text-gray-900 mb-4 leading-snug">{selectedArticle.title}</h2>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="text-center p-2 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm font-bold text-gray-800">{selectedArticle.views.toLocaleString()}</p>
                  <p className="text-[10px] text-gray-400">Vues</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm font-bold text-[#017764]">{selectedArticle.helpful}%</p>
                  <p className="text-[10px] text-gray-400">Utile</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm font-bold text-[#8a852a]">RAG</p>
                  <p className="text-[10px] text-gray-400">Indexé</p>
                </div>
              </div>

              {/* Article content */}
              <div className="space-y-4 text-[12px] text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-orange-500" /> Symptômes
                  </h3>
                  <ul className="space-y-1 text-gray-500">
                    <li className="flex gap-2"><span className="text-gray-300 mt-1">•</span>Impossible de se connecter depuis le client VPN</li>
                    <li className="flex gap-2"><span className="text-gray-300 mt-1">•</span>Message d&apos;erreur &quot;Authentication failed&quot;</li>
                    <li className="flex gap-2"><span className="text-gray-300 mt-1">•</span>Connexion qui s&apos;établit puis se déconnecte</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-[#017764]" /> Étapes de résolution
                  </h3>
                  <div className="space-y-2">
                    {[
                      "Vérifier la version du client (v4.10+ requis)",
                      "Effacer les profils : Préférences → Nettoyer",
                      "Se reconnecter sur vpn.company.com",
                      "Vérifier que le certificat n'a pas expiré",
                      "Si persistant, réinstaller le client",
                    ].map((step, i) => (
                      <div key={i} className="flex gap-2.5 p-2 bg-gray-50 rounded-lg border border-gray-100">
                        <span className="w-5 h-5 rounded-full bg-[#017764]/15 text-[#017764] flex items-center justify-center text-[10px] font-bold shrink-0">
                          {i + 1}
                        </span>
                        <span className="text-[11px] text-gray-700">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-gray-400" /> Tags RAG
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {["VPN", "Cisco AnyConnect", "Connexion", "Réseau", "Auth"].map(tag => (
                      <span key={tag} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded border border-gray-200">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-gray-200">
                <p className="text-[10px] text-gray-400 mb-3">Cet article vous a-t-il été utile ?</p>
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[#017764]/10 text-[#017764] text-[11px] rounded-lg hover:bg-[#017764]/20 transition-colors border border-[#017764]/20">
                    <ThumbsUp className="w-3.5 h-3.5" /> Oui
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gray-100 text-gray-500 text-[11px] rounded-lg hover:bg-gray-200 transition-colors border border-gray-200">
                    Améliorer
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center px-8">
              <BookOpen className="w-12 h-12 text-gray-300 mb-4" />
              <p className="text-sm font-medium text-gray-500 mb-1">Sélectionnez un article</p>
              <p className="text-[11px] text-gray-400">Cliquez sur un article pour afficher son contenu et ses statistiques</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
