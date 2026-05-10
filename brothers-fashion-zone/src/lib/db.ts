import { db } from './firebase'
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'

export async function addProduct(data: any) {
  const ref = collection(db, 'products')
  const docRef = await addDoc(ref, {
    ...data,
    createdAt: serverTimestamp(),
  })
  return docRef.id
}

export async function getProducts(category?: string) {
  const ref = collection(db, 'products')
  const q = category
    ? query(ref, where('category', '==', category), where('isActive', '==', true))
    : query(ref, where('isActive', '==', true))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function getProductBySlug(slug: string) {
  const ref = collection(db, 'products')
  const q = query(ref, where('slug', '==', slug))
  const snap = await getDocs(q)
  if (snap.empty) return null
  const doc = snap.docs[0]
  return { id: doc.id, ...doc.data() }
}

export async function getFeaturedProducts() {
  const ref = collection(db, 'products')
  const q = query(ref, where('isFeatured', '==', true), where('isActive', '==', true))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function updateProduct(id: string, data: any) {
  const ref = doc(db, 'products', id)
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() })
}

export async function deleteProduct(id: string) {
  const ref = doc(db, 'products', id)
  await deleteDoc(ref)
}

export async function addCategory(data: any) {
  const ref = collection(db, 'categories')
  await addDoc(ref, { ...data, createdAt: serverTimestamp() })
}

export async function getCategories() {
  const ref = collection(db, 'categories')
  const snap = await getDocs(ref)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function updateCategory(id: string, data: any) {
  const ref = doc(db, 'categories', id)
  await updateDoc(ref, data)
}

export async function deleteCategory(id: string) {
  const ref = doc(db, 'categories', id)
  await deleteDoc(ref)
}

export async function addBrand(data: any) {
  const ref = collection(db, 'brands')
  await addDoc(ref, { ...data, createdAt: serverTimestamp() })
}

export async function getBrands() {
  const ref = collection(db, 'brands')
  const snap = await getDocs(ref)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function updateBrand(id: string, data: any) {
  const ref = doc(db, 'brands', id)
  await updateDoc(ref, data)
}

export async function deleteBrand(id: string) {
  const ref = doc(db, 'brands', id)
  await deleteDoc(ref)
}

export async function addBanner(data: any) {
  const ref = collection(db, 'banners')
  await addDoc(ref, { ...data, createdAt: serverTimestamp() })
}

export async function getBanners() {
  const ref = collection(db, 'banners')
  const snap = await getDocs(ref)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function updateBanner(id: string, data: any) {
  const ref = doc(db, 'banners', id)
  await updateDoc(ref, data)
}

export async function deleteBanner(id: string) {
  const ref = doc(db, 'banners', id)
  await deleteDoc(ref)
}

export async function addReel(data: any) {
  const ref = collection(db, 'reels')
  await addDoc(ref, { ...data, createdAt: serverTimestamp() })
}

export async function getReels() {
  const ref = collection(db, 'reels')
  const snap = await getDocs(ref)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function updateReel(id: string, data: any) {
  const ref = doc(db, 'reels', id)
  await updateDoc(ref, data)
}

export async function deleteReel(id: string) {
  const ref = doc(db, 'reels', id)
  await deleteDoc(ref)
}

export async function addVideo(data: any) {
  const ref = collection(db, 'videos')
  await addDoc(ref, { ...data, createdAt: serverTimestamp() })
}

export async function getVideos() {
  const ref = collection(db, 'videos')
  const snap = await getDocs(ref)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function deleteVideo(id: string) {
  const ref = doc(db, 'videos', id)
  await deleteDoc(ref)
}

export async function addOrder(data: any) {
  const ref = collection(db, 'orders')
  const docRef = await addDoc(ref, { ...data, createdAt: serverTimestamp() })
  return docRef.id
}

export async function getOrders() {
  const ref = collection(db, 'orders')
  const q = query(ref, orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function updateOrderStatus(id: string, status: string) {
  const ref = doc(db, 'orders', id)
  await updateDoc(ref, { orderStatus: status })
}

export async function updateOrder(id: string, data: any) {
  const ref = doc(db, 'orders', id)
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() })
}

export async function addContactMessage(data: any) {
  const ref = collection(db, 'contact_messages')
  await addDoc(ref, { ...data, createdAt: serverTimestamp() })
}

export async function getContactMessages() {
  const ref = collection(db, 'contact_messages')
  const q = query(ref, orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function addCoupon(data: any) {
  const ref = collection(db, 'coupons')
  await addDoc(ref, { ...data, createdAt: serverTimestamp() })
}

export async function getCoupons() {
  const ref = collection(db, 'coupons')
  const snap = await getDocs(ref)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function updateCoupon(id: string, data: any) {
  const ref = doc(db, 'coupons', id)
  await updateDoc(ref, data)
}

export async function deleteCoupon(id: string) {
  const ref = doc(db, 'coupons', id)
  await deleteDoc(ref)
}

export async function getSetting(key: string): Promise<string | null> {
  const ref = doc(db, 'settings', key)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  return snap.data()?.value
}

export async function setSetting(key: string, value: string) {
  const ref = doc(db, 'settings', key)
  await updateDoc(ref, { value, updatedAt: serverTimestamp() })
}