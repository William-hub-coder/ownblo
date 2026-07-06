"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Save, Loader2 } from "lucide-react";
import { AdminFormField } from "@/components/admin/AdminFormField";
import { AdminConfirmDialog } from "@/components/admin/AdminConfirmDialog";

type Article = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  reading_time: number;
  published: boolean;
  published_at: string;
};

const emptyArticle: Article = {
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  tags: [],
  reading_time: 5,
  published: true,
  published_at: new Date().toISOString().split("T")[0],
};

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Article | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");

  const fetchArticles = async () => {
    const res = await fetch("/api/admin/articles");
    if (res.ok) setArticles(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchArticles(); }, []);

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    const method = isNew ? "POST" : "PUT";
    await fetch("/api/admin/articles", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    setSaving(false);
    setEditing(null);
    setIsNew(false);
    await fetchArticles();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await fetch(`/api/admin/articles?slug=${deleteTarget}`, { method: "DELETE" });
    setDeleteTarget(null);
    await fetchArticles();
  };

  const addTag = () => {
    if (!tagInput.trim() || !editing) return;
    setEditing({ ...editing, tags: [...editing.tags, tagInput.trim()] });
    setTagInput("");
  };

  if (loading) {
    return <div className="animate-pulse space-y-4">{[1, 2, 3].map((i) => (<div key={i} className="h-20 bg-[var(--cyber-border)] rounded-xl" />))}</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--cyber-text)]">Articles</h1>
          <p className="text-sm text-[var(--cyber-muted)] mt-1">{articles.length} article(s)</p>
        </div>
        <button
          onClick={() => { setEditing({ ...emptyArticle }); setIsNew(true); }}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[var(--cyber-primary)] to-[var(--cyber-accent)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> New Article
        </button>
      </div>

      {/* Article list */}
      <div className="space-y-3">
        {articles.map((a) => (
          <div key={a.slug} className="flex items-center justify-between rounded-xl border border-[var(--cyber-border)] bg-[var(--cyber-surface)]/50 p-4">
            <div>
              <h3 className="font-medium text-[var(--cyber-text)]">{a.title}</h3>
              <p className="text-xs text-[var(--cyber-muted)] mt-0.5">
                {a.published ? "Published" : "Draft"} · {a.published_at} · {a.tags?.join(", ") || "No tags"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => { setEditing(a); setIsNew(false); }} className="rounded-lg p-2 text-[var(--cyber-muted)] hover:text-[var(--cyber-primary)]">
                <Pencil className="h-4 w-4" />
              </button>
              <button onClick={() => setDeleteTarget(a.slug)} className="rounded-lg p-2 text-[var(--cyber-muted)] hover:text-red-400">
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
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-[var(--cyber-border)] bg-[var(--cyber-surface)] shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[var(--cyber-text)]">{isNew ? "New Article" : "Edit Article"}</h3>
              <button onClick={() => { setEditing(null); setIsNew(false); }} className="text-[var(--cyber-muted)] hover:text-[var(--cyber-text)]"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <AdminFormField label="Title">
                    <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="w-full rounded-lg border border-[var(--cyber-border)] bg-[var(--cyber-bg)]/50 px-3 py-2 text-sm text-[var(--cyber-text)] focus:outline-none focus:border-[var(--cyber-primary)]" />
                  </AdminFormField>
                </div>
                <AdminFormField label="Reading Time (min)">
                  <input type="number" value={editing.reading_time} onChange={(e) => setEditing({ ...editing, reading_time: Number(e.target.value) })} className="w-full rounded-lg border border-[var(--cyber-border)] bg-[var(--cyber-bg)]/50 px-3 py-2 text-sm text-[var(--cyber-text)] focus:outline-none focus:border-[var(--cyber-primary)]" />
                </AdminFormField>
              </div>
              <AdminFormField label="Excerpt">
                <textarea value={editing.excerpt} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} rows={2} className="w-full rounded-lg border border-[var(--cyber-border)] bg-[var(--cyber-bg)]/50 px-3 py-2 text-sm text-[var(--cyber-text)] focus:outline-none focus:border-[var(--cyber-primary)] resize-none" />
              </AdminFormField>
              <AdminFormField label="Content (Markdown)">
                <textarea value={editing.content} onChange={(e) => setEditing({ ...editing, content: e.target.value })} rows={12} className="w-full rounded-lg border border-[var(--cyber-border)] bg-[var(--cyber-bg)]/50 px-3 py-2 text-sm font-mono text-[var(--cyber-text)] focus:outline-none focus:border-[var(--cyber-primary)] resize-none" />
              </AdminFormField>
              <AdminFormField label="Tags">
                <div className="flex gap-2 mb-2 flex-wrap">
                  {editing.tags?.map((t) => (
                    <span key={t} className="inline-flex items-center gap-1 rounded-full bg-[var(--cyber-accent)]/10 px-2.5 py-0.5 text-xs text-[var(--cyber-accent)]">
                      {t}
                      <button onClick={() => setEditing({ ...editing, tags: editing.tags.filter((x) => x !== t) })} className="hover:text-red-400"><X className="h-3 w-3" /></button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }} placeholder="Add tag..." className="flex-1 rounded-lg border border-[var(--cyber-border)] bg-[var(--cyber-bg)]/50 px-3 py-2 text-sm text-[var(--cyber-text)] focus:outline-none focus:border-[var(--cyber-primary)]" />
                  <button onClick={addTag} type="button" className="rounded-lg bg-[var(--cyber-accent)]/10 px-3 py-2 text-xs text-[var(--cyber-accent)] hover:bg-[var(--cyber-accent)]/20">Add</button>
                </div>
              </AdminFormField>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-[var(--cyber-text)]">
                  <input type="checkbox" checked={editing.published} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} className="rounded" />
                  Published
                </label>
                <AdminFormField label="Date" className="flex-1">
                  <input type="date" value={editing.published_at} onChange={(e) => setEditing({ ...editing, published_at: e.target.value })} className="w-full rounded-lg border border-[var(--cyber-border)] bg-[var(--cyber-bg)]/50 px-3 py-2 text-sm text-[var(--cyber-text)] focus:outline-none focus:border-[var(--cyber-primary)]" />
                </AdminFormField>
              </div>
              <button onClick={handleSave} disabled={saving || !editing.title} className="w-full rounded-lg bg-gradient-to-r from-[var(--cyber-primary)] to-[var(--cyber-accent)] px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {saving ? "Saving..." : "Save Article"}
              </button>
            </div>
          </div>
        </>
      )}

      <AdminConfirmDialog
        open={!!deleteTarget}
        title="Delete Article"
        message="This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
