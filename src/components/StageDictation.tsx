import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { WordItem, DictationResult } from '../types';
import { Volume2, ArrowRight, CornerDownLeft, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import { speakWord, playBlockClick, playLevelUpSound, triggerCelebrationConfetti } from '../utils/audio';
import { LetterKeypad } from './LetterKeypad';

interface StageDictationProps {
  allWords: WordItem[];
  isSlowAudio: boolean;
  onFinishDictation: (results: DictationResult[]) => void;
}

export const StageDictation: React.FC<StageDictationProps> = ({
  allWords,
  isSlowAudio,
  onFinishDictation,
}) => {
  // Randomize all 10 words at the start of dictation
  const [shuffledWords, setShuffledWords] = useState<WordItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [results, setResults] = useState<DictationResult[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const initDictation = useCallback(() => {
    const randomized = [...allWords].sort(() => 0.5 - Math.random());
    setShuffledWords(randomized);
    setCurrentIndex(0);
    setTypedAnswer('');
    setResults([]);
    setIsCompleted(false);
  }, [allWords]);

  useEffect(() => {
    initDictation();
  }, [initDictation]);

  const currentWord = shuffledWords[currentIndex];

  const playCurrentAudio = useCallback(() => {
    if (currentWord) {
      speakWord(currentWord.lowercase, isSlowAudio);
    }
  }, [currentWord, isSlowAudio]);

  useEffect(() => {
    if (!isCompleted && currentWord) {
      playCurrentAudio();
    }
  }, [currentIndex, isCompleted, currentWord, playCurrentAudio]);

  const handleLetterPress = (letter: string) => {
    if (isCompleted) return;
    setTypedAnswer((prev) => prev + letter);
  };

  const handleBackspace = () => {
    if (isCompleted) return;
    setTypedAnswer((prev) => prev.slice(0, -1));
  };

  const handleSaveAndNext = () => {
    if (!typedAnswer.trim() || !currentWord) return;
    playBlockClick();

    const cleanInput = typedAnswer.trim().toUpperCase();
    const isCorrect = cleanInput === currentWord.word.toUpperCase();

    const newResult: DictationResult = {
      wordId: currentWord.id,
      targetWord: currentWord.word,
      userAnswer: cleanInput,
      isCorrect,
      chunksFormula: currentWord.chunkFormula,
      emoji: currentWord.emoji,
      soundRule: currentWord.stars[0] || currentWord.memoryTip,
    };

    const nextResults = [...results, newResult];
    setResults(nextResults);
    setTypedAnswer('');

    if (currentIndex + 1 < shuffledWords.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
      playLevelUpSound();
      triggerCelebrationConfetti();
    }
  };

  // Score summary
  const score = useMemo(() => {
    return results.filter((r) => r.isCorrect).length;
  }, [results]);

  if (isCompleted) {
    const wrongCount = results.length - score;

    return (
      <div className="max-w-2xl mx-auto px-3 sm:px-4 py-8">
        <div className="mc-card p-6 sm:p-8 border-4 border-black text-center">
          <div className="text-6xl mb-4 select-none">
            {score === 10 ? '🏆' : score >= 8 ? '⭐' : '📝'}
          </div>

          <h2 className="font-minecraft text-xl sm:text-2xl text-[#1e1e1e] mb-2">
            DIKTĀTS PABEIGTS!
          </h2>

          <div className="my-5 p-6 mc-card-dark border-4 border-[#141414] max-w-sm mx-auto">
            <p className="font-minecraft text-xs text-[#aaaaaa] mb-2">TAVS REZULTĀTS:</p>
            <div className="font-minecraft text-4xl sm:text-5xl text-[#55ff55] mc-text-shadow">
              {score} / {results.length}
            </div>
          </div>

          <p className="font-bold text-sm text-[#444444] mb-6">
            {score === 10
              ? 'Izcili! Visi 10 vārdi uzrakstīti nevainojami!'
              : `Labots darbs: pareizi ${score} no 10 vārdiem. Kļūdas: ${wrongCount}.`}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            {wrongCount > 0 ? (
              <button
                onClick={() => {
                  playBlockClick();
                  onFinishDictation(results);
                }}
                className="mc-btn-red px-6 py-3 font-minecraft text-xs text-white flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>PĀRIET UZ KĻŪDU LABOJUMU ({wrongCount})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex items-center gap-2 text-emerald-800 font-minecraft text-xs bg-emerald-100 p-3 border-2 border-emerald-500 justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Nav nevienas kļūdas! Visi 10 vārdi apgūti!</span>
              </div>
            )}

            <button
              onClick={initDictation}
              className="mc-btn-gold px-6 py-3 font-minecraft text-xs text-[#2b1c00] flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <RotateCcw className="w-4 h-4" />
              <span>PILDĪT DIKTĀTU VĒLREIZ</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-4 py-6">
      <div className="mc-card p-6 sm:p-8 border-4 border-black text-center">
        {/* Stage Badge & Progress */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <span className="inline-block px-3 py-1 mc-slot bg-[#a62e2e] text-white font-minecraft text-[10px]">
            11. POSMS: SKOLAS DIKTĀTS (TIKAI AUDIO)
          </span>
          <span className="font-minecraft text-xs text-[#333333]">
            VĀRDS {currentIndex + 1} no {shuffledWords.length}
          </span>
        </div>

        {/* Audio prompt button - ABSOLUTELY NO PICTURE OR CHUNK HINTS */}
        <div className="my-8 flex flex-col items-center justify-center">
          <button
            onClick={() => {
              playBlockClick();
              playCurrentAudio();
            }}
            className="mc-btn-green px-8 py-5 font-minecraft text-sm sm:text-base text-white flex items-center gap-3 cursor-pointer shadow-lg hover:scale-102"
          >
            <Volume2 className="w-6 h-6 animate-pulse text-[#ffff55]" />
            <span>NOKLAUSĪTIES VĀRDU</span>
          </button>
          <p className="font-bold text-xs text-[#666666] mt-3">
            Klausies tik reižu, cik nepieciešams, un ieraksti atbildi!
          </p>
        </div>

        {/* Input area */}
        <div className="my-5 max-w-sm mx-auto">
          <input
            type="text"
            value={typedAnswer}
            onChange={(e) => setTypedAnswer(e.target.value.toUpperCase())}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSaveAndNext();
            }}
            placeholder="Ieraksti vārdu..."
            className="w-full text-center font-minecraft text-xl sm:text-2xl py-3 mc-slot-empty text-[#ffff55] focus:outline-none focus:ring-2 focus:ring-[#55ff55]"
            autoFocus
          />
        </div>

        {/* Keypad */}
        <LetterKeypad
          onLetterPress={handleLetterPress}
          onBackspace={handleBackspace}
          onSubmit={handleSaveAndNext}
        />

        {/* Submit and Next word */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSaveAndNext}
            disabled={!typedAnswer.trim()}
            className="mc-btn-gold px-6 py-3 font-minecraft text-xs text-[#2b1c00] flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-40"
          >
            <span>
              {currentIndex + 1 === shuffledWords.length ? 'PABEIGT DIKTĀTU' : 'NĀKAMAIS VĀRDS'}
            </span>
            <CornerDownLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
