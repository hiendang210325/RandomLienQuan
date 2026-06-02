import React, { useState } from 'react';
import { GalleryItem } from '../types';
import { motion } from 'motion/react';
import { PlusCircle, Image as ImageIcon, UserPlus, X, Save } from 'lucide-react';

interface Props {
  initialData?: GalleryItem;
  onAdd: (c: GalleryItem) => void;
  onUpdate: (c: GalleryItem) => void;
  onClose: () => void;
}

export default function AdminGalleryForm({ initialData, onAdd, onUpdate, onClose }: Props) {
  const [name, setName] = useState(initialData?.name || '');
  const [leftImageUrl, setLeftImageUrl] = useState(initialData?.leftImageUrl || '');
  const [rightImageUrl, setRightImageUrl] = useState(initialData?.rightImageUrl || '');

  const handleLeftImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLeftImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRightImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRightImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !leftImageUrl || !rightImageUrl) return;
    
    if (initialData) {
      onUpdate({ ...initialData, name, leftImageUrl, rightImageUrl });
    } else {
      onAdd({ id: Date.now().toString(), name, leftImageUrl, rightImageUrl });
    }
    
    setName('');
    setLeftImageUrl('');
    setRightImageUrl('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-[#0a0a0f] p-6 md:p-8 rounded-2xl border border-pink-900/40 shadow-[0_8px_32px_rgba(236,72,153,0.15)] relative overflow-hidden w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar"
      >
        <button 
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-pink-400 z-20 bg-slate-900/50 p-1 rounded-full hover:bg-slate-800 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="absolute top-0 right-0 w-48 h-48 bg-pink-600/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-600/10 rounded-full blur-[80px] pointer-events-none"></div>
        
        <div className="flex items-center gap-3 mb-6 relative z-10">
          {initialData ? <Save className="text-pink-400" size={24} /> : <UserPlus className="text-pink-400" size={24} />}
          <h3 className="text-2xl font-fantasy text-slate-100 uppercase tracking-widest border-b-2 border-pink-500/30 pb-1">
            {initialData ? 'Cập nhật Thư viện' : 'Thêm mới Thư viện'}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10">
          
          <div className="mb-6">
            <label className="block text-sm font-bold text-pink-400 mb-2 uppercase tracking-widest">
              Tên bản ghi
            </label>
            <input 
              type="text" 
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-[#050508] border border-pink-900/50 rounded-xl p-4 text-slate-200 outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400/50 transition-all font-sans placeholder-slate-600 text-lg"
              placeholder="VD: Chiến dịch Neon Dawn"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Left Image Section */}
            <div className="bg-black/30 p-4 rounded-xl border border-pink-900/30 flex flex-col h-full">
              <label className="text-sm font-semibold text-pink-400 mb-3 uppercase tracking-widest flex items-center gap-2">
                <ImageIcon size={16} /> Ảnh bên trái
              </label>
              
              <div className="flex-1 flex flex-col gap-4">
                {leftImageUrl ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="relative rounded-lg overflow-hidden border border-pink-800/50 flex-1 min-h-[200px]"
                  >
                    <img src={leftImageUrl} alt="Left preview" className="absolute inset-0 w-full h-full object-cover" />
                  </motion.div>
                ) : (
                  <div className="rounded-lg border-2 border-dashed border-pink-900/40 flex-1 min-h-[200px] flex items-center justify-center text-pink-900/50 bg-black/20">
                    <span className="text-sm uppercase tracking-widest">Đang chờ dữ liệu ảnh</span>
                  </div>
                )}
                
                <input 
                  type="file"
                  accept="image/*"
                  onChange={handleLeftImageChange}
                  className="w-full bg-[#050508] border border-pink-900/50 rounded-lg p-2 text-slate-300 outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400/50 transition-all font-sans file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-pink-950 file:text-pink-400 hover:file:bg-pink-900"
                  required={!initialData}
                />
              </div>
            </div>

            {/* Right Image Section */}
            <div className="bg-black/30 p-4 rounded-xl border border-purple-900/30 flex flex-col h-full">
              <label className="text-sm font-semibold text-purple-400 mb-3 uppercase tracking-widest flex items-center gap-2">
                <ImageIcon size={16} /> Ảnh bên phải
              </label>
              
              <div className="flex-1 flex flex-col gap-4">
                {rightImageUrl ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="relative rounded-lg overflow-hidden border border-purple-800/50 flex-1 min-h-[200px]"
                  >
                    <img src={rightImageUrl} alt="Right preview" className="absolute inset-0 w-full h-full object-cover" />
                  </motion.div>
                ) : (
                  <div className="rounded-lg border-2 border-dashed border-purple-900/40 flex-1 min-h-[200px] flex items-center justify-center text-purple-900/50 bg-black/20">
                    <span className="text-sm uppercase tracking-widest">Đang chờ dữ liệu ảnh</span>
                  </div>
                )}

                <input 
                  type="file"
                  accept="image/*"
                  onChange={handleRightImageChange}
                  className="w-full bg-[#050508] border border-purple-900/50 rounded-lg p-2 text-slate-300 outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50 transition-all font-sans file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-purple-950 file:text-purple-400 hover:file:bg-purple-900"
                  required={!initialData}
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full relative group overflow-hidden bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 border-none text-white font-bold py-5 px-6 rounded-xl transition-all font-fantasy tracking-[0.2em] uppercase text-lg shadow-[0_0_20px_rgba(236,72,153,0.3)]"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
            <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
              {initialData ? (
                <><Save size={24} /> Cập nhật thư viện</>
              ) : (
                <><PlusCircle size={24} /> Khởi tạo thư viện</>
              )}
            </span>
          </button>
        </form>
      </motion.div>
    </div>
  );
}
