import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { WordItem } from '../types';
import { Volume2, ArrowRight } from 'lucide-react';
import { speakWord, playXpOrbSound, playGentleTryAgain, playBlockClick } from '../utils/audio';

interface StagePictureChoiceProps {
  currentWord: WordItem;
  allWords: WordItem[];
  isSlowAudio: boolean;
  onSuccess: () => void;
}

export const StagePictureChoice: React.FC<StagePictureChoiceProps> = ({
  currentWord,
  allWords,
  isSlowAudio,
  onSuccess,
}) => {
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Generate 3 choices (the current word + 2 random distractors)
  const choices = useMemo(() => {
    const distractors = allWords
      .filter((w) => w.id !== currentWord.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);
    const combined = [currentWord, ...distractors];
    return combined.sort(() => 0.5 - Math.random());
  }, [currentWord, allWords]);

  const playAudio = useCallback(() => {
    speakWord(currentWord.lowercase, isSlowAudio);
  }, [currentWord.lowercase, isSlowAudio]);

  useEffect(() => {
    setSelectedWordId(null);
    setIsAnswered(false);
    setIsCorrect(false);
    // Play audio when entering stage
    playAudio();
  }, [currentWord, playAudio]);

  const handleSelect = (choice: WordItem) => {
    if (isAnswered) return;
    playBlockClick();
    setSelectedWordId(choice.id);
    setIsAnswered(true);

    if (choice.id === currentWord.id) {
      setIsCorrect(true);
      playXpOrbSound();
    } else {
      setIsCorrect(false);
      playGentleTryAgain();
    }
  };

  const handleNext = () => {
    playBlockClick();
    onSuccess();
  };

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-4 py-6">
      <div className="mc-card p-6 sm:p-8 border-4 border-black">
        {/* Instruction badge */}
        <div className="text-center mb-4">
          <span className="inline-block px-4 py-1.5 mc-slot bg-[#4b8b29] text-white font-minecraft text-[11px] shadow-[0_0_8px_#55ff55]">
            1. POSMS: KLAUSIES UN IZVĒLIES ATTĒLU
          </span>
        </div>

        {/* Audio prompt button - NO WRITTEN WORD! */}
        <div className="my-6 text-center">
          <button
            onClick={() => {
              playBlockClick();
              playAudio();
            }}
            className="mc-btn-green px-6 sm:px-8 py-4 sm:py-5 font-minecraft text-sm sm:text-base text-white flex items-center justify-center gap-3 mx-auto cursor-pointer shadow-lg hover:scale-102"
          >
            <Volume2 className="w-6 h-6 animate-pulse text-[#ffff55]" />
            <span>KLAUSIES VĀRDU</span>
          </button>
          <p className="font-bold text-xs text-[#555555] mt-2">
            Nospied, lai noklausītos vēlreiz
          </p>
        </div>

        {/* Picture choices grid (3-4 pictures) */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 my-6">
          {choices.map((choice) => {
            const isSelected = selectedWordId === choice.id;
            let cardStyle = 'mc-slot bg-[#c6c6c6] hover:brightness-110';

            if (isAnswered) {
              if (choice.id === currentWord.id) {
                cardStyle = 'mc-slot bg-[#5b8731] ring-4 ring-[#ffff55] scale-105';
              } else if (isSelected) {
                cardStyle = 'mc-slot bg-[#a62e2e] opacity-75';
              } else {
                cardStyle = 'mc-slot bg-[#c6c6c6] opacity-40';
              }
            }

            return (
              <button
                key={choice.id}
                type="button"
                disabled={isAnswered}
                onClick={() => handleSelect(choice)}
                className={`p-4 sm:p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${cardStyle}`}
              >
                <span className="text-5xl sm:text-6xl select-none">{choice.emoji}</span>
                <span className="font-bold text-xs sm:text-sm text-slate-800">
                  {choice.latvianTranslation}
                </span>
              </button>
            );
          })}
        </div>

        {/* Feedback and Continue */}
        {isAnswered && (
          <div
            className={`p-4 border-2 my-4 animate-fadeIn ${
              isCorrect
                ? 'mc-slot bg-[#5b8731] text-white border-[#153308]'
                : 'mc-slot bg-[#a62e2e] text-white border-[#400f0f]'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-minecraft text-xs text-[#ffff55] mb-1">
                  {isCorrect ? 'PAREIZS ATTĒLS! XP +10' : 'MĒĢINI VĒLREIZ!'}
                </p>
                <p className="font-bold text-xs text-white">
                  {isCorrect
                    ? `Tas ir: ${currentWord.latvianTranslation}. Tagad apskatīsim vārda burtus!`
                    : 'Noklausies vēlreiz un izvēlies pareizo attēlu.'}
                </p>
              </div>

              {isCorrect ? (
                <button
                  onClick={handleNext}
                  className="mc-btn-gold px-5 py-2.5 font-minecraft text-xs text-[#2b1c00] flex items-center gap-2 shrink-0 cursor-pointer shadow-md"
                >
                  <span>TĀLĀK</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsAnswered(false);
                    setSelectedWordId(null);
                    playAudio();
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
