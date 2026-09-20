'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Sun, MapPin } from 'lucide-react'
import { socialLinks } from './social-links'

const slides = [
  { src: '/bangladesh/coxsbazar.jpg', name: "Cox's Bazar" },
  { src: '/bangladesh/sajek.jpg', name: 'Sajek Valley' },
  { src: '/bangladesh/sylhet.jpg', name: 'Sylhet Tea Gardens' },
  { src: '/bangladesh/saintmartin.jpg', name: "Saint Martin's Island" },
  { src: '/bangladesh/bandarban.jpg', name: 'Bandarban Hills' },
  { src: '/bangladesh/sundarbans.jpg', name: 'Sundarbans' },
]

const BRIGHTNESS_KEY = 'wt_hero_brightness'

export default function Hero() {
  const [current, setCurrent] = useState(0)
  const [brightness, setBrightness] = useState(0.6)

  // Load saved brightness preference (client-only to avoid hydration mismatch)
  useEffect(() => {
    const saved = localStorage.getItem(BRIGHTNESS_KEY)
    if (saved) {
      const n = parseFloat(saved)
      if (!Number.isNaN(n)) setBrightness(n)
    }
  }, [])

  // Auto-advance the slideshow
  useEffect(() => {
    const t = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length)
    }, 5500)
    return () => clearInterval(t)
  }, [])

  const handleBrightness = (v: number) => {
    setBrightness(v)
    localStorage.setItem(BRIGHTNESS_KEY, String(v))
  }

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Bangladesh picture slideshow */}
      <div className="absolute inset-0">
        <AnimatePresence>
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 1.6 }, scale: { duration: 6, ease: 'easeOut' } }}
            className="absolute inset-0"
          >
            <Image
              src={slides[current].src}
              alt={`${slides[current].name}, Bangladesh`}
              fill
              priority
              sizes="100vw"
              className="object-cover"
              style={{ filter: `brightness(${brightness})` }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Scrim overlays — independent of the brightness slider so the logo & text stay readable over any photo */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0F2C]/85 via-[#0A0F2C]/55 to-[#0A0F2C]/90" />
      <div className="absolute inset-0 bg-[#0A0F2C]/25" />

      {/* Subtle brand glows */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center py-32">
        {/* Avatar */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="mx-auto mb-8 w-32 h-32 sm:w-40 sm:h-40 rounded-full ring-4 ring-primary/40 overflow-hidden shadow-2xl"
        >
          <Image src="/logo.png" alt="Md Zahirul Islam" width={160} height={160} className="w-full h-full object-cover" priority />
        </motion.div>

        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="font-display text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-white mb-4"
          style={{ textShadow: '0 2px 24px rgba(0,0,0,0.6)' }}
        >
          Md Zahirul Islam
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-primary font-display text-lg sm:text-xl md:text-2xl font-semibold mb-6 tracking-wide"
          style={{ textShadow: '0 2px 16px rgba(0,0,0,0.7)' }}
        >
          Explorer · Storyteller · Influencer
        </motion.p>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-white/80 max-w-2xl mx-auto text-base sm:text-lg mb-10"
          style={{ textShadow: '0 1px 12px rgba(0,0,0,0.7)' }}
        >
          From the shores of Bangladesh to the streets of Rome — sharing stories, cultures & adventures with the world
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <Button asChild size="lg" className="text-base px-8 py-6 font-semibold">
            <a href="#about">Explore My World</a>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-base px-8 py-6 font-semibold border-primary/60 text-white hover:bg-primary/20 bg-white/5 backdrop-blur-sm">
            <a href="#vlog">Watch My Content</a>
          </Button>
        </motion.div>

        {/* Social icons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="flex justify-center flex-wrap gap-3 sm:gap-4 max-w-xl mx-auto"
        >
          {socialLinks.map((s, i) => (
            <motion.a
              key={s.label}
              href={s.comingSoon ? undefined : s.href}
              target={s.comingSoon ? undefined : '_blank'}
              rel={s.comingSoon ? undefined : 'noopener noreferrer'}
              aria-label={s.comingSoon ? `${s.label} (coming soon)` : s.label}
              title={s.comingSoon ? `${s.label} — coming soon` : s.label}
              className={`w-11 h-11 rounded-full bg-[#0A0F2C]/60 backdrop-blur-sm border border-white/10 flex items-center justify-center transition-all ${s.comingSoon ? 'text-white/30 cursor-default' : 'text-white/80 hover:text-primary hover:bg-primary/20'}`}
              animate={{ y: [0, -6, 0] }}
              transition={{ delay: 1.2 + i * 0.15, duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <s.icon size={20} />
            </motion.a>
          ))}
        </motion.div>
      </div>

      {/* Current place caption (bottom-left) */}
      <div className="absolute bottom-6 left-4 sm:left-6 z-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-1.5 rounded-full bg-[#0A0F2C]/60 backdrop-blur-md border border-white/10 px-3.5 py-1.5 text-xs sm:text-sm text-white/85"
          >
            <MapPin size={14} className="text-primary shrink-0" />
            <span className="font-medium">{slides[current].name}</span>
            <span className="text-white/50">· Bangladesh</span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Brightness control (bottom-right) */}
      <div className="absolute bottom-6 right-4 sm:right-6 z-20 flex items-center gap-2.5 rounded-full bg-[#0A0F2C]/70 backdrop-blur-md border border-white/10 px-3.5 py-2">
        <Sun size={16} className="text-primary shrink-0" />
        <input
          type="range"
          min={25}
          max={120}
          value={Math.round(brightness * 100)}
          onChange={(e) => handleBrightness(Number(e.target.value) / 100)}
          aria-label="Adjust background photo brightness"
          className="w-24 sm:w-36 h-1.5 cursor-pointer rounded-full"
          style={{ accentColor: 'hsl(var(--primary))' }}
        />
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/40 flex items-start justify-center p-1.5">
          <div className="w-1.5 h-3 bg-primary rounded-full" />
        </div>
      </motion.div>
    </section>
  )
}
