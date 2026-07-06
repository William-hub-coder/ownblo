"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Save, Loader2 } from "lucide-react";
import { AdminFormField } from "@/components/admin/AdminFormField";
import { AdminConfirmDialog } from "@/components/admin/AdminConfirmDialog";

type Bookmark = {
  id: string;
  title: string;
  url: string;
  description: string;
  category: string;
};

const emptyBookmark: Bookmark = {
  id: "",
  title: "",
  url: "",
  description: "",
  category: "resource",
};

export default function AdminBookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Bookmark | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const fetchBookmarks = async () => {
    const res = await fetch("/api/admin/bookmarks");
    if (res.ok) setBookmarks(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchBookmarks(); }, []);

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    const method = isNew ? "POST" : "PUT";
    await fetch("/api/admin/bookmarks", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    setSaving(false);
    setEditing(null);
    setIsNew(false);
    await fetchBookmarks();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await fetch(`/api/admin/bookmarks?id=${deleteTarget}`, { method: "DELETE" });
    setDeleteTarget(null);
    await fetchBookmarks();
  };

  if (loading) {
    return <div className="animate-pulse space-y-4">{[1, 2, 3].map((i) => (<div key={i} className="h-16 bg-[var(--cyber-border)] rounded-xl" />))}</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--cyber-text)]">Bookmarks</h1>
          <p className="text-sm text-[var(--cyber-muted)] mt-1">{bookmarks.length} bookmark(s)</p>
        </div>
        <button
          onClick={() => { setEditing({ ...emptyBookmark }); setIsNew(true); }}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[var(--cyber-primary)] to-[var(--cyber-accent)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> New Bookmark
        </button>
      </div>

      <div className="space-y-2">
        {bookmarks.map((b) => (
          <div key={b.id} className="flex items-center justify-between rounded-xl border border-[var(--cyber-border)] bg-[var(--cyber-surface)]/50 p-3">
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-[var(--cyber-text)] text-sm truncate">{b.title}</h3>
              <p className="text-xs text-[var(--cyber-muted)] truncate">{b.url}</p>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <span className="text-xs text-[var(--cyber-muted)] px-2 py-0.5 rounded-full bg-[var(--cyber-border)]/20">{b.category}</span>
              <button onClick={() => { setEditing(b); setIsNew(false); }} className="rounded-lg p-1.5 text-[var(--cyber-muted)] hover:text-[var(--cyber-primary)]"><Pencil className="h-3.5 w-3.5" /></button>
              <button onClick={() => setDeleteTarget(b.id)} className="rounded-lg p-1.5 text-[var(--cyber-muted)] hover:text-red-400"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <>
          <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => { setEditing(null); setIsNew(false); }} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md rounded-xl border border-[var(--cyber-border)] bg-[var(--cyber-surface)] shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[var(--cyber-text)]">{isNew ? "New Bookmark" : "Edit Bookmark"}</h3>
              <button onClick={() => { setEditing(null); setIsNew(false); }} className="text-[var(--cyber-muted)] hover:text-[var(--cyber-text)]"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-3">
              <AdminFormField label="Title">
                <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="w-full rounded-lg border border-[var(--cyber-border)] bg-[var(--cyber-bg)]/50 px-3 py-2 text-sm text-[var(--cyber-text)] focus:outline-none focus:border-[var(--cyber-primary)]" />
              </AdminFormField>
              <AdminFormField label="URL">
                <input value={editing.url} onChange={(e) => setEditing({ ...editing, url: e.target.value })} className="w-full rounded-lg border border-[var(--cyber-border)] bg-[var(--cyber-bg)]/50 px-3 py-2 text-sm text-[var(--cyber-text)] focus:outline-none focus:border-[var(--cyber-primary)]" />
              </AdminFormField>
              <AdminFormField label="Description">
                <textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={2} className="w-full rounded-lg border border-[var(--cyber-border)] bg-[var(--cyber-bg)]/50 px-3 py-2 text-sm text-[var(--cyber-text)] focus:outline-none focus:border-[var(--cyber-primary)] resize-none" />
              </AdminFormField>
              <AdminFormField label="Category">
                <select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className="w-full rounded-lg border border-[var(--cyber-border)] bg-[var(--cyber-bg)]/50 px-3 py-2 text-sm text-[var(--cyber-text)]">
                  <option value="resource">Resource</option>
                  <option value="tool">Tool</option>
                  <option value="inspiration">Inspiration</option>
                  <option value="reference">Reference</option>
                </select>
              </AdminFormField>
              <button onClick={handleSave} disabled={saving || !editing.title || !editing.url} className="w-full rounded-lg bg-gradient-to-r from-[var(--cyber-primary)] to-[var(--cyber-accent)] px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </>
      )}

      <AdminConfirmDialog
        open={!!deleteTarget}
        title="Delete Bookmark"
        message="This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
