import { categoryLabels } from "@/i18n/categoryLabels";
import type { Ticket, Priority, Status, Channel, CategorySlug } from "@/data/mock";

export const slaByPriority: Record<Priority, number> = { P1: 60, P2: 180, P3: 480, P4: 1440 };

export interface TicketRow {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  channel: Channel;
  category_slug: CategorySlug;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  sla_minutes_left: number;
  created_at: Date;
  updated_at: Date;
}

export function hydrateTicket(row: TicketRow): Ticket {
  return {
    id: row.id,
    title: { fr: row.title, en: row.title, pt: row.title },
    priority: row.priority,
    status: row.status,
    channel: row.channel,
    contact: {
      id: `c-${row.id}`,
      name: row.contact_name,
      email: row.contact_email,
      phone: row.contact_phone,
      company: "—",
      tier: "Starter",
      healthScore: 70,
      totalTickets: 1,
      csat: 0,
      language: "fr",
    },
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    slaMinutesLeft: row.sla_minutes_left,
    tags: [],
    sentiment: "neutral",
    sentimentScore: 0.5,
    aiConfidence: 0,
    relatedTickets: [],
    category: categoryLabels[row.category_slug],
    messages: [
      {
        id: `m-${row.id}`,
        sender: "contact",
        timestamp: row.created_at,
        channel: row.channel,
        content: { fr: row.description, en: row.description, pt: row.description },
      },
    ],
  };
}
