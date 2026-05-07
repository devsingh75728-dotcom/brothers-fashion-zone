'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const CATEGORIES = [
  { label: 'Footwear', emoji: '👟', slug: 'footwear' },
  { label: 'Women', emoji: '👗', slug: 'women' },
  { label: 'Men', emoji: '👔', slug: 'men' },
  { label: 'Kids', emoji: '👶', slug: 'kids' },
  { label: 'Watches', emoji: '⌚', slug: 'watches' },
  { label: 'Bags', emoji: '👜', slug: 'bags' },
  { label: 'Accessories', emoji: '💍', slug: 'accessories' },
  { label: 'Sale', emoji: '🏷️', slug: 'sale' },
  { label: 'New In', emoji: '✨', slug: 'new' },
];

export function CategoryCircles() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin-slow {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      .animate-spin-slow {
        animation: spin-slow 3s linear infinite;
      }
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  return (
    <section className="bg-white border-b border-gray-200 py-6 overflow-hidden">
      <div
        ref={ref}
        className="flex gap-6 px-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {CATEGORIES.map((cat, idx) => (
          <motion.div
            key={cat.slug}
            initial={{ scale: 0, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
            transition={{
              delay: idx * 0.08,
              type: 'spring',
              stiffness: 200,
              damping: 15,
            }}
            className="flex-shrink-0 snap-start"
          >
            <Link href={`/category/${cat.slug}`} className="group flex flex-col items-center gap-2">
              <div className="relative w-[72px] h-[72px] rounded-full border-2 border-gray-200 overflow-hidden flex items-center justify-center bg-gray-50 transition-all duration-300 group-hover:border-[#C9B99A] group-active:border-[#C9B99A] group-active:border-[3px]">
                <span className="text-3xl">{cat.emoji}</span>
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#C9B99A] opacity-0 group-hover:opacity-100 animate-spin-slow" style={{ animationDuration: '3s' }} />
              </div>
              <span className="text-[11px] text-gray-500 group-hover:text-[#1A1A1A] transition-colors whitespace-nowrap font-inter">
                {cat.label}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
