import {
  SiInstagram,
  SiFacebook,
  SiX,
  SiWhatsapp,
  SiThreads,
  SiTelegram,
  SiGithub,
  SiYoutube,
} from 'react-icons/si'
import { FaLinkedin } from 'react-icons/fa'
import type { IconType } from 'react-icons'

export type SocialLink = {
  label: string
  href: string
  icon: IconType
  color: string
  comingSoon?: boolean
}

// Live social profiles for Md Zahirul Islam ("Walk with Tanim").
export const socialLinks: SocialLink[] = [
  { label: 'YouTube', href: '#', icon: SiYoutube, color: '#FF0000', comingSoon: true },
  { label: 'Instagram', href: 'https://www.instagram.com/walk_with_tanim', icon: SiInstagram, color: '#E4405F' },
  { label: 'Facebook', href: 'https://www.facebook.com/zahirul.zamader', icon: SiFacebook, color: '#1877F2' },
  { label: 'Facebook Page', href: 'https://www.facebook.com/profile.php?id=61567227817028', icon: SiFacebook, color: '#1877F2' },
  { label: 'X (Twitter)', href: 'https://x.com/Xahirul_1998', icon: SiX, color: '#FFFFFF' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/md-zahirul-islam-b8962b149/', icon: FaLinkedin, color: '#0A66C2' },
  { label: 'Threads', href: 'https://threads.net/@walk_with_tanim', icon: SiThreads, color: '#FFFFFF' },
  { label: 'Telegram', href: 'https://telegram.me/Tanim_Rahman', icon: SiTelegram, color: '#26A5E4' },
  { label: 'WhatsApp', href: 'https://wa.me/393921202060', icon: SiWhatsapp, color: '#25D366' },
  { label: 'GitHub', href: 'https://github.com/zahirulzamader', icon: SiGithub, color: '#FFFFFF' },
]
