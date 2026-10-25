'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Lock, Loader2, Save, Plus, Trash2, LogOut, ArrowLeft, Upload,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import {
  defaultContent,
  SECTION_KEYS,
  SECTION_LABELS,
  type SiteContent,
  type SectionKey,
} from '@/lib/content/defaults'

type Status = 'loading' | 'locked' | 'ready'

export default function AdminDashboard() {
  const [status, setStatus] = useState<Status>('loading')
  const [passcode, setPasscode] = useState('')
  const [busy, setBusy] = useState(false)
  const [content, setContent] = useState<SiteContent>(() => structuredClone(defaultContent))
  const [active, setActive] = useState<SectionKey>('hero')
  const [savingSection, setSavingSection] = useState<SectionKey | null>(null)

  const loadAll = async () => {
    try {
      const [adminRes, contentRes] = await Promise.all([
        fetch('/api/admin'),
        fetch('/api/content'),
      ])
      const adminData = await adminRes.json()
      const contentData = await contentRes.json()
      if (contentData?.content) setContent(contentData.content)
      setStatus(adminData?.isAdmin ? 'ready' : 'locked')
    } catch {
      setStatus('locked')
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadAll()
  }, [])

  const handleLogin = async () => {
    if (!passcode.trim()) {
      toast.error('Enter your passcode.')
      return
    }
    setBusy(true)
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      })
      const data = await res.json()
      if (data?.success) {
        setPasscode('')
        toast.success('Welcome back! You can now edit your site.')
        await loadAll()
      } else {
        toast.error(data?.message ?? 'Incorrect passcode.')
      }
    } catch {
      toast.error('Login failed. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  const handleLogout = async () => {
    setBusy(true)
    try {
      await fetch('/api/admin', { method: 'DELETE' })
      setStatus('locked')
      toast.success('Signed out.')
    } catch {
      toast.error('Could not sign out.')
    } finally {
      setBusy(false)
    }
  }

  const setSection = <K extends SectionKey>(key: K, value: SiteContent[K]) => {
    setContent((prev) => ({ ...prev, [key]: value }))
  }

  const saveSection = async (key: SectionKey) => {
    setSavingSection(key)
    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: key, data: content[key] }),
      })
      const data = await res.json()
      if (data?.success) {
        toast.success('Saved! Your changes are live.')
      } else {
        toast.error(data?.message ?? 'Could not save.')
      }
    } catch {
      toast.error('Could not save. Please try again.')
    } finally {
      setSavingSection(null)
    }
  }

  // ---- image upload helper (returns public url or null) ----
  const uploadImage = async (file: File): Promise<string | null> => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file.')
      return null
    }
    if (file.size > 100 * 1024 * 1024) {
      toast.error('Image is too large (max 100MB).')
      return null
    }
    try {
      const presign = await fetch('/api/upload/presigned', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name, contentType: file.type }),
      })
      const pdata = await presign.json()
      if (!pdata?.success) {
        toast.error(pdata?.message ?? 'Upload failed.')
        return null
      }
      const put = await fetch(pdata.uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      })
      if (!put.ok) {
        toast.error('Upload failed. Please try again.')
        return null
      }
      toast.success('Photo uploaded!')
      return pdata.publicUrl as string
    } catch {
      toast.error('Upload failed. Please try again.')
      return null
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    )
  }

  if (status === 'locked') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div
          className="w-full max-w-sm bg-card rounded-2xl p-8"
          style={{ boxShadow: 'var(--shadow-lg)' }}
        >
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
            <Lock className="text-primary" size={24} />
          </div>
          <h1 className="font-display text-2xl font-bold text-center text-foreground mb-2">
            Content Editor
          </h1>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Enter your private passcode to edit your website.
          </p>
          <Label htmlFor="pc">Passcode</Label>
          <Input
            id="pc"
            type="password"
            value={passcode}
            autoFocus
            onChange={(e) => setPasscode(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleLogin() }}
            placeholder="Your private passcode"
            className="mt-1 mb-4"
          />
          <Button onClick={handleLogin} disabled={busy} className="w-full gap-2">
            {busy ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
            Sign in
          </Button>
          <Link
            href="/"
            className="mt-4 flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-primary"
          >
            <ArrowLeft size={12} /> Back to website
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-20 bg-card/90 backdrop-blur border-b border-border">
        <div className="max-w-[1100px] mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="text-primary" size={18} />
            <span className="font-display font-bold text-foreground">Content Editor</span>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="gap-1">
              <Link href="/" target="_blank"><ArrowLeft size={14} /> View site</Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} disabled={busy} className="gap-1">
              <LogOut size={14} /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-[1100px] mx-auto px-4 py-6 grid md:grid-cols-[220px_1fr] gap-6">
        {/* Sidebar */}
        <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
          {SECTION_KEYS.map((key) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`text-left px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                active === key
                  ? 'bg-primary text-primary-foreground font-medium'
                  : 'text-muted-foreground hover:bg-secondary'
              }`}
            >
              {SECTION_LABELS[key]}
            </button>
          ))}
        </nav>

        {/* Editor panel */}
        <main>
          <div className="bg-card rounded-xl p-5 sm:p-6" style={{ boxShadow: 'var(--shadow-md)' }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-lg font-bold text-foreground">
                {SECTION_LABELS[active]}
              </h2>
              <Button
                onClick={() => saveSection(active)}
                disabled={savingSection === active}
                size="sm"
                className="gap-1"
              >
                {savingSection === active
                  ? <Loader2 size={14} className="animate-spin" />
                  : <Save size={14} />}
                Save
              </Button>
            </div>

            <SectionEditor
              section={active}
              content={content}
              setSection={setSection}
              uploadImage={uploadImage}
            />

            <div className="mt-6 pt-4 border-t border-border flex justify-end">
              <Button
                onClick={() => saveSection(active)}
                disabled={savingSection === active}
                className="gap-1"
              >
                {savingSection === active
                  ? <><Loader2 size={14} className="animate-spin" /> Saving…</>
                  : <><Save size={14} /> Save changes</>}
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Tip: edit one section, press <strong>Save changes</strong>, then open your website to see it updated.
          </p>
        </main>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Small reusable field components                                     */
/* ------------------------------------------------------------------ */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <Label className="mb-1 block text-xs">{label}</Label>
      {children}
    </div>
  )
}

