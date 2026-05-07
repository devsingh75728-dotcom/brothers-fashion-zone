'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const REVIEWS = [
  { id: 1, name: 'Priya S.', city: 'Mumbai', avatar: '#C9B99A', title: 'Amazing Quality!', body: 'The kurta fits perfectly. Fabric is premium quality, stitching is neat. Delivered in 3 days. Will order again!', product: 'Men\'s Cotton Kurta', stars: 5, date: '15 Dec 2025', verified: true },
  { id: 2, name: 'Rahul M.', city: 'Delhi', avatar: '#1A1A1A', title: 'Best Online Shopping Experience', body: 'Customer service was responsive. The sneakers look exactly like the photos. Sizing was accurate. Highly recommend.', product: 'Running Sneakers', stars: 5, date: '12 Dec 2025', verified: true },
  { id: 3, name: 'Ananya K.', city: 'Bangalore', avatar: '#6B7280', title: 'Love the Collection', body: 'Found the perfect saree for my sister\'s wedding. The color is vibrant and the border work is detailed. Price is very competitive.', product: 'Silk Saree', stars: 5, date: '10 Dec 2025', verified: true },
  { id: 4, name: 'Vikram P.', city: 'Hyderabad', avatar: '#92400E', title: 'Great Value for Money', body: 'Bought formal shirts, quality exceeds expectations. Fabric is breathable, perfect for office wear. Free delivery was a bonus.', product: 'Formal Shirts Set', stars: 4, date: '8 Dec 2025', verified: true },
  { id: 5, name: 'Sneha R.', city: 'Chennai', avatar: '#1E3A5F', title: 'Quick Delivery, Nice Packaging', body: 'Ordered for my brother\'s birthday. The watch arrived in a beautiful gift box. He loved it! UPI payment was seamless.', product: 'Leather Watch', stars: 5, date: '5 Dec 2025', verified: true },
  { id: 6, name: 'Arjun T.', city: 'Pune', avatar: '#4A1D4A', title: 'Good Fit', body: 'The jeans are comfortable and stylish. The stretch fabric is great for daily wear. Waist size was accurate to size chart.', product: 'Slim Fit Jeans', stars: 4, date: '3 Dec 2025', verified: true },
  { id: 7, name: 'Meera L.', city: 'Kolkata', avatar: '#C9B99A', title: 'Beautiful Ethnic Wear', body: 'The anarkali suit is stunning. The dupatta has lovely embroidery. Perfect for festive occasions. My mom loved it!', product: 'Anarkali Suit', stars: 5, date: '1 Dec 2025', verified: true },
  { id: 8, name: 'Rohan D.', city: 'Ahmedabad', avatar: '#1A1A1A', title: 'Reliable Store', body: 'Ordered footwear, genuine product as described. No compromise on quality. WhatsApp support was helpful for tracking.', product: 'Casual Sandals', stars: 4, date: '28 Nov 2025', verified: true },
  { id: 9, name: 'Kavya N.', city: 'Jaipur', avatar: '#6B7280', title: 'Perfect for Gifting', body: 'Bought a handbag for my friend\'s birthday. The leather quality is premium. The compartments are well designed. Beautiful piece!', product: 'Leather Handbag', stars: 5, date: '25 Nov 2025', verified: true },
  { id: 10, name: 'Amit S.', city: 'Lucknow', avatar: '#92400E', title: 'Value Packed Deals', body: 'The combo offer on shirts and trousers is unbeatable. Quality is consistent across all items. Will shop again for sure!', product: 'Formal Combo Pack', stars: 4, date: '22 Nov 2025', verified: true },
];

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#FFD600" stroke="#FFD600" strokeWidth="2">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export function ReviewsSection() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % REVIEWS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const cols = typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : 3;

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12">
          <div>
            <p className="font-inter text-[11px] text-[#C9B99A] uppercase tracking-widest mb-3">CUSTOMER REVIEWS</p>
            <h2 className="font-serif text-[44px] text-[#1A1A1A]">What Our Customers Say</h2>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <p className="font-serif text-[56px] text-[#1A1A1A]">4.8</p>
            <div className="flex gap-1 justify-end mb-1">
              {[...Array(5)].map((_, i) => <StarIcon key={i} />)}
            </div>
            <p className="font-inter text-[13px] text-gray-500">Based on 2,400+ reviews</p>
          </div>
        </div>

        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[0, 1, 2].map((offset) => {
              const review = REVIEWS[(current + offset) % REVIEWS.length];
              return (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: offset * 0.1 }}
                  className="bg-white border border-[#E8E8E8] rounded-xl p-7 shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: review.avatar }}
                    >
                      <span className="font-inter text-[16px] font-semibold text-white">
                        {review.name.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-inter text-[14px] font-semibold">{review.name}</p>
                      <p className="font-inter text-[12px] text-gray-500">{review.city}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex gap-0.5">
                      {[...Array(review.stars)].map((_, i) => <StarIcon key={i} />)}
                    </div>
                    <span className="font-inter text-[11px] text-gray-400 ml-auto">{review.date}</span>
                  </div>
                  <p className="font-inter text-[14px] font-semibold mb-2">{review.title}</p>
                  <p className="font-inter text-[13px] text-[#444] leading-relaxed line-clamp-4">{review.body}</p>
                  {review.verified && (
                    <div className="mt-4 flex items-center justify-between">
                      <span className="font-inter text-[11px] px-3 py-1 bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0] rounded-full">
                        Verified Purchase
                      </span>
                      <span className="font-inter text-[11px] text-gray-400 italic">{review.product}</span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          <div className="flex justify-center gap-2 mt-8">
            {REVIEWS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="h-2 rounded-full bg-gray-200 transition-all overflow-hidden"
                style={{ width: i === current ? '24px' : '8px' }}
              >
                <motion.div
                  animate={{ width: i === current ? '100%' : '0%' }}
                  transition={{ duration: 0.3 }}
                  className="h-full bg-[#C9B99A]"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}