import React, { useState } from 'react';
import { WordItem } from '../types';
import { Sparkles, ArrowRight, Check } from 'lucide-react';
import { playXpOrbSound, playBlockClick } from '../utils/audio';

interface StageSoundAssociationProps {
  currentWord: WordItem;
  onNext: () => void;
}

export const StageSoundAssociation: React.FC<StageSoundAssociationProps> = ({
  currentWord,
  onNext,
}) => {
  const [hasTappedRemember, setHasTappedRemember] = useState(false);

  const handleConfirm = () => {
    playBlockClick();
    playXpOrbSound();
    setHasTappedRemember(true);
  };

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-4 py-6">
      <div className="mc-card p-6 sm:p-8 border-4 border-black text-center">
        {/* Stage Badge */}
        <div className="mb-4">
          <span className="inline-block px-4 py-1.5 mc-slot bg-[#df9e10] text-[#2b1c00] font-minecraft text-[11px]">
            3. POSMS: SKAŅAS UN BURTU LIKUMS
          </span>
        </div>

        {/* Association Spotlight */}
        <div className="my-5">
          <div className="text-4xl mb-2">{currentWord.emoji}</div>
          <h3 className="font-minecraft text-xl sm:text-2xl text-[#1e1e1e] mb-1">
            {currentWord.word}
          </h3>
          <p className="font-bold text-xs text-[#555555] mb-4">
            {currentWord.chunkFormula}
          </p>

          {/* Big Golden Star Rules Box */}
          <div className="my-6 p-5 sm:p-6 mc-slot bg-[#ffffaa] border-4 border-[#999900] shadow-[0_0_12px_#ffff55] max-w-lg mx-auto">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-[#886600]" />
              <span className="font-minecraft text-xs text-[#554400]">
                GALVENAIS LIKUMS LATVISKI:
              </span>
            </div>

            <div className="space-y-2">
              {currentWord.stars.map((star, idx) => (
                <div
                  key={idx}
                  className="font-minecraft text-base sm:text-xl text-[#000000] bg-white/80 border-2 border-[#bbbb00] py-2 px-3 shadow-xs"
                >
                  {star}
                </div>
              ))}
            </div>

            <p className="font-bold text-sm text-[#443300] mt-4 pt-3 border-t border-[#cccc00]">
              {currentWord.memoryTip}
            </p>
          </div>

          {/* Simple pedagogical connection */}
          <p className="font-bold text-sm text-[#2b2b2b] my-4">
            Dzirdi skaņu:{' '}
            <span className="font-minecraft text-[#005500] underline">
              {currentWord.soundAssociation.latvianSound}
            </span>{' '}
            ➔ Raksti burtus:{' '}
            <span className="font-minecraft text-[#880000] underline">
              {currentWord.soundAssociation.englishLetters}
            </span>
          </p>
        </div>

        {/* Confirmation Button */}
        <div className="mt-6 pt-4 border-t-2 border-[#8b8b8b] flex justify-center">
          {!hasTappedRemember ? (
            <button
              onClick={handleConfirm}
              className="mc-btn-green px-8 py-3.5 font-minecraft text-xs sm:text-sm text-white flex items-center gap-2 cursor-pointer shadow-md hover:scale-102"
            >
              <Check className="w-5 h-5 text-[#ffff55]" />
              <span>SAPRATU UN IEGAUMĒJU!</span>
            </button>
          ) : (
            <button
              onClick={() => {
                playBlockClick();
                onNext();
              }}
              className="mc-btn-gold px-8 py-3.5 font-minecraft text-xs sm:text-sm text-[#2b1c00] flex items-center gap-2 cursor-pointer shadow-md animate-scaleIn"
            >
              <span>TĀLĀK: PĀRBAUDI SEVI (VIEGLI)</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
