"use client";

import { useState, useEffect } from "react";
import { AdminFormField } from "@/components/admin/AdminFormField";
import { AvatarCropper } from "@/components/admin/AvatarCropper";
import { Save, Loader2, CheckCircle, Plus, X, Camera, Upload } from "lucide-react";
import { useToast } from "@/components/admin/Toast";

type Profile = {
  name: string; title: string;
  greeting_zh: string; greeting_en: string;
  bio_zh: string; bio_en: string;
  location: string; role_zh: string; role_en: string;
  avatar_url: string;
  typewriter_zh: string[]; typewriter_en: string[];
};

const emptyProfile: Profile = {
  name: "", title: "",
  greeting_zh: "", greeting_en: "",
  bio_zh: "", bio_en: "",
  location: "", role_zh: "", role_en: "",
  avatar_url: "",
  typewriter_zh: [], typewriter_en: [],
};

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [twZhInput, setTwZhInput] = useState("");
  const [twEnInput, setTwEnInput] = useState("");
  const [showCropper, setShowCropper] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetch("/api/admin/profile")
      .then((r) => r.json())
      .then((data) => { setProfile({ ...emptyProfile, ...data }); setLoading(false); })
      .catch(() => { toast.error("加载失败"); setLoading(false); });
  }, []);

  const handleSave = async () => {
    setSaving(true); setSaved(false);
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (res.ok) { setSaved(true); toast.success("个人资料已保存，刷新前台即可查看"); setTimeout(() => setSaved(false), 3000); }
      else { const err = await res.json(); toast.error(err.error || "保存失败"); }
    } catch { toast.error("网络错误"); }
    setSaving(false);
  };

  const addTw = (lang: "zh" | "en") => {
    const val = lang === "zh" ? twZhInput.trim() : twEnInput.trim();
    if (!val) return;
    if (lang === "zh") { setProfile({ ...profile, typewriter_zh: [...profile.typewriter_zh, val] }); setTwZhInput(""); }
    else { setProfile({ ...profile, typewriter_en: [...profile.typewriter_en, val] }); setTwEnInput(""); }
  };

  const removeTw = (lang: "zh" | "en", idx: number) => {
    if (lang === "zh") setProfile({ ...profile, typewriter_zh: profile.typewriter_zh.filter((_, i) => i !== idx) });
    else setProfile({ ...profile, typewriter_en: profile.typewriter_en.filter((_, i) => i !== idx) });
  };

  if (loading) return <div className="animate-pulse space-y-6">{[1, 2, 3, 4, 5].map((i) => (<div key={i} className="h-12 bg-[var(--cosmic-orbit-glow)] rounded-xl" />))}</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--cosmic-text-primary)]">个人资料</h1>
          <p className="text-sm text-[var(--cosmic-star-dim)] mt-1">管理首页、关于页的自我介绍内容。修改后刷新前台即可生效。</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[var(--cosmic-accent-cyan)] to-[var(--cosmic-accent-purple)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 shadow-lg"
          style={{ boxShadow: "0 0 20px rgba(6,182,212,0.3)" }}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <CheckCircle className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {saving ? "保存中..." : saved ? "已保存！" : "保存"}
        </button>
      </div>

      <div className="rounded-xl border border-[var(--cosmic-orbit-glow)] bg-[var(--cosmic-bg-card)] p-6 space-y-6 hud-corners">
        {/* Basic Info */}
        <div className="grid sm:grid-cols-2 gap-4">
          <AdminFormField label="姓名">
            <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full rounded-lg border border-[var(--cosmic-orbit-glow)] bg-[var(--cosmic-bg-secondary)] px-3 py-2 text-sm text-[var(--cosmic-text-primary)] focus:outline-none focus:border-[var(--cosmic-accent-cyan)]" />
          </AdminFormField>
          <AdminFormField label="头衔 (中/英通用)">
            <input value={profile.title} onChange={(e) => setProfile({ ...profile, title: e.target.value })}
              className="w-full rounded-lg border border-[var(--cosmic-orbit-glow)] bg-[var(--cosmic-bg-secondary)] px-3 py-2 text-sm text-[var(--cosmic-text-primary)] focus:outline-none focus:border-[var(--cosmic-accent-cyan)]" />
          </AdminFormField>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <AdminFormField label="中文问候语 (Hero)">
            <input value={profile.greeting_zh} onChange={(e) => setProfile({ ...profile, greeting_zh: e.target.value })}
              className="w-full rounded-lg border border-[var(--cosmic-orbit-glow)] bg-[var(--cosmic-bg-secondary)] px-3 py-2 text-sm text-[var(--cosmic-text-primary)] focus:outline-none focus:border-[var(--cosmic-accent-cyan)]" placeholder="你好，我是" />
          </AdminFormField>
          <AdminFormField label="English Greeting (Hero)">
            <input value={profile.greeting_en} onChange={(e) => setProfile({ ...profile, greeting_en: e.target.value })}
              className="w-full rounded-lg border border-[var(--cosmic-orbit-glow)] bg-[var(--cosmic-bg-secondary)] px-3 py-2 text-sm text-[var(--cosmic-text-primary)] focus:outline-none focus:border-[var(--cosmic-accent-cyan)]" placeholder="Hi, I'm" />
          </AdminFormField>
        </div>

        {/* Hero Typewriter Texts */}
        <div className="border-t border-[var(--cosmic-orbit-glow)] pt-4">
          <h3 className="text-sm font-semibold text-[var(--cosmic-text-primary)] mb-3">首页打字机文字</h3>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="text-xs text-[var(--cosmic-star-dim)] mb-2 block">中文</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {profile.typewriter_zh.map((t, i) => (
                  <span key={i} className="inline-flex items-center gap-1 rounded-full bg-[var(--cosmic-accent-cyan)]/10 px-2.5 py-0.5 text-xs text-[var(--cosmic-accent-cyan)]">
                    {t} <button onClick={() => removeTw("zh", i)} className="hover:text-red-400"><X className="h-3 w-3" /></button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={twZhInput} onChange={(e) => setTwZhInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTw("zh"); } }}
                  placeholder="添加中文标签..." className="flex-1 rounded-lg border border-[var(--cosmic-orbit-glow)] bg-[var(--cosmic-bg-secondary)] px-3 py-1.5 text-xs text-[var(--cosmic-text-primary)] focus:outline-none focus:border-[var(--cosmic-accent-cyan)]" />
                <button onClick={() => addTw("zh")} className="rounded-lg bg-[var(--cosmic-accent-cyan)]/20 px-2 py-1 text-xs text-[var(--cosmic-accent-cyan)]"><Plus className="h-3.5 w-3.5" /></button>
              </div>
            </div>
            <div>
              <label className="text-xs text-[var(--cosmic-star-dim)] mb-2 block">English</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {profile.typewriter_en.map((t, i) => (
                  <span key={i} className="inline-flex items-center gap-1 rounded-full bg-[var(--cosmic-accent-purple)]/10 px-2.5 py-0.5 text-xs text-[var(--cosmic-accent-purple)]">
                    {t} <button onClick={() => removeTw("en", i)} className="hover:text-red-400"><X className="h-3 w-3" /></button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={twEnInput} onChange={(e) => setTwEnInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTw("en"); } }}
                  placeholder="Add English tag..." className="flex-1 rounded-lg border border-[var(--cosmic-orbit-glow)] bg-[var(--cosmic-bg-secondary)] px-3 py-1.5 text-xs text-[var(--cosmic-text-primary)] focus:outline-none focus:border-[var(--cosmic-accent-cyan)]" />
                <button onClick={() => addTw("en")} className="rounded-lg bg-[var(--cosmic-accent-purple)]/20 px-2 py-1 text-xs text-[var(--cosmic-accent-purple)]"><Plus className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="border-t border-[var(--cosmic-orbit-glow)] pt-4">
          <h3 className="text-sm font-semibold text-[var(--cosmic-text-primary)] mb-3">个人简介</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <AdminFormField label="中文简介">
              <textarea value={profile.bio_zh} onChange={(e) => setProfile({ ...profile, bio_zh: e.target.value })} rows={6}
                className="w-full rounded-lg border border-[var(--cosmic-orbit-glow)] bg-[var(--cosmic-bg-secondary)] px-3 py-2 text-sm text-[var(--cosmic-text-primary)] focus:outline-none focus:border-[var(--cosmic-accent-cyan)] resize-none" />
            </AdminFormField>
            <AdminFormField label="English Bio">
              <textarea value={profile.bio_en} onChange={(e) => setProfile({ ...profile, bio_en: e.target.value })} rows={6}
                className="w-full rounded-lg border border-[var(--cosmic-orbit-glow)] bg-[var(--cosmic-bg-secondary)] px-3 py-2 text-sm text-[var(--cosmic-text-primary)] focus:outline-none focus:border-[var(--cosmic-accent-cyan)] resize-none" />
            </AdminFormField>
          </div>
        </div>

        {/* Location & Role */}
        <div className="grid sm:grid-cols-3 gap-4">
          <AdminFormField label="所在地">
            <input value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })}
              className="w-full rounded-lg border border-[var(--cosmic-orbit-glow)] bg-[var(--cosmic-bg-secondary)] px-3 py-2 text-sm text-[var(--cosmic-text-primary)] focus:outline-none focus:border-[var(--cosmic-accent-cyan)]" />
          </AdminFormField>
          <AdminFormField label="中文职位">
            <input value={profile.role_zh} onChange={(e) => setProfile({ ...profile, role_zh: e.target.value })}
              className="w-full rounded-lg border border-[var(--cosmic-orbit-glow)] bg-[var(--cosmic-bg-secondary)] px-3 py-2 text-sm text-[var(--cosmic-text-primary)] focus:outline-none focus:border-[var(--cosmic-accent-cyan)]" />
          </AdminFormField>
          <AdminFormField label="English Role">
            <input value={profile.role_en} onChange={(e) => setProfile({ ...profile, role_en: e.target.value })}
              className="w-full rounded-lg border border-[var(--cosmic-orbit-glow)] bg-[var(--cosmic-bg-secondary)] px-3 py-2 text-sm text-[var(--cosmic-text-primary)] focus:outline-none focus:border-[var(--cosmic-accent-cyan)]" />
          </AdminFormField>
        </div>

        <AdminFormField label="头像">
          <div className="flex items-center gap-4">
            {/* Preview */}
            <div className="w-20 h-20 rounded-full border-2 border-[var(--cosmic-orbit-glow)] overflow-hidden bg-[var(--cosmic-bg-secondary)] flex-shrink-0 flex items-center justify-center">
              {profile.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <Camera className="h-8 w-8 text-[var(--cosmic-star-dim)]/30" />
              )}
            </div>
            <div className="flex-1 space-y-1">
              <button
                onClick={() => setShowCropper(true)}
                className="rounded-lg bg-gradient-to-r from-[var(--cosmic-accent-cyan)] to-[var(--cosmic-accent-purple)] px-4 py-2 text-xs font-medium text-white hover:opacity-90 inline-flex items-center gap-1.5">
                <Upload className="h-3.5 w-3.5" /> 上传并裁剪头像
              </button>
              <p className="text-[10px] text-[var(--cosmic-star-dim)]">支持拖拽、滚轮缩放、圆形裁剪，推荐正方形图片</p>
            </div>
          </div>
        </AdminFormField>

        {showCropper && (
          <AvatarCropper
            currentUrl={profile.avatar_url}
            onSave={(url) => { setProfile({ ...profile, avatar_url: url }); setShowCropper(false); toast.success("头像已上传"); }}
            onCancel={() => setShowCropper(false)}
          />
        )}
      </div>
    </div>
  );
}
