import React, { useState } from "react";
import { GalleryItem } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { Trash2, AlertTriangle, Images, Search, Plus, ChevronLeft, ChevronRight, Pencil } from "lucide-react";

interface Props {
  galleries: GalleryItem[];
  onDelete: (id: string) => void;
  onEdit: (c: GalleryItem) => void;
  onAddClick: () => void;
}

export default function AdminGalleryList({ galleries, onDelete, onEdit, onAddClick }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Fewer items per page since they take more vertical space with 2 images

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const filteredGalleries = galleries.filter((g) => {
    return g.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const totalPages = Math.ceil(filteredGalleries.length / itemsPerPage);
  const paginatedGalleries = filteredGalleries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-[#0a0a0f]/80 backdrop-blur-md p-6 rounded-2xl border border-pink-900/40 shadow-[0_8px_32px_rgba(236,72,153,0.1)] flex flex-col h-[700px] xl:h-[800px] relative overflow-hidden"
    >
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 shrink-0 relative z-10">
        <div className="flex items-center gap-3">
          <Images className="text-pink-400" size={24} />
          <h3 className="text-xl font-fantasy text-slate-100 uppercase tracking-widest">
            Danh sách thư viện
          </h3>
          <div className="bg-pink-900/30 text-pink-300 px-3 py-1 rounded-full text-xs font-bold border border-pink-500/30 ml-2 hidden sm:block">
            {galleries.length} Bản ghi
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-500/50" size={16} />
            <input
              type="text"
              placeholder="Tìm kiếm thư viện..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-40 xl:w-48 focus:md:w-64 bg-[#050508] border border-pink-900/50 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400/50 transition-all font-sans placeholder-slate-600"
            />
          </div>

          <button
            onClick={onAddClick}
            className="flex items-center gap-2 bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(236,72,153,0.2)] shrink-0"
          >
            <Plus size={16} /> Thêm bản ghi
          </button>
        </div>
      </div>

      {galleries.length === 0 && (
        <div className="bg-yellow-950/40 border border-yellow-500/50 text-yellow-400 p-4 rounded-xl mb-4 text-sm flex-shrink-0 flex items-center gap-3 relative z-10">
          <AlertTriangle size={20} className="shrink-0 text-yellow-500" />
          <p>Lưu ý hệ thống: Thư viện hiện tại trống. Thêm bản ghi để khởi tạo.</p>
        </div>
      )}
      
      <div className="space-y-4 overflow-y-auto pr-2 flex-1 custom-scrollbar relative z-10">
        <AnimatePresence>
          {paginatedGalleries.map((gallery) => (
            <motion.div
              key={gallery.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
              className="flex flex-col bg-[#050508]/80 p-4 rounded-xl border border-pink-900/30 transition-all hover:border-pink-500/50 group hover:bg-[#0a0a0f] hover:shadow-[0_0_15px_rgba(236,72,153,0.15)]"
            >
              <div className="flex items-center justify-between mb-3 border-b border-pink-900/30 pb-2">
                <h4 className="font-bold text-slate-200 text-sm md:text-base font-sans group-hover:text-pink-300 transition-colors">
                  {gallery.name}
                </h4>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600 mr-2">ID: {gallery.id.slice(-4)}</span>
                  <button
                    onClick={() => onEdit(gallery)}
                    className="text-cyan-400 hover:text-cyan-300 p-2 bg-cyan-950/20 hover:bg-cyan-900/40 rounded-lg border border-cyan-900/30 hover:border-cyan-500/50 transition-all group/edit"
                    title="Cập nhật bản ghi"
                  >
                    <Pencil size={16} className="group-hover/edit:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                  </button>
                  <button
                    onClick={() => onDelete(gallery.id)}
                    className="text-red-400 hover:text-red-300 p-2 bg-red-950/20 hover:bg-red-900/40 rounded-lg border border-red-900/30 hover:border-red-500/50 transition-all group/btn"
                    title="Xóa bản ghi"
                  >
                    <Trash2 size={16} className="group-hover/btn:drop-shadow-[0_0_8px_rgba(248,113,113,0.8)]" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 h-32 md:h-40">
                <div className="relative rounded-lg overflow-hidden border border-pink-800/30 group/img">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity z-10 flex items-end p-2">
                    <span className="text-[10px] text-pink-300 uppercase tracking-widest font-bold">Bên trái</span>
                  </div>
                  <img src={gallery.leftImageUrl} alt="Left" className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-700" />
                </div>
                <div className="relative rounded-lg overflow-hidden border border-purple-800/30 group/img">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity z-10 flex items-end p-2">
                    <span className="text-[10px] text-purple-300 uppercase tracking-widest font-bold">Bên phải</span>
                  </div>
                  <img src={gallery.rightImageUrl} alt="Right" className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-700" />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredGalleries.length === 0 && galleries.length > 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center">
              <Search size={24} className="text-slate-600" />
            </div>
            <p className="uppercase tracking-widest text-sm font-semibold text-center">
              Không có bản ghi nào khớp với bộ lọc
            </p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 relative z-10 pt-4 border-t border-pink-900/30">
          <span className="text-sm text-slate-400 font-sans">
            Trang <span className="font-bold text-pink-400">{currentPage}</span> của {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-pink-900/50 text-pink-500 hover:bg-pink-950/40 disabled:opacity-50 disabled:hover:bg-transparent transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-pink-900/50 text-pink-500 hover:bg-pink-950/40 disabled:opacity-50 disabled:hover:bg-transparent transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
