export type Priority = "P1" | "P2" | "P3" | "P4";
export type Status = "open" | "pending" | "resolved" | "closed";
export type Channel = "email" | "slack" | "teams" | "whatsapp" | "web" | "phone";
export type Sentiment = "positive" | "neutral" | "frustrated" | "urgent";
export type CategorySlug = "network" | "auth" | "api" | "security" | "admin" | "app";
export type DayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export interface LocalizedText {
  fr: string;
  en: string;
  pt: string;
}

export interface Agent {
  id: string;
  name: string;
  avatar: string;
  team: string;
  status: "online" | "busy" | "away" | "offline";
  ticketsOpen: number;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  company: string;
  tier: "VIP" | "Enterprise" | "SMB" | "Starter";
  healthScore: number;
  totalTickets: number;
  csat: number;
  language: string;
}

export interface Message {
  id: string;
  sender: "contact" | "agent" | "ai";
  content: LocalizedText;
  timestamp: Date;
  channel: Channel;
  sentiment?: Sentiment;
}

export interface Ticket {
  id: string;
  title: LocalizedText;
  priority: Priority;
  status: Status;
  channel: Channel;
  contact: Contact;
  assignedAgent?: Agent;
  createdAt: Date;
  updatedAt: Date;
  slaMinutesLeft: number;
  tags: LocalizedText[];
  sentiment: Sentiment;
  sentimentScore: number;
  messages: Message[];
  aiConfidence: number;
  aiDraft?: LocalizedText;
  relatedTickets: string[];
  category: LocalizedText;
}

export const agents: Agent[] = [
  { id: "a1", name: "Sophie Martin", avatar: "SM", team: "Réseau", status: "online", ticketsOpen: 8 },
  { id: "a2", name: "Lucas Bernard", avatar: "LB", team: "IT Support", status: "online", ticketsOpen: 12 },
  { id: "a3", name: "Emma Dubois", avatar: "ED", team: "Sécurité", status: "busy", ticketsOpen: 5 },
  { id: "a4", name: "Théo Moreau", avatar: "TM", team: "DevOps", status: "away", ticketsOpen: 3 },
  { id: "a5", name: "Chloé Petit", avatar: "CP", team: "IT Support", status: "online", ticketsOpen: 9 },
];

export const contacts: Contact[] = [
  { id: "c1", name: "Jane Doe", email: "jane@acmecorp.com", company: "Acme Corp", tier: "VIP", healthScore: 72, totalTickets: 14, csat: 4.2, language: "fr" },
  { id: "c2", name: "Marc Dupont", email: "m.dupont@startupxyz.fr", company: "StartupXYZ", tier: "Enterprise", healthScore: 88, totalTickets: 6, csat: 4.7, language: "fr" },
  { id: "c3", name: "Alice Chen", email: "alice@techfirm.io", company: "TechFirm", tier: "SMB", healthScore: 55, totalTickets: 22, csat: 3.8, language: "en" },
  { id: "c4", name: "Roberto Silva", email: "r.silva@globalco.com", company: "GlobalCo", tier: "Enterprise", healthScore: 91, totalTickets: 3, csat: 4.9, language: "fr" },
  { id: "c5", name: "Fatou Diallo", email: "f.diallo@innova.sn", company: "Innova SN", tier: "SMB", healthScore: 63, totalTickets: 8, csat: 4.1, language: "fr" },
];

