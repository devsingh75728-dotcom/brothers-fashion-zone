'use client';

import { motion } from 'framer-motion';
import { GraduationCap, Users, Leaf, Sparkles } from 'lucide-react';

const GUIDES = [
  { badge: 'BEGINNER', badgeBg: '#6B5CE7', icon: GraduationCap, title: 'How to Shop in India', sub: 'Complete guide for beginners' },
  { badge: 'TOP PICKS', badgeBg: '#FF2D6B', icon: Users, title: 'Best Fashion Stores Online', sub: 'Our handpicked verification' },
  { badge: 'STYLING', badgeBg: '#39FF14', icon: Leaf, title: 'Ethnic Wear Style Guide', sub: 'Traditional meets modern' },
  { badge: 'STYLE GUIDE', badgeBg: '#6B5CE7', icon: Sparkles, title: 'Western Fashion Trends', sub: 'Current season must-haves' },
];

export function GuidesSection() {
  return (
    <section className="bg-yellow-400 border-b-2 border-black py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-display font-black text-3xl md:text-4xl lg:text-5xl text-black leading-[0.95]">
          LEARN TO SHOP LIKE A PRO
        </h2>
        <p className="font-mono text-[14px] text-black mt-3">
          Expert guides for shoppers and style lovers
        </p>
        <button className="bg-transparent border-2 border-black shadow-[4px_4px_0px_#0A0A0A] hover:bg-black hover:text-white hover:shadow-[2px_2px_0px_#0A0A0A] transition-all duration-200 h-12 px-6 font-display font-bold text-[13px] uppercase text-black mt-5">
          VIEW ALL GUIDES →
        </button>

        <div className="flex flex-col gap-3 mt-8">
          {GUIDES.map((guide, idx) => (
            <motion.div
              key={guide.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              viewport={{ once: true }}
              className="bg-white border-2 border-black shadow-[3px_3px_0px_#0A0A0A] p-5 flex items-start gap-4 hover:-translate-y-1 hover:shadow-[5px_5px_0px_#0A0A0A] transition-all duration-250 cursor-pointer"
            >
              <guide.icon size={24} style={{ color: guide.badgeBg }} />
              <div className="flex-1">
                <span
                  className={`inline-block border-2 border-black px-2 py-0.5 text-[10px] font-display font-bold uppercase mb-2 ${guide.badgeBg === '#39FF14' ? 'text-black' : 'text-white'}`}
                  style={{ backgroundColor: guide.badgeBg }}
                >
                  {guide.badge}
                </span>
                <h3 className="font-display font-black text-[16px] uppercase text-black">
                  {guide.title}
                </h3>
                <p className="font-mono text-[12px] text-gray-500 mt-1">
                  {guide.sub}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
