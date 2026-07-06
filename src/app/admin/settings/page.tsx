"use client";

import { useState, useEffect } from "react";
import { AdminFormField } from "@/components/admin/AdminFormField";
import { Save, Loader2, CheckCircle } from "lucide-react";
import { adminT } from "@/lib/admin-i18n";
import { useToast } from "@/components/admin/Toast";

const defaultConfig = { name: "", title: "", description: "", url: "", ogImage: "", links: { github: "", twitter: "", email: "" } };

export default function AdminSettingsPage() {
  const [config, setConfig] = useState(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetch("/api/admin/settings").then((r) => r.json()).then((data) => { setConfig({ ...defaultConfig, ...data }); setLoading(false); }).catch(() => { toast.error("加载失败"); setLoading(false); });
  }, []);

  const handleSave = async () => {
    setSaving(true); setSaved(false);
    try {
      const res = await fetch("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(config) });
      if (res.ok) { setSaved(true); toast.success("设置已保存，刷新前台即可看到更新"); setTimeout(() => setSaved(false), 3000); }
      else toast.error("保存失败");
    } catch { toast.error("网络错误"); }
    setSaving(false);
  };

  if (loading) return <div className="animate-pulse space-y-6">{[1, 2, 3, 4, 5, 6].map((i) => (<div key={i} className="h-12 bg-[var(--cosmic-orbit-glow)] rounded-xl" />))}</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--cosmic-text-primary)]">{adminT("settings")}</h1>
          <p className="text-sm text-[var(--cosmic-star-dim)] mt-1">修改后刷新前台页面即可实时生效</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[var(--cosmic-accent-cyan)] to-[var(--cosmic-accent-purple)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 transition-opacity shadow-lg"
          style={{ boxShadow: "0 0 20px rgba(6,182,212,0.3)" }}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <CheckCircle className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {saving ? adminT("saving") : saved ? adminT("saved") : adminT("saveChanges")}
        </button>
      </div>

      <div className="rounded-xl border border-[var(--cosmic-orbit-glow)] bg-[var(--cosmic-bg-card)] p-6 space-y-5 hud-corners">
        <div className="grid sm:grid-cols-2 gap-5">
          <AdminFormField label={adminT("siteName")}>
            <input value={config.name} onChange={(e) => setConfig({ ...config, name: e.target.value })} className="w-full rounded-lg border border-[var(--cosmic-orbit-glow)] bg-[var(--cosmic-bg-secondary)] px-3 py-2 text-sm text-[var(--cosmic-text-primary)] focus:outline-none focus:border-[var(--cosmic-accent-cyan)]" />
          </AdminFormField>
          <AdminFormField label={adminT("siteTitle")}>
            <input value={config.title} onChange={(e) => setConfig({ ...config, title: e.target.value })} className="w-full rounded-lg border border-[var(--cosmic-orbit-glow)] bg-[var(--cosmic-bg-secondary)] px-3 py-2 text-sm text-[var(--cosmic-text-primary)] focus:outline-none focus:border-[var(--cosmic-accent-cyan)]" />
          </AdminFormField>
        </div>
        <AdminFormField label={adminT("siteDesc")}>
          <textarea value={config.description} onChange={(e) => setConfig({ ...config, description: e.target.value })} rows={3} className="w-full rounded-lg border border-[var(--cosmic-orbit-glow)] bg-[var(--cosmic-bg-secondary)] px-3 py-2 text-sm text-[var(--cosmic-text-primary)] focus:outline-none focus:border-[var(--cosmic-accent-cyan)] resize-none" />
        </AdminFormField>
        <div className="grid sm:grid-cols-2 gap-5">
          <AdminFormField label={adminT("siteUrl")}>
            <input value={config.url} onChange={(e) => setConfig({ ...config, url: e.target.value })} className="w-full rounded-lg border border-[var(--cosmic-orbit-glow)] bg-[var(--cosmic-bg-secondary)] px-3 py-2 text-sm text-[var(--cosmic-text-primary)] focus:outline-none focus:border-[var(--cosmic-accent-cyan)]" />
          </AdminFormField>
          <AdminFormField label={adminT("ogImage")}>
            <input value={config.ogImage} onChange={(e) => setConfig({ ...config, ogImage: e.target.value })} className="w-full rounded-lg border border-[var(--cosmic-orbit-glow)] bg-[var(--cosmic-bg-secondary)] px-3 py-2 text-sm text-[var(--cosmic-text-primary)] focus:outline-none focus:border-[var(--cosmic-accent-cyan)]" />
          </AdminFormField>
        </div>
        <h3 className="text-sm font-semibold text-[var(--cosmic-text-primary)] pt-4 border-t border-[var(--cosmic-orbit-glow)]">{adminT("socialLinks")}</h3>
        <div className="grid sm:grid-cols-3 gap-5">
          <AdminFormField label={adminT("githubUrl")}>
            <input value={config.links.github} onChange={(e) => setConfig({ ...config, links: { ...config.links, github: e.target.value } })} className="w-full rounded-lg border border-[var(--cosmic-orbit-glow)] bg-[var(--cosmic-bg-secondary)] px-3 py-2 text-sm text-[var(--cosmic-text-primary)] focus:outline-none focus:border-[var(--cosmic-accent-cyan)]" />
          </AdminFormField>
          <AdminFormField label={adminT("twitterUrl")}>
            <input value={config.links.twitter} onChange={(e) => setConfig({ ...config, links: { ...config.links, twitter: e.target.value } })} className="w-full rounded-lg border border-[var(--cosmic-orbit-glow)] bg-[var(--cosmic-bg-secondary)] px-3 py-2 text-sm text-[var(--cosmic-text-primary)] focus:outline-none focus:border-[var(--cosmic-accent-cyan)]" />
          </AdminFormField>
          <AdminFormField label={adminT("email")}>
            <input value={config.links.email} onChange={(e) => setConfig({ ...config, links: { ...config.links, email: e.target.value } })} className="w-full rounded-lg border border-[var(--cosmic-orbit-glow)] bg-[var(--cosmic-bg-secondary)] px-3 py-2 text-sm text-[var(--cosmic-text-primary)] focus:outline-none focus:border-[var(--cosmic-accent-cyan)]" />
          </AdminFormField>
        </div>
      </div>
    </div>
  );
}
