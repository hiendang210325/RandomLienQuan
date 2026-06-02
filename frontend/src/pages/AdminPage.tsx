import React, { useState } from 'react';
import { Character } from '../types';
import AdminCharacterForm from '../components/AdminCharacterForm';
import AdminCharacterList from '../components/AdminCharacterList';
import AdminGalleryForm from '../components/AdminGalleryForm';
import AdminGalleryList from '../components/AdminGalleryList';
import AdminVideoTab from '../components/AdminVideoTab';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Users, Settings, BarChart3, Shield, LogOut } from 'lucide-react';

interface Props {
  characters: Character[];
  setCharacters: React.Dispatch<React.SetStateAction<Character[]>>;
  onLogout?: () => void;
}

export default function AdminPage({ characters, setCharacters, onLogout }: Props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'General' | 'Gallery' | 'Videos'>('General');
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);

  const [galleries, setGalleries] = useState<import('../types').GalleryItem[]>([]);
  const [editingGallery, setEditingGallery] = useState<import('../types').GalleryItem | null>(null);

  React.useEffect(() => {
    if (activeTab === 'Gallery' && galleries.length === 0) {
      fetch('/api/galleries')
        .then(res => res.json())
        .then(data => setGalleries(data))
        .catch(err => console.error('Tải thư viện thất bại', err));
    }
  }, [activeTab]);

  const handleAdd = async (char: Character) => {
    try {
      const res = await fetch('/api/characters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(char)
      });
      if (res.ok) {
        const newChar = await res.json();
        setCharacters(prev => [newChar, ...prev]);
      } else {
        const errText = await res.text();
        alert(`Thêm nhân vật thất bại. Trạng thái: ${res.status}. Phản hồi: ${errText}`);
      }
    } catch (error) {
      console.error('Thêm nhân vật thất bại', error);
      alert('Lỗi mạng khi thêm nhân vật.');
    }
  };

  const handleUpdate = async (char: Character) => {
    try {
      const res = await fetch(`/api/characters/${char.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(char)
      });
      if (res.ok) {
        const updatedChar = await res.json();
        setCharacters(prev => prev.map(c => c.id === updatedChar.id ? updatedChar : c));
      }
    } catch (error) {
      console.error('Cập nhật nhân vật thất bại', error);
    }
  };

  const handleToggleShowInSpin = async (char: Character, showInSpin: boolean) => {
    try {
      const res = await fetch(`/api/characters/${char.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ showInSpin })
      });

      if (res.ok) {
        const updatedChar = await res.json();
        setCharacters(prev => prev.map(c => c.id === updatedChar.id ? updatedChar : c));
      } else {
        const errText = await res.text();
        alert(`Cập nhật hiển thị vòng quay thất bại. Trạng thái: ${res.status}. Phản hồi: ${errText}`);
      }
    } catch (error) {
      console.error('Cập nhật hiển thị vòng quay thất bại', error);
      alert('Lỗi mạng khi cập nhật hiển thị vòng quay.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/characters/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCharacters(prev => prev.filter(c => c.id !== id));
      }
    } catch (error) {
      console.error('Xóa nhân vật thất bại', error);
    }
  };

  const handleGalleryAdd = async (gallery: import('../types').GalleryItem) => {
    try {
      const res = await fetch('/api/galleries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gallery)
      });
      if (res.ok) {
        const newG = await res.json();
        setGalleries(prev => [newG, ...prev]);
      } else {
        const errText = await res.text();
        alert(`Thêm thư viện thất bại. Trạng thái: ${res.status}. Phản hồi: ${errText}`);
      }
    } catch (error) {
      console.error('Thêm mục thư viện thất bại', error);
      alert('Lỗi mạng khi thêm thư viện.');
    }
  };

  const handleGalleryUpdate = async (gallery: import('../types').GalleryItem) => {
    try {
      const res = await fetch(`/api/galleries/${gallery.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gallery)
      });
      if (res.ok) {
        const updatedG = await res.json();
        setGalleries(prev => prev.map(g => g.id === updatedG.id ? updatedG : g));
      }
    } catch (error) {
      console.error('Cập nhật mục thư viện thất bại', error);
    }
  };

  const handleGalleryDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/galleries/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setGalleries(prev => prev.filter(g => g.id !== id));
      }
    } catch (error) {
      console.error('Xóa mục thư viện thất bại', error);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#050508] text-slate-200 overflow-hidden font-sans selection:bg-cyan-500/30">
      {/* Background ambient light */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="relative z-20 flex flex-col h-full bg-[#0a0a0f] border-r border-cyan-900/30 shadow-[4px_0_24px_rgba(8,145,178,0.05)]"
      >
        <div className="p-4 md:p-6 flex items-center justify-between border-b border-cyan-900/30">
          <AnimatePresence mode="popLayout">
            {isSidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-2 overflow-hidden whitespace-nowrap"
              >
                <Shield className="w-8 h-8 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] shrink-0" />
                <span className="font-fantasy font-bold text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                  NEXUS
                </span>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg text-cyan-500 hover:bg-cyan-950/50 hover:text-cyan-300 transition-colors shrink-0"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} className="mx-auto" />}
          </button>
        </div>

        <nav className="flex-1 py-6 flex flex-col gap-2 px-3 overflow-hidden">
          {[
            { icon: Users, label: 'Chung', id: 'General' },
            { icon: BarChart3, label: 'Thư viện', id: 'Gallery' },
            { icon: Settings, label: 'Video', id: 'Videos' },
          ].map((item, i) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={i}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-300 group ${isActive
                  ? 'bg-cyan-950/40 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(8,145,178,0.15)]'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                  }`}
              >
                <item.icon size={22} className={`shrink-0 ${isActive ? 'drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'group-hover:text-cyan-400 transition-colors'}`} />
                <AnimatePresence mode="popLayout">
                  {isSidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="font-medium tracking-wide whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            )
          })}
        </nav>

        {onLogout && (
          <div className="p-4 border-t border-cyan-900/30">
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-3 p-3 rounded-xl text-red-400 hover:bg-red-950/30 hover:text-red-300 transition-all border border-transparent hover:border-red-900/50 group"
            >
              <LogOut size={20} className="shrink-0 group-hover:drop-shadow-[0_0_8px_rgba(248,113,113,0.8)]" />
              <AnimatePresence mode="popLayout">
                {isSidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="font-medium tracking-wide whitespace-nowrap"
                  >
                    Đăng xuất
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        )}
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 relative z-10 overflow-y-auto custom-scrollbar">
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h1 className="text-3xl md:text-5xl font-fantasy font-bold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)] mb-3">
              Trung tâm điều khiển
            </h1>
            <div className="h-1 w-32 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mb-4"></div>
            <p className="text-slate-400 text-lg">Quản lý các thực thể trong hệ thống.</p>
          </motion.div>

          <div className="w-full">
            {activeTab === 'General' ? (
              <AdminCharacterList
                characters={characters}
                onDelete={handleDelete}
                onEdit={(char) => {
                  setEditingCharacter(char);
                  setIsModalOpen(true);
                }}
                onToggleShowInSpin={handleToggleShowInSpin}
                onAddClick={() => {
                  setEditingCharacter(null);
                  setIsModalOpen(true);
                }}
              />
            ) : activeTab === 'Gallery' ? (
              <AdminGalleryList
                galleries={galleries}
                onDelete={handleGalleryDelete}
                onEdit={(g) => {
                  setEditingGallery(g);
                  setIsModalOpen(true);
                }}
                onAddClick={() => {
                  setEditingGallery(null);
                  setIsModalOpen(true);
                }}
              />
            ) : (
              <AdminVideoTab />
            )}
          </div>
        </div>

        <AnimatePresence>
          {isModalOpen && activeTab === 'General' && (
            <AdminCharacterForm
              initialData={editingCharacter || undefined}
              onAdd={handleAdd}
              onUpdate={handleUpdate}
              onClose={() => {
                setIsModalOpen(false);
                setEditingCharacter(null);
              }}
            />
          )}
          {isModalOpen && activeTab === 'Gallery' && (
            <AdminGalleryForm
              initialData={editingGallery || undefined}
              onAdd={handleGalleryAdd}
              onUpdate={handleGalleryUpdate}
              onClose={() => {
                setIsModalOpen(false);
                setEditingGallery(null);
              }}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
