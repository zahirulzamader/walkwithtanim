import Navbar from './components/navbar'
import Hero from './components/hero'
import About from './components/about'
import Journey from './components/journey'
import Education from './components/education'
import Skills from './components/skills'
import Vlog from './components/vlog'
import Gallery from './components/gallery'
import TravelJournal from './components/travel-journal'
import Contact from './components/contact'
import Footer from './components/footer'
import { getAllContent } from '@/lib/content/get-content'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const content = await getAllContent()
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero content={content.hero} />
      <About content={content.about} />
      <Journey content={content.journey} />
      <Education content={content.education} />
      <Skills content={content.skills} />
      <Vlog content={content.vlog} />
      <Gallery content={content.gallery} />
      <TravelJournal />
      <Contact content={content.contact} />
      <Footer />
    </main>
  )
}
