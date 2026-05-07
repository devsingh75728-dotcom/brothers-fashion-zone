'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Video, Upload, Plus, X, Play, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';

interface VideoItem {
  id: string;
  url: string;
  type: string;
  section: string;
  thumbnail?: string;
  created_at: string;
}

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInstagramModal, setShowInstagramModal] = useState(false);
  const [instagramUrl, setInstagramUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('store_videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setVideos([]);
        return;
      }
      setVideos(data || []);
    } catch (err) {
      console.warn('Could not load videos');
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleInstagramImport = async () => {
    if (!instagramUrl.trim()) {
      toast.error('Please enter an Instagram URL');
      return;
    }

    try {
      const { error } = await supabase
        .from('store_videos')
        .insert({
          url: instagramUrl,
          type: 'instagram_embed',
          section: 'homepage_strip',
        });

      if (error) throw error;
      
      toast.success('Instagram video imported!');
      setInstagramUrl('');
      setShowInstagramModal(false);
      fetchVideos();
    } catch (err: any) {
      toast.error(err.message || 'Failed to import video');
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      for (const file of files) {
        const fileName = `${Date.now()}-${file.name}`;
        
        const { error: uploadError } = await supabase.storage
          .from('videos')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('videos')
          .getPublicUrl(fileName);

        const { error: insertError } = await supabase
          .from('store_videos')
          .insert({
            url: publicUrl,
            type: 'upload',
            section: 'homepage_strip',
          });

        if (insertError) throw insertError;
      }

      toast.success('Video uploaded successfully!');
      fetchVideos();
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload video');
    } finally {
      setUploading(false);
    }
  };

  const deleteVideo = async (id: string) => {
    if (!confirm('Delete this video?')) return;
    
    try {
      await supabase.from('store_videos').delete().eq('id', id);
      setVideos(videos.filter(v => v.id !== id));
      toast.success('Video deleted');
    } catch (err) {
      toast.error('Failed to delete video');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display font-semibold text-[28px] text-white">Videos</h1>
          <p className="text-white/40 font-inter text-[13px] mt-1">{videos.length} videos</p>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={() => setShowInstagramModal(true)}
            className="flex items-center gap-2 h-10 px-4 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white rounded-lg font-inter text-[13px] hover:opacity-90 transition-opacity"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            Import from Instagram
          </button>
          <label className="flex items-center gap-2 h-10 px-4 bg-[#C9B99A] text-[#0A0A0A] rounded-lg font-inter text-[14px] font-semibold cursor-pointer hover:bg-[#B8A88A] transition-colors">
            <Upload size={14} />
            Upload Video
            <input 
              type="file" 
              accept="video/mp4,video/webm,video/mov" 
              className="hidden"
              onChange={handleVideoUpload}
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {/* Upload Zone */}
      <div className="border-2 border-dashed border-[#222] rounded-xl bg-[#111111] p-8 text-center hover:border-[#C9B99A] transition-colors cursor-pointer">
        <Video size={32} className="mx-auto text-white/20" />
        <p className="text-white/40 font-inter text-sm mt-2">Drag and drop videos here</p>
        <p className="text-white/25 font-inter text-xs mt-1">or click Upload Video button above</p>
        <p className="text-white/20 font-inter text-[11px] mt-2">MP4, WEBM, MOV • Max 100MB</p>
      </div>

      {/* Videos Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#C9C9C9] border-t-transparent rounded-full animate-spin" style={{ borderRadius: '0 !important' }} />
        </div>
      ) : videos.length === 0 ? (
        <div className="bg-[#111111] border border-[#1A1A1A] rounded-xl py-20 text-center">
          <Video size={48} className="mx-auto text-white/10" />
          <h3 className="text-white/60 font-display text-[24px] mt-4">No videos yet</h3>
          <p className="text-white/30 font-inter text-[14px] mt-2">Upload videos or import from Instagram</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((video) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#111111] border border-[#1A1A1A] rounded-xl overflow-hidden group"
            >
              <div className="aspect-video bg-[#0A0A0A] relative">
                {video.type === 'instagram_embed' ? (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#833AB4]/20 via-[#FD1D1D]/20 to-[#F77737]/20">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-white/40"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                  </div>
                ) : (
                  <video src={video.url} className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play size={40} className="text-white" />
                </div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-white font-inter text-[13px]">
                    {video.type === 'instagram_embed' ? 'Instagram Embed' : 'Uploaded Video'}
                  </p>
                  <p className="text-white/40 font-inter text-[11px] mt-1">{video.section}</p>
                </div>
                <button 
                  onClick={() => deleteVideo(video.id)}
                  className="w-8 h-8 flex items-center justify-center rounded border border-[#222] text-white/40 hover:text-[#DC2626] hover:border-[#DC2626] transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Instagram Import Modal */}
      {showInstagramModal && (
        <div className="fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowInstagramModal(false)} />
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-[#111111] border-l border-[#1A1A1A] p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-display text-xl">Import from Instagram</h2>
              <button onClick={() => setShowInstagramModal(false)} className="w-9 h-9 bg-[#1A1A1A] rounded-lg flex items-center justify-center">
                <X size={16} className="text-white" />
              </button>
            </div>
            
            <div className="space-y-4">
              <input
                type="url"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                placeholder="https://www.instagram.com/reel/..."
                className="w-full h-12 bg-[#0A0A0A] border border-[#222] rounded-lg px-4 text-white font-inter text-sm focus:border-[#C9B99A] focus:outline-none"
              />
              
              <p className="text-white/40 font-mono text-[12px]">
                Enter your Instagram post/reel URL. We&apos;ll embed it on your homepage.
              </p>

              <button
                onClick={handleInstagramImport}
                className="w-full h-12 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white font-inter font-semibold rounded-lg hover:opacity-90 transition-opacity"
              >
                Import Video
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}