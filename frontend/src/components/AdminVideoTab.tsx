import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Video, Save, Upload, AlertCircle } from 'lucide-react';

export default function AdminVideoTab() {
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    setIsLoading(true);
    fetch('/api/settings/backgroundVideoUrl')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.value) {
          setVideoUrl(data.value);
        }
      })
      .catch((err) => console.error('Tải URL video thất bại', err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Video quá lớn. Giới hạn là 50MB.' });
        return;
      }
      setMessage(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/settings/backgroundVideoUrl', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: videoUrl }),
      });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Cập nhật video thành công!' });
      } else {
        setMessage({ type: 'error', text: 'Cập nhật video thất bại.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Lỗi mạng khi lưu video.' });
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return <div className="text-cyan-500 p-8 text-center animate-pulse">Đang tải cấu hình video...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#0a0a0f] p-6 md:p-8 rounded-2xl border border-cyan-900/40 shadow-[0_8px_32px_rgba(8,145,178,0.1)] relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-cyan-950/50 rounded-xl border border-cyan-800/50">
          <Video className="text-cyan-400" size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-fantasy font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
            Video Hình Nền
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Cấu hình video nền lặp lại cho giao diện chính. (Tối đa 50MB)
          </p>
        </div>
      </div>

      <div className="space-y-6 max-w-2xl">
        {message && (
          <div
            className={`p-4 rounded-xl flex items-center gap-3 ${
              message.type === 'success'
                ? 'bg-green-950/30 text-green-400 border border-green-900/50'
                : 'bg-red-950/30 text-red-400 border border-red-900/50'
            }`}
          >
            <AlertCircle size={20} />
            <span className="text-sm">{message.text}</span>
          </div>
        )}

        <div className="relative">
          <label className="block text-xs font-semibold text-cyan-500 mb-2 uppercase tracking-widest flex items-center gap-2">
            <Upload size={14} /> Tải lên Video
          </label>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            className="w-full bg-[#050508] border border-cyan-900/50 rounded-xl p-3 text-slate-200 outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50 transition-all font-sans file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-cyan-950 file:text-cyan-400 hover:file:bg-cyan-900 cursor-pointer"
          />
        </div>

        {videoUrl && (
          <div className="mt-6">
            <label className="block text-xs font-semibold text-cyan-500 mb-2 uppercase tracking-widest">
              Xem trước Video
            </label>
            <div className="rounded-xl overflow-hidden border border-cyan-900/50 bg-black/50 aspect-video flex items-center justify-center">
              <video
                src={videoUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        <div className="pt-4">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white rounded-xl font-bold tracking-wider uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={20} />
            {isSaving ? 'Đang lưu...' : 'Lưu Cấu hình'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
