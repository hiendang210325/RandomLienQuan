import { motion, useAnimation } from 'motion/react';
import React, { useEffect, useState, useCallback } from 'react';
import { Character } from '../types';
import CharacterCard from './CharacterCard';

interface SpinReelProps {
  characters: Character[];
  isSpinning: boolean;
  onSpinComplete: (winner: Character) => void;
}

export default function SpinReel({ characters, isSpinning, onSpinComplete }: SpinReelProps) {
  const controls = useAnimation();
  const [sequence, setSequence] = useState<Character[]>([]);
  
  const TOTAL_ITEMS = 60;
  const WINNER_INDEX = 4;
  const ITEM_HEIGHT = 360;
  const GAP = 24;
  const ITEM_SIZE = ITEM_HEIGHT + GAP;
  const CONTAINER_HEIGHT = 500;

  useEffect(() => {
    if (isSpinning) return;

    if (characters.length > 0) {
      const previewSeq = [];
      for (let i = 0; i < 3; i++) {
        previewSeq.push(characters[i % characters.length]);
      }
      setSequence(previewSeq);
      controls.set({ y: -(0 * ITEM_SIZE) + (CONTAINER_HEIGHT/2 - ITEM_HEIGHT/2) });
    } else {
      setSequence([]);
    }
  }, [characters, isSpinning, controls]);

  useEffect(() => {
    if (isSpinning && characters.length >= 3) {
      const winner = characters[Math.floor(Math.random() * characters.length)];
      
      const newSeq = [];
      for (let i = 0; i < TOTAL_ITEMS; i++) {
        if (i === WINNER_INDEX) {
          newSeq.push(winner);
          continue;
        }
        
        let randomChar = characters[Math.floor(Math.random() * characters.length)];
        // Prevent adjacent duplicates
        if (characters.length > 1 && i > 0) {
          while (randomChar.id === newSeq[i - 1].id || (i === WINNER_INDEX - 1 && randomChar.id === winner.id)) {
            randomChar = characters[Math.floor(Math.random() * characters.length)];
          }
        }
        newSeq.push(randomChar);
      }
      
      // Post-process to ensure the element after winner is also not a duplicate
      if (characters.length > 1 && WINNER_INDEX + 1 < TOTAL_ITEMS) {
        while (newSeq[WINNER_INDEX + 1].id === winner.id) {
          newSeq[WINNER_INDEX + 1] = characters[Math.floor(Math.random() * characters.length)];
        }
      }

      setSequence(newSeq);

      const START_INDEX = TOTAL_ITEMS - 4; // Start near the end of the array
      
      const startY = -(START_INDEX * ITEM_SIZE) + (CONTAINER_HEIGHT / 2 - ITEM_HEIGHT / 2);
      const endY = -(WINNER_INDEX * ITEM_SIZE) + (CONTAINER_HEIGHT / 2 - ITEM_HEIGHT / 2);

      controls.set({ y: startY });
      
      controls.start({
        y: endY,
        transition: {
          duration: 5,
          ease: [0.15, 0.85, 0.2, 1] // Custom ease for dramatic slowdown
        }
      }).then(() => {
        onSpinComplete(winner);
      });
    }
  }, [isSpinning, characters, controls, onSpinComplete]); // eslint-disable-line react-hooks/exhaustive-deps
  // Ignoring exhaustive-deps because we only want this to run when isSpinning flips to true

  return (
    <div className="w-full max-w-md h-[560px] relative overflow-hidden flex items-center justify-center pointer-events-none sm:pointer-events-auto">
      {/* Container Background */}
      <div className="absolute inset-y-0 w-[300px] border-x border-[#c5a059]/30 bg-black/40 shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] z-0"></div>
      
      {/* Center Highlight Decorations */}
      <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[320px] h-[390px] border border-cyan-400/40 z-30 pointer-events-none">
        <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-cyan-400"></div>
        <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-cyan-400"></div>
        <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-cyan-400"></div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-cyan-400"></div>
      </div>

      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#050505] via-transparent to-[#050505] z-20"></div>

      <motion.div
        animate={controls}
        className="flex flex-col items-center w-full absolute top-0 z-10"
        style={{ gap: `${GAP}px`, willChange: 'transform' }}
      >
        {sequence.map((char, index) => (
          <div key={`${char?.id || index}-${index}`} style={{ height: `${ITEM_HEIGHT}px`, width: '260px' }} className="flex-shrink-0">
            {char && <CharacterCard character={char} compact={false} imageOnly={true} />}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
