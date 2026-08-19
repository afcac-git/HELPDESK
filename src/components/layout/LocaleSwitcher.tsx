"use client";

import { useTransition } from "react";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { setLocale } from "@/i18n/actions";
import { locales, localeLabels, type Locale } from "@/i18n/config";

export default function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale() as Locale;
  const [isPending, startTransition] = useTransition();

  const handleLocaleChange = (next: Locale) => {
    startTransition(() => {
      setLocale(next);
    });
  };

  return (
    <div className={cn("flex items-center gap-0.5 p-0.5 bg-gray-100 rounded-lg", className)}>
      {locales.map((l) => (
        <button
          key={l}
          onClick={() => handleLocaleChange(l)}
          disabled={isPending}
          title={localeLabels[l]}
          className={cn(
            "flex-1 text-[10px] font-semibold uppercase py-1 px-2 rounded-md transition-colors",
            locale === l ? "bg-white text-[#017764] shadow-sm" : "text-gray-400 hover:text-gray-600"
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
