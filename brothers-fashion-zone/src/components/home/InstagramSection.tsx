'use client';

import { motion } from 'framer-motion';

const InstagramIcon = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.141c-3.718 0-6.726 3.008-6.726 6.726 0 3.719 3.008 6.726 6.726 6.726s6.726-3.007 6.726-6.726c0-3.718-3.008-6.726-6.726-6.726zm0 10.468c-2.456 0-4.445-1.989-4.445-4.445s1.989-4.445 4.445-4.445 4.445 1.989 4.445 4.445-1.989 4.445-4.445 4.445zm6.726-11.616c0 2.456-1.989 4.445-4.445 4.445s-4.445-1.989-4.445-4.445 1.989-4.445 4.445-4.445 4.445 1.989 4.445 4.445z"/>
  </svg>
);

export function InstagramSection() {
  return (
    <section className="bg-[#0A0A0A] py-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Profile Card */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-[#0A0A0A] border-2 border-[#0A0A0A] shadow-[6px_6px_0px_#0A0A0A] p-8"
        >
          {/* Profile Section */}
          <div className="flex items-center gap-5 mb-6">
            {/* Logo Circle */}
            <div className="w-[72px] h-[72px] rounded-full border-[3px] border-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] bg-[#C9B99A] flex items-center justify-center flex-shrink-0 overflow-hidden">
              <span className="font-display font-black text-[24px] text-[#0A0A0A]">B</span>
            </div>
            <div>
              <p className="font-display font-black text-[18px] text-white">@brothers_fashion_zone_</p>
              <p className="text-[14px] text-white/60 mt-1">Brother&apos;s Fashion Zone</p>
              <p className="font-mono text-[12px] text-white/40 mt-1">Clothing (brand) • 🇮🇳 All over India delivery</p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex border-y-2 border-white/10 py-5 my-5">
            <div className="flex-1 text-center border-r border-white/10">
              <p className="font-display font-black text-[32px] text-white">443</p>
              <p className="font-mono text-[11px] text-white/40 uppercase tracking-wide mt-1">Posts</p>
            </div>
            <div className="flex-1 text-center border-r border-white/10">
              <p className="font-display font-black text-[32px] text-[#C9B99A]">535</p>
              <p className="font-mono text-[11px] text-white/40 uppercase tracking-wide mt-1">Followers</p>
            </div>
            <div className="flex-1 text-center">
              <p className="font-display font-black text-[32px] text-white">1</p>
              <p className="font-mono text-[11px] text-white/40 uppercase tracking-wide mt-1">Following</p>
            </div>
          </div>

          {/* Follow Button */}
          <a
            href="https://www.instagram.com/brothers_fashion_zone_"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-[52px] bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] border-2 border-[#0A0A0A] shadow-[4px_4px_0px_#0A0A0A] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#0A0A0A] transition-all duration-200 flex items-center justify-center gap-2.5"
          >
            <InstagramIcon size={20} className="text-white" />
            <span className="font-display font-black text-[14px] uppercase text-white">FOLLOW ON INSTAGRAM</span>
          </a>
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="flex justify-center mt-6"
        >
          <button
            onClick={() => window.open('https://www.instagram.com/brothers_fashion_zone_', '_blank')}
            className="bg-transparent border-2 border-white/20 shadow-[4px_4px_0px_#0A0A0A] hover:bg-white/10 hover:shadow-[6px_6px_0px_#0A0A0A] transition-all duration-200 h-12 px-8 font-display font-black text-[14px] uppercase text-white"
          >
            VIEW ALL POSTS ON INSTAGRAM →
          </button>
        </motion.div>

        {/* Hashtags */}
        <div className="flex justify-center gap-2 mt-8 flex-wrap">
          <span className="font-mono text-[12px] text-[#C9B99A]">#BrothersFashionZone</span>
          <span className="text-white/30">•</span>
          <span className="font-mono text-[12px] text-[#C9B99A]">#EthnicWear</span>
          <span className="text-white/30">•</span>
          <span className="font-mono text-[12px] text-[#C9B99A]">#PremiumFashion</span>
          <span className="text-white/30">•</span>
          <span className="font-mono text-[12px] text-[#C9B99A]">#IndianFashion</span>
        </div>
      </div>
    </section>
  );
}