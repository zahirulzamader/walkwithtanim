'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import { Instagram } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel'

const destinations = [
  {
    name: 'Rome',
    flag: '🇮🇹',
    image: 'https://images.pexels.com/photos/18602876/pexels-photo-18602876/free-photo-of-colosseum-in-rome.jpeg',
  },
  {
    name: 'Vatican City',
    flag: '🇻🇦',
    image: 'https://upload.wikimedia.org/wikipedia/commons/d/d6/St_Peter%27s_Square%2C_Vatican_City_-_April_2007.jpg',
  },
  {
    name: 'Madrid',
    flag: '🇪🇸',
    image: '/destinations/madrid.jpg',
  },
  {
    name: 'Riga',
    flag: '🇱🇻',
    image: 'https://images.pexels.com/photos/37375886/pexels-photo-37375886/free-photo-of-scenic-view-of-riga-s-old-town-and-daugava-river.jpeg',
  },
  {
    name: 'Kaunas',
    flag: '🇱🇹',
    image: '/destinations/kaunas.jpg',
  },
  {
    name: 'Dhaka',
    flag: '🇧🇩',
    image: 'https://images.pexels.com/videos/33267203/4k-drone-video-dhaka-4k-drone-view-of-dhaka-city-dhaka-4k-drone-dhaka-4k-drone-footage-33267203.jpeg',
  },
  {
    name: 'Bhola',
    flag: '🇧🇩',
    image: 'https://images.pexels.com/videos/34287257/4k-4k-bangladeshi-drone-footage-4k-video-bhola-34287257.jpeg',
  },
  {
    name: 'Next Destination',
    flag: '✈️',
    image: 'https://cdn.abacus.ai/images/04fc69a5-4f9e-4fdf-aa6f-8fb51e125e7d.png',
  },
]

export default function Gallery() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 })

  return (
    <section id="gallery" className="py-20 sm:py-32">
      <div ref={ref} className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
            My <span className="text-primary">World</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Places that shaped who I am today — swipe through my journey
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Carousel opts={{ loop: true, align: 'start' }} className="w-full">
            <CarouselContent className="-ml-4">
              {destinations.map((dest) => (
                <CarouselItem key={dest.name} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                  <div
                    className="relative aspect-[16/10] rounded-xl overflow-hidden group bg-muted"
                    style={{ boxShadow: 'var(--shadow-md)' }}
                  >
                    <Image
                      src={dest.image}
                      alt={`${dest.name} cityscape`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{dest.flag}</span>
                        <h3 className="font-display text-lg font-bold text-white">{dest.name}</h3>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 sm:-left-5 bg-background/80 backdrop-blur border-border text-foreground hover:bg-primary hover:text-primary-foreground" />
            <CarouselNext className="right-2 sm:-right-5 bg-background/80 backdrop-blur border-border text-foreground hover:bg-primary hover:text-primary-foreground" />
          </Carousel>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground text-sm mb-4">
            More photos coming soon — follow me on Instagram for daily updates
          </p>
          <Button asChild variant="outline" className="border-pink-500/50 text-pink-400 hover:bg-pink-500/10">
            <a href="https://www.instagram.com/walk_with_tanim" target="_blank" rel="noopener noreferrer">
              <Instagram size={16} className="mr-2" /> Follow on Instagram
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
