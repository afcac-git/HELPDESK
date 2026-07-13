"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { tickets as initialTickets, type Ticket } from "@/data/mock";

interface TicketsContextValue {
  tickets: Ticket[];
  addTicket: (ticket: Ticket) => void;
}

const TicketsContext = createContext<TicketsContextValue | null>(null);

export function TicketsProvider({ children }: { children: ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);

  const addTicket = (ticket: Ticket) => {
    setTickets((prev) => [ticket, ...prev]);
  };

  return <TicketsContext.Provider value={{ tickets, addTicket }}>{children}</TicketsContext.Provider>;
}

export function useTickets() {
  const ctx = useContext(TicketsContext);
  if (!ctx) throw new Error("useTickets must be used within a TicketsProvider");
  return ctx;
}
