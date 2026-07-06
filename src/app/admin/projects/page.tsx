"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Save, Loader2 } from "lucide-react";
import { AdminFormField } from "@/components/admin/AdminFormField";
import { AdminConfirmDialog } from "@/components/admin/AdminConfirmDialog";

type Project = {
  slug: string;
  title: string;
  description: string;
  category: string;
  tech_stack: string[];
  github_url: string;
  demo_url: string;
  role: string;
  timeline: string;
  tech_challenges: string;
};

const emptyProject: Project = {
  slug: "",
  title: "",
  description: "",
  category: "web",
  tech_stack: [],
  github_url: "",
  demo_url: "",
  role: "",
  timeline: "",
  tech_challenges: "",
};

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Project | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [techInput, setTechInput] = useState("");

  const fetchProjects = async () => {
    const res = await fetch("/api/admin/projects");
    if (res.ok) setProjects(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    const method = isNew ? "POST" : "PUT";
    await fetch("/api/admin/projects", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    setSaving(false);
    setEditing(null);
    setIsNew(false);
    await fetchProjects();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await fetch(`/api/admin/projects?slug=${deleteTarget}`, { method: "DELETE" });
    setDeleteTarget(null);
    await fetchProjects();
  };

  const addTech = () => {
    if (!techInput.trim() || !editing) return;
    setEditing({ ...editing, tech_stack: [...editing.tech_stack, techInput.trim()] });
    setTechInput("");
  };

  if (loading) {
    return <div className="animate-pulse space-y-4">{[1, 2, 3].map((i) => (<div key={i} className="h-20 bg-[var(--cyber-border)] rounded-xl" />))}</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--cyber-text)]">Projects</h1>
          <p className="text-sm text-[var(--cyber-muted)] mt-1">{projects.length} project(s)</p>
        </div>
        <button
          onClick={() => { setEditing({ ...emptyProject }); setIsNew(true); }}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[var(--cyber-primary)] to-[var(--cyber-accent)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> New Project
        </button>
      </div>

      {/* Project list */}
      <div className="space-y-3">
        {projects.map((p) => (
          <div key={p.slug} className="flex items-center justify-between rounded-xl border border-[var(--cyber-border)] bg-[var(--cyber-surface)]/50 p-4">
            <div>
              <h3 className="font-medium text-[var(--cyber-text)]">{p.title}</h3>
              <p className="text-xs text-[var(--cyber-muted)] mt-0.5">
                {p.category} · {p.tech_stack?.join(", ") || "No tech"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => { setEditing(p); setIsNew(false); }} className="rounded-lg p-2 text-[var(--cyber-muted)] hover:text-[var(--cyber-primary)]">
                <Pencil className="h-4 w-4" />
              </button>
              <button onClick={() => setDeleteTarget(p.slug)} className="rounded-lg p-2 text-[var(--cyber-muted)] hover:text-red-400">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit modal */}
      {editing && (
        <>
          <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => { setEditing(null); setIsNew(false); }} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-xl border border-[var(--cyber-border)] bg-[var(--cyber-surface)] shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[var(--cyber-text)]">{isNew ? "New Project" : "Edit Project"}</h3>
              <button onClick={() => { setEditing(null); setIsNew(false); }} className="text-[var(--cyber-muted)] hover:text-[var(--cyber-text)]"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <AdminFormField label="Title">
                <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="w-full rounded-lg border border-[var(--cyber-border)] bg-[var(--cyber-bg)]/50 px-3 py-2 text-sm text-[var(--cyber-text)] focus:outline-none focus:border-[var(--cyber-primary)]" />
              </AdminFormField>
              <AdminFormField label="Description">
                <textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={3} className="w-full rounded-lg border border-[var(--cyber-border)] bg-[var(--cyber-bg)]/50 px-3 py-2 text-sm text-[var(--cyber-text)] focus:outline-none focus:border-[var(--cyber-primary)] resize-none" />
              </AdminFormField>
              <div className="grid grid-cols-2 gap-4">
                <AdminFormField label="Category">
                  <select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className="w-full rounded-lg border border-[var(--cyber-border)] bg-[var(--cyber-bg)]/50 px-3 py-2 text-sm text-[var(--cyber-text)]">
                    <option value="web">Web</option>
                    <option value="mobile">Mobile</option>
                    <option value="design">Design</option>
                    <option value="other">Other</option>
                  </select>
                </AdminFormField>
                <AdminFormField label="Role">
                  <input value={editing.role} onChange={(e) => setEditing({ ...editing, role: e.target.value })} className="w-full rounded-lg border border-[var(--cyber-border)] bg-[var(--cyber-bg)]/50 px-3 py-2 text-sm text-[var(--cyber-text)] focus:outline-none focus:border-[var(--cyber-primary)]" />
                </AdminFormField>
              </div>
              <AdminFormField label="Tech Stack">
                <div className="flex gap-2 mb-2 flex-wrap">
                  {editing.tech_stack?.map((t) => (
                    <span key={t} className="inline-flex items-center gap-1 rounded-full bg-[var(--cyber-primary)]/10 px-2.5 py-0.5 text-xs text-[var(--cyber-primary)]">
                      {t}
                      <button onClick={() => setEditing({ ...editing, tech_stack: editing.tech_stack.filter((x) => x !== t) })} className="hover:text-red-400"><X className="h-3 w-3" /></button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={techInput} onChange={(e) => setTechInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTech(); } }} placeholder="Add technology..." className="flex-1 rounded-lg border border-[var(--cyber-border)] bg-[var(--cyber-bg)]/50 px-3 py-2 text-sm text-[var(--cyber-text)] focus:outline-none focus:border-[var(--cyber-primary)]" />
                  <button onClick={addTech} type="button" className="rounded-lg bg-[var(--cyber-primary)]/10 px-3 py-2 text-xs text-[var(--cyber-primary)] hover:bg-[var(--cyber-primary)]/20">Add</button>
                </div>
              </AdminFormField>
              <div className="grid grid-cols-2 gap-4">
                <AdminFormField label="GitHub URL">
                  <input value={editing.github_url} onChange={(e) => setEditing({ ...editing, github_url: e.target.value })} className="w-full rounded-lg border border-[var(--cyber-border)] bg-[var(--cyber-bg)]/50 px-3 py-2 text-sm text-[var(--cyber-text)] focus:outline-none focus:border-[var(--cyber-primary)]" />
                </AdminFormField>
                <AdminFormField label="Demo URL">
                  <input value={editing.demo_url} onChange={(e) => setEditing({ ...editing, demo_url: e.target.value })} className="w-full rounded-lg border border-[var(--cyber-border)] bg-[var(--cyber-bg)]/50 px-3 py-2 text-sm text-[var(--cyber-text)] focus:outline-none focus:border-[var(--cyber-primary)]" />
                </AdminFormField>
              </div>
              <AdminFormField label="Timeline">
                <input value={editing.timeline} onChange={(e) => setEditing({ ...editing, timeline: e.target.value })} className="w-full rounded-lg border border-[var(--cyber-border)] bg-[var(--cyber-bg)]/50 px-3 py-2 text-sm text-[var(--cyber-text)] focus:outline-none focus:border-[var(--cyber-primary)]" />
              </AdminFormField>
              <AdminFormField label="Technical Challenges">
                <textarea value={editing.tech_challenges} onChange={(e) => setEditing({ ...editing, tech_challenges: e.target.value })} rows={3} className="w-full rounded-lg border border-[var(--cyber-border)] bg-[var(--cyber-bg)]/50 px-3 py-2 text-sm text-[var(--cyber-text)] focus:outline-none focus:border-[var(--cyber-primary)] resize-none" />
              </AdminFormField>
              <button onClick={handleSave} disabled={saving || !editing.title} className="w-full rounded-lg bg-gradient-to-r from-[var(--cyber-primary)] to-[var(--cyber-accent)] px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {saving ? "Saving..." : "Save Project"}
              </button>
            </div>
          </div>
        </>
      )}

      <AdminConfirmDialog
        open={!!deleteTarget}
        title="Delete Project"
        message="This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