function TextField({
  label, value, onChange, placeholder,
}: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <Field label={label}>
      <Input value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </Field>
  )
}

function AreaField({
  label, value, onChange, rows = 3,
}: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <Field label={label}>
      <Textarea value={value} rows={rows} onChange={(e) => onChange(e.target.value)} />
    </Field>
  )
}

function RowCard({
  index, onRemove, children,
}: { index: number; onRemove: () => void; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border p-4 mb-3 relative">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-muted-foreground">Item {index + 1}</span>
        <Button variant="ghost" size="sm" onClick={onRemove} className="h-7 gap-1 text-red-400 hover:text-red-500 hover:bg-red-500/10">
          <Trash2 size={13} /> Remove
        </Button>
      </div>
      {children}
    </div>
  )
}

function ImageField({
  label, value, onChange, uploadImage,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  uploadImage: (f: File) => Promise<string | null>
}) {
  const [uploading, setUploading] = useState(false)
  return (
    <Field label={label}>
      <div className="flex gap-2 items-start">
        <Input
          value={value}
          placeholder="Paste an image link, or upload →"
          onChange={(e) => onChange(e.target.value)}
          className="flex-1"
        />
        <label className="shrink-0">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const f = e.target.files?.[0]
              e.target.value = ''
              if (!f) return
              setUploading(true)
              const url = await uploadImage(f)
              setUploading(false)
              if (url) onChange(url)
            }}
          />
          <span className="inline-flex items-center gap-1 h-10 px-3 rounded-md border border-input text-sm cursor-pointer hover:bg-secondary">
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
            Upload
          </span>
        </label>
      </div>
      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="preview" className="mt-2 h-20 w-32 object-cover rounded-md border border-border" />
      ) : null}
    </Field>
  )
}

/* ------------------------------------------------------------------ */
/* Per-section editors                                                  */
/* ------------------------------------------------------------------ */

