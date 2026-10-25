// Single source of truth for all editable site content.
// The admin dashboard edits these values and saves them to the database;
// each section component falls back to these defaults when nothing is saved.

export type Stat = { value: string; label: string }
export type Experience = {
  flag: string
  role: string
  company: string
  location: string
  period: string
  description: string
}
export type EducationItem = {
  flag: string
  degree: string
  institution: string
  location: string
  years: string
}
export type LanguageItem = { name: string; level: string; percent: number }
export type Destination = { name: string; flag: string; image: string }

export type HeroContent = {
  name: string
  tagline: string
  description: string
}
export type AboutContent = {
  paragraphs: string[]
  stats: Stat[]
}
export type JourneyContent = {
  subtitle: string
  experiences: Experience[]
}
export type EducationContent = {
  subtitle: string
  items: EducationItem[]
}
export type SkillsContent = {
  subtitle: string
  skills: string[]
  languages: LanguageItem[]
}
export type Partner = { name: string; logo: string }
export type VlogContent = {
  subtitle: string
  youtubeTitle: string
  youtubeDesc: string
  youtubeUrl: string
  instaHandle: string
  instaDesc: string
  instaUrl: string
  partnersTitle: string
  partners: Partner[]
}
export type GalleryContent = {
  subtitle: string
  footerNote: string
  destinations: Destination[]
}
export type ContactContent = {
  subtitle: string
  email: string
  phone: string
  location: string
}

export type SiteContent = {
  hero: HeroContent
  about: AboutContent
  journey: JourneyContent
  education: EducationContent
  skills: SkillsContent
  vlog: VlogContent
  gallery: GalleryContent
  contact: ContactContent
}

export type SectionKey = keyof SiteContent

export const SECTION_KEYS: SectionKey[] = [
  'hero',
  'about',
  'journey',
  'education',
  'skills',
  'vlog',
  'gallery',
  'contact',
]

export const SECTION_LABELS: Record<SectionKey, string> = {
  hero: 'Hero (name & tagline)',
  about: 'About (bio & stats)',
  journey: 'Journey (work history)',
  education: 'Education',
  skills: 'Skills & Languages',
  vlog: 'Content / Vlog cards',
  gallery: 'Gallery (places)',
  contact: 'Contact details',
}

