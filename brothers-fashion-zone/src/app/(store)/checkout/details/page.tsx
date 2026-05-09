'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';

const FREE_SHIPPING_THRESHOLD = 599;
const SHIPPING_COST = 49;
const PLATFORM_FEE = 10;

const schema = z.object({
  fullName: z.string().min(2, 'Enter your full name'),
  phone: z.string().min(10).max(10),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().min(5, 'Enter your address'),
  city: z.string().min(2, 'Enter city'),
  state: z.string().min(2, 'Enter state'),
  pincode: z.string().min(6).max(6),
  landmark: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function CheckoutDetailsPage() {
  const router = useRouter();
  const { items, getTotal } = useCartStore();
  
  const subtotal = getTotal();
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping + PLATFORM_FEE;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      landmark: '',
    },
  });

  const onSubmit = (data: FormValues) => {
    localStorage.setItem('bfz_checkout', JSON.stringify({
      fullName: data.fullName,
      phone: data.phone,
      email: data.email ?? '',
      address1: data.address,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      landmark: data.landmark ?? '',
    }));
    router.push('/checkout/payment');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display font-black text-3xl mb-4">YOUR CART IS EMPTY</h1>
          <Link href="/products" className="underline font-inter">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#F5F0E8', minHeight: '100vh', padding: '24px 16px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '32px' }}>
          {[
            { num: 1, label: 'CART' },
            { num: 2, label: 'DETAILS' },
            { num: 3, label: 'PAYMENT' },
          ].map((step, i) => (
            <div key={step.num} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: step.num <= 2 ? '#0A0A0A' : '#FFFFFF',
                border: `2px solid ${step.num <= 2 ? '#0A0A0A' : '#E5E5E5'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '14px', color: step.num <= 2 ? '#FFFFFF' : '#999999' }}>
                  {step.num}
                </span>
              </div>
              <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '12px', color: step.num <= 2 ? '#0A0A0A' : '#999999' }}>
                {step.label}
              </span>
              {i < 2 && <div style={{ width: '40px', height: '2px', background: '#E5E5E5', marginLeft: '8px' }} />}
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }} className="lg:grid lg:grid-cols-5">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ background: '#FFD600', border: '2px solid #0A0A0A', boxShadow: '4px 4px 0px #0A0A0A', padding: '24px', marginBottom: '16px' }}>
              <h2 style={{ fontFamily: 'Space Grotesk', fontWeight: 900, fontSize: '24px', marginBottom: '20px' }}>
                DELIVERY TO
              </h2>

              <div style={{ marginBottom: '16px' }}>
                <input
                  {...register('fullName')}
                  placeholder="Full Name"
                  style={{ width: '100%', height: '52px', border: '2px solid #0A0A0A', padding: '0 16px', fontSize: '16px', background: 'white', boxSizing: 'border-box' }}
                />
                {errors.fullName && <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px' }}>{errors.fullName.message}</p>}
              </div>

              <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
                <div style={{ width: '80px', height: '52px', border: '2px solid #0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', fontWeight: 700, fontSize: '14px', flexShrink: 0 }}>
                  +91
                </div>
                <div style={{ flex: 1 }}>
                  <input
                    {...register('phone')}
                    placeholder="Phone Number"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    style={{ width: '100%', height: '52px', border: '2px solid #0A0A0A', padding: '0 16px', fontSize: '16px', background: 'white', boxSizing: 'border-box' }}
                  />
                  {errors.phone && <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px' }}>Enter valid 10-digit number</p>}
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <input
                  {...register('email')}
                  placeholder="Email Address (Optional)"
                  type="email"
                  style={{ width: '100%', height: '52px', border: '2px solid #0A0A0A', padding: '0 16px', fontSize: '16px', background: 'white', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <input
                  {...register('address')}
                  placeholder="Address Line (House No, Street, Area)"
                  style={{ width: '100%', height: '52px', border: '2px solid #0A0A0A', padding: '0 16px', fontSize: '16px', background: 'white', boxSizing: 'border-box' }}
                />
                {errors.address && <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px' }}>{errors.address.message}</p>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
                <div>
                  <input
                    {...register('city')}
                    placeholder="City"
                    style={{ width: '100%', height: '52px', border: '2px solid #0A0A0A', padding: '0 16px', fontSize: '16px', background: 'white', boxSizing: 'border-box' }}
                  />
                  {errors.city && <p style={{ color: '#DC2626', fontSize: '11px', marginTop: '4px' }}>Enter city</p>}
                </div>
                <div>
                  <input
                    {...register('state')}
                    placeholder="State"
                    style={{ width: '100%', height: '52px', border: '2px solid #0A0A0A', padding: '0 16px', fontSize: '16px', background: 'white', boxSizing: 'border-box' }}
                  />
                  {errors.state && <p style={{ color: '#DC2626', fontSize: '11px', marginTop: '4px' }}>Enter state</p>}
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <input
                  {...register('pincode')}
                  placeholder="Pincode"
                  type="tel"
                  inputMode="numeric"
                  maxLength={6}
                  style={{ width: '100%', height: '52px', border: '2px solid #0A0A0A', padding: '0 16px', fontSize: '16px', background: 'white', boxSizing: 'border-box' }}
                />
                {errors.pincode && <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px' }}>Enter 6-digit pincode</p>}
              </div>

              <div style={{ marginBottom: '16px' }}>
                <input
                  {...register('landmark')}
                  placeholder="Landmark (Optional)"
                  style={{ width: '100%', height: '52px', border: '2px solid #0A0A0A', padding: '0 16px', fontSize: '16px', background: 'white', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <button
              type="submit"
              style={{ width: '100%', height: '56px', background: '#0A0A0A', color: 'white', border: '2px solid #0A0A0A', boxShadow: '4px 4px 0px #0A0A0A', fontFamily: 'Space Grotesk', fontWeight: 900, fontSize: '16px', cursor: 'pointer', letterSpacing: '1px' }}
            >
              PROCEED TO PAYMENT →
            </button>
          </form>

          <div style={{ background: 'white', border: '2px solid #0A0A0A', boxShadow: '4px 4px 0px #0A0A0A', padding: '24px', position: 'sticky', top: '24px', height: 'fit-content' }}>
            <h2 style={{ fontFamily: 'Space Grotesk', fontWeight: 900, fontSize: '24px', marginBottom: '20px' }}>
              ORDER SUMMARY
            </h2>
            
            <div style={{ marginBottom: '16px' }}>
              {items.map((item) => (
                <div key={`${item.id}-${item.variant.size}`} style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ position: 'relative', width: '64px', height: '64px', border: '2px solid #0A0A0A', flexShrink: 0 }}>
                    <Image
                      src={item.image || '/placeholder.jpg'}
                      alt={item.name}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                    <span style={{ position: 'absolute', top: '-8px', right: '-8px', width: '20px', height: '20px', background: '#6B5CE7', color: 'white', fontSize: '10px', fontFamily: 'Space Grotesk', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #0A0A0A' }}>
                      {item.quantity}
                    </span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                    <p style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', color: '#666' }}>{item.variant.size}</p>
                  </div>
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: '14px' }}>₹{item.price.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '2px dashed #0A0A0A', margin: '16px 0' }} />

            <div style={{ fontFamily: 'JetBrains Mono', fontSize: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Shipping</span>
                {shipping === 0 ? (
                  <span style={{ color: '#39FF14', fontWeight: 'bold' }}>FREE</span>
                ) : (
                  <span>₹{shipping}</span>
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Platform Fee</span>
                <span>₹{PLATFORM_FEE}</span>
              </div>
            </div>

            <div style={{ borderTop: '2px solid #0A0A0A', marginTop: '16px', paddingTop: '16px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'Space Grotesk', fontWeight: 900, fontSize: '20px' }}>TOTAL</span>
              <span style={{ fontFamily: 'Space Grotesk', fontWeight: 900, fontSize: '24px' }}>₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}