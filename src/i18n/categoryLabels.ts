import type { CategorySlug, LocalizedText } from "@/data/mock";

export const categoryLabels: Record<CategorySlug, LocalizedText> = {
  network: { fr: "Réseau", en: "Network", pt: "Rede" },
  auth: { fr: "Authentification", en: "Authentication", pt: "Autenticação" },
  api: { fr: "API", en: "API", pt: "API" },
  security: { fr: "Sécurité", en: "Security", pt: "Segurança" },
  admin: { fr: "Administration", en: "Administration", pt: "Administração" },
  app: { fr: "Application", en: "Application", pt: "Aplicação" },
};