export const defaultContent: SiteContent = {
  hero: {
    name: 'Md Zahirul Islam',
    tagline: 'Explorer · Storyteller · Influencer',
    description:
      'From the shores of Bangladesh to the streets of Rome — sharing stories, cultures & adventures with the world',
  },
  about: {
    paragraphs: [
      "I'm a Master's student in Rome, studying Tourism Strategy, Cultural Heritage & Made in Italy at Università degli Studi di Roma Tor Vergata. With a BA in English Literature, I blend language, culture, and storytelling.",
      "Having lived and worked across Bangladesh, Latvia, and Italy, I've experienced the magic of different cultures firsthand. Now I'm building a platform to share authentic travel stories and cultural experiences with the world.",
      'Passionate about digital communication, content creation, and connecting with people across borders.',
    ],
    stats: [
      { value: '3', label: 'Countries Lived' },
      { value: '6+', label: 'Years Experience' },
      { value: '2+', label: 'Languages (+ Learning Italian)' },
      { value: '∞', label: 'Stories to Tell' },
    ],
  },
  journey: {
    subtitle: 'A path woven across three countries, six roles, and countless experiences',
    experiences: [
      {
        flag: '🇮🇹',
        role: 'Desk & Tourist Management Assistant',
        company: 'Ancient Roman Tours SRL',
        location: 'Rome, Italy',
        period: 'Jun 2026 – Present',
        description:
          'Managing tourist desk operations and assisting visitors with guided tour bookings across historic Rome.',
      },
      {
        flag: '🇮🇹',
        role: 'Executive Assistant',
        company: 'National CAF Prenestina',
        location: 'Rome, Italy',
        period: 'Oct 2025 – Jun 2026',
        description:
          'Provided executive administrative support, handling fiscal assistance and documentation services.',
      },
      {
        flag: '🇱🇻',
        role: 'Hotel Receptionist',
        company: 'Hotel Le Chevalier',
        location: 'Riga, Latvia',
        period: 'Feb – Aug 2025',
        description:
          'Front desk operations, guest relations, and hospitality management in a boutique hotel setting.',
      },
      {
        flag: '🇱🇻',
        role: 'Bartender & Waiter (Tourist Section)',
        company: 'Chili Pizza',
        location: 'Riga, Latvia',
        period: 'Feb – Aug 2025',
        description:
          'Served international tourists, delivering warm hospitality and memorable dining experiences.',
      },
      {
        flag: '🇧🇩',
        role: 'Customer Service Officer',
        company: 'Akashbari Holidays',
        location: 'Dhaka, Bangladesh',
        period: 'Sep 2023 – Sep 2024',
        description:
          'Managed customer inquiries and travel bookings, ensuring seamless holiday experiences.',
      },
      {
        flag: '🇧🇩',
        role: 'Visa Submission Officer',
        company: 'VFS Global',
        location: 'Dhaka, Bangladesh',
        period: 'Mar – Sep 2023',
        description:
          'Processed visa applications with precision, assisting applicants through complex documentation requirements.',
      },
    ],
  },
  education: {
    subtitle: 'Academic foundations across three countries',
    items: [
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
    ],
  },
  skills: {
    subtitle: 'A blend of technical expertise and cross-cultural competence',
    skills: [
      'Digital Communication',
      'Content Creation',
      'Social Media Management',
      'Scriptwriting',
      'Microsoft Office Suite',
      'Team Leadership',
      'Intercultural Communication',
      'Customer Service',
      'Organizational Planning',
    ],
    languages: [
      { name: 'Bengali', level: 'Native', percent: 100 },
      { name: 'English', level: 'C1 – Proficient', percent: 90 },
      { name: 'Italian', level: 'A1 – Beginner', percent: 20 },
    ],
  },
  vlog: {
    subtitle: 'Real stories. Real cultures. Real adventures.',
    youtubeTitle: 'Walk With Tanim',
    youtubeDesc:
      'Travel vlogs, cultural deep-dives, and behind-the-scenes stories from my life across continents.',
    youtubeUrl: 'https://www.youtube.com/@walkwithtanim',
    instaHandle: '@walk_with_tanim',
    instaDesc:
      'Short-form content, travel reels, and daily life snippets from Rome and beyond.',
    instaUrl: 'https://www.instagram.com/walk_with_tanim',
    partnersTitle: 'Brands & Partners I Travel With',
    partners: [
      { name: 'Agoda', logo: 'https://cdn.abacus.ai/images/5bc9d522-fa98-477f-9e18-342f75a4706d.png' },
      { name: 'Booking.com', logo: 'https://cdn.abacus.ai/images/20902489-acb7-4783-8452-aa279e4c6dbe.png' },
      { name: 'Expedia', logo: 'https://cdn.abacus.ai/images/191ef7bf-eae8-4cf6-800b-95ff59c80bb0.png' },
      { name: 'Airbnb', logo: 'https://cdn.abacus.ai/images/ca04e94e-ddb6-4b84-aa5b-ea15e0958c04.png' },
      { name: 'Nike', logo: 'https://cdn.abacus.ai/images/665cc64a-71a4-4df4-b07e-09525dc199d8.png' },
      { name: 'The North Face', logo: 'https://cdn.abacus.ai/images/27c06a45-ef53-48f0-9cf1-8c84d12b0cd3.png' },
      { name: 'Columbia', logo: 'https://cdn.abacus.ai/images/cd05d360-5d8c-408c-a996-8a6c416f330b.png' },
      { name: 'Decathlon', logo: 'https://cdn.abacus.ai/images/da3e2551-8e12-4dc8-9e53-4f8110a60c9b.png' },
      { name: 'Trek', logo: 'https://cdn.abacus.ai/images/932a8179-1b72-42d3-8d59-f1e2ecd4a6d8.png' },
      { name: 'GoPro', logo: 'https://cdn.abacus.ai/images/0b93efc0-77e5-4e6d-93d5-4ed8724392c6.png' },
    ],
  },
  gallery: {
    subtitle: 'Places that shaped who I am today — swipe through my journey',
    footerNote: 'More photos coming soon — follow me on Instagram for daily updates',
    destinations: [
      { name: 'Rome', flag: '🇮🇹', image: 'https://images.pexels.com/photos/18602876/pexels-photo-18602876/free-photo-of-colosseum-in-rome.jpeg' },
      { name: 'Vatican City', flag: '🇻🇦', image: 'https://upload.wikimedia.org/wikipedia/commons/d/d6/St_Peter%27s_Square%2C_Vatican_City_-_April_2007.jpg' },
      { name: 'Madrid', flag: '🇪🇸', image: '/destinations/madrid.jpg' },
      { name: 'Riga', flag: '🇱🇻', image: 'https://images.pexels.com/photos/37375886/pexels-photo-37375886/free-photo-of-scenic-view-of-riga-s-old-town-and-daugava-river.jpeg' },
      { name: 'Kaunas', flag: '🇱🇹', image: '/destinations/kaunas.jpg' },
      { name: 'Dhaka', flag: '🇧🇩', image: 'https://images.pexels.com/videos/33267203/4k-drone-video-dhaka-4k-drone-view-of-dhaka-city-dhaka-4k-drone-dhaka-4k-drone-footage-33267203.jpeg' },
      { name: 'Bhola', flag: '🇧🇩', image: 'https://images.pexels.com/videos/34287257/4k-4k-bangladeshi-drone-footage-4k-video-bhola-34287257.jpeg' },
      { name: 'Next Destination', flag: '✈️', image: 'https://cdn.abacus.ai/images/04fc69a5-4f9e-4fdf-aa6f-8fb51e125e7d.png' },
    ],
  },
  contact: {
    subtitle: "Have a collaboration idea, brand proposal, or just want to say hi? Let's connect!",
    email: 'zahirulislamtanim@gmail.com',
    phone: '(+39) 3921202060',
    location: 'Rome, Italy',
  },
}
