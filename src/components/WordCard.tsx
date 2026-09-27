import React, { useState } from 'react';
import { Volume2, Sparkles, HelpCircle } from 'lucide-react';
import { WordItem } from '../types';
import { speakWord, playBlockClick } from '../utils/audio';

interface WordCardProps {
  item: WordItem;
  isSlowAudio: boolean;
  onStarWord?: (wordId: string) => void;
  isStarred?: boolean;
}

export const WordCard: React.FC<WordCardProps> = ({
  item,
  isSlowAudio,
  onStarWord,
  isStarred = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeChunkIndex, setActiveChunkIndex] = useState<number | null>(null);

  const handlePlayAudio = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playBlockClick();
    setIsPlaying(true);
    speakWord(item.lowercase, isSlowAudio);
    setTimeout(() => {
      setIsPlaying(false);
    }, 1200);
  };

  const handleChunkClick = (index: number) => {
    playBlockClick();
    setActiveChunkIndex(activeChunkIndex === index ? null : index);
  };

  return (
    <div className="mc-card p-5 sm:p-6 text-slate-900 transition-transform duration-100 flex flex-col justify-between relative group">
      {/* Top row: Item info & Mastered checkbox */}
      <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b-2 border-[#8b8b8b]">
        <div className="flex items-center gap-2.5">
          {/* Minecraft Item Slot for Icon */}
          <div className="w-12 h-12 mc-slot-empty flex items-center justify-center text-3xl">
            {item.emoji}
          </div>
          <div>
            <span className="font-minecraft text-xs text-[#222222] tracking-wider block">
              ITEM #{item.id.toUpperCase()}
            </span>
            <span className="font-extrabold text-sm text-[#005500] bg-[#88ff88]/40 px-2 py-0.5 border border-[#44aa44]">
              {item.latvianTranslation}
            </span>
          </div>
        </div>

        {onStarWord && (
          <button
            onClick={() => {
              playBlockClick();
              onStarWord(item.id);
            }}
            className={`p-2 transition-all cursor-pointer ${
              isStarred
                ? 'mc-slot bg-[#ffd700] text-black'
                : 'mc-slot-empty text-[#777777] hover:text-[#ffd700]'
            }`}
            title="Apgūts vārds"
          >
            <Sparkles className={`w-5 h-5 ${isStarred ? 'fill-[#ffaa00] text-[#553300]' : ''}`} />
          </button>
        )}
      </div>

      {/* Main Minecraft Display:
          FISH
          FI + SH
          ⭐ SH = Š
          🔊 fish
      */}
      <div className="text-center my-2 flex flex-col items-center">
        {/* Large Word Header */}
        <h2 className="font-minecraft text-2xl sm:text-3xl text-[#1e1e1e] tracking-wider mb-4">
          {item.word}
        </h2>

        {/* Chunks in Minecraft Crafting Slots: FI + SH */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
          {item.chunks.map((chunk, idx) => {
            const isLast = idx === item.chunks.length - 1;
            const isSelected = activeChunkIndex === idx;

            return (
              <React.Fragment key={idx}>
                <button
                  onClick={() => handleChunkClick(idx)}
                  className={`min-w-14 h-12 px-3 flex items-center justify-center font-minecraft text-base sm:text-lg cursor-pointer transition-all ${
                    chunk.isSpecial
                      ? 'mc-slot bg-[#5b8731] text-white shadow-[0_0_8px_#55ff55]'
                      : 'mc-slot bg-[#c6c6c6] text-[#222222]'
                  } ${isSelected ? 'ring-4 ring-[#ffff55]' : 'hover:brightness-110'}`}
                  title={chunk.explanation || 'Skaņu bloks'}
                >
                  {chunk.text}
                </button>
                {!isLast && (
                  <span className="font-minecraft text-xl text-[#333333] select-none font-bold">
                    +
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Selected Chunk Explanation */}
        {activeChunkIndex !== null && item.chunks[activeChunkIndex]?.explanation && (
          <div className="mb-3 px-3 py-1.5 bg-[#ffffa0] border-2 border-[#bbbb00] text-[#443300] font-bold text-xs animate-fadeIn">
            {item.chunks[activeChunkIndex].text}: {item.chunks[activeChunkIndex].explanation}
          </div>
        )}

        {/* Stars Rules (⭐ SH = Š) */}
        <div className="w-full flex flex-col items-center gap-1.5 my-3">
          {item.stars.map((star, idx) => (
            <div
              key={idx}
              className="font-minecraft text-xs sm:text-sm text-[#000000] bg-[#ffff55] border-2 border-[#999900] px-4 py-2 shadow-[2px_2px_0_#444400]"
            >
              {star}
            </div>
          ))}
        </div>

        {/* Audio Button: 🔊 fish */}
        <div className="mt-3 w-full flex justify-center">
          <button
            onClick={handlePlayAudio}
            className={`mc-btn-green w-full sm:w-auto px-6 py-3 font-minecraft text-xs sm:text-sm text-white flex items-center justify-center gap-3 cursor-pointer shadow-md transition-all ${
              isPlaying ? 'brightness-125 scale-98 ring-2 ring-[#ffffff]' : 'hover:scale-102'
            }`}
          >
            <Volume2 className={`w-5 h-5 ${isPlaying ? 'animate-bounce text-[#ffff55]' : ''}`} />
            <span>KLAUSĪTIES: {item.lowercase}</span>
          </button>
        </div>
      </div>

      {/* Memory Hint / Lore */}
      <div className="mt-4 pt-3 border-t-2 border-[#8b8b8b] text-left">
        <p className="font-bold text-xs sm:text-sm text-[#2b2b2b] flex items-start gap-1.5">
          <span className="text-[#855a00] font-black shrink-0">📜</span>
          <span>{item.memoryTip}</span>
        </p>

        {item.specialComparison && (
          <div className="mt-2 p-2 bg-[#ffdddd] border border-[#cc6666] text-[#770000] font-bold text-xs flex items-start gap-1.5">
            <HelpCircle className="w-4 h-4 shrink-0 text-[#aa0000] mt-0.5" />
            <span>{item.specialComparison.note}</span>
          </div>
        )}
      </div>
    </div>
  );
};
