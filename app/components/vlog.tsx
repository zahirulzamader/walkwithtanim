'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Youtube, Instagram, Sparkles, Bell, Loader2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export default function Vlog() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = async () => {
    if (!email?.trim()) {
      toast.error('Please enter your email')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      const data = await res.json()
      if (data?.success) {
        setSubscribed(true)
        toast.success('You\'re on the list! 🎉')
        setEmail('')
      } else {
        toast.error(data?.message ?? 'Something went wrong')
      }
    } catch {
      toast.error('Failed to subscribe. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="vlog" className="py-20 sm:py-32 bg-secondary/30">
      <div ref={ref} className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
            My Content <span className="text-primary">Universe</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Real stories. Real cultures. Real adventures.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-12">
          {/* YouTube Card */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-card rounded-xl p-8 text-center relative overflow-hidden"
            style={{ boxShadow: 'var(--shadow-md)' }}
          >
            <div className="absolute top-3 right-3 bg-red-500/20 text-red-400 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <Sparkles size={12} /> Coming Soon
            </div>
            <div className="w-16 h-16 mx-auto mb-4 bg-red-500/10 rounded-full flex items-center justify-center">
              <Youtube className="text-red-500" size={32} />
            </div>
            <h3 className="font-display text-xl font-bold text-foreground mb-2">Zahirul Explores</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Travel vlogs, cultural deep-dives, and behind-the-scenes stories from my life across continents.
            </p>
            <Button variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10" disabled>
              <Bell size={16} className="mr-2" /> Subscribe
            </Button>
          </motion.div>

          {/* Instagram/TikTok Card */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-card rounded-xl p-8 text-center relative overflow-hidden"
            style={{ boxShadow: 'var(--shadow-md)' }}
          >
            <div className="absolute top-3 right-3 bg-green-500/20 text-green-400 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <Sparkles size={12} /> Live Now
            </div>
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-full flex items-center justify-center">
              <Instagram className="text-pink-500" size={32} />
            </div>
            <h3 className="font-display text-xl font-bold text-foreground mb-2">@walk_with_tanim</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Short-form content, travel reels, and daily life snippets from Rome and beyond.
            </p>
            <Button asChild variant="outline" className="border-pink-500/50 text-pink-400 hover:bg-pink-500/10">
              <a href="https://www.instagram.com/walk_with_tanim" target="_blank" rel="noopener noreferrer">
                <Instagram size={16} className="mr-2" /> Follow on Instagram
              </a>
            </Button>
          </motion.div>
        </div>

        {/* Email subscription */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-lg mx-auto bg-card rounded-xl p-6 sm:p-8 text-center"
          style={{ boxShadow: 'var(--shadow-md)' }}
        >
          <h3 className="font-display text-lg font-bold text-foreground mb-2">
            Be the first to know when I go live
          </h3>
          <p className="text-muted-foreground text-sm mb-4">Enter your email and stay updated</p>
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              className="flex-1"
              disabled={subscribed}
            />
            <Button
              onClick={handleSubscribe}
              disabled={loading || subscribed}
              className="shrink-0"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : subscribed ? (
                <><Check size={16} className="mr-1" /> Subscribed</>
              ) : (
                'Notify Me'
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
