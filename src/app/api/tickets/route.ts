import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { hydrateTicket, slaByPriority, type TicketRow } from "@/lib/ticketRecord";
import type { Priority, Channel, CategorySlug } from "@/data/mock";

const priorities: Priority[] = ["P1", "P2", "P3", "P4"];
const channels: Channel[] = ["email", "slack", "whatsapp", "teams", "web", "phone"];
const categories: CategorySlug[] = ["network", "auth", "api", "security", "admin", "app"];

export async function GET() {
  const { rows } = await pool.query<TicketRow>(
    `select * from tickets order by created_at desc`
  );
  return NextResponse.json(rows.map(hydrateTicket));
}

export async function POST(request: Request) {
  const body = await request.json();
  const { title, description, priority, channel, category, name, email, phone } = body ?? {};

  if (
    typeof title !== "string" || !title.trim() ||
    typeof description !== "string" || !description.trim() ||
    typeof name !== "string" || !name.trim() ||
    typeof email !== "string" || !email.trim() ||
    typeof phone !== "string" || !phone.trim() ||
    !priorities.includes(priority) ||
    !channels.includes(channel) ||
    !categories.includes(category)
  ) {
    return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
  }

  const id = `TK-${Math.floor(1000 + Math.random() * 9000)}`;

  const { rows } = await pool.query<TicketRow>(
    `insert into tickets (
      id, title, description, priority, status, channel,
      category_slug, contact_name, contact_email, contact_phone, sla_minutes_left
    ) values ($1, $2, $3, $4, 'open', $5, $6, $7, $8, $9, $10)
    returning *`,
    [id, title.trim(), description.trim(), priority, channel, category, name.trim(), email.trim(), phone.trim(), slaByPriority[priority as Priority]]
  );

  return NextResponse.json(hydrateTicket(rows[0]), { status: 201 });
}
