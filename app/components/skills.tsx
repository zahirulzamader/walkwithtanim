'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  Smartphone, Users, PenTool, Monitor, Award, Globe, Headphones,
  Camera, ClipboardList, Languages,
} from 'lucide-react'

const skills = [
  { icon: Smartphone, label: 'Digital Communication' },
  { icon: Camera, label: 'Content Creation' },
  { icon: Users, label: 'Social Media Management' },
  { icon: PenTool, label: 'Scriptwriting' },
  { icon: Monitor, label: 'Microsoft Office Suite' },
  { icon: Award, label: 'Team Leadership' },
  { icon: Globe, label: 'Intercultural Communication' },
  { icon: Headphones, label: 'Customer Service' },
  { icon: ClipboardList, label: 'Organizational Planning' },
]

const languages = [
  { name: 'Bengali', level: 'Native', percent: 100 },
  { name: 'English', level: 'C1 – Proficient', percent: 90 },
  { name: 'Italian', level: 'A1 – Beginner', percent: 20 },
]

export default function Skills() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="skills" className="py-20 sm:py-32">
      <div ref={ref} className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
            <span className="text-primary">Skills</span> & Languages
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            A blend of technical expertise and cross-cultural competence
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
          {/* Skills grid */}
          <div>
            <h3 className="font-display text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Award className="text-primary" size={22} /> Core Skills
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {skills.map((skill, i) => (
                <motion.div
                  key={skill.label}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={inView ? { scale: 1, opacity: 1 } : {}}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="bg-card rounded-xl p-4 text-center hover:bg-primary/10 transition-colors group"
                  style={{ boxShadow: 'var(--shadow-sm)' }}
                >
                  <skill.icon className="mx-auto mb-2 text-muted-foreground group-hover:text-primary transition-colors" size={24} />
                  <p className="text-xs font-medium text-foreground/80">{skill.label}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div>
            <h3 className="font-display text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Languages className="text-primary" size={22} /> Languages
            </h3>
            <div className="space-y-6">
              {languages.map((lang, i) => (
                <motion.div
                  key={lang.name}
                  initial={{ x: 40, opacity: 0 }}
                  animate={inView ? { x: 0, opacity: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                >
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-foreground">{lang.name}</span>
                    <span className="text-sm text-muted-foreground">{lang.level}</span>
                  </div>
                  <div className="h-3 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-amber-400 rounded-full"
                      initial={{ width: 0 }}
                      animate={inView ? { width: `${lang.percent}%` } : {}}
                      transition={{ duration: 1, delay: 0.4 + i * 0.15 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