function SectionEditor({
  section, content, setSection, uploadImage,
}: {
  section: SectionKey
  content: SiteContent
  setSection: <K extends SectionKey>(key: K, value: SiteContent[K]) => void
  uploadImage: (f: File) => Promise<string | null>
}) {
  if (section === 'hero') {
    const d = content.hero
    return (
      <>
        <TextField label="Your name" value={d.name} onChange={(v) => setSection('hero', { ...d, name: v })} />
        <TextField label="Tagline" value={d.tagline} onChange={(v) => setSection('hero', { ...d, tagline: v })} />
        <AreaField label="Intro line" value={d.description} onChange={(v) => setSection('hero', { ...d, description: v })} />
      </>
    )
  }

  if (section === 'about') {
    const d = content.about
    return (
      <>
        <Label className="mb-2 block text-xs">Paragraphs</Label>
        {d.paragraphs.map((p, i) => (
          <RowCard key={i} index={i} onRemove={() => setSection('about', { ...d, paragraphs: d.paragraphs.filter((_, j) => j !== i) })}>
            <AreaField label="Text" value={p} onChange={(v) => {
              const next = [...d.paragraphs]; next[i] = v; setSection('about', { ...d, paragraphs: next })
            }} />
          </RowCard>
        ))}
        <Button variant="outline" size="sm" className="gap-1 mb-6" onClick={() => setSection('about', { ...d, paragraphs: [...d.paragraphs, ''] })}>
          <Plus size={14} /> Add paragraph
        </Button>

        <Label className="mb-2 block text-xs">Stats (4 shown as cards)</Label>
        {d.stats.map((s, i) => (
          <RowCard key={i} index={i} onRemove={() => setSection('about', { ...d, stats: d.stats.filter((_, j) => j !== i) })}>
            <TextField label="Number / value" value={s.value} onChange={(v) => {
              const next = [...d.stats]; next[i] = { ...s, value: v }; setSection('about', { ...d, stats: next })
            }} />
            <TextField label="Label" value={s.label} onChange={(v) => {
              const next = [...d.stats]; next[i] = { ...s, label: v }; setSection('about', { ...d, stats: next })
            }} />
          </RowCard>
        ))}
        <Button variant="outline" size="sm" className="gap-1" onClick={() => setSection('about', { ...d, stats: [...d.stats, { value: '', label: '' }] })}>
          <Plus size={14} /> Add stat
        </Button>
      </>
    )
  }

  if (section === 'journey') {
    const d = content.journey
    return (
      <>
        <AreaField label="Subtitle" value={d.subtitle} onChange={(v) => setSection('journey', { ...d, subtitle: v })} />
        <Label className="mb-2 block text-xs">Work experience</Label>
        {d.experiences.map((x, i) => (
          <RowCard key={i} index={i} onRemove={() => setSection('journey', { ...d, experiences: d.experiences.filter((_, j) => j !== i) })}>
            <TextField label="Flag emoji" value={x.flag} onChange={(v) => { const n = [...d.experiences]; n[i] = { ...x, flag: v }; setSection('journey', { ...d, experiences: n }) }} />
            <TextField label="Role / job title" value={x.role} onChange={(v) => { const n = [...d.experiences]; n[i] = { ...x, role: v }; setSection('journey', { ...d, experiences: n }) }} />
            <TextField label="Company" value={x.company} onChange={(v) => { const n = [...d.experiences]; n[i] = { ...x, company: v }; setSection('journey', { ...d, experiences: n }) }} />
            <TextField label="Location" value={x.location} onChange={(v) => { const n = [...d.experiences]; n[i] = { ...x, location: v }; setSection('journey', { ...d, experiences: n }) }} />
            <TextField label="Period (e.g. Jun 2026 – Present)" value={x.period} onChange={(v) => { const n = [...d.experiences]; n[i] = { ...x, period: v }; setSection('journey', { ...d, experiences: n }) }} />
            <AreaField label="Description" value={x.description} onChange={(v) => { const n = [...d.experiences]; n[i] = { ...x, description: v }; setSection('journey', { ...d, experiences: n }) }} />
          </RowCard>
        ))}
        <Button variant="outline" size="sm" className="gap-1" onClick={() => setSection('journey', { ...d, experiences: [...d.experiences, { flag: '🏳️', role: '', company: '', location: '', period: '', description: '' }] })}>
          <Plus size={14} /> Add experience
        </Button>
      </>
    )
  }

  if (section === 'education') {
    const d = content.education
    return (
      <>
        <AreaField label="Subtitle" value={d.subtitle} onChange={(v) => setSection('education', { ...d, subtitle: v })} />
        <Label className="mb-2 block text-xs">Education entries</Label>
        {d.items.map((x, i) => (
          <RowCard key={i} index={i} onRemove={() => setSection('education', { ...d, items: d.items.filter((_, j) => j !== i) })}>
            <TextField label="Flag emoji" value={x.flag} onChange={(v) => { const n = [...d.items]; n[i] = { ...x, flag: v }; setSection('education', { ...d, items: n }) }} />
            <TextField label="Degree / programme" value={x.degree} onChange={(v) => { const n = [...d.items]; n[i] = { ...x, degree: v }; setSection('education', { ...d, items: n }) }} />
            <TextField label="Institution" value={x.institution} onChange={(v) => { const n = [...d.items]; n[i] = { ...x, institution: v }; setSection('education', { ...d, items: n }) }} />
            <TextField label="Location" value={x.location} onChange={(v) => { const n = [...d.items]; n[i] = { ...x, location: v }; setSection('education', { ...d, items: n }) }} />
            <TextField label="Years (e.g. 2025 – Present)" value={x.years} onChange={(v) => { const n = [...d.items]; n[i] = { ...x, years: v }; setSection('education', { ...d, items: n }) }} />
          </RowCard>
        ))}
        <Button variant="outline" size="sm" className="gap-1" onClick={() => setSection('education', { ...d, items: [...d.items, { flag: '🏳️', degree: '', institution: '', location: '', years: '' }] })}>
          <Plus size={14} /> Add education
        </Button>
      </>
    )
  }

  if (section === 'skills') {
    const d = content.skills
    return (
      <>
        <AreaField label="Subtitle" value={d.subtitle} onChange={(v) => setSection('skills', { ...d, subtitle: v })} />
        <Label className="mb-2 block text-xs">Core skills</Label>
        {d.skills.map((s, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <Input value={s} onChange={(e) => { const n = [...d.skills]; n[i] = e.target.value; setSection('skills', { ...d, skills: n }) }} />
            <Button variant="ghost" size="sm" onClick={() => setSection('skills', { ...d, skills: d.skills.filter((_, j) => j !== i) })} className="text-red-400 hover:text-red-500 hover:bg-red-500/10">
              <Trash2 size={14} />
            </Button>
          </div>
        ))}
        <Button variant="outline" size="sm" className="gap-1 mb-6" onClick={() => setSection('skills', { ...d, skills: [...d.skills, ''] })}>
          <Plus size={14} /> Add skill
        </Button>

        <Label className="mb-2 block text-xs">Languages</Label>
        {d.languages.map((l, i) => (
          <RowCard key={i} index={i} onRemove={() => setSection('skills', { ...d, languages: d.languages.filter((_, j) => j !== i) })}>
            <TextField label="Language" value={l.name} onChange={(v) => { const n = [...d.languages]; n[i] = { ...l, name: v }; setSection('skills', { ...d, languages: n }) }} />
            <TextField label="Level (e.g. C1 – Proficient)" value={l.level} onChange={(v) => { const n = [...d.languages]; n[i] = { ...l, level: v }; setSection('skills', { ...d, languages: n }) }} />
            <Field label="Proficiency bar (0–100)">
              <Input type="number" min={0} max={100} value={l.percent} onChange={(e) => { const n = [...d.languages]; n[i] = { ...l, percent: Math.max(0, Math.min(100, Number(e.target.value) || 0)) }; setSection('skills', { ...d, languages: n }) }} />
            </Field>
          </RowCard>
        ))}
        <Button variant="outline" size="sm" className="gap-1" onClick={() => setSection('skills', { ...d, languages: [...d.languages, { name: '', level: '', percent: 50 }] })}>
          <Plus size={14} /> Add language
        </Button>
      </>
    )
  }

  if (section === 'vlog') {
    const d = content.vlog
    return (
      <>
        <AreaField label="Subtitle" value={d.subtitle} onChange={(v) => setSection('vlog', { ...d, subtitle: v })} />
        <TextField label="YouTube card – title" value={d.youtubeTitle} onChange={(v) => setSection('vlog', { ...d, youtubeTitle: v })} />
        <AreaField label="YouTube card – description" value={d.youtubeDesc} onChange={(v) => setSection('vlog', { ...d, youtubeDesc: v })} />
        <TextField label="YouTube link (URL) – Subscribe button" value={d.youtubeUrl} onChange={(v) => setSection('vlog', { ...d, youtubeUrl: v })} />
        <TextField label="Instagram card – handle" value={d.instaHandle} onChange={(v) => setSection('vlog', { ...d, instaHandle: v })} />
        <AreaField label="Instagram card – description" value={d.instaDesc} onChange={(v) => setSection('vlog', { ...d, instaDesc: v })} />
        <TextField label="Instagram link (URL)" value={d.instaUrl} onChange={(v) => setSection('vlog', { ...d, instaUrl: v })} />

        <div className="mt-6 border-t border-border pt-6">
          <TextField label="Brands strip – heading" value={d.partnersTitle} onChange={(v) => setSection('vlog', { ...d, partnersTitle: v })} />
          <Label className="mb-2 mt-4 block text-xs">Brand / sponsor names (auto-scrolling)</Label>
          {d.partners.map((p, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <Input value={p} onChange={(e) => { const n = [...d.partners]; n[i] = e.target.value; setSection('vlog', { ...d, partners: n }) }} />
              <Button variant="ghost" size="sm" onClick={() => setSection('vlog', { ...d, partners: d.partners.filter((_, j) => j !== i) })} className="text-red-400 hover:text-red-500 hover:bg-red-500/10">
                <Trash2 size={14} />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" className="gap-1" onClick={() => setSection('vlog', { ...d, partners: [...d.partners, ''] })}>
            <Plus size={14} /> Add brand
          </Button>
        </div>
      </>
    )
  }

  if (section === 'gallery') {
    const d = content.gallery
    return (
      <>
        <AreaField label="Subtitle" value={d.subtitle} onChange={(v) => setSection('gallery', { ...d, subtitle: v })} />
        <AreaField label="Footer note (below photos)" value={d.footerNote} onChange={(v) => setSection('gallery', { ...d, footerNote: v })} />
        <Label className="mb-2 block text-xs">Places (photo cards)</Label>
        {d.destinations.map((x, i) => (
          <RowCard key={i} index={i} onRemove={() => setSection('gallery', { ...d, destinations: d.destinations.filter((_, j) => j !== i) })}>
            <TextField label="Place name" value={x.name} onChange={(v) => { const n = [...d.destinations]; n[i] = { ...x, name: v }; setSection('gallery', { ...d, destinations: n }) }} />
            <TextField label="Flag emoji" value={x.flag} onChange={(v) => { const n = [...d.destinations]; n[i] = { ...x, flag: v }; setSection('gallery', { ...d, destinations: n }) }} />
            <ImageField label="Photo" value={x.image} uploadImage={uploadImage} onChange={(v) => { const n = [...d.destinations]; n[i] = { ...x, image: v }; setSection('gallery', { ...d, destinations: n }) }} />
          </RowCard>
        ))}
        <Button variant="outline" size="sm" className="gap-1" onClick={() => setSection('gallery', { ...d, destinations: [...d.destinations, { name: '', flag: '✈️', image: '' }] })}>
          <Plus size={14} /> Add place
        </Button>
      </>
    )
  }

  // contact
  const d = content.contact
  return (
    <>
      <AreaField label="Subtitle" value={d.subtitle} onChange={(v) => setSection('contact', { ...d, subtitle: v })} />
      <TextField label="Email" value={d.email} onChange={(v) => setSection('contact', { ...d, email: v })} />
      <TextField label="Phone" value={d.phone} onChange={(v) => setSection('contact', { ...d, phone: v })} />
      <TextField label="Location" value={d.location} onChange={(v) => setSection('contact', { ...d, location: v })} />
    </>
  )
}
