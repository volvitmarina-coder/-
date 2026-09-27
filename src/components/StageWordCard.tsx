import React, { useEffect } from 'react';
import { WordItem } from '../types';
import { Volume2, ArrowRight } from 'lucide-react';
import { speakWord, playBlockClick } from '../utils/audio';

interface StageWordCardProps {
  currentWord: WordItem;
  isSlowAudio: boolean;
  onNext: () => void;
}

export const StageWordCard: React.FC<StageWordCardProps> = ({
  currentWord,
  isSlowAudio,
  onNext,
}) => {
  useEffect(() => {
    speakWord(currentWord.lowercase, isSlowAudio);
  }, [currentWord, isSlowAudio]);

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-4 py-6">
      <div className="mc-card p-6 sm:p-8 border-4 border-black text-center">
        {/* Stage badge */}
        <div className="mb-4">
          <span className="inline-block px-4 py-1.5 mc-slot bg-[#383838] text-[#ffd700] font-minecraft text-[11px]">
            2. POSMS: VĀRDA KARTE UN DAĻAS
          </span>
        </div>

        {/* Word Picture & Latvian meaning */}
        <div className="flex flex-col items-center justify-center my-2">
          <div className="w-20 h-20 mc-slot-empty flex items-center justify-center text-5xl mb-2">
            {currentWord.emoji}
          </div>
          <span className="font-extrabold text-sm text-[#005500] bg-[#88ff88]/50 px-3 py-0.5 border border-[#33aa33]">
            {currentWord.latvianTranslation}
          </span>
        </div>

        {/* Full Word */}
        <h2 className="font-minecraft text-3xl sm:text-4xl text-[#1e1e1e] tracking-wider my-4">
          {currentWord.word}
        </h2>

        {/* Chunks visually split: CH + EE + SE */}
        <div className="p-4 mc-card-dark border-4 border-[#141414] my-5">
          <p className="font-minecraft text-[10px] text-[#aaaaaa] mb-3">
            ATCERIES VĀRDA DAĻAS (BLOKUS):
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {currentWord.chunks.map((chunk, idx) => {
              const isLast = idx === currentWord.chunks.length - 1;
              return (
                <React.Fragment key={idx}>
                  <div
                    className={`min-w-16 h-14 px-3 flex items-center justify-center font-minecraft text-lg sm:text-xl ${
                      chunk.isSpecial
                        ? 'mc-slot bg-[#5b8731] text-white shadow-[0_0_8px_#55ff55]'
                        : 'mc-slot bg-[#c6c6c6] text-[#222222]'
                    }`}
                  >
                    {chunk.text}
                  </div>
                  {!isLast && (
                    <span className="font-minecraft text-xl text-[#ffff55] select-none font-bold">
                      +
                    </span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Audio Button */}
        <div className="flex justify-center my-4">
          <button
            onClick={() => {
              playBlockClick();
              speakWord(currentWord.lowercase, isSlowAudio);
            }}
            className="mc-btn-green px-6 py-3 font-minecraft text-xs sm:text-sm text-white flex items-center gap-2.5 cursor-pointer shadow-md"
          >
            <Volume2 className="w-5 h-5 text-[#ffff55]" />
            <span>KLAUSĪTIES: {currentWord.lowercase}</span>
          </button>
        </div>

        {/* Next Stage Button */}
        <div className="mt-6 pt-4 border-t-2 border-[#8b8b8b] flex justify-end">
          <button
            onClick={() => {
              playBlockClick();
              onNext();
            }}
            className="mc-btn-gold px-6 py-3 font-minecraft text-xs text-[#2b1c00] flex items-center gap-2 cursor-pointer shadow-md"
          >
            <span>NĀKAMAIS: SKAŅAS LIKUMS</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
