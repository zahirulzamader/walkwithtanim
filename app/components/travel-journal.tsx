'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import { BookOpen, Plane, MapPin, Compass, PenLine, Loader2, ImagePlus, X, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel'
import { toast } from 'sonner'

type JournalEntry = {
  place: string
  country: string
  flag: string
  image: string
  experience: string
  gettingThere: string
  tips: string
}

const defaultEntries: JournalEntry[] = [
  {
    place: 'Rome',
    country: 'Italy',
    flag: '🇮🇹',
    image: 'https://images.pexels.com/photos/18602876/pexels-photo-18602876/free-photo-of-colosseum-in-rome.jpeg',
    experience:
      'Rome became home. Living among two thousand years of history — waking near the Colosseum, wandering Trastevere at golden hour, and welcoming travelers from every corner of the world at Ancient Roman Tours. Every cobblestone here tells a story, and I get to be part of it every single day.',
    gettingThere:
      'I moved to Italy for work after my time in the Baltics. An employer-sponsored national work visa (Nulla Osta) followed by a residence permit (Permesso di Soggiorno) made settling in Rome possible.',
    tips:
      'Visitors from most countries can enter visa-free for up to 90 days within the Schengen Area. Base yourself near Termini for easy transport, get the Roma Pass for museums, and drink freely from the street fountains (nasoni) — the water is fresh and free.',
  },
  {
    place: 'Madrid',
    country: 'Spain',
    flag: '🇪🇸',
    image: '/destinations/madrid.jpg',
    experience:
      'Madrid stole a piece of my heart. From the buzzing energy of Plaza Mayor to late-night tapas crawls and the golden light spilling over the Royal Palace, the Spanish capital taught me how to slow down and truly savor life.',
    gettingThere:
      'As a resident of Italy, travel within the Schengen zone is seamless — I flew directly from Rome to Madrid with no border checks, just a short two-and-a-half-hour hop.',
    tips:
      'If you hold a Schengen visa or residence permit, Spain is open with no extra paperwork. Fly into Madrid-Barajas, grab a 10-trip metro ticket, and catch the free evening hours at the Prado Museum.',
  },
  {
    place: 'Riga',
    country: 'Latvia',
    flag: '🇱🇻',
    image: 'https://images.pexels.com/photos/37375886/pexels-photo-37375886/free-photo-of-scenic-view-of-riga-s-old-town-and-daugava-river.jpeg',
    experience:
      'Riga is where my European journey began. Working the front desk of a boutique hotel and serving tourists at Chili Pizza, I learned hospitality in one of the Baltics’ most beautiful Art Nouveau cities — and fell in love with its snowy winters.',
    gettingThere:
      'I arrived in Latvia on a work-based residence permit sponsored through hospitality employment. It was my first foothold in Europe and my gateway into the Schengen Area.',
    tips:
      'Latvia is part of Schengen, so the 90-day visa-free rule applies to eligible visitors. Riga’s Old Town is fully walkable, the Central Market is a must, and cheap buses reach the seaside town of Jūrmala in under an hour.',
  },
  {
    place: 'Kaunas',
    country: 'Lithuania',
    flag: '🇱🇹',
    image: '/destinations/kaunas.jpg',
    experience:
      'A trip to Kaunas revealed a city of quiet charm — the meeting point of two rivers, an Old Town Hall locals call the “White Swan,” and some of the warmest, friendliest people I’ve met anywhere in the Baltics.',
    gettingThere:
      'From Riga, Kaunas is an easy cross-border bus ride — around four hours through the Baltic countryside with no border stops, thanks to Schengen’s open borders.',
    tips:
      'Reach Kaunas via budget flights into Kaunas Airport or long-distance buses from Riga, Vilnius, or Warsaw. Explore the Old Town on foot, ride the historic funicular, and try cepelinai — Lithuania’s hearty potato dumplings.',
  },
]

type DbEntry = {
  id: number
  place: string
  country: string
  flag: string
  imageUrl: string
  experience: string
  gettingThere: string
  tips: string
}

const emptyForm = {
  place: '',
  country: '',
  flag: '',
  imageUrl: '',
  experience: '',
  gettingThere: '',
  tips: '',
}

