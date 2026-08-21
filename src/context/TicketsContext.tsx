"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { tickets as mockTickets, type Ticket, type Priority, type Channel, type CategorySlug } from "@/data/mock";

export interface NewTicketInput {
  title: string;
  description: string;
  priority: Priority;
  channel: Channel;
  category: CategorySlug;
  name: string;
  email: string;
  phone: string;
}

interface TicketsContextValue {
  tickets: Ticket[];
  createTicket: (input: NewTicketInput) => Promise<void>;
}

const TicketsContext = createContext<TicketsContextValue | null>(null);

// fetch()'s res.json() leaves Date fields as ISO strings (Response.json()
// on the server serializes them); revive them so formatRelativeTime()'s
// date.getTime() calls don't blow up on a string.
function reviveTicket(raw: Ticket): Ticket {
  return {
    ...raw,
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
    messages: raw.messages.map((m) => ({ ...m, timestamp: new Date(m.timestamp) })),
  };
}

export function TicketsProvider({ children }: { children: ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);

  useEffect(() => {
    fetch("/api/tickets")
      .then((res) => (res.ok ? res.json() : []))
      .then((persisted: Ticket[]) => {
        setTickets([...persisted.map(reviveTicket), ...mockTickets]);
      })
      .catch(() => {
        // Keep the demo data if the database is unreachable.
      });
  }, []);

  const createTicket = async (input: NewTicketInput) => {
    const res = await fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      throw new Error("Failed to create ticket");
    }
    const ticket: Ticket = reviveTicket(await res.json());
    setTickets((prev) => [ticket, ...prev]);
  };

  return <TicketsContext.Provider value={{ tickets, createTicket }}>{children}</TicketsContext.Provider>;
}

export function useTickets() {
  const ctx = useContext(TicketsContext);
  if (!ctx) throw new Error("useTickets must be used within a TicketsProvider");
  return ctx;
}
