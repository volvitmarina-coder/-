import React, { useState } from 'react';
import { WordItem } from '../types';
import { Volume2, ArrowRight, RotateCcw } from 'lucide-react';
import { speakWord, playXpOrbSound, playGentleTryAgain, playBlockClick } from '../utils/audio';
import { LetterKeypad } from './LetterKeypad';

interface StagePictureWritingProps {
  currentWord: WordItem;
  isSlowAudio: boolean;
  onNext: () => void;
}

export const StagePictureWriting: React.FC<StagePictureWritingProps> = ({
  currentWord,
  isSlowAudio,
  onNext,
}) => {
  const [typedInput, setTypedInput] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const expected = currentWord.word.toUpperCase();

  const handleLetterPress = (letter: string) => {
    if (isAnswered) return;
    if (typedInput.length < expected.length + 3) {
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
          <span className="inline-block px-4 py-1.5 mc-slot bg-[#2ea6a6] text-white font-minecraft text-[11px]">
            9. POSMS: REDZI ATTĒLU ➔ UZRAKSTI VĀRDU
          </span>
        </div>

        {/* ONLY Picture & Speaker button */}
        <div className="my-5 flex flex-col items-center justify-center">
          <div className="w-24 h-24 mc-slot-empty flex items-center justify-center text-6xl mb-3">
            {currentWord.emoji}
          </div>
          <span className="font-extrabold text-sm text-[#005500] bg-[#88ff88]/50 px-3 py-0.5 border border-[#33aa33] mb-3">
            {currentWord.latvianTranslation}
          </span>

          <button
            onClick={() => {
              playBlockClick();
              speakWord(currentWord.lowercase, isSlowAudio);
            }}
            className="mc-btn-green px-5 py-2 font-minecraft text-xs text-white flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Volume2 className="w-4 h-4" />
            <span>NOKLAUSĪTIES VĀRDU</span>
          </button>
        </div>

        {/* Input box */}
        <div className="my-4 max-w-sm mx-auto">
          <p className="font-minecraft text-[10px] text-[#333333] mb-2">
            UZRAKSTI PILNU ANGLISKO VĀRDU:
          </p>
          <input
            type="text"
            value={typedInput}
            onChange={(e) => {
              if (!isAnswered) {
                setTypedInput(e.target.value.toUpperCase());
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit();
            }}
            placeholder="Raksti vārdu šeit..."
            className="w-full text-center font-minecraft text-xl sm:text-2xl py-3 mc-slot-empty text-[#ffff55] focus:outline-none focus:ring-2 focus:ring-[#55ff55]"
            disabled={isAnswered}
          />
        </div>

        {/* Keypad */}
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
                  {isCorrect ? 'LIELISKI UZRAKSTĪTS! XP +20' : 'MĒĢINI VĒLREIZ!'}
                </p>
                <p className="font-bold text-xs text-white">
                  {isCorrect
                    ? `Pareizi: ${currentWord.word} (${currentWord.chunkFormula})`
                    : `Tava atbilde: "${typedInput}". Pareizi ir: ${currentWord.word}`}
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
                  <span>MĒĢINĀT</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
