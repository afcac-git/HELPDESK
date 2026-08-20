"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useTranslations } from "next-intl";
import { Plus, X } from "lucide-react";
import { useTickets } from "@/context/TicketsContext";
import type { Priority, Channel, CategorySlug } from "@/data/mock";

const priorityOptions: Priority[] = ["P1", "P2", "P3", "P4"];
const channelOptions: Channel[] = ["email", "slack", "whatsapp", "teams", "web", "phone"];
const categoryOptions: CategorySlug[] = ["network", "auth", "api", "security", "admin", "app"];

const inputClass = "w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 outline-none focus:border-[#017764]/50 transition-colors";
const selectClass = "w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 outline-none focus:border-[#017764]/50 transition-colors";

export default function NewTicketModal({ trigger }: { trigger?: React.ReactNode }) {
  const t = useTranslations("newTicket");
  const tCommon = useTranslations("common");
  const { createTicket } = useTickets();

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("P3");
  const [channel, setChannel] = useState<Channel>("web");
  const [category, setCategory] = useState<CategorySlug>("network");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("P3");
    setChannel("web");
    setCategory("network");
    setName("");
    setEmail("");
    setPhone("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !name.trim() || !email.trim() || !phone.trim()) return;

    setSubmitting(true);
    setError(false);
    try {
      await createTicket({ title, description, priority, channel, category, name, email, phone });
      resetForm();
      setOpen(false);
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        {trigger ?? (
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#017764] hover:bg-[#015a4d] text-white text-xs font-semibold rounded-lg transition-colors shadow-lg shadow-[#017764]/20">
            <Plus className="w-3.5 h-3.5" />
            {t("trigger")}
          </button>
        )}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-2xl shadow-xl z-50 p-6 max-h-[85vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-1">
            <Dialog.Title className="text-sm font-semibold text-gray-900">{t("title")}</Dialog.Title>
            <Dialog.Close asChild>
              <button className="p-1 rounded text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Description className="text-xs text-gray-400 mb-4">{t("subtitle")}</Dialog.Description>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[11px] text-gray-500 mb-1 block">{t("subject")}</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} required className={inputClass} />
            </div>
            <div>
              <label className="text-[11px] text-gray-500 mb-1 block">{t("description")}</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} className={`${inputClass} resize-none`} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-gray-500 mb-1 block">{t("priority")}</label>
                <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)} className={selectClass}>
                  {priorityOptions.map((p) => (
                    <option key={p} value={p}>{tCommon(`priority.${p}`)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[11px] text-gray-500 mb-1 block">{t("category")}</label>
                <select value={category} onChange={(e) => setCategory(e.target.value as CategorySlug)} className={selectClass}>
                  {categoryOptions.map((c) => (
                    <option key={c} value={c}>{tCommon(`categories.${c}`)}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-[11px] text-gray-500 mb-1 block">{t("channel")}</label>
              <select value={channel} onChange={(e) => setChannel(e.target.value as Channel)} className={selectClass}>
                {channelOptions.map((c) => (
                  <option key={c} value={c}>{tCommon(`channel.${c}`)}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-gray-500 mb-1 block">{t("yourName")}</label>
                <input value={name} onChange={(e) => setName(e.target.value)} required className={inputClass} />
              </div>
              <div>
                <label className="text-[11px] text-gray-500 mb-1 block">{t("yourEmail")}</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClass} />
              </div>
            </div>
            <div>
              <label className="text-[11px] text-gray-500 mb-1 block">{t("yourPhone")}</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required className={inputClass} />
            </div>
            {error && (
              <p className="text-xs text-red-600">{t("error")}</p>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <Dialog.Close asChild>
                <button type="button" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-medium rounded-lg transition-colors">
                  {t("cancel")}
                </button>
              </Dialog.Close>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#017764] hover:bg-[#015a4d] disabled:opacity-60 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                {submitting ? t("submitting") : t("submit")}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
