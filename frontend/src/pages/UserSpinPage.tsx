import React, { useState, useCallback, useEffect, useMemo } from "react";
import { Character, GalleryItem } from "../types";
import CharacterCard from "../components/CharacterCard";
import SpinReel from "../components/SpinReel";
import ResultModal from "../components/ResultModal";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  characters: Character[];
  galleries: GalleryItem[];
  backgroundVideoUrl?: string;
}

export default function UserSpinPage({
  characters,
  galleries,
  backgroundVideoUrl,
}: Props) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<Character | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const spinCharacters = useMemo(
    () => characters.filter((character) => character.showInSpin === true),
    [characters],
  );

  useEffect(() => {
    if (!galleries || galleries.length <= 1) return;
    const interval = setInterval(() => {
      setGalleryIndex((prev) => (prev + 1) % galleries.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [galleries]);

  const activeGallery = galleries?.[galleryIndex] || null;

  const handleSpin = () => {
    if (spinCharacters.length < 3) return;
    setIsSpinning(true);
    setResult(null);
  };

  const handleComplete = useCallback((winner: Character) => {
    setIsSpinning(false);
    setResult(winner);
  }, []);

  return (
    <div className="flex-1 flex w-full h-full relative">
      {/* Background magical elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-purple-600/10 blur-[100px] rounded-full"></div>
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-cyan-600/10 blur-[100px] rounded-full"></div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 flex flex-col lg:flex-row w-full z-10">
        {/* Left Featured Column */}
        <section className="hidden lg:flex w-[300px] relative flex-col justify-end h-full bg-black/60 overflow-hidden z-20">
          <AnimatePresence>
            {activeGallery?.leftImageUrl && (
              <motion.img
                key={`left-${activeGallery.id}`}
                src={activeGallery.leftImageUrl}
                alt="Left Featured"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full object-cover z-0"
              />
            )}
          </AnimatePresence>
        </section>

        {/* Center Spin Area */}
        <section className="flex-1 flex flex-col items-center justify-center relative w-full h-full bg-black">
          {/* Background Video */}
          {backgroundVideoUrl && (
            <div className="absolute inset-0 z-0 overflow-hidden">
              <video
                src={backgroundVideoUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 mix-blend-multiply"></div>
            </div>
          )}

          <div className="relative z-10 w-full flex flex-col items-center">
            <SpinReel
              characters={spinCharacters}
              isSpinning={isSpinning}
              onSpinComplete={handleComplete}
            />

            <div className="mt-8 flex flex-col items-center gap-6">
              <button
                onClick={handleSpin}
                disabled={isSpinning || spinCharacters.length < 3}
                className="group relative w-64 h-16 bg-gradient-to-b from-[#c5a059] to-[#8a6d3b] rounded flex items-center justify-center overflow-hidden border border-[#f3d081] shadow-[0_0_20px_rgba(138,109,59,0.4)] hover:shadow-[0_0_40px_rgba(138,109,59,0.6)] active:scale-95 transition-all outline-none disabled:opacity-50 disabled:active:scale-100 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="uppercase tracking-[0.4em] font-bold text-black group-disabled:opacity-80 font-sans">
                  Quay
                </span>
              </button>

              {spinCharacters.length < 3 ? (
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-red-500 opacity-80 italic animate-pulse">
                  {/* <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Not enough souls in the pool */}
                </div>
              ) : (
                <div className="flex gap-4 text-[10px] uppercase tracking-widest text-[#c5a059] opacity-60 italic">
                  <span className="flex items-center gap-2"></span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Right Featured Column */}
        <section className="hidden lg:flex w-[300px] relative flex-col justify-end h-full bg-black/60 text-right overflow-hidden">
          <AnimatePresence>
            {activeGallery?.rightImageUrl && (
              <motion.img
                key={`right-${activeGallery.id}`}
                src={activeGallery.rightImageUrl}
                alt="Right Featured"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full object-cover z-0"
              />
            )}
          </AnimatePresence>
        </section>
      </div>

      {result && (
        <ResultModal character={result} onClose={() => setResult(null)} />
      )}
    </div>
  );
}
