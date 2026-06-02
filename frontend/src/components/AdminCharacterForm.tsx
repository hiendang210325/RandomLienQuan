import React, { useState } from 'react';
import { Character, CharacterFormPayload } from '../types';
import { motion } from 'motion/react';
import { PlusCircle, Image as ImageIcon, Sparkles, UserPlus, X, Save } from 'lucide-react';

const MAX_IMAGE_DIMENSION = 900;
const IMAGE_QUALITY = 0.86;

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Cannot load selected image'));
    image.src = src;
  });

const optimizeImageFile = async (file: File) => {
  const dataUrl = await readFileAsDataUrl(file);
  const image = await loadImage(dataUrl);
  const scale = Math.min(
    1,
    MAX_IMAGE_DIMENSION / Math.max(image.naturalWidth, image.naturalHeight),
  );
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (!context) {
    return dataUrl;
  }

  canvas.width = width;
  canvas.height = height;
  context.drawImage(image, 0, 0, width, height);

  return canvas.toDataURL('image/webp', IMAGE_QUALITY);
};

interface Props {
  initialData?: Character;
  onAdd: (c: CharacterFormPayload) => Promise<void> | void;
  onUpdate: (c: CharacterFormPayload) => Promise<void> | void;
  onClose: () => void;
}

export default function AdminCharacterForm({ initialData, onAdd, onUpdate, onClose }: Props) {
  const [name, setName] = useState(initialData?.name || '');
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '');
  const [categories, setCategories] = useState<string[]>(initialData?.categories || []);
  const [categoryInput, setCategoryInput] = useState('');
  const [imageError, setImageError] = useState('');
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageError('');
      setIsProcessingImage(true);

      try {
        setImageUrl(await optimizeImageFile(file));
      } catch (error) {
        console.error('Image processing failed', error);
        setImageError('Không đọc được ảnh đã chọn.');
      } finally {
        setIsProcessingImage(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !imageUrl || isProcessingImage) return;

    setIsSubmitting(true);

    try {
      if (initialData) {
        await onUpdate({
          ...initialData,
          name,
          imageUrl,
          categories,
        });
      } else {
        await onAdd({
          name,
          imageUrl,
          categories,
        });
      }

      setName('');
      setImageUrl('');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-[#0a0a0f] p-6 rounded-2xl border border-cyan-900/40 shadow-[0_8px_32px_rgba(8,145,178,0.2)] relative overflow-hidden w-full max-w-md"
      >
        <button 
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-cyan-400 z-20 bg-slate-900/50 p-1 rounded-full hover:bg-slate-800 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-600/10 rounded-full blur-[60px] pointer-events-none"></div>
        
        <div className="flex items-center gap-3 mb-6">
          {initialData ? <Save className="text-purple-400" size={24} /> : <UserPlus className="text-cyan-400" size={24} />}
          <h3 className="text-xl font-fantasy text-slate-100 uppercase tracking-widest">
            {initialData ? 'Cập nhật nhân vật' : 'Thêm nhân vật'}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <div>
            <label className="block text-xs font-semibold text-cyan-500 mb-2 uppercase tracking-widest flex items-center gap-2">
              Tên nhân vật
            </label>
            <input 
              type="text" 
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-[#050508] border border-cyan-900/50 rounded-xl p-3 text-slate-200 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all font-sans placeholder-slate-600"
              placeholder="VD: Cyber Ninja 01"
              required
            />
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-cyan-500 mb-2 uppercase tracking-widest flex items-center gap-2">
              <ImageIcon size={14} /> Tải ảnh lên
            </label>
            <input 
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full bg-[#050508] border border-cyan-900/50 rounded-xl p-2 text-slate-200 outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50 transition-all font-sans file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-cyan-950 file:text-cyan-400 hover:file:bg-cyan-900"
              required={!initialData}
            />
            {imageError && (
              <p className="mt-2 text-xs text-red-400">{imageError}</p>
            )}
          </div>
          
          <div>
             <label className="block text-xs font-semibold text-cyan-500 mb-2 uppercase tracking-widest flex items-center gap-2">
               <Sparkles size={14} /> Phân loại nhóm
             </label>
             <div className="bg-[#050508] border border-cyan-900/50 rounded-xl p-2 transition-all focus-within:border-cyan-400 focus-within:ring-1 focus-within:ring-cyan-400/50">
               <div className="flex flex-wrap gap-2 mb-2">
                 {categories.map((cat, index) => (
                   <span key={index} className="flex items-center gap-1 bg-cyan-950/50 text-cyan-300 border border-cyan-500/30 px-2 py-1 rounded-md text-xs">
                     {cat}
                     <button type="button" onClick={() => setCategories(categories.filter((_, i) => i !== index))} className="hover:text-red-400 ml-1">
                       <X size={12} />
                     </button>
                   </span>
                 ))}
               </div>
               <input
                 type="text"
                 value={categoryInput}
                 onChange={e => setCategoryInput(e.target.value)}
                 onKeyDown={e => {
                   if (e.key === 'Enter' || e.key === ',') {
                     e.preventDefault();
                     const newCat = categoryInput.trim();
                     if (newCat && !categories.includes(newCat)) {
                       setCategories([...categories, newCat]);
                     }
                     setCategoryInput('');
                   }
                 }}
                 placeholder="Nhập nhóm và nhấn Enter..."
                 className="w-full bg-transparent text-slate-200 outline-none font-sans text-sm placeholder-slate-600 px-1"
               />
             </div>
             <p className="text-[10px] text-slate-500 mt-1">Nhấn Enter hoặc dấu phẩy (,) để thêm tag.</p>
          </div>
          
          {imageUrl && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 p-3 rounded-xl bg-black/40 border border-cyan-900/30"
            >
              <span className="block text-[10px] uppercase tracking-widest text-cyan-500/70 mb-2">Xác nhận hình ảnh</span>
              <img src={imageUrl} alt="preview" className="h-32 w-full object-cover rounded-lg border border-cyan-800/50 shadow-[0_0_15px_rgba(34,211,238,0.1)]" />
            </motion.div>
          )}

          <button 
            type="submit" 
            disabled={isSubmitting || isProcessingImage}
            className="w-full relative group overflow-hidden bg-gradient-to-r from-cyan-600 to-purple-600 border-none text-white font-bold py-4 px-6 rounded-xl mt-6 transition-all font-fantasy tracking-[0.2em] uppercase disabled:opacity-60"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
            <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
              {isProcessingImage ? (
                <><ImageIcon size={20} /> Đang xử lý ảnh</>
              ) : isSubmitting ? (
                <><Save size={20} /> Đang lưu</>
              ) : initialData ? (
                <><Save size={20} /> Cập nhật</>
              ) : (
                <><PlusCircle size={20} /> Khởi tạo</>
              )}
            </span>
          </button>
        </form>
      </motion.div>
    </div>
  );
}
