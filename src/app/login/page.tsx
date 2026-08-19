"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Mail, Lock, ArrowLeft } from "lucide-react";
import LocaleSwitcher from "@/components/layout/LocaleSwitcher";
import afcacLogo from "@/images/afcac_logo.png";

const inputClass = "w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 outline-none focus:border-[#017764]/50 transition-colors";

export default function LoginPage() {
  const t = useTranslations("login");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 sm:px-10">
        <Link href="/" className="flex items-center gap-3">
          <Image src={afcacLogo} alt="AFCAC" className="w-9 h-9 object-contain shrink-0" priority />
          <div>
            <span className="text-gray-900 font-bold text-base tracking-tight">AFCAC</span>
            <span className="text-[#017764] font-bold text-base tracking-tight"> Helpdesk</span>
          </div>
        </Link>
        <LocaleSwitcher />
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">{t("title")}</h1>
            <p className="text-xs text-gray-500 mt-1">{t("subtitle")}</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-4">
            <div>
              <label className="text-[11px] text-gray-500 mb-1 block">{t("email")}</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("emailPlaceholder")}
                  required
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className="text-[11px] text-gray-500 mb-1 block">{t("password")}</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("passwordPlaceholder")}
                  required
                  className={inputClass}
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-[#017764] hover:bg-[#015a4d] text-white text-sm font-semibold rounded-lg transition-colors"
            >
              {t("submit")}
            </button>
          </form>

          <Link
            href="/"
            className="flex items-center justify-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 mt-5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {t("backHome")}
          </Link>
        </div>
      </main>
    </div>
  );
}
