import React, { useState } from 'react';
import { WordItem } from '../types';
import { Volume2, ArrowRight, Check, RotateCcw } from 'lucide-react';
import { speakWord, playXpOrbSound, playGentleTryAgain, playBlockClick } from '../utils/audio';
import { LetterKeypad } from './LetterKeypad';

interface StageMissingLettersMediumProps {
  currentWord: WordItem;
  isSlowAudio: boolean;
  onNext: () => void;
}

export const StageMissingLettersMedium: React.FC<StageMissingLettersMediumProps> = ({
  currentWord,
  isSlowAudio,
  onNext,
}) => {
  const [typedInput, setTypedInput] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const task = currentWord.missingMedium;
  const expected = task.missing.toUpperCase();

  const handleLetterPress = (letter: string) => {
    if (isAnswered) return;
    if (typedInput.length < expected.length) {
      setTypedInput((prev) => prev + letter);
    }
  };

  const handleBackspace = () => {
    if (isAnswered) return;
    setTypedInput((prev) => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    if (isAnswered || !typedInput.trim()) return;
    setIsAnswered(true);

    if (typedInput.trim().toUpperCase() === expected) {
      setIsCorrect(true);
      playXpOrbSound();
    } else {
      setIsCorrect(false);
      playGentleTryAgain();
    }
  };

  const handleRetry = () => {
    playBlockClick();
    setTypedInput('');
    setIsAnswered(false);
    setIsCorrect(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-4 py-6">
      <div className="mc-card p-6 sm:p-8 border-4 border-black text-center">
        {/* Stage Badge */}
        <div className="mb-4">
          <span className="inline-block px-4 py-1.5 mc-slot bg-[#df9e10] text-[#2b1c00] font-minecraft text-[11px]">
            5. POSMS: IERAKSTI BURTUS (VIDĒJI)
          </span>
        </div>

        {/* Word Picture & Audio button */}
        <div className="flex flex-col items-center justify-center my-2">
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

        {/* Display task: FI _ _ */}
        <div className="my-5 p-5 mc-card-dark border-4 border-[#141414]">
          <p className="font-minecraft text-[10px] text-[#aaaaaa] mb-2">
            IERAKSTI TRŪKSTOŠOS BURTUS PATSTĀVĪGI:
          </p>
          <div className="font-minecraft text-2xl sm:text-3xl text-white flex items-center justify-center gap-3">
            <span>{task.display.split('_')[0]}</span>
            <div className="min-w-20 px-3 py-1 mc-slot-empty border-2 border-[#55ff55] text-[#55ff55]">
              {typedInput || task.placeholder}
            </div>
            <span>{task.display.split('_').pop() || ''}</span>
          </div>
          {task.hint && (
            <p className="font-bold text-xs text-[#ffff88] mt-3">
              💡 Padoms: {task.hint}
            </p>
          )}
        </div>

        {/* Physical input fallback + virtual keypad */}
        <div className="max-w-xs mx-auto mb-2">
          <input
            type="text"
            value={typedInput}
            onChange={(e) => {
              if (!isAnswered) {
                setTypedInput(e.target.value.toUpperCase().slice(0, expected.length));
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit();
            }}
            placeholder="Ieraksti burtus..."
            className="w-full text-center font-minecraft text-lg py-2 mc-slot-empty text-[#55ff55] focus:outline-none focus:ring-2 focus:ring-[#55ff55]"
            disabled={isAnswered}
          />
        </div>

        {/* Virtual Letter Keypad */}
        <LetterKeypad
          onLetterPress={handleLetterPress}
          onBackspace={handleBackspace}
          onSubmit={handleSubmit}
          disabled={isAnswered}
        />

        {/* Feedback Alert */}
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
                  {isCorrect ? 'PAREIZI IERAKSTĪTS! XP +10' : 'KĻŪDA! MĒĢINI VĒLREIZ!'}
                </p>
                <p className="font-bold text-xs text-white">
                  {isCorrect
                    ? `Pareizi: ${currentWord.word} (${currentWord.stars[0]})`
                    : `Tava atbilde: "${typedInput}". Pareizie burti ir: ${expected}`}
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
                  onClick={handleRetry}
                  className="mc-btn-gold px-4 py-2 font-minecraft text-xs text-[#2b1c00] flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>MĒĢINI VĒLREIZ</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
