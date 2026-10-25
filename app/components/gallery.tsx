'use client'

import { useState, useEffect } from 'react'
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
  type CarouselApi,
} from '@/components/ui/carousel'
import { defaultContent, type GalleryContent } from '@/lib/content/defaults'

export default function Gallery({ content }: { content?: GalleryContent }) {
  const c = content ?? defaultContent.gallery
  const destinations = c.destinations
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 })
  const [api, setApi] = useState<CarouselApi>()

  useEffect(() => {
    if (!api) return
    const id = setInterval(() => api.scrollNext(), 3500)
    return () => clearInterval(id)
  }, [api])

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
            {c.subtitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Carousel setApi={setApi} opts={{ loop: true, align: 'start' }} className="w-full">
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
            {c.footerNote}
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
