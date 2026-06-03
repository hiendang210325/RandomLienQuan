import React, { useState } from "react";
import { Character } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { Trash2, AlertTriangle, ShieldCheck, Search, Plus, ChevronLeft, ChevronRight, Filter, Pencil, Eye, EyeOff } from "lucide-react";

interface Props {
  characters: Character[];
  onDelete: (id: string) => void;
  onEdit: (c: Character) => void;
  onToggleShowInSpin: (c: Character, showInSpin: boolean) => void;
  pendingSpinIds?: Record<string, boolean>;
  onAddClick: () => void;
}

const getCategoryColor = (category?: string) => {
  if (!category) return 'border-slate-500/50 text-slate-400 bg-slate-900/50';
  const c = category.toLowerCase();
  if (c.includes('sát thủ')) return 'border-red-500/50 text-red-400 bg-red-950/30';
  if (c.includes('đấu sĩ')) return 'border-orange-500/50 text-orange-400 bg-orange-950/30';
  if (c.includes('đỡ đòn')) return 'border-emerald-500/50 text-emerald-400 bg-emerald-950/30';
  if (c.includes('pháp sư')) return 'border-purple-500/50 text-purple-400 bg-purple-950/30';
  if (c.includes('xạ thủ')) return 'border-yellow-500/50 text-yellow-400 bg-yellow-950/30';
  if (c.includes('trợ thủ')) return 'border-cyan-500/50 text-cyan-400 bg-cyan-950/30';
  
  // Generic color for unknown classes
  const colors = [
    'border-pink-500/50 text-pink-400 bg-pink-950/30',
    'border-indigo-500/50 text-indigo-400 bg-indigo-950/30',
    'border-lime-500/50 text-lime-400 bg-lime-950/30',
    'border-fuchsia-500/50 text-fuchsia-400 bg-fuchsia-950/30'
  ];
  const charCodeSum = category.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[charCodeSum % colors.length];
};

