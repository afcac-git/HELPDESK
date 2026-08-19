"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import TopBar from "@/components/layout/TopBar";
import { knowledgeArticles, type CategorySlug } from "@/data/mock";
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
import type { Locale } from "@/i18n/config";

const categories: ("all" | CategorySlug)[] = ["all", "network", "auth", "api", "security", "admin", "app"];

const categoryColor: Record<CategorySlug, string> = {
  network:  "text-[#017764] bg-[#017764]/10 border-[#017764]/20",
  auth:     "text-emerald-700 bg-emerald-50 border-emerald-200",
  api:      "text-[#8a852a] bg-[#b0aa34]/10 border-[#b0aa34]/20",
  security: "text-red-600 bg-red-50 border-red-200",
  admin:    "text-orange-600 bg-orange-50 border-orange-200",
  app:      "text-gray-600 bg-gray-100 border-gray-200",
};

const suggestedArticles: { reasonKey: string; titleKey: string; category: CategorySlug; confidence: number }[] = [
  { reasonKey: "article1Reason", titleKey: "article1Title", category: "network", confidence: 0.91 },
  { reasonKey: "article2Reason", titleKey: "article2Title", category: "auth", confidence: 0.84 },
];

export default function KnowledgePage() {
  const t = useTranslations("knowledge");
  const tCommon = useTranslations("common");
  const tTime = useTranslations("time");
  const locale = useLocale() as Locale;
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | CategorySlug>("all");
  const [selectedArticle, setSelectedArticle] = useState<typeof knowledgeArticles[0] | null>(null);

  const filtered = knowledgeArticles.filter(a => {
    const matchSearch = !search || a.title[locale].toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === "all" || a.category === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar
        title={t("title")}
        subtitle={t("subtitle", { count: knowledgeArticles.length })}
        actions={
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#017764] hover:bg-[#015a4d] text-white text-xs font-semibold rounded-lg transition-colors shadow-lg shadow-[#017764]/20">
            <Plus className="w-3.5 h-3.5" /> {t("newArticle")}
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
              <span className="text-sm font-semibold text-[#017764]">{t("aiSuggestedTitle")}</span>
              <span className="text-[10px] text-[#017764] bg-[#017764]/10 px-2 py-0.5 rounded-full border border-[#017764]/20">{t("aiSuggestedBadge")}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {suggestedArticles.map(article => (
                <div key={article.titleKey} className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-xl shadow-sm">
                  <Lightbulb className="w-4 h-4 text-[#8a852a] shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800 mb-0.5">{t(`suggested.${article.titleKey}`)}</p>
                    <p className="text-[10px] text-gray-400 mb-2">{t(`suggested.${article.reasonKey}`)}</p>
                    <div className="flex items-center gap-2">
                      <span className={cn("text-[10px] border px-1.5 py-0.5 rounded", categoryColor[article.category])}>
                        {tCommon(`categories.${article.category}`)}
                      </span>
                      <span className="text-[10px] text-[#017764]">{tCommon("aiPrefix")} {Math.round(article.confidence * 100)}%</span>
                    </div>
                  </div>
                  <button className="px-2 py-1 bg-[#017764]/10 text-[#017764] text-[10px] rounded-lg hover:bg-[#017764]/20 transition-colors shrink-0 border border-[#017764]/20">
                    {t("generate")}
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
                placeholder={t("searchPlaceholder")}
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
                {tCommon(`categories.${cat}`)}
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
                      <span className="text-sm font-medium text-gray-800 group-hover:text-gray-900 transition-colors">{article.title[locale]}</span>
                      <span className={cn("text-[10px] border px-1.5 py-0.5 rounded shrink-0", categoryColor[article.category])}>
                        {tCommon(`categories.${article.category}`)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1 text-[11px] text-gray-400">
                        <Eye className="w-3 h-3" /> {article.views.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-[#017764]">
                        <ThumbsUp className="w-3 h-3" /> {article.helpful}%
                      </span>
                      <span className="text-[11px] text-gray-400">{t("updatedAgo", { time: formatRelativeTime(article.lastUpdated, tTime) })}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-1">
                        <div
                          className="h-1 rounded-full"
                          style={{ width: `${article.helpful}%`, background: "linear-gradient(to right, #017764, #01c4a3)" }}
                        />
                      </div>
                      <span className="text-[10px] text-gray-400">{article.helpful}{t("usefulSuffix")}</span>
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
                  {tCommon(`categories.${selectedArticle.category}`)}
                </span>
                <div className="flex items-center gap-1">
                  <button className="p-1.5 rounded text-gray-400 hover:text-gray-600 transition-colors"><Edit3 className="w-3.5 h-3.5" /></button>
                  <button className="p-1.5 rounded text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>

              <h2 className="text-sm font-bold text-gray-900 mb-4 leading-snug">{selectedArticle.title[locale]}</h2>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="text-center p-2 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm font-bold text-gray-800">{selectedArticle.views.toLocaleString()}</p>
                  <p className="text-[10px] text-gray-400">{t("views")}</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm font-bold text-[#017764]">{selectedArticle.helpful}%</p>
                  <p className="text-[10px] text-gray-400">{t("useful")}</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm font-bold text-[#8a852a]">{t("ragIndexed")}</p>
                  <p className="text-[10px] text-gray-400">{t("indexed")}</p>
                </div>
              </div>

              {/* Article content */}
              <div className="space-y-4 text-[12px] text-gray-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-orange-500" /> {t("symptoms")}
                  </h3>
                  <ul className="space-y-1 text-gray-500">
                    <li className="flex gap-2"><span className="text-gray-300 mt-1">•</span>{t("demoArticle.symptom1")}</li>
                    <li className="flex gap-2"><span className="text-gray-300 mt-1">•</span>{t("demoArticle.symptom2")}</li>
                    <li className="flex gap-2"><span className="text-gray-300 mt-1">•</span>{t("demoArticle.symptom3")}</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-[#017764]" /> {t("resolutionSteps")}
                  </h3>
                  <div className="space-y-2">
                    {["step1", "step2", "step3", "step4", "step5"].map((step, i) => (
                      <div key={step} className="flex gap-2.5 p-2 bg-gray-50 rounded-lg border border-gray-100">
                        <span className="w-5 h-5 rounded-full bg-[#017764]/15 text-[#017764] flex items-center justify-center text-[10px] font-bold shrink-0">
                          {i + 1}
                        </span>
                        <span className="text-[11px] text-gray-700">{t(`demoArticle.${step}`)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-gray-400" /> {t("ragTags")}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {t.raw("demoArticle.tags").map((tag: string) => (
                      <span key={tag} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded border border-gray-200">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-gray-200">
                <p className="text-[10px] text-gray-400 mb-3">{t("wasHelpful")}</p>
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[#017764]/10 text-[#017764] text-[11px] rounded-lg hover:bg-[#017764]/20 transition-colors border border-[#017764]/20">
                    <ThumbsUp className="w-3.5 h-3.5" /> {t("yes")}
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gray-100 text-gray-500 text-[11px] rounded-lg hover:bg-gray-200 transition-colors border border-gray-200">
                    {t("improve")}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center px-8">
              <BookOpen className="w-12 h-12 text-gray-300 mb-4" />
              <p className="text-sm font-medium text-gray-500 mb-1">{t("selectArticle")}</p>
              <p className="text-[11px] text-gray-400">{t("selectArticleHint")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
