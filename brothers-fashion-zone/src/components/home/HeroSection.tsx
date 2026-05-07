'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const bannerSlides = [
  {
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1400&q=80',
    title: 'WEAR THE STYLE.',
    subtitle: 'Premium Fashion • Delivered Across India',
  },
  {
    image: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=1400&q=80',
    title: 'ELEGANCE REDEFINED.',
    subtitle: 'Finest Ethnic Wear for Every Occasion',
  },
  {
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400&q=80',
    title: 'FESTIVE COLLECTION.',
    subtitle: 'Celebrate Tradition with Modern Flair',
  },
  {
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1400&q=80',
    title: 'WINTER ESSENTIALS.',
    subtitle: 'Premium Jackets & Coats for the Season',
  },
  {
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80',
    title: 'SUMMER VIBES.',
    subtitle: 'Light & Breezy Styles for Sunny Days',
  },
];

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  return (
    <section 
      className="relative overflow-hidden min-h-[85vh] flex items-center"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Banner Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <Image
            src={bannerSlides[currentSlide].image}
            alt="Fashion Banner"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/30" />
        </motion.div>
      </AnimatePresence>

      {/* Left Arrow */}
      <motion.button
        whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.25)' }}
        whileTap={{ scale: 0.95 }}
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 flex items-center justify-center z-10 hidden md:flex"
      >
        <ChevronLeft size={24} className="text-white" />
      </motion.button>

      {/* Right Arrow */}
      <motion.button
        whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.25)' }}
        whileTap={{ scale: 0.95 }}
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 flex items-center justify-center z-10 hidden md:flex"
      >
        <ChevronRight size={24} className="text-white" />
      </motion.button>

      {/* Content */}
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-8 relative z-10">
        <div className="max-w-4xl">
          {/* Tag Pill */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block border-2 border-white bg-black/50 backdrop-blur-sm px-4 py-1.5 mb-6"
          >
            <span className="font-display font-bold text-[11px] uppercase tracking-widest text-white">
              INDIA&apos;S PREMIUM FASHION STORE
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h1 className="font-display font-black text-5xl md:text-7xl lg:text-8xl text-white leading-[0.88] tracking-[-0.03em]">
              {bannerSlides[currentSlide].title}
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="inline-block border-2 border-white bg-black/50 backdrop-blur-sm px-4 py-2 mt-5"
          >
            <span className="font-display font-bold text-[13px] text-white">
              {bannerSlides[currentSlide].subtitle}
            </span>
          </motion.div>

          {/* Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 flex flex-col md:flex-row gap-3"
          >
            <Link
              href="/products"
              className="bg-yellow-400 border-2 border-black shadow-[4px_4px_0px_#0A0A0A] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#0A0A0A] transition-all duration-200 h-14 px-8 flex items-center justify-center"
            >
              <span className="font-display font-black text-[16px] uppercase text-black">
                SHOP NOW
              </span>
            </Link>
            <Link
              href="/products"
              className="bg-white/90 backdrop-blur-sm border-2 border-white/30 shadow-[4px_4px_0px_#0A0A0A] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#0A0A0A] transition-all duration-200 h-14 px-8 flex items-center justify-center"
            >
              <span className="font-display font-bold text-[16px] uppercase text-black">
                VIEW COLLECTION
              </span>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Dot Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        {bannerSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className="relative"
          >
            <motion.div
              animate={{
                width: currentSlide === index ? 24 : 8,
              }}
              className={`h-2 rounded-full ${currentSlide === index ? 'bg-white' : 'bg-white/40'}`}
              transition={{ duration: 0.3 }}
            />
          </button>
        ))}
      </div>
    </section>
  );
}