export default function AdminCharacterList({ characters, onDelete, onEdit, onToggleShowInSpin, pendingSpinIds = {}, onAddClick }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("Tất cả");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const spinEnabledCount = characters.filter((c) => c.showInSpin === true).length;

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterCategory]);

  const allCategories = ["Tất cả", ...Array.from(new Set(characters.flatMap(c => c.categories || [])))];

  const filteredCharacters = characters.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = filterCategory === "Tất cả" || (c.categories && c.categories.includes(filterCategory));
    return matchSearch && matchCategory;
  });

  const totalPages = Math.ceil(filteredCharacters.length / itemsPerPage);
  const paginatedCharacters = filteredCharacters.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-[#0a0a0f]/80 backdrop-blur-md p-6 rounded-2xl border border-purple-900/40 shadow-[0_8px_32px_rgba(147,51,234,0.1)] flex flex-col h-[700px] xl:h-[800px] relative overflow-hidden"
    >
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 shrink-0 relative z-10">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-purple-400" size={24} />
          <h3 className="text-xl font-fantasy text-slate-100 uppercase tracking-widest">
            Danh sách nhân vật
          </h3>
          <div className="bg-purple-900/30 text-purple-300 px-3 py-1 rounded-full text-xs font-bold border border-purple-500/30 ml-2 hidden sm:block">
            {spinEnabledCount}/{characters.length} Đã bật
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500/50" size={16} />
            <input
              type="text"
              placeholder="Tìm kiếm nhân vật..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-40 xl:w-48 focus:md:w-64 bg-[#050508] border border-cyan-900/50 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all font-sans placeholder-slate-600"
            />
          </div>

          <div className="relative">
             <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500/50" size={16} />
             <select 
               value={filterCategory} 
               onChange={e => setFilterCategory(e.target.value)}
               className="w-full md:w-36 bg-[#050508] border border-cyan-900/50 rounded-xl pl-9 pr-8 py-2 text-sm text-slate-200 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all font-sans appearance-none"
             >
               {allCategories.map(cat => (
                 <option key={cat} value={cat} className="bg-[#050508]">{cat}</option>
               ))}
             </select>
             <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-cyan-500/50 text-[10px]">
               ▼
             </div>
          </div>

          <button
            onClick={onAddClick}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)] shrink-0"
          >
            <Plus size={16} /> Thêm mới
          </button>
        </div>
      </div>

      {spinEnabledCount < 3 && (
        <div className="bg-red-950/40 border border-red-500/50 text-red-400 p-4 rounded-xl mb-4 text-sm flex-shrink-0 flex items-center gap-3 relative z-10">
          <AlertTriangle size={20} className="shrink-0 text-red-500 animate-pulse" />
          <p>Cảnh báo hệ thống: Kích hoạt ít nhất 3 nhân vật cho vòng quay.</p>
        </div>
      )}
      
      <div className="space-y-3 overflow-y-auto pr-2 flex-1 custom-scrollbar relative z-10">
        <AnimatePresence>
          {paginatedCharacters.map((char) => {
            const isSpinTogglePending = pendingSpinIds[char.id] === true;

            return (
            <motion.div
              key={char.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
              className="flex items-center gap-4 bg-[#050508]/80 p-3 rounded-xl border border-cyan-900/30 transition-all hover:border-cyan-500/50 group hover:bg-[#0a0a0f] hover:shadow-[0_0_15px_rgba(34,211,238,0.15)]"
            >
              <div className="relative shrink-0 overflow-hidden rounded-lg">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                <img
                  src={char.imageUrl}
                  alt={char.name}
                  className="w-16 h-16 object-cover border border-slate-800 group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-slate-200 truncate text-sm md:text-base font-sans group-hover:text-cyan-300 transition-colors">
                  {char.name}
                </h4>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  {char.categories && char.categories.length > 0 ? (
                    char.categories.map((cat, i) => (
                      <span key={i} className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded border ${getCategoryColor(cat)}`}>
                        {cat}
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded border border-slate-500/50 text-slate-400 bg-slate-900/50">
                      Chưa phân loại
                    </span>
                  )}
                  <span className="text-xs text-slate-600 hidden sm:inline ml-auto">ID: {char.id.slice(-4)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (!isSpinTogglePending) {
                      onToggleShowInSpin(char, char.showInSpin !== true);
                    }
                  }}
                  disabled={isSpinTogglePending}
                  aria-pressed={char.showInSpin === true}
                  aria-busy={isSpinTogglePending}
                  className={`relative h-9 w-16 rounded-full border transition-all disabled:cursor-wait disabled:opacity-80 ${
                    char.showInSpin === true
                      ? 'border-emerald-400/60 bg-emerald-500/20 shadow-[0_0_14px_rgba(16,185,129,0.2)]'
                      : 'border-slate-700 bg-slate-900/60'
                  }`}
                  title={char.showInSpin === true ? "Hiển thị ở vòng quay" : "Ẩn ở vòng quay"}
                >
                  <span
                    className={`absolute top-1 flex h-7 w-7 items-center justify-center rounded-full transition-all ${
                      char.showInSpin === true
                        ? 'left-8 bg-emerald-400 text-slate-950'
                        : 'left-1 bg-slate-700 text-slate-300'
                    }`}
                  >
                    {char.showInSpin === true ? <Eye size={14} /> : <EyeOff size={14} />}
                  </span>
                </button>
                <button
                  onClick={() => onEdit(char)}
                  className="text-cyan-400 hover:text-cyan-300 p-3 bg-cyan-950/20 hover:bg-cyan-900/40 rounded-lg border border-cyan-900/30 hover:border-cyan-500/50 transition-all group/edit"
                  title="Cập nhật nhân vật"
                >
                  <Pencil size={18} className="group-hover/edit:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                </button>
                <button
                  onClick={() => onDelete(char.id)}
                  className="text-red-400 hover:text-red-300 p-3 bg-red-950/20 hover:bg-red-900/40 rounded-lg border border-red-900/30 hover:border-red-500/50 transition-all group/btn"
                  title="Vô hiệu hóa nhân vật"
                >
                  <Trash2 size={18} className="group-hover/btn:drop-shadow-[0_0_8px_rgba(248,113,113,0.8)]" />
                </button>
              </div>
            </motion.div>
            );
          })}
        </AnimatePresence>
        
        {filteredCharacters.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center">
              <Search size={24} className="text-slate-600" />
            </div>
            <p className="uppercase tracking-widest text-sm font-semibold text-center">
              {searchQuery || filterCategory !== "Tất cả" 
                ? "Không có nhân vật nào khớp với bộ lọc" 
                : "Không tìm thấy nhân vật"}
            </p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 relative z-10 pt-4 border-t border-cyan-900/30">
          <span className="text-sm text-slate-400 font-sans">
            Trang <span className="font-bold text-cyan-400">{currentPage}</span> của {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-cyan-900/50 text-cyan-500 hover:bg-cyan-950/40 disabled:opacity-50 disabled:hover:bg-transparent transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-cyan-900/50 text-cyan-500 hover:bg-cyan-950/40 disabled:opacity-50 disabled:hover:bg-transparent transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