export const tickets: Ticket[] = [
  {
    id: "TK-4521",
    title: {
      fr: "Impossible de se connecter au VPN depuis ce matin",
      en: "Unable to connect to VPN since this morning",
      pt: "Impossível conectar à VPN desde esta manhã",
    },
    priority: "P1",
    status: "open",
    channel: "whatsapp",
    contact: contacts[0],
    assignedAgent: agents[0],
    createdAt: new Date(Date.now() - 7200000),
    updatedAt: new Date(Date.now() - 900000),
    slaMinutesLeft: 47,
    tags: [
      { fr: "VPN", en: "VPN", pt: "VPN" },
      { fr: "Réseau", en: "Network", pt: "Rede" },
      { fr: "Urgent", en: "Urgent", pt: "Urgente" },
    ],
    sentiment: "frustrated",
    sentimentScore: 0.82,
    aiConfidence: 0.91,
    aiDraft: {
      fr: "Bonjour Jane,\n\nJe comprends parfaitement l'urgence de cette situation et m'en excuse sincèrement.\n\nVoici les étapes pour résoudre le problème VPN :\n\n1. Vérifiez que le client Cisco AnyConnect est bien à jour (v4.10+)\n2. Effacez le cache : Préférences → Nettoyer les profils\n3. Reconnectez-vous sur le serveur vpn.acmecorp.com\n\nSi le problème persiste, je prends la main à distance immédiatement.\n\nCordialement,\nSophie - Équipe Réseau",
      en: "Hello Jane,\n\nI completely understand the urgency of this situation and sincerely apologize.\n\nHere are the steps to resolve the VPN issue:\n\n1. Check that the Cisco AnyConnect client is up to date (v4.10+)\n2. Clear the cache: Preferences → Clean profiles\n3. Reconnect to the vpn.acmecorp.com server\n\nIf the problem persists, I'll take over remotely right away.\n\nBest regards,\nSophie - Network Team",
      pt: "Olá Jane,\n\nEntendo perfeitamente a urgência desta situação e peço sinceras desculpas.\n\nAqui estão os passos para resolver o problema de VPN:\n\n1. Verifique se o cliente Cisco AnyConnect está atualizado (v4.10+)\n2. Limpe o cache: Preferências → Limpar perfis\n3. Reconecte-se ao servidor vpn.acmecorp.com\n\nSe o problema persistir, assumirei o controle remoto imediatamente.\n\nAtenciosamente,\nSophie - Equipe de Rede",
    },
    relatedTickets: ["TK-4103", "TK-3891"],
    category: { fr: "Réseau / VPN", en: "Network / VPN", pt: "Rede / VPN" },
    messages: [
      {
        id: "m1", sender: "contact", timestamp: new Date(Date.now() - 7200000), channel: "whatsapp", sentiment: "neutral",
        content: {
          fr: "Mon accès VPN ne fonctionne plus depuis ce matin",
          en: "My VPN access hasn't worked since this morning",
          pt: "Meu acesso VPN parou de funcionar desde esta manhã",
        },
      },
      {
        id: "m2", sender: "agent", timestamp: new Date(Date.now() - 6900000), channel: "whatsapp",
        content: {
          fr: "Bonjour Jane, je regarde ça immédiatement.",
          en: "Hello Jane, I'm looking into this right away.",
          pt: "Olá Jane, vou verificar isso imediatamente.",
        },
      },
      {
        id: "m3", sender: "contact", timestamp: new Date(Date.now() - 900000), channel: "whatsapp", sentiment: "frustrated",
        content: {
          fr: "Ça fait 2h que j'attends ! J'ai une présentation dans 30 minutes !",
          en: "I've been waiting for 2 hours! I have a presentation in 30 minutes!",
          pt: "Já faz 2h que estou esperando! Tenho uma apresentação em 30 minutos!",
        },
      },
    ],
  },
  {
    id: "TK-4520",
    title: {
      fr: "Erreur 500 sur l'API de facturation",
      en: "500 error on the billing API",
      pt: "Erro 500 na API de faturamento",
    },
    priority: "P1",
    status: "open",
    channel: "slack",
    contact: contacts[1],
    assignedAgent: agents[2],
    createdAt: new Date(Date.now() - 3600000),
    updatedAt: new Date(Date.now() - 1800000),
    slaMinutesLeft: 22,
    tags: [
      { fr: "API", en: "API", pt: "API" },
      { fr: "Facturation", en: "Billing", pt: "Faturamento" },
      { fr: "Production", en: "Production", pt: "Produção" },
    ],
    sentiment: "urgent",
    sentimentScore: 0.91,
    aiConfidence: 0.76,
    relatedTickets: ["TK-4488"],
    category: { fr: "API / Intégration", en: "API / Integration", pt: "API / Integração" },
    messages: [
      {
        id: "m4", sender: "contact", timestamp: new Date(Date.now() - 3600000), channel: "slack", sentiment: "urgent",
        content: {
          fr: "Notre intégration de paiement retourne des 500 depuis 14h. Clients bloqués.",
          en: "Our payment integration has been returning 500s since 2pm. Customers are blocked.",
          pt: "Nossa integração de pagamento está retornando erros 500 desde as 14h. Clientes bloqueados.",
        },
      },
    ],
  },
  {
    id: "TK-4519",
    title: {
      fr: "Réinitialisation de mot de passe impossible",
      en: "Unable to reset password",
      pt: "Impossível redefinir a senha",
    },
    priority: "P2",
    status: "pending",
    channel: "email",
    contact: contacts[2],
    assignedAgent: agents[1],
    createdAt: new Date(Date.now() - 14400000),
    updatedAt: new Date(Date.now() - 3600000),
    slaMinutesLeft: 180,
    tags: [
      { fr: "Auth", en: "Auth", pt: "Auth" },
      { fr: "MDP", en: "Password", pt: "Senha" },
    ],
    sentiment: "neutral",
    sentimentScore: 0.45,
    aiConfidence: 0.95,
    aiDraft: {
      fr: "Bonjour Alice,\n\nVoici la procédure pour réinitialiser votre mot de passe...",
      en: "Hello Alice,\n\nHere is the procedure to reset your password...",
      pt: "Olá Alice,\n\nAqui está o procedimento para redefinir sua senha...",
    },
    relatedTickets: [],
    category: { fr: "Authentification", en: "Authentication", pt: "Autenticação" },
    messages: [
      {
        id: "m5", sender: "contact", timestamp: new Date(Date.now() - 14400000), channel: "email", sentiment: "neutral",
        content: {
          fr: "Je ne reçois pas l'email de réinitialisation de mot de passe.",
          en: "I'm not receiving the password reset email.",
          pt: "Não estou recebendo o email de redefinição de senha.",
        },
      },
    ],
  },
  {
    id: "TK-4518",
    title: {
      fr: "Demande de provisionnement - 50 nouvelles licences",
      en: "Provisioning request - 50 new licenses",
      pt: "Solicitação de provisionamento - 50 novas licenças",
    },
    priority: "P3",
    status: "open",
    channel: "email",
    contact: contacts[3],
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 43200000),
    slaMinutesLeft: 420,
    tags: [
      { fr: "Licences", en: "Licenses", pt: "Licenças" },
      { fr: "Provisionnement", en: "Provisioning", pt: "Provisionamento" },
    ],
    sentiment: "positive",
    sentimentScore: 0.2,
    aiConfidence: 0.88,
    relatedTickets: [],
    category: { fr: "Administration", en: "Administration", pt: "Administração" },
    messages: [
      {
        id: "m6", sender: "contact", timestamp: new Date(Date.now() - 86400000), channel: "email", sentiment: "positive",
        content: {
          fr: "Nous avons besoin de 50 licences supplémentaires pour notre expansion.",
          en: "We need 50 additional licenses for our expansion.",
          pt: "Precisamos de 50 licenças adicionais para nossa expansão.",
        },
      },
    ],
  },
  {
    id: "TK-4517",
    title: {
      fr: "Dashboard analytics ne charge pas les données",
      en: "Analytics dashboard is not loading data",
      pt: "O dashboard de analytics não carrega os dados",
    },
    priority: "P2",
    status: "open",
    channel: "web",
    contact: contacts[4],
    assignedAgent: agents[4],
    createdAt: new Date(Date.now() - 10800000),
    updatedAt: new Date(Date.now() - 2400000),
    slaMinutesLeft: 95,
    tags: [
      { fr: "Dashboard", en: "Dashboard", pt: "Dashboard" },
      { fr: "Performance", en: "Performance", pt: "Desempenho" },
    ],
    sentiment: "neutral",
    sentimentScore: 0.5,
    aiConfidence: 0.82,
    relatedTickets: ["TK-4492"],
    category: { fr: "Application Web", en: "Web Application", pt: "Aplicação Web" },
    messages: [
      {
        id: "m7", sender: "contact", timestamp: new Date(Date.now() - 10800000), channel: "web", sentiment: "neutral",
        content: {
          fr: "Le dashboard analytics affiche une roue de chargement infinie.",
          en: "The analytics dashboard shows an infinite loading spinner.",
          pt: "O dashboard de analytics exibe um carregamento infinito.",
        },
      },
    ],
  },
  {
    id: "TK-4516",
    title: {
      fr: "Configuration SSO avec Azure AD",
      en: "SSO configuration with Azure AD",
      pt: "Configuração de SSO com Azure AD",
    },
    priority: "P3",
    status: "resolved",
    channel: "teams",
    contact: contacts[1],
    assignedAgent: agents[2],
    createdAt: new Date(Date.now() - 172800000),
    updatedAt: new Date(Date.now() - 86400000),
    slaMinutesLeft: 9999,
    tags: [
      { fr: "SSO", en: "SSO", pt: "SSO" },
      { fr: "Azure AD", en: "Azure AD", pt: "Azure AD" },
      { fr: "Sécurité", en: "Security", pt: "Segurança" },
    ],
    sentiment: "positive",
    sentimentScore: 0.15,
    aiConfidence: 0.97,
    relatedTickets: [],
    category: { fr: "Sécurité / IAM", en: "Security / IAM", pt: "Segurança / IAM" },
    messages: [],
  },
];

