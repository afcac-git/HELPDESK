"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useTranslations } from "next-intl";
import { Building2, UserPlus, Pencil, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { agents as mockAgents } from "@/data/mock";

interface Team {
  id: string;
  name: string;
}

type Status = "online" | "busy" | "away" | "offline";

interface AgentRow {
  id: string;
  name: string;
  teamId: string;
  status: Status;
  ticketsOpen: number;
}

const statusColor: Record<Status, string> = {
  online: "bg-emerald-400",
  busy: "bg-orange-400",
  away: "bg-yellow-400",
  offline: "bg-gray-400",
};

const statusOptions: Status[] = ["online", "busy", "away", "offline"];

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

function seedTeams(): Team[] {
  const names = Array.from(new Set(mockAgents.map((a) => a.team)));
  return names.map((name, i) => ({ id: `team-${i + 1}`, name }));
}

function seedAgents(teams: Team[]): AgentRow[] {
  return mockAgents.map((a) => ({
    id: a.id,
    name: a.name,
    teamId: teams.find((t) => t.name === a.team)?.id ?? teams[0]?.id ?? "",
    status: a.status,
    ticketsOpen: a.ticketsOpen,
  }));
}

const inputClass = "w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 outline-none focus:border-[#017764]/50 transition-colors";
const selectClass = "w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 outline-none focus:border-[#017764]/50 transition-colors";

export default function TeamAgentsSection() {
  const t = useTranslations("settings.team");

  const [teams, setTeams] = useState<Team[]>(seedTeams);
  const [agentsList, setAgentsList] = useState<AgentRow[]>(() => seedAgents(seedTeams()));

  const [editingTeam, setEditingTeam] = useState<Team | "new" | null>(null);
  const [teamName, setTeamName] = useState("");

  const [editingAgent, setEditingAgent] = useState<AgentRow | "new" | null>(null);
  const [agentName, setAgentName] = useState("");
  const [agentTeamId, setAgentTeamId] = useState("");
  const [agentStatus, setAgentStatus] = useState<Status>("online");

  const openNewTeam = () => {
    setTeamName("");
    setEditingTeam("new");
  };
  const openEditTeam = (team: Team) => {
    setTeamName(team.name);
    setEditingTeam(team);
  };
  const saveTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) return;
    if (editingTeam === "new") {
      setTeams((prev) => [...prev, { id: `team-${Date.now()}`, name: teamName.trim() }]);
    } else if (editingTeam) {
      const id = editingTeam.id;
      setTeams((prev) => prev.map((tm) => (tm.id === id ? { ...tm, name: teamName.trim() } : tm)));
    }
    setEditingTeam(null);
  };
  const deleteTeam = (team: Team) => {
    if (!window.confirm(t("deleteGroupConfirm"))) return;
    setTeams((prev) => prev.filter((tm) => tm.id !== team.id));
  };

  const openNewAgent = () => {
    setAgentName("");
    setAgentTeamId(teams[0]?.id ?? "");
    setAgentStatus("online");
    setEditingAgent("new");
  };
  const openEditAgent = (agent: AgentRow) => {
    setAgentName(agent.name);
    setAgentTeamId(agent.teamId);
    setAgentStatus(agent.status);
    setEditingAgent(agent);
  };
  const saveAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentName.trim() || !agentTeamId) return;
    if (editingAgent === "new") {
      setAgentsList((prev) => [
        ...prev,
        { id: `agent-${Date.now()}`, name: agentName.trim(), teamId: agentTeamId, status: agentStatus, ticketsOpen: 0 },
      ]);
    } else if (editingAgent) {
      const id = editingAgent.id;
      setAgentsList((prev) =>
        prev.map((a) => (a.id === id ? { ...a, name: agentName.trim(), teamId: agentTeamId, status: agentStatus } : a))
      );
    }
    setEditingAgent(null);
  };
  const deleteAgent = (agent: AgentRow) => {
    if (!window.confirm(t("deleteAgentConfirm"))) return;
    setAgentsList((prev) => prev.filter((a) => a.id !== agent.id));
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-1">{t("title")}</h2>
        <p className="text-xs text-gray-400">{t("subtitle")}</p>
      </div>

      {/* Groups */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#017764]" /> {t("groupsTitle")}
          </h3>
          <button
            onClick={openNewTeam}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#017764] hover:bg-[#015a4d] text-white text-xs font-semibold rounded-lg transition-colors"
          >
            <Building2 className="w-3.5 h-3.5" /> {t("addGroup")}
          </button>
        </div>
        {teams.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-4">{t("noGroups")}</p>
        ) : (
          <div className="space-y-2">
            {teams.map((team) => {
              const count = agentsList.filter((a) => a.teamId === team.id).length;
              return (
                <div key={team.id} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div>
                    <p className="text-xs font-medium text-gray-800">{team.name}</p>
                    <p className="text-[10px] text-gray-400">{t("membersCount", { count })}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEditTeam(team)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => deleteTeam(team)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Agents */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-[#017764]" /> {t("agentsTitle")}
          </h3>
          <button
            onClick={openNewAgent}
            disabled={teams.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#017764] hover:bg-[#015a4d] disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" /> {t("addAgent")}
          </button>
        </div>
        {agentsList.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-4">{t("noAgents")}</p>
        ) : (
          <div className="space-y-2">
            {agentsList.map((agent) => (
              <div key={agent.id} className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="relative shrink-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-[10px] font-bold text-gray-600">
                    {initials(agent.name)}
                  </div>
                  <span className={cn("absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-gray-50", statusColor[agent.status])} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-800 truncate">{agent.name}</p>
                  <p className="text-[10px] text-gray-400">
                    {teams.find((tm) => tm.id === agent.teamId)?.name ?? "—"} · {t(`status${agent.status.charAt(0).toUpperCase()}${agent.status.slice(1)}`)}
                  </p>
                </div>
                <span className="text-[10px] text-gray-400 shrink-0">{t("ticketsOpen", { count: agent.ticketsOpen })}</span>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => openEditAgent(agent)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => deleteAgent(agent)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Team dialog */}
      <Dialog.Root open={editingTeam !== null} onOpenChange={(o) => !o && setEditingTeam(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50" />
          <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-2xl shadow-xl z-50 p-6">
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="text-sm font-semibold text-gray-900">
                {editingTeam === "new" ? t("newGroup") : t("editGroup")}
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="p-1 rounded text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </Dialog.Close>
            </div>
            <form onSubmit={saveTeam} className="space-y-4">
              <div>
                <label className="text-[11px] text-gray-500 mb-1 block">{t("groupName")}</label>
                <input value={teamName} onChange={(e) => setTeamName(e.target.value)} required autoFocus className={inputClass} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Dialog.Close asChild>
                  <button type="button" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-medium rounded-lg transition-colors">
                    {t("cancel")}
                  </button>
                </Dialog.Close>
                <button type="submit" className="px-4 py-2 bg-[#017764] hover:bg-[#015a4d] text-white text-xs font-semibold rounded-lg transition-colors">
                  {t("save")}
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Agent dialog */}
      <Dialog.Root open={editingAgent !== null} onOpenChange={(o) => !o && setEditingAgent(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50" />
          <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-2xl shadow-xl z-50 p-6">
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="text-sm font-semibold text-gray-900">
                {editingAgent === "new" ? t("newAgent") : t("editAgent")}
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="p-1 rounded text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </Dialog.Close>
            </div>
            <form onSubmit={saveAgent} className="space-y-4">
              <div>
                <label className="text-[11px] text-gray-500 mb-1 block">{t("agentName")}</label>
                <input value={agentName} onChange={(e) => setAgentName(e.target.value)} required autoFocus className={inputClass} />
              </div>
              <div>
                <label className="text-[11px] text-gray-500 mb-1 block">{t("agentTeam")}</label>
                <select value={agentTeamId} onChange={(e) => setAgentTeamId(e.target.value)} className={selectClass}>
                  {teams.map((tm) => (
                    <option key={tm.id} value={tm.id}>{tm.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[11px] text-gray-500 mb-1 block">{t("agentStatus")}</label>
                <select value={agentStatus} onChange={(e) => setAgentStatus(e.target.value as Status)} className={selectClass}>
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>{t(`status${s.charAt(0).toUpperCase()}${s.slice(1)}`)}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Dialog.Close asChild>
                  <button type="button" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-medium rounded-lg transition-colors">
                    {t("cancel")}
                  </button>
                </Dialog.Close>
                <button type="submit" className="px-4 py-2 bg-[#017764] hover:bg-[#015a4d] text-white text-xs font-semibold rounded-lg transition-colors">
                  {t("save")}
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
