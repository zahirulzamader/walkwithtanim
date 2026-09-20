'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { MapPin, Calendar } from 'lucide-react'

const experiences = [
  {
    flag: '🇮🇹',
    role: 'Desk & Tourist Management Assistant',
    company: 'Ancient Roman Tours SRL',
    location: 'Rome, Italy',
    period: 'Jun 2026 – Present',
    description: 'Managing tourist desk operations and assisting visitors with guided tour bookings across historic Rome.',
  },
  {
    flag: '🇮🇹',
    role: 'Executive Assistant',
    company: 'National CAF Prenestina',
    location: 'Rome, Italy',
    period: 'Oct 2025 – Jun 2026',
    description: 'Provided executive administrative support, handling fiscal assistance and documentation services.',
  },
  {
    flag: '🇱🇻',
    role: 'Hotel Receptionist',
    company: 'Hotel Le Chevalier',
    location: 'Riga, Latvia',
    period: 'Feb – Aug 2025',
    description: 'Front desk operations, guest relations, and hospitality management in a boutique hotel setting.',
  },
  {
    flag: '🇱🇻',
    role: 'Bartender & Waiter (Tourist Section)',
    company: 'Chili Pizza',
    location: 'Riga, Latvia',
    period: 'Feb – Aug 2025',
    description: 'Served international tourists, delivering warm hospitality and memorable dining experiences.',
  },
  {
    flag: '🇧🇩',
    role: 'Customer Service Officer',
    company: 'Akashbari Holidays',
    location: 'Dhaka, Bangladesh',
    period: 'Sep 2023 – Sep 2024',
    description: 'Managed customer inquiries and travel bookings, ensuring seamless holiday experiences.',
  },
  {
    flag: '🇧🇩',
    role: 'Visa Submission Officer',
    company: 'VFS Global',
    location: 'Dhaka, Bangladesh',
    period: 'Mar – Sep 2023',
    description: 'Processed visa applications with precision, assisting applicants through complex documentation requirements.',
  },
]

export default function Journey() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 })

  return (
    <section id="journey" className="py-20 sm:py-32">
      <div ref={ref} className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
            My <span className="text-primary">Journey</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            A path woven across three countries, six roles, and countless experiences
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Center line */}
          <div className="absolute left-4 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-border" />

          {experiences.map((exp, i) => {
            const isLeft = i % 2 === 0
            return (
              <motion.div
                key={`${exp.company}-${exp.period}`}
                initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className={`relative mb-10 md:mb-12 flex md:items-center ${
                  isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                } pl-12 md:pl-0`}
              >
                {/* Dot */}
                <div className="absolute left-3 md:left-1/2 md:-translate-x-1/2 top-6 md:top-1/2 md:-translate-y-1/2 w-3 h-3 bg-primary rounded-full ring-4 ring-background z-10" />

                {/* Card */}
                <div className={`md:w-[45%] ${isLeft ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'}`}>
                  <div
                    className="bg-card rounded-xl p-6 hover:bg-card/80 transition-all"
                    style={{ boxShadow: 'var(--shadow-md)' }}
                  >
                    <div className="text-2xl mb-2">{exp.flag}</div>
                    <h3 className="font-display text-lg font-bold text-foreground">{exp.role}</h3>
                    <p className="text-primary font-semibold text-sm mt-1">{exp.company}</p>
                    <div className="flex flex-wrap gap-3 mt-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin size={12} /> {exp.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> {exp.period}
                      </span>
                    </div>
                    <p className="text-foreground/60 text-sm mt-3 leading-relaxed">{exp.description}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
