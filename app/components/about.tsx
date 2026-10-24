'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Globe, Briefcase, Languages, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { defaultContent, type AboutContent } from '@/lib/content/defaults'

const STAT_ICONS = [Globe, Briefcase, Languages, BookOpen]

export default function About({ content }: { content?: AboutContent }) {
  const c = content ?? defaultContent.about
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="about" className="py-20 sm:py-32 bg-secondary/30">
      <div ref={ref} className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Photo */}
          <motion.div
            initial={{ x: -60, opacity: 0 }}
            animate={inView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.7 }}
            className="flex justify-center"
          >
            <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-full border-4 border-primary/40 overflow-hidden">
              <Image src="/logo.png" alt="Md Zahirul Islam" width={320} height={320} className="w-full h-full object-cover" />
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ x: 60, opacity: 0 }}
            animate={inView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-6">
              Hi, I&apos;m <span className="text-primary">Zahirul</span> 👋
            </h2>
            <div className="space-y-4 text-foreground/70 text-base leading-relaxed">
              {c.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <Button asChild variant="outline" className="mt-8 border-primary/50 text-primary hover:bg-primary/10">
              <a href="#contact">Get in Touch</a>
            </Button>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
        >
          {c.stats.map((stat, i) => {
            const Icon = STAT_ICONS[i % STAT_ICONS.length]
            return (
              <div
                key={stat.label}
                className="bg-card rounded-xl p-6 text-center hover:bg-card/80 transition-colors"
                style={{ boxShadow: 'var(--shadow-md)' }}
              >
                <Icon className="mx-auto mb-3 text-primary" size={28} />
                <div className="font-display text-3xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
