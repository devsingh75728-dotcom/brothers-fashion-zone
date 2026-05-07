'use client';

import Link from 'next/link';
import { MessageCircle } from 'lucide-react';

const YoutubeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.141c-3.濮阳3.718 0 6.726 3.834 6.726 3.834s3.008 0 6.726-.053c.97 0 1.394 0 2.003.208.86.293 1.554.969 1.783 1.614.25.698.278 1.538.278 3.042 0 1.505-.028 2.384-.278 3.082-.229.645-.923 1.321-1.783 1.614-.609.208-1.033.208-2.003.208-3.718 0-6.726-.053-6.726-.053s-3.116.053-6.726.053c-.97 0-1.394 0-2.003-.208-.86-.293-1.554-.969-1.783-1.614-.25-.698-.278-1.538-.278-3.082 0-1.504.028-2.384.278-3.082.229-.645.923-1.321 1.783-1.614.609-.208 1.033-.208 2.003-.208zm0 3.536c-3.352 0-6.068 2.716-6.068 6.068s2.716 6.068 6.068 6.068 6.068-2.716 6.068-6.068-2.716-6.068-6.068-6.068zm0 10.468c-2.456 0-4.445-1.989-4.445-4.445s1.989-4.445 4.445-4.445 4.445 1.989 4.445 4.445-1.989 4.445-4.445 4.445z"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const COMPANY_LINKS = ['About Us', 'Products', 'New Arrivals', 'Blog'];
const SUPPORT_LINKS = ['Contact Us', 'Returns & Refunds', 'Shipping Policy', 'FAQ'];
const QUICK_LINKS = ['Men', 'Women', 'Ethnic', 'Western', 'Accessories', 'Sale'];

export function Footer() {
  return (
    <footer className="bg-white border-t-4 border-black">
      <div className="h-1.5 w-full" style={{
        background: 'linear-gradient(90deg, #FF2D6B 0%, #FFD600 25%, #39FF14 50%, #6B5CE7 75%, #FF2D6B 100%)',
      }} />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h2 className="font-display font-black italic text-3xl text-black">
            BROTHER&apos;S FASHION ZONE.
          </h2>
          <div className="border-l-4 border-yellow-400 pl-4 mt-4">
            <p className="font-mono text-[13px] text-black leading-relaxed">
              The fashion store for modern India.<br />
              Shop premium, shop real.
            </p>
          </div>
          <div className="flex gap-3 mt-6">
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 border-2 border-black shadow-[3px_3px_0px_#0A0A0A] flex items-center justify-center hover:bg-yellow-400 transition-colors">
              <YoutubeIcon />
            </a>
            <a href="https://instagram.com/brothers_fashion_zone_" target="_blank" rel="noopener noreferrer" className="w-12 h-12 border-2 border-black shadow-[3px_3px_0px_#0A0A0A] flex items-center justify-center hover:bg-yellow-400 transition-colors">
              <InstagramIcon />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 border-2 border-black shadow-[3px_3px_0px_#0A0A0A] flex items-center justify-center hover:bg-yellow-400 transition-colors">
              <LinkedinIcon />
            </a>
            <a href="https://wa.me/918141001555" target="_blank" rel="noopener noreferrer" className="w-12 h-12 border-2 border-black shadow-[3px_3px_0px_#0A0A0A] flex items-center justify-center hover:bg-yellow-400 transition-colors">
              <MessageCircle size={20} className="text-black" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <span className="inline-block bg-black text-white font-display font-bold text-[11px] uppercase border-2 border-black px-3 py-1 mb-4">
              COMPANY
            </span>
            {COMPANY_LINKS.map((link) => (
              <Link key={link} href="#" className="block font-mono text-[13px] text-black py-1.5 hover:text-[#C9B99A] transition-colors">
                {link}
              </Link>
            ))}
          </div>
          <div>
            <span className="inline-block bg-black text-white font-display font-bold text-[11px] uppercase border-2 border-black px-3 py-1 mb-4">
              SUPPORT & LEGAL
            </span>
            {SUPPORT_LINKS.map((link) => (
              <Link key={link} href="#" className="block font-mono text-[13px] text-black py-1.5 hover:text-[#C9B99A] transition-colors">
                {link}
              </Link>
            ))}
          </div>
          <div>
            <span className="inline-block bg-black text-white font-display font-bold text-[11px] uppercase border-2 border-black px-3 py-1 mb-4">
              QUICK LINKS
            </span>
            {QUICK_LINKS.map((link) => (
              <Link key={link} href={`/category/${link.toLowerCase()}`} className="block font-mono text-[13px] text-black py-1.5 hover:text-[#C9B99A] transition-colors">
                {link}
              </Link>
            ))}
          </div>
          <div>
            <span className="inline-block bg-black text-white font-display font-bold text-[11px] uppercase border-2 border-black px-3 py-1 mb-4">
              CONTACT
            </span>
            <a href="mailto:brothersfashion@gmail.com" className="block font-mono text-[13px] text-black py-1.5 hover:text-[#C9B99A] transition-colors">
              brothersfashion@gmail.com
            </a>
            <a href="tel:+918141001555" className="block font-mono text-[13px] text-black py-1.5 hover:text-[#C9B99A] transition-colors">
              +91 81410 01555
            </a>
            <p className="font-mono text-[13px] text-black py-1.5">
              Mon–Sat: 10AM – 7PM
            </p>
            <a
              href="https://wa.me/918141001555"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 border-2 border-black mt-2 font-mono text-[13px]"
            >
              <MessageCircle size={16} />
              WhatsApp
            </a>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 mt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <span className="font-mono text-[11px] text-gray-400">Buy Ethnic Wear India</span>
            <span className="font-mono text-[11px] text-gray-400">Premium Kurtas Online</span>
            <span className="font-mono text-[11px] text-gray-400">Indian Fashion Store</span>
            <span className="font-mono text-[11px] text-gray-400">Ethnic Wear Delivery</span>
            <span className="font-mono text-[11px] text-gray-400">Best Sarees India</span>
            <span className="font-mono text-[11px] text-gray-400">UK Size Footwear</span>
            <span className="font-mono text-[11px] text-gray-400">Ethnic Fashion Online</span>
            <span className="font-mono text-[11px] text-gray-400">Shop Indian Clothes</span>
          </div>
        </div>

        <div className="border-t-2 border-black pt-4 mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-display font-bold text-[11px] uppercase text-black text-center md:text-left">
            © 2026 BROTHER&apos;S FASHION ZONE. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-4 font-display font-bold text-[11px] uppercase text-black">
            <Link href="/privacy" className="hover:text-[#C9B99A] transition-colors">PRIVACY</Link>
            <span className="text-gray-300">|</span>
            <Link href="/terms" className="hover:text-[#C9B99A] transition-colors">TERMS</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
