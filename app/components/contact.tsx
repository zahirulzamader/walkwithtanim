'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Mail, Phone, MapPin, Send, Loader2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { socialLinks } from './social-links'

export default function Contact() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...(prev ?? {}), [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form?.name?.trim() || !form?.email?.trim() || !form?.message?.trim()) {
      toast.error('Please fill in all required fields')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data?.success) {
        setSent(true)
        toast.success('Message sent successfully! 🎉')
        setForm({ name: '', email: '', subject: '', message: '' })
      } else {
        toast.error(data?.message ?? 'Something went wrong')
      }
    } catch {
      toast.error('Failed to send. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="py-20 sm:py-32 bg-secondary/30">
      <div ref={ref} className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
            Get in <span className="text-primary">Touch</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Have a collaboration idea, brand proposal, or just want to say hi? Let&apos;s connect!
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          {/* Contact info */}
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            animate={inView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="font-display text-xl font-bold text-foreground mb-6">Contact Information</h3>
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="text-primary" size={20} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-foreground font-medium text-sm" suppressHydrationWarning>self.mdzahirulislam@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="text-primary" size={20} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-foreground font-medium text-sm" suppressHydrationWarning>(+39) 3921202060</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="text-primary" size={20} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="text-foreground font-medium text-sm">Rome, Italy</p>
                </div>
              </div>
            </div>

            {/* Social */}
            <div className="mt-8">
              <p className="text-sm text-muted-foreground mb-3">Follow me</p>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.comingSoon ? undefined : s.href}
                    target={s.comingSoon ? undefined : '_blank'}
                    rel={s.comingSoon ? undefined : 'noopener noreferrer'}
                    aria-label={s.comingSoon ? `${s.label} (coming soon)` : s.label}
                    title={s.comingSoon ? `${s.label} — coming soon` : s.label}
                    className={`w-10 h-10 rounded-full bg-card flex items-center justify-center transition-all ${s.comingSoon ? 'text-muted-foreground/40 cursor-default' : 'text-muted-foreground hover:text-primary hover:bg-primary/10'}`}
                    style={{ boxShadow: 'var(--shadow-sm)' }}
                  >
                    <s.icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ x: 40, opacity: 0 }}
            animate={inView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Name *</label>
                  <Input name="name" value={form.name} onChange={handleChange} placeholder="Your name" required />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Email *</label>
                  <Input name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Subject</label>
                <Input name="subject" value={form.subject} onChange={handleChange} placeholder="What's this about?" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Message *</label>
                <Textarea name="message" value={form.message} onChange={handleChange} placeholder="Tell me what's on your mind..." rows={5} required />
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={loading || sent}>
                {loading ? (
                  <><Loader2 size={16} className="mr-2 animate-spin" /> Sending...</>
                ) : sent ? (
                  <><Check size={16} className="mr-2" /> Message Sent!</>
                ) : (
                  <><Send size={16} className="mr-2" /> Send Message</>
                )}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Your information is stored securely and will only be used to respond to your inquiry.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
