import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "À l'instant";
  if (minutes < 60) return `Il y a ${minutes}m`;
  if (hours < 24) return `Il y a ${hours}h`;
  return `Il y a ${days}j`;
}

export function formatSLA(minutes: number): { text: string; color: string } {
  if (minutes <= 0) return { text: "EXPIRÉ", color: "text-red-500" };
  if (minutes <= 30) return { text: `${minutes}m`, color: "text-red-400" };
  if (minutes <= 60) return { text: `${minutes}m`, color: "text-orange-400" };
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const text = hours > 0 ? `${hours}h${mins > 0 ? mins + "m" : ""}` : `${mins}m`;
  return { text, color: "text-emerald-400" };
}
