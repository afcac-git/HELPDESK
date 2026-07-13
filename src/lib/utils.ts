import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type TimeTranslator = (key: string, values?: Record<string, number | string>) => string;

export function formatRelativeTime(date: Date, t: TimeTranslator): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return t("justNow");
  if (minutes < 60) return t("minutesAgo", { count: minutes });
  if (hours < 24) return t("hoursAgo", { count: hours });
  return t("daysAgo", { count: days });
}

export function formatSLA(minutes: number, t: TimeTranslator): { text: string; color: string } {
  if (minutes <= 0) return { text: t("slaExpired"), color: "text-red-500" };
  if (minutes <= 30) return { text: `${minutes}m`, color: "text-red-400" };
  if (minutes <= 60) return { text: `${minutes}m`, color: "text-orange-400" };
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const text = hours > 0 ? `${hours}h${mins > 0 ? mins + "m" : ""}` : `${mins}m`;
  return { text, color: "text-emerald-400" };
}
