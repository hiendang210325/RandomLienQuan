import React from "react";
import { Character } from "../types";

interface CharacterCardProps {
  character: Character;
  compact?: boolean;
  featured?: boolean;
  imageOnly?: boolean;
}

const rarityColors = {
  Legendary:
    "border-yellow-400/60 shadow-[0_0_30px_rgba(250,204,21,0.2)] text-yellow-400",
  Epic: "border-purple-400/60 shadow-[0_0_30px_rgba(192,132,252,0.2)] text-purple-400",
  Rare: "border-cyan-400/60 shadow-[0_0_30px_rgba(34,211,238,0.2)] text-cyan-400",
  Common:
    "border-[#c5a059]/60 shadow-[0_0_30px_rgba(197,160,89,0.2)] text-[#c5a059]",
};

export default function CharacterCard({
  character,
  compact = false,
  featured = false,
  imageOnly = false,
}: CharacterCardProps) {
  const styleStr = character.rarity
    ? rarityColors[character.rarity]
    : rarityColors.Common;
  const colorTextClass =
    styleStr.split(" ").find((c) => c.startsWith("text-")) || "text-cyan-400";
  const heightClass = compact ? "h-full" : featured ? "h-[500px]" : "h-[320px]";

  return (
    <div
      className={`relative w-full ${heightClass} rounded-xl border-2 bg-[#111] flex flex-col p-4 z-20 ${styleStr} group transition-transform duration-300 ${featured ? "hover:scale-105 cursor-pointer" : ""}`}
    >
      {/* Image Container */}
      <div
        className={`flex-1 rounded border border-white/5 bg-gradient-to-b from-transparent to-black/80 mb-4 overflow-hidden relative`}
      >
        <img
          src={character.imageUrl}
          alt={character.name}
          className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-700 ease-out"
          referrerPolicy="no-referrer"
        />

        {/* Gradients */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#111] to-transparent opacity-90" />

        {/* Rarity Indicator inside image */}
        {character.rarity && !compact && (
          <div className="absolute top-3 left-3">
            <span
              className={`px-2 py-0.5 rounded text-[9px] uppercase tracking-widest bg-black/60 backdrop-blur-sm border border-white/10 ${colorTextClass}`}
            >
              {character.rarity}
            </span>
          </div>
        )}

        {/* Name overlaid on image bottom */}
        {featured && !imageOnly && (
          <div className="absolute bottom-4 left-0 right-0 text-center px-2">
            <h3 className={`font-fantasy text-[#f3d081] text-2xl`}>
              {character.name.split(" ")[0]}
            </h3>
          </div>
        )}
      </div>

      {!imageOnly && (
        <>
          <div
            className={`h-1 w-full mb-3 opacity-30 bg-current ${colorTextClass}`}
          ></div>

          <div
            className={`text-center uppercase tracking-widest ${compact ? "text-[9px]" : "text-[10px]"} ${colorTextClass} truncate px-1`}
          >
            {character.name}
          </div>
        </>
      )}
    </div>
  );
}
