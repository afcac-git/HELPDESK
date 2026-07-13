export type Priority = "P1" | "P2" | "P3" | "P4";
export type Status = "open" | "pending" | "resolved" | "closed";
export type Channel = "email" | "slack" | "teams" | "whatsapp" | "web" | "phone";
export type Sentiment = "positive" | "neutral" | "frustrated" | "urgent";

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
  content: string;
  timestamp: Date;
  channel: Channel;
  sentiment?: Sentiment;
}

export interface Ticket {
  id: string;
  title: string;
  priority: Priority;
  status: Status;
  channel: Channel;
  contact: Contact;
  assignedAgent?: Agent;
  createdAt: Date;
  updatedAt: Date;
  slaMinutesLeft: number;
  tags: string[];
  sentiment: Sentiment;
  sentimentScore: number;
  messages: Message[];
  aiConfidence: number;
  aiDraft?: string;
  relatedTickets: string[];
  category: string;
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
    title: "Impossible de se connecter au VPN depuis ce matin",
    priority: "P1",
    status: "open",
    channel: "whatsapp",
    contact: contacts[0],
    assignedAgent: agents[0],
    createdAt: new Date(Date.now() - 7200000),
    updatedAt: new Date(Date.now() - 900000),
    slaMinutesLeft: 47,
    tags: ["VPN", "Réseau", "Urgent"],
    sentiment: "frustrated",
    sentimentScore: 0.82,
    aiConfidence: 0.91,
    aiDraft: "Bonjour Jane,\n\nJe comprends parfaitement l'urgence de cette situation et m'en excuse sincèrement.\n\nVoici les étapes pour résoudre le problème VPN :\n\n1. Vérifiez que le client Cisco AnyConnect est bien à jour (v4.10+)\n2. Effacez le cache : Préférences → Nettoyer les profils\n3. Reconnectez-vous sur le serveur vpn.acmecorp.com\n\nSi le problème persiste, je prends la main à distance immédiatement.\n\nCordialement,\nSophie - Équipe Réseau",
    relatedTickets: ["TK-4103", "TK-3891"],
    category: "Réseau / VPN",
    messages: [
      { id: "m1", sender: "contact", content: "Mon accès VPN ne fonctionne plus depuis ce matin", timestamp: new Date(Date.now() - 7200000), channel: "whatsapp", sentiment: "neutral" },
      { id: "m2", sender: "agent", content: "Bonjour Jane, je regarde ça immédiatement.", timestamp: new Date(Date.now() - 6900000), channel: "whatsapp" },
      { id: "m3", sender: "contact", content: "Ça fait 2h que j'attends ! J'ai une présentation dans 30 minutes !", timestamp: new Date(Date.now() - 900000), channel: "whatsapp", sentiment: "frustrated" },
    ],
  },
  {
    id: "TK-4520",
    title: "Erreur 500 sur l'API de facturation",
    priority: "P1",
    status: "open",
    channel: "slack",
    contact: contacts[1],
    assignedAgent: agents[2],
    createdAt: new Date(Date.now() - 3600000),
    updatedAt: new Date(Date.now() - 1800000),
    slaMinutesLeft: 22,
    tags: ["API", "Facturation", "Production"],
    sentiment: "urgent",
    sentimentScore: 0.91,
    aiConfidence: 0.76,
    relatedTickets: ["TK-4488"],
    category: "API / Intégration",
    messages: [
      { id: "m4", sender: "contact", content: "Notre intégration de paiement retourne des 500 depuis 14h. Clients bloqués.", timestamp: new Date(Date.now() - 3600000), channel: "slack", sentiment: "urgent" },
    ],
  },
  {
    id: "TK-4519",
    title: "Réinitialisation de mot de passe impossible",
    priority: "P2",
    status: "pending",
    channel: "email",
    contact: contacts[2],
    assignedAgent: agents[1],
    createdAt: new Date(Date.now() - 14400000),
    updatedAt: new Date(Date.now() - 3600000),
    slaMinutesLeft: 180,
    tags: ["Auth", "MDP"],
    sentiment: "neutral",
    sentimentScore: 0.45,
    aiConfidence: 0.95,
    aiDraft: "Bonjour Alice,\n\nVoici la procédure pour réinitialiser votre mot de passe...",
    relatedTickets: [],
    category: "Authentification",
    messages: [
      { id: "m5", sender: "contact", content: "Je ne reçois pas l'email de réinitialisation de mot de passe.", timestamp: new Date(Date.now() - 14400000), channel: "email", sentiment: "neutral" },
    ],
  },
  {
    id: "TK-4518",
    title: "Demande de provisionnement - 50 nouvelles licences",
    priority: "P3",
    status: "open",
    channel: "email",
    contact: contacts[3],
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 43200000),
    slaMinutesLeft: 420,
    tags: ["Licences", "Provisionnement"],
    sentiment: "positive",
    sentimentScore: 0.2,
    aiConfidence: 0.88,
    relatedTickets: [],
    category: "Administration",
    messages: [
      { id: "m6", sender: "contact", content: "Nous avons besoin de 50 licences supplémentaires pour notre expansion.", timestamp: new Date(Date.now() - 86400000), channel: "email", sentiment: "positive" },
    ],
  },
  {
    id: "TK-4517",
    title: "Dashboard analytics ne charge pas les données",
    priority: "P2",
    status: "open",
    channel: "web",
    contact: contacts[4],
    assignedAgent: agents[4],
    createdAt: new Date(Date.now() - 10800000),
    updatedAt: new Date(Date.now() - 2400000),
    slaMinutesLeft: 95,
    tags: ["Dashboard", "Performance"],
    sentiment: "neutral",
    sentimentScore: 0.5,
    aiConfidence: 0.82,
    relatedTickets: ["TK-4492"],
    category: "Application Web",
    messages: [
      { id: "m7", sender: "contact", content: "Le dashboard analytics affiche une roue de chargement infinie.", timestamp: new Date(Date.now() - 10800000), channel: "web", sentiment: "neutral" },
    ],
  },
  {
    id: "TK-4516",
    title: "Configuration SSO avec Azure AD",
    priority: "P3",
    status: "resolved",
    channel: "teams",
    contact: contacts[1],
    assignedAgent: agents[2],
    createdAt: new Date(Date.now() - 172800000),
    updatedAt: new Date(Date.now() - 86400000),
    slaMinutesLeft: 9999,
    tags: ["SSO", "Azure AD", "Sécurité"],
    sentiment: "positive",
    sentimentScore: 0.15,
    aiConfidence: 0.97,
    relatedTickets: [],
    category: "Sécurité / IAM",
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

export const volumeForecast = [
  { day: "Lun", actual: 312, predicted: 320 },
  { day: "Mar", actual: 287, predicted: 295 },
  { day: "Mer", actual: 421, predicted: 410 },
  { day: "Jeu", actual: 356, predicted: 340 },
  { day: "Ven", actual: 498, predicted: 480 },
  { day: "Sam", actual: 189, predicted: 200 },
  { day: "Dim", actual: null, predicted: 847 },
];

export const teamPerformance = [
  { team: "IT Support", resolved: 45, pending: 12, slaOk: 94 },
  { team: "Réseau", resolved: 23, pending: 8, slaOk: 87 },
  { team: "Sécurité", resolved: 18, pending: 3, slaOk: 98 },
  { team: "DevOps", resolved: 12, pending: 5, slaOk: 91 },
  { team: "RH", resolved: 8, pending: 2, slaOk: 100 },
];

export const knowledgeArticles = [
  { id: "kb1", title: "Résolution des problèmes VPN Cisco AnyConnect", category: "Réseau", views: 1247, helpful: 94, lastUpdated: new Date(Date.now() - 86400000 * 3) },
  { id: "kb2", title: "Guide de réinitialisation de mot de passe", category: "Authentification", views: 3891, helpful: 97, lastUpdated: new Date(Date.now() - 86400000 * 1) },
  { id: "kb3", title: "Configuration SSO Azure AD / Okta", category: "Sécurité", views: 892, helpful: 89, lastUpdated: new Date(Date.now() - 86400000 * 7) },
  { id: "kb4", title: "Provisionnement et gestion des licences", category: "Administration", views: 654, helpful: 91, lastUpdated: new Date(Date.now() - 86400000 * 2) },
  { id: "kb5", title: "Intégration API REST — Guide développeur", category: "API", views: 2103, helpful: 88, lastUpdated: new Date(Date.now() - 86400000 * 5) },
  { id: "kb6", title: "Diagnostic des performances dashboard", category: "Application", views: 445, helpful: 85, lastUpdated: new Date(Date.now() - 86400000 * 4) },
];
