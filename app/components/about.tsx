'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Globe, Briefcase, Languages, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

const stats = [
  { icon: Globe, value: '3', label: 'Countries Lived' },
  { icon: Briefcase, value: '6+', label: 'Years Experience' },
  { icon: Languages, value: '2+', label: 'Languages (+ Learning Italian)' },
  { icon: BookOpen, value: '∞', label: 'Stories to Tell' },
]

export default function About() {
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
              <p>
                I&apos;m a Master&apos;s student in Rome, studying Tourism Strategy, Cultural Heritage
                & Made in Italy at Università degli Studi di Roma Tor Vergata. With a BA in English
                Literature, I blend language, culture, and storytelling.
              </p>
              <p>
                Having lived and worked across Bangladesh, Latvia, and Italy, I&apos;ve experienced
                the magic of different cultures firsthand. Now I&apos;m building a platform to share
                authentic travel stories and cultural experiences with the world.
              </p>
              <p>
                Passionate about digital communication, content creation, and connecting
                with people across borders.
              </p>
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
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-card rounded-xl p-6 text-center hover:bg-card/80 transition-colors"
              style={{ boxShadow: 'var(--shadow-md)' }}
            >
              <stat.icon className="mx-auto mb-3 text-primary" size={28} />
              <div className="font-display text-3xl font-bold text-primary mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