export const dashboardStats = {
  openTickets: 127,
  resolvedToday: 89,
  aiResolvedAuto: 43,
  avgResponseTime: "4m 32s",
  csat: 4.6,
  slaBreaches: 3,
  agentsOnline: 18,
  predictedVolume: 847,
  predictedDelta: 23,
  agentsNeeded: 12,
  agentsAvailable: 9,
};

export const sentimentTrend = [
  { time: "08h", positive: 65, neutral: 25, negative: 10 },
  { time: "09h", positive: 58, neutral: 28, negative: 14 },
  { time: "10h", positive: 52, neutral: 30, negative: 18 },
  { time: "11h", positive: 48, neutral: 27, negative: 25 },
  { time: "12h", positive: 60, neutral: 28, negative: 12 },
  { time: "13h", positive: 55, neutral: 32, negative: 13 },
  { time: "14h", positive: 50, neutral: 29, negative: 21 },
  { time: "15h", positive: 62, neutral: 25, negative: 13 },
];

export const volumeForecast: { day: DayKey; actual: number | null; predicted: number }[] = [
  { day: "mon", actual: 312, predicted: 320 },
  { day: "tue", actual: 287, predicted: 295 },
  { day: "wed", actual: 421, predicted: 410 },
  { day: "thu", actual: 356, predicted: 340 },
  { day: "fri", actual: 498, predicted: 480 },
  { day: "sat", actual: 189, predicted: 200 },
  { day: "sun", actual: null, predicted: 847 },
];

