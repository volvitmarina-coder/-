import React, { useState } from 'react';
import { WordItem } from '../types';
import { Volume2, ArrowRight, RotateCcw } from 'lucide-react';
import { speakWord, playXpOrbSound, playGentleTryAgain, playBlockClick } from '../utils/audio';
import { LetterKeypad } from './LetterKeypad';

interface StageMissingLettersHardProps {
  currentWord: WordItem;
  isSlowAudio: boolean;
  onNext: () => void;
}

export const StageMissingLettersHard: React.FC<StageMissingLettersHardProps> = ({
  currentWord,
  isSlowAudio,
  onNext,
}) => {
  const [typedInput, setTypedInput] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const task = currentWord.missingHard;
  const expectedMissing = task.missing.toUpperCase();
  const expectedFull = task.fullWord.toUpperCase();

  const handleLetterPress = (letter: string) => {
    if (isAnswered) return;
    if (typedInput.length < expectedFull.length) {
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

    const cleanInput = typedInput.trim().toUpperCase();
    // Accept either typing just the missing letters OR typing the whole completed word
    if (cleanInput === expectedMissing || cleanInput === expectedFull) {
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
          <span className="inline-block px-4 py-1.5 mc-slot bg-[#a62e2e] text-white font-minecraft text-[11px]">
            6. POSMS: TRŪKSTOŠIE BURTI (GRŪTI)
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

        {/* Display task: template with missing letters */}
        <div className="my-5 p-5 mc-card-dark border-4 border-[#141414]">
          <p className="font-minecraft text-[10px] text-[#aaaaaa] mb-2">
            ŠOBRĪD TRŪKST VĒL VAIRĀK BURTU:
          </p>
          <div className="font-minecraft text-xl sm:text-2xl text-[#ffff55] tracking-widest my-2">
            {task.display}
          </div>
          <p className="font-bold text-xs text-[#dddddd] mt-2">
            Ieraksti trūkstošos burtus vai visu vārdu!
          </p>
        </div>

        {/* Input box */}
        <div className="max-w-xs mx-auto mb-2">
          <input
            type="text"
            value={typedInput}
            onChange={(e) => {
              if (!isAnswered) {
                setTypedInput(e.target.value.toUpperCase().slice(0, expectedFull.length));
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
                  {isCorrect ? 'GRŪTAIS UZDEVUMS IZZIŅOTS! XP +15' : 'NAV PAREIZI!'}
                </p>
                <p className="font-bold text-xs text-white">
                  Pilns vārds ir: <strong className="font-minecraft">{currentWord.word}</strong> ({currentWord.chunkFormula})
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