export default function TravelJournal() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 })
  const [entries, setEntries] = useState<JournalEntry[]>(defaultEntries)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ ...emptyForm })
  const [saving, setSaving] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [uploading, setUploading] = useState(false)

  const loadEntries = async () => {
    try {
      const res = await fetch('/api/journal')
      const data = await res.json()
      if (data?.success && Array.isArray(data.entries)) {
        const dbEntries: JournalEntry[] = data.entries.map((e: DbEntry) => ({
          place: e.place,
          country: e.country,
          flag: e.flag || '✈️',
          image: e.imageUrl || '',
          experience: e.experience,
          gettingThere: e.gettingThere,
          tips: e.tips,
        }))
        // User-written stories appear first, then the built-in ones.
        setEntries([...dbEntries, ...defaultEntries])
      }
    } catch {
      // Keep default entries if the fetch fails.
    }
  }

  const loadAdmin = async () => {
    try {
      const res = await fetch('/api/admin')
      const data = await res.json()
      setIsAdmin(Boolean(data?.isAdmin))
    } catch {
      setIsAdmin(false)
    }
  }

  useEffect(() => {
    loadEntries()
    loadAdmin()
  }, [])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file.')
      return
    }
    if (file.size > 100 * 1024 * 1024) {
      toast.error('Image is too large (max 100MB).')
      return
    }
    setUploading(true)
    try {
      const presign = await fetch('/api/upload/presigned', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name, contentType: file.type }),
      })
      const pdata = await presign.json()
      if (!pdata?.success) {
        toast.error(pdata?.message ?? 'Upload failed.')
        return
      }
      const put = await fetch(pdata.uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      })
      if (!put.ok) {
        toast.error('Upload failed. Please try again.')
        return
      }
      setForm((f) => ({ ...f, imageUrl: pdata.publicUrl }))
      toast.success('Photo uploaded!')
    } catch {
      toast.error('Upload failed. Please try again.')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const update = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async () => {
    if (!form.place.trim() || !form.country.trim() || !form.experience.trim()) {
      toast.error('Please fill in the place, country and your experience.')
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data?.success) {
        toast.success('Your story is published! 🌍')
        setForm({ ...emptyForm })
        setOpen(false)
        await loadEntries()
      } else {
        toast.error(data?.message ?? 'Something went wrong.')
      }
    } catch {
      toast.error('Failed to publish. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section id="journal" className="py-20 sm:py-32 bg-secondary/30">
      <div ref={ref} className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 text-primary text-sm font-semibold mb-3">
            <BookOpen size={16} /> Travel Journal
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
            Stories From The <span className="text-primary">Road</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-6">
            Where I’ve been, how I got there, and everything you need to follow the same path
          </p>

          {isAdmin && (
          <div className="flex flex-col items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <EyeOff size={13} /> Owner mode — only you can see this button. Visitors can’t.
            </span>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <PenLine size={16} /> Write Your Story
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[560px]">
              <DialogHeader>
                <DialogTitle className="font-display">Write a new story</DialogTitle>
                <DialogDescription>
                  Add a destination in your own words. It appears in your Travel Journal right away.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-1">
                    <Label htmlFor="j-place">Place *</Label>
                    <Input id="j-place" value={form.place} onChange={update('place')} placeholder="Paris" className="mt-1" />
                  </div>
                  <div className="sm:col-span-1">
                    <Label htmlFor="j-country">Country *</Label>
                    <Input id="j-country" value={form.country} onChange={update('country')} placeholder="France" className="mt-1" />
                  </div>
                  <div className="sm:col-span-1">
                    <Label htmlFor="j-flag">Flag emoji</Label>
                    <Input id="j-flag" value={form.flag} onChange={update('flag')} placeholder="🇫🇷" className="mt-1" />
                  </div>
                </div>

                <div>
                  <Label>Photo</Label>
                  <div className="mt-1 flex items-center gap-3">
                    <label className="inline-flex items-center gap-2 cursor-pointer rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-secondary/60 transition-colors">
                      {uploading ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
                      {uploading ? 'Uploading…' : 'Upload a photo'}
                      <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                    </label>
                    {form.imageUrl && (
                      <div className="relative w-14 h-14 rounded-md overflow-hidden bg-muted shrink-0">
                        <Image src={form.imageUrl} alt="Selected photo" fill className="object-cover" sizes="56px" />
                        <button type="button" onClick={() => setForm((f) => ({ ...f, imageUrl: '' }))} className="absolute top-0 right-0 bg-background/80 rounded-bl p-0.5 text-foreground" aria-label="Remove photo">
                          <X size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                  <Input value={form.imageUrl} onChange={update('imageUrl')} placeholder="…or paste an image URL (optional)" className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">Leave empty for a colored card with your flag emoji.</p>
                </div>

                <div>
                  <Label htmlFor="j-exp">Your experience *</Label>
                  <Textarea id="j-exp" value={form.experience} onChange={update('experience')} placeholder="What did this place mean to you?" rows={4} className="mt-1" />
                </div>

                <div>
                  <Label htmlFor="j-got">How you got there</Label>
                  <Textarea id="j-got" value={form.gettingThere} onChange={update('gettingThere')} placeholder="Your route, visa, transport…" rows={3} className="mt-1" />
                </div>

                <div>
                  <Label htmlFor="j-tips">How others can visit</Label>
                  <Textarea id="j-tips" value={form.tips} onChange={update('tips')} placeholder="Practical tips for travelers…" rows={3} className="mt-1" />
                </div>

              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={saving} className="gap-2">
                  {saving ? <><Loader2 size={16} className="animate-spin" /> Publishing…</> : 'Publish Story'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          </div>
          )}
        </motion.div>

        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Carousel opts={{ loop: true }} className="w-full">
            <CarouselContent>
              {entries.map((entry, idx) => (
                <CarouselItem key={`${entry.place}-${idx}`}>
                  <div
                    className="grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden bg-card"
                    style={{ boxShadow: 'var(--shadow-md)' }}
                  >
                    {/* Image */}
                    <div className="relative aspect-[16/11] md:aspect-auto md:min-h-[440px] bg-muted">
                      {entry.image ? (
                        <Image
                          src={entry.image}
                          alt={`${entry.place}, ${entry.country}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/25 via-secondary to-background">
                          <span className="text-6xl">{entry.flag}</span>
                        </div>
                      )}
                      <div className="absolute top-4 left-4 flex items-center gap-2 bg-background/80 backdrop-blur px-3 py-1.5 rounded-full">
                        <span className="text-xl">{entry.flag}</span>
                        <span className="font-display font-bold text-sm text-foreground">
                          {entry.place}, {entry.country}
                        </span>
                      </div>
                    </div>

                    {/* Text */}
                    <div className="p-6 sm:p-8 flex flex-col justify-center">
                      <p className="text-foreground/80 text-sm sm:text-base leading-relaxed mb-6">
                        {entry.experience}
                      </p>

                      <div className="space-y-4">
                        {entry.gettingThere && (
                          <div className="flex gap-3">
                            <div className="shrink-0 w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Plane size={16} className="text-primary" />
                            </div>
                            <div>
                              <h4 className="font-display text-sm font-bold text-foreground mb-1">How I Got There</h4>
                              <p className="text-muted-foreground text-sm leading-relaxed">{entry.gettingThere}</p>
                            </div>
                          </div>
                        )}

                        {entry.tips && (
                          <div className="flex gap-3">
                            <div className="shrink-0 w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Compass size={16} className="text-primary" />
                            </div>
                            <div>
                              <h4 className="font-display text-sm font-bold text-foreground mb-1">How You Can Visit</h4>
                              <p className="text-muted-foreground text-sm leading-relaxed">{entry.tips}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1 mt-6 text-xs text-muted-foreground">
                        <MapPin size={12} /> {entry.place}, {entry.country}
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 sm:-left-5 bg-background/80 backdrop-blur border-border text-foreground hover:bg-primary hover:text-primary-foreground" />
            <CarouselNext className="right-2 sm:-right-5 bg-background/80 backdrop-blur border-border text-foreground hover:bg-primary hover:text-primary-foreground" />
          </Carousel>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center text-muted-foreground text-sm mt-8"
        >
          New stories added after every trip — more destinations on the way ✈️
        </motion.p>
      </div>
    </section>
  )
}