export const teamPerformance: { team: LocalizedText; resolved: number; pending: number; slaOk: number }[] = [
  { team: { fr: "IT Support", en: "IT Support", pt: "Suporte de TI" }, resolved: 45, pending: 12, slaOk: 94 },
  { team: { fr: "Réseau", en: "Network", pt: "Rede" }, resolved: 23, pending: 8, slaOk: 87 },
  { team: { fr: "Sécurité", en: "Security", pt: "Segurança" }, resolved: 18, pending: 3, slaOk: 98 },
  { team: { fr: "DevOps", en: "DevOps", pt: "DevOps" }, resolved: 12, pending: 5, slaOk: 91 },
  { team: { fr: "RH", en: "HR", pt: "RH" }, resolved: 8, pending: 2, slaOk: 100 },
];

export const knowledgeArticles: { id: string; title: LocalizedText; category: CategorySlug; views: number; helpful: number; lastUpdated: Date }[] = [
  { id: "kb1", title: { fr: "Résolution des problèmes VPN Cisco AnyConnect", en: "Resolving VPN issues with Cisco AnyConnect", pt: "Resolução de problemas de VPN com Cisco AnyConnect" }, category: "network", views: 1247, helpful: 94, lastUpdated: new Date(Date.now() - 86400000 * 3) },
  { id: "kb2", title: { fr: "Guide de réinitialisation de mot de passe", en: "Password reset guide", pt: "Guia de redefinição de senha" }, category: "auth", views: 3891, helpful: 97, lastUpdated: new Date(Date.now() - 86400000 * 1) },
  { id: "kb3", title: { fr: "Configuration SSO Azure AD / Okta", en: "SSO configuration Azure AD / Okta", pt: "Configuração de SSO Azure AD / Okta" }, category: "security", views: 892, helpful: 89, lastUpdated: new Date(Date.now() - 86400000 * 7) },
  { id: "kb4", title: { fr: "Provisionnement et gestion des licences", en: "License provisioning and management", pt: "Provisionamento e gestão de licenças" }, category: "admin", views: 654, helpful: 91, lastUpdated: new Date(Date.now() - 86400000 * 2) },
  { id: "kb5", title: { fr: "Intégration API REST — Guide développeur", en: "REST API Integration — Developer Guide", pt: "Integração de API REST — Guia do desenvolvedor" }, category: "api", views: 2103, helpful: 88, lastUpdated: new Date(Date.now() - 86400000 * 5) },
  { id: "kb6", title: { fr: "Diagnostic des performances dashboard", en: "Dashboard performance diagnostics", pt: "Diagnóstico de desempenho do dashboard" }, category: "app", views: 445, helpful: 85, lastUpdated: new Date(Date.now() - 86400000 * 4) },
];
