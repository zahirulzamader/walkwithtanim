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

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Journey />
      <Education />
      <Skills />
      <Vlog />
      <Gallery />
      <TravelJournal />
      <Contact />
      <Footer />
    </main>
  )
}
