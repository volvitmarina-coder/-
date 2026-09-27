import React, { useState } from 'react';
import { WordItem } from '../types';
import { Check, ArrowRight, Volume2 } from 'lucide-react';
import { speakWord, playXpOrbSound, playGentleTryAgain, playBlockClick } from '../utils/audio';

interface StageMissingLettersEasyProps {
  currentWord: WordItem;
  isSlowAudio: boolean;
  onNext: () => void;
}

export const StageMissingLettersEasy: React.FC<StageMissingLettersEasyProps> = ({
  currentWord,
  isSlowAudio,
  onNext,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const task = currentWord.missingEasy;

  const isCorrect = selectedOption === task.missing;

  const handleSelect = (option: string) => {
    if (isAnswered) return;
    playBlockClick();
    setSelectedOption(option);
    setIsAnswered(true);

    if (option === task.missing) {
      playXpOrbSound();
    } else {
      playGentleTryAgain();
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-4 py-6">
      <div className="mc-card p-6 sm:p-8 border-4 border-black text-center">
        {/* Stage Badge */}
        <div className="mb-4">
          <span className="inline-block px-4 py-1.5 mc-slot bg-[#4b8b29] text-white font-minecraft text-[11px] shadow-[0_0_8px_#55ff55]">
            4. POSMS: TRŪKSTOŠIE BURTI (VIEGLI)
          </span>
        </div>

        {/* Word Picture & Audio button */}
        <div className="flex flex-col items-center justify-center my-3">
          <div className="w-16 h-16 mc-slot-empty flex items-center justify-center text-4xl mb-2">
            {currentWord.emoji}
          </div>
          <button
            onClick={() => {
              playBlockClick();
              speakWord(currentWord.lowercase, isSlowAudio);
            }}
            className="mc-btn-green px-4 py-1.5 font-minecraft text-xs text-white flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Volume2 className="w-4 h-4" />
            <span>KLAUSĪTIES ({currentWord.lowercase})</span>
          </button>
        </div>

        {/* Target Missing Display */}
        <div className="my-6 p-5 mc-card-dark border-4 border-[#141414]">
          <p className="font-minecraft text-[10px] text-[#aaaaaa] mb-2">
            ATRODI TRŪKSTOŠOS BURTUS:
          </p>
          <div className="font-minecraft text-2xl sm:text-3xl text-white flex items-center justify-center gap-3">
            <span>{task.display.split('__')[0]}</span>
            <span
              className={`min-w-16 px-3 py-1 inline-block transition-all ${
                isAnswered
                  ? isCorrect
                    ? 'mc-slot bg-[#4b8b29] text-white shadow-[0_0_8px_#55ff55] scale-105'
                    : 'mc-slot bg-[#a62e2e] text-white'
                  : 'mc-slot-empty text-[#ffff55] border-2 border-dashed border-[#ffff55]'
              }`}
            >
              {isAnswered ? selectedOption : '? ?'}
            </span>
            <span>{task.display.split('__')[1] || ''}</span>
          </div>
        </div>

        {/* 3 Choices */}
        <div className="grid grid-cols-3 gap-3 my-5">
          {task.options.map((opt) => {
            const isSelected = selectedOption === opt;
            let style = 'mc-btn text-white';

            if (isAnswered) {
              if (opt === task.missing) {
                style = 'mc-btn-green text-white ring-4 ring-[#ffff55]';
              } else if (isSelected) {
                style = 'mc-btn-red text-white';
              } else {
                style = 'mc-btn opacity-40 text-[#777777]';
              }
            }

            return (
              <button
                key={opt}
                type="button"
                disabled={isAnswered}
                onClick={() => handleSelect(opt)}
                className={`py-4 px-3 font-minecraft text-xl sm:text-2xl cursor-pointer transition-all ${style}`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {/* Feedback message */}
        {isAnswered && (
          <div
            className={`p-4 border-2 my-4 animate-fadeIn ${
              isCorrect
                ? 'mc-slot bg-[#5b8731] text-white border-[#153308]'
                : 'mc-slot bg-[#a62e2e] text-white border-[#400f0f]'
            }`}
          >
            <div className="flex items-center justify-between gap-3 text-left">
              <div>
                <p className="font-minecraft text-xs text-[#ffff55] mb-1">
                  {isCorrect ? 'PAREIZI! XP +10' : 'MĒĢINI VĒLREIZ!'}
                </p>
                <p className="font-bold text-xs text-white">
                  {task.ruleTip} ({currentWord.word})
                </p>
              </div>

              {isCorrect ? (
                <button
                  onClick={() => {
                    playBlockClick();
                    onNext();
                  }}
                  className="mc-btn-gold px-5 py-2.5 font-minecraft text-xs text-[#2b1c00] flex items-center gap-2 shrink-0 cursor-pointer shadow-md"
                >
                  <span>TĀLĀK</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsAnswered(false);
                    setSelectedOption(null);
                  }}
                  className="mc-btn-gold px-4 py-2 font-minecraft text-xs text-[#2b1c00] shrink-0 cursor-pointer"
                >
                  VĒLREIZ
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
