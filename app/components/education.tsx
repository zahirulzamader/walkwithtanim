'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { GraduationCap } from 'lucide-react'

const educations = [
  {
    flag: '🇮🇹',
    degree: 'Tourism Strategy, Cultural Heritage & Made in Italy',
    institution: 'Università degli Studi di Roma Tor Vergata',
    location: 'Rome, Italy',
    years: '2025 – Present',
  },
  {
    flag: '🇱🇻',
    degree: "Master's in Philology & Applied Linguistics",
    institution: 'Daugavpils University',
    location: 'Latvia',
    years: '2024 – 2025',
  },
  {
    flag: '🇧🇩',
    degree: 'BA (Hons) English Literature',
    institution: 'National University – Adamjee Cantonment College',
    location: 'Dhaka, Bangladesh',
    years: '2017 – 2022',
  },
]

export default function Education() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="education" className="py-20 sm:py-32 bg-secondary/30">
      <div ref={ref} className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
            <span className="text-primary">Education</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Academic foundations across three countries
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {educations.map((edu, i) => (
            <motion.div
              key={edu.institution}
              initial={{ y: 40, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="bg-card rounded-xl p-6 sm:p-8 text-center hover:scale-[1.02] transition-transform"
              style={{ boxShadow: 'var(--shadow-md)' }}
            >
              <div className="text-3xl mb-4">{edu.flag}</div>
              <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <GraduationCap className="text-primary" size={28} />
              </div>
              <h3 className="font-display text-lg font-bold text-foreground mb-2 leading-snug">{edu.degree}</h3>
              <p className="text-primary text-sm font-semibold mb-1">{edu.institution}</p>
              <p className="text-muted-foreground text-xs">{edu.location}</p>
              <p className="text-muted-foreground text-xs mt-2">{edu.years}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
