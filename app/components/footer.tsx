'use client'

import Image from 'next/image'
import { socialLinks } from './social-links'
import AdminLogin from './admin-login'

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Journey', href: '#journey' },
  { label: 'Contact', href: '#contact' },
]

export default function Footer() {
  return (
    <footer className="py-12 border-t border-border">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center gap-6">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-3 justify-center">
            <Image src="/logo.png" alt="Md Zahirul Islam" width={48} height={48} className="rounded-full" />
            <span className="font-display text-2xl font-bold text-primary">ZahirulIslam</span>
          </a>
          <p className="text-sm text-muted-foreground max-w-md">
            Explorer · Storyteller · Influencer
          </p>

          {/* Nav */}
          <div className="flex flex-wrap justify-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Social */}
          <div className="flex flex-wrap justify-center gap-3">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.comingSoon ? undefined : s.href}
                target={s.comingSoon ? undefined : '_blank'}
                rel={s.comingSoon ? undefined : 'noopener noreferrer'}
                aria-label={s.comingSoon ? `${s.label} (coming soon)` : s.label}
                title={s.comingSoon ? `${s.label} — coming soon` : s.label}
                className={`w-9 h-9 rounded-full bg-secondary/60 flex items-center justify-center transition-all ${s.comingSoon ? 'text-muted-foreground/40 cursor-default' : 'text-muted-foreground hover:text-primary hover:bg-primary/10'}`}
              >
                <s.icon size={16} />
              </a>
            ))}
          </div>

          {/* Copyright */}
          <div className="flex items-center gap-2">
            <p className="text-xs text-muted-foreground">
              © 2026 Md Zahirul Islam. All rights reserved.
            </p>
            <AdminLogin />
          </div>
        </div>
      </div>
    </footer>
  )
}
