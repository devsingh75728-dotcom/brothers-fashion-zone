'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export function SaleAlertBanner() {
  return (
    <section className="border-2 border-[#0A0A0A] shadow-[6px_6px_0px_#0A0A0A] overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Left - Image */}
        <div className="w-full md:w-1/2 aspect-square md:aspect-auto relative">
          <Image
            src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80"
            alt="Sale Fashion"
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Right - Pink Section */}
        <div className="w-full md:w-1/2 bg-[#FF2D6B] p-8 md:p-12 flex flex-col items-center justify-center text-center">
          <motion.h2
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            viewport={{ once: true }}
            className="font-display font-black text-[48px] md:text-[72px] text-white leading-[0.9] tracking-[-0.03em]"
          >
            SALE ALERT
          </motion.h2>
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-white border-[3px] border-black shadow-[4px_4px_0px_#0A0A0A] px-6 py-2.5 mt-4"
          >
            <span className="font-display font-black text-lg md:text-xl uppercase text-black">
              UP TO 60% OFF
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="font-mono text-[14px] text-white/80 mt-6"
          >
            Shop before it&apos;s gone
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Link
              href="/products"
              className="inline-block bg-[#FFD600] border-2 border-black shadow-[4px_4px_0px_#0A0A0A] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#0A0A0A] transition-all duration-200 h-14 px-8 mt-6 font-display font-black text-[16px] uppercase text-black"
            >
              SHOP SALE →
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}