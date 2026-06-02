import { motion } from "motion/react";
import { Character } from "../types";
import CharacterCard from "./CharacterCard";

interface ResultModalProps {
  character: Character;
  onClose: () => void;
}

export default function ResultModal({ character, onClose }: ResultModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
        className="bg-[#050505] border border-[#c5a059]/30 p-12 flex flex-col items-center max-w-md w-full shadow-[0_0_80px_rgba(197,160,89,0.15)] text-center relative overflow-hidden"
      >
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#c5a059] to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#c5a059]/10 to-transparent pointer-events-none" />

        <h2 className="text-3xl font-fantasy text-[#f3d081] mb-2 mt-4 drop-shadow-md tracking-widest uppercase">
          Thành Công
        </h2>
        {/* <p className="text-[#c5a059]/70 mb-8 italic text-xs uppercase tracking-widest">
          A new soul binds to your destiny.
        </p> */}

        <div className="w-64 h-80 mb-6 relative">
          <CharacterCard character={character} />
          {/* Glow effect behind */}
          <div className="absolute inset-0 -z-10 bg-[#c5a059]/10 blur-2xl rounded-full animate-pulse" />
        </div>

        <button
          onClick={onClose}
          className="group relative px-10 h-12 bg-gradient-to-b from-[#c5a059] to-[#8a6d3b] flex items-center justify-center overflow-hidden border border-[#f3d081] shadow-[0_0_20px_rgba(138,109,59,0.4)] hover:shadow-[0_0_40px_rgba(138,109,59,0.6)] active:scale-95 transition-all mt-6"
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <span className="uppercase tracking-[0.4em] font-bold text-black font-sans text-xs">
            Xác Nhận
          </span>
        </button>
      </motion.div>
    </motion.div>
  );
}
