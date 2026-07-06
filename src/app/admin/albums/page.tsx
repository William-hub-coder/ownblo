"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, X, Save, Loader2, Image, Camera, Search } from "lucide-react";
import { AdminFormField } from "@/components/admin/AdminFormField";
import { AdminConfirmDialog } from "@/components/admin/AdminConfirmDialog";
import { UniversalUploader } from "@/components/admin/UniversalUploader";
import type { MediaFile } from "@/types/media";

type Photo = {
  id: string;
  title: string;
  url: string;
  camera?: string;
  aperture?: string;
  shutter?: string;
  iso?: number;
  taken?: string;
};

type Album = {
  slug: string;
  title: string;
  description: string;
  cover_url: string;
  sort_order: number;
  photos: Photo[];
};

const emptyAlbum: Album = {
  slug: "",
  title: "",
  description: "",
  cover_url: "",
  sort_order: 1,
  photos: [],
};

export default function AdminAlbumsPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Album | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [mediaSearch, setMediaSearch] = useState("");
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [showPhotoEditor, setShowPhotoEditor] = useState(false);

  const fetchAlbums = useCallback(async () => {
    const res = await fetch("/api/admin/albums");
    if (res.ok) setAlbums(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { fetchAlbums(); }, [fetchAlbums]);

  const fetchMedia = useCallback(async () => {
    setMediaLoading(true);
    const res = await fetch("/api/admin/media?type=image&limit=100");
    if (res.ok) {
      const data = await res.json();
      setMediaFiles(data.files || []);
    }
    setMediaLoading(false);
  }, []);

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    const method = isNew ? "POST" : "PUT";
    await fetch("/api/admin/albums", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    setSaving(false);
    setEditing(null);
    setIsNew(false);
    await fetchAlbums();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await fetch(`/api/admin/albums?slug=${deleteTarget}`, { method: "DELETE" });
    setDeleteTarget(null);
    await fetchAlbums();
  };

  const addPhotoToAlbum = (mediaFile: MediaFile) => {
    if (!editing) return;
    const newPhoto: Photo = {
      id: crypto.randomUUID(),
      title: mediaFile.filename.replace(/\.[^.]+$/, ""),
      url: mediaFile.url,
    };
    setEditing({ ...editing, photos: [...editing.photos, newPhoto] });
    setShowPicker(false);
  };

  const removePhoto = (photoId: string) => {
    if (!editing) return;
    setEditing({ ...editing, photos: editing.photos.filter((p) => p.id !== photoId) });
  };

  const updatePhoto = (photoId: string, updates: Partial<Photo>) => {
    if (!editing) return;
    setEditing({
      ...editing,
      photos: editing.photos.map((p) => (p.id === photoId ? { ...p, ...updates } : p)),
    });
  };

  const filteredMedia = mediaSearch
    ? mediaFiles.filter((f) => f.filename.toLowerCase().includes(mediaSearch.toLowerCase()))
    : mediaFiles;

  if (loading) {
    return <div className="animate-pulse space-y-4">{[1, 2, 3].map((i) => (<div key={i} className="h-24 bg-[var(--cosmic-orbit-glow)] rounded-xl" />))}</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--cosmic-text-primary)]">Photo Albums</h1>
          <p className="text-sm text-[var(--cosmic-star-dim)] mt-1">{albums.length} album(s) · Photos appear on the public Photography page</p>
        </div>
        <button
          onClick={() => { setEditing({ ...emptyAlbum }); setIsNew(true); }}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[var(--cosmic-accent-cyan)] to-[var(--cosmic-accent-purple)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> New Album
        </button>
      </div>

      {/* Album list */}
      <div className="space-y-4">
        {albums.map((album) => (
          <div key={album.slug} className="rounded-xl border border-[var(--cosmic-orbit-glow)] bg-[var(--cosmic-bg-card)] p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-[var(--cosmic-text-primary)]">{album.title}</h3>
                <p className="text-xs text-[var(--cosmic-star-dim)]">{album.slug} · {album.photos.length} photos</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => { setEditing({ ...album }); setIsNew(false); }} className="rounded-lg p-2 text-[var(--cosmic-star-dim)] hover:text-[var(--cosmic-accent-cyan)]">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => setDeleteTarget(album.slug)} className="rounded-lg p-2 text-[var(--cosmic-star-dim)] hover:text-red-400">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            {/* Photo thumbnails */}
            {album.photos.length > 0 ? (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {album.photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="relative flex-shrink-0 w-24 h-24 rounded-lg border border-[var(--cosmic-orbit-glow)] overflow-hidden bg-[var(--cosmic-bg-secondary)] group cursor-pointer"
                    onClick={() => { setEditingPhoto(photo); setShowPhotoEditor(true); }}
                  >
                    {photo.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={photo.url} alt={photo.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><Camera className="h-6 w-6 text-[var(--cosmic-star-dim)]/30" /></div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                      <Pencil className="h-4 w-4 text-white opacity-0 group-hover:opacity-100" />
                    </div>
                    <p className="absolute bottom-0 left-0 right-0 truncate bg-black/60 px-1 py-0.5 text-[8px] text-white/70">{photo.title}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[var(--cosmic-star-dim)]/50 italic">No photos yet. Click edit to add from your media library.</p>
            )}
          </div>
        ))}
      </div>

      {/* Edit Album Modal */}
      {editing && (
        <>
          <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => { setEditing(null); setIsNew(false); }} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl border border-[var(--cosmic-orbit-glow)] bg-[var(--cosmic-bg-card)] shadow-2xl p-6 hud-corners">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[var(--cosmic-text-primary)]">{isNew ? "New Album" : "Edit Album"}</h3>
              <button onClick={() => { setEditing(null); setIsNew(false); }} className="text-[var(--cosmic-star-dim)] hover:text-[var(--cosmic-text-primary)]"><X className="h-5 w-5" /></button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <AdminFormField label="Album Title">
                  <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="w-full rounded-lg border border-[var(--cosmic-orbit-glow)] bg-[var(--cosmic-bg-secondary)] px-3 py-2 text-sm text-[var(--cosmic-text-primary)] focus:outline-none focus:border-[var(--cosmic-accent-cyan)]" />
                </AdminFormField>
                <AdminFormField label="Cover Image URL">
                  <input value={editing.cover_url} onChange={(e) => setEditing({ ...editing, cover_url: e.target.value })} className="w-full rounded-lg border border-[var(--cosmic-orbit-glow)] bg-[var(--cosmic-bg-secondary)] px-3 py-2 text-sm text-[var(--cosmic-text-primary)] focus:outline-none focus:border-[var(--cosmic-accent-cyan)]" />
                </AdminFormField>
              </div>
              <AdminFormField label="Description">
                <textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={2} className="w-full rounded-lg border border-[var(--cosmic-orbit-glow)] bg-[var(--cosmic-bg-secondary)] px-3 py-2 text-sm text-[var(--cosmic-text-primary)] focus:outline-none focus:border-[var(--cosmic-accent-cyan)] resize-none" />
              </AdminFormField>

              {/* Photos in album */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-[var(--cosmic-text-primary)]">Photos ({editing.photos.length})</label>
                  <button
                    onClick={() => { setShowPicker(true); fetchMedia(); }}
                    className="text-xs text-[var(--cosmic-accent-cyan)] hover:underline inline-flex items-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add from Media Library
                  </button>
                </div>
                {editing.photos.length > 0 ? (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {editing.photos.map((photo, idx) => (
                      <div key={photo.id} className="relative group rounded-lg border border-[var(--cosmic-orbit-glow)] overflow-hidden aspect-square bg-[var(--cosmic-bg-secondary)]">
                        {photo.url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={photo.url} alt={photo.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><Image className="h-5 w-5 text-[var(--cosmic-star-dim)]/30" /></div>
                        )}
                        <button
                          onClick={() => removePhoto(photo.id)}
                          className="absolute top-1 right-1 rounded-full bg-black/60 p-0.5 text-white opacity-0 group-hover:opacity-100 hover:text-red-400"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                        <input
                          value={photo.title}
                          onChange={(e) => updatePhoto(photo.id, { title: e.target.value })}
                          className="absolute bottom-0 left-0 right-0 bg-black/70 px-1 py-0.5 text-[9px] text-white border-0 outline-none"
                          placeholder="Photo title"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-[var(--cosmic-orbit-glow)] p-6 text-center">
                    <Camera className="h-8 w-8 mx-auto mb-2 text-[var(--cosmic-star-dim)]/20" />
                    <p className="text-xs text-[var(--cosmic-star-dim)]">Click "Add from Media Library" to add photos</p>
                  </div>
                )}
              </div>

              <button onClick={handleSave} disabled={saving || !editing.title} className="w-full rounded-lg bg-gradient-to-r from-[var(--cosmic-accent-cyan)] to-[var(--cosmic-accent-purple)] px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {saving ? "Saving..." : "Save Album"}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Media Picker Modal */}
      {showPicker && (
        <>
          <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm" onClick={() => setShowPicker(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-full max-w-4xl max-h-[85vh] flex flex-col rounded-xl border border-[var(--cosmic-orbit-glow)] bg-[var(--cosmic-bg-card)] shadow-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-[var(--cosmic-text-primary)]">Select Photos</h3>
              <button onClick={() => setShowPicker(false)} className="text-[var(--cosmic-star-dim)] hover:text-[var(--cosmic-text-primary)]"><X className="h-5 w-5" /></button>
            </div>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--cosmic-star-dim)]" />
              <input value={mediaSearch} onChange={(e) => setMediaSearch(e.target.value)} placeholder="Filter images..." className="w-full rounded-lg border border-[var(--cosmic-orbit-glow)] bg-[var(--cosmic-bg-secondary)] pl-9 pr-3 py-2 text-sm text-[var(--cosmic-text-primary)] focus:outline-none" />
            </div>
            {mediaLoading ? (
              <div className="text-center py-12"><Loader2 className="h-6 w-6 animate-spin mx-auto text-[var(--cosmic-accent-cyan)]" /></div>
            ) : (
              <div className="flex-1 overflow-y-auto grid grid-cols-4 sm:grid-cols-6 gap-2">
                {filteredMedia.length === 0 ? (
                  <div className="col-span-full text-center py-12 text-sm text-[var(--cosmic-star-dim)]">
                    <Image className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    No images. Upload first in Media Library.
                  </div>
                ) : (
                  filteredMedia.map((file) => (
                    <button
                      key={file.id}
                      onClick={() => addPhotoToAlbum(file)}
                      className="group relative aspect-square rounded-lg border border-[var(--cosmic-orbit-glow)] overflow-hidden hover:border-[var(--cosmic-accent-cyan)] transition-colors bg-[var(--cosmic-bg-secondary)]"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={file.url} alt={file.filename} className="w-full h-full object-cover" loading="lazy" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                        <Plus className="h-6 w-6 text-white opacity-0 group-hover:opacity-100" />
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </>
      )}

      <AdminConfirmDialog
        open={!!deleteTarget}
        title="Delete Album"
        message="This will delete the album and remove all its photos. This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
