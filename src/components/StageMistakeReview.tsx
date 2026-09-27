import React, { useState, useEffect } from 'react';
import { WordItem, DictationResult } from '../types';
import { Volume2, ArrowRight, RotateCcw, CheckCircle2, CornerDownLeft } from 'lucide-react';
import { speakWord, playBlockClick, playXpOrbSound, playCraftSuccess, triggerCelebrationConfetti, playGentleTryAgain } from '../utils/audio';
import { LetterKeypad } from './LetterKeypad';

interface StageMistakeReviewProps {
  initialMistakes: DictationResult[];
  allWords: WordItem[];
  isSlowAudio: boolean;
  onFinishAllMistakes: () => void;
}

export const StageMistakeReview: React.FC<StageMistakeReviewProps> = ({
  initialMistakes,
  allWords,
  isSlowAudio,
  onFinishAllMistakes,
}) => {
  // Mode within review: 'review-list' or 'retest-dictation'
  const [reviewMode, setReviewMode] = useState<'review-list' | 'retest-dictation'>('review-list');
  const [activeMistakes, setActiveMistakes] = useState<DictationResult[]>(initialMistakes);

  // Retest state
  const [retestIndex, setRetestIndex] = useState(0);
  const [typedInput, setTypedInput] = useState('');
  const [remainingFailed, setRemainingFailed] = useState<DictationResult[]>([]);
  const [isRetestFinished, setIsRetestFinished] = useState(false);

  useEffect(() => {
    setActiveMistakes(initialMistakes);
    setReviewMode('review-list');
  }, [initialMistakes]);

  // Current retest item
  const currentRetestItem = activeMistakes[retestIndex];

  // Play audio for current retest item
  useEffect(() => {
    if (reviewMode === 'retest-dictation' && currentRetestItem && !isRetestFinished) {
      speakWord(currentRetestItem.targetWord.toLowerCase(), isSlowAudio);
    }
  }, [reviewMode, currentRetestItem, isRetestFinished, isSlowAudio]);

  const handleStartRetest = () => {
    playBlockClick();
    setRetestIndex(0);
    setTypedInput('');
    setRemainingFailed([]);
    setIsRetestFinished(false);
    setReviewMode('retest-dictation');
  };

  const handleRetestSubmit = () => {
    if (!typedInput.trim() || !currentRetestItem) return;
    playBlockClick();

    const cleanInput = typedInput.trim().toUpperCase();
    const isCorrect = cleanInput === currentRetestItem.targetWord.toUpperCase();

    let newFailed = [...remainingFailed];
    if (isCorrect) {
      playXpOrbSound();
    } else {
      playGentleTryAgain();
      newFailed.push({
        ...currentRetestItem,
        userAnswer: cleanInput,
        isCorrect: false,
      });
    }

    setRemainingFailed(newFailed);
    setTypedInput('');

    if (retestIndex + 1 < activeMistakes.length) {
      setRetestIndex((prev) => prev + 1);
    } else {
      // Completed this round of retest
      setIsRetestFinished(true);
      if (newFailed.length === 0) {
        playCraftSuccess();
        triggerCelebrationConfetti();
      }
    }
  };

  // If all mistakes are fixed!
  if (activeMistakes.length === 0 || (isRetestFinished && remainingFailed.length === 0)) {
    return (
      <div className="max-w-2xl mx-auto px-3 sm:px-4 py-8">
        <div className="mc-card p-6 sm:p-8 border-4 border-black text-center">
          <div className="text-6xl mb-4 select-none">🏆</div>
          <h2 className="font-minecraft text-xl sm:text-2xl text-[#1e1e1e] mb-2">
            VISAS KĻŪDAS IZLABOTAS!
          </h2>
          <p className="font-bold text-sm text-[#444444] mb-6">
            Lieliski! Visi vārdi tagad ir apgūti un uzrakstīti pareizi!
          </p>

          <button
            onClick={() => {
              playBlockClick();
              onFinishAllMistakes();
            }}
            className="mc-btn-green px-8 py-3.5 font-minecraft text-xs sm:text-sm text-white flex items-center justify-center gap-2 mx-auto cursor-pointer shadow-md"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>PABEIGT MĀCĪBAS</span>
          </button>
        </div>
      </div>
    );
  }

  // Retest dictation view
  if (reviewMode === 'retest-dictation') {
    if (isRetestFinished) {
      return (
        <div className="max-w-2xl mx-auto px-3 sm:px-4 py-8">
          <div className="mc-card p-6 sm:p-8 border-4 border-black text-center">
            <h2 className="font-minecraft text-xl text-[#1e1e1e] mb-3">
              KĻŪDU MINI-DIKTĀTA REZULTĀTS
            </h2>
            <p className="font-bold text-sm text-[#444444] mb-5">
              Vēl palikuši kļūdīti vārdi: {remainingFailed.length} no {activeMistakes.length}.
            </p>

            <button
              onClick={() => {
                setActiveMistakes(remainingFailed);
                setReviewMode('review-list');
              }}
              className="mc-btn-gold px-6 py-3 font-minecraft text-xs text-[#2b1c00] flex items-center justify-center gap-2 mx-auto cursor-pointer shadow-md"
            >
              <RotateCcw className="w-4 h-4" />
              <span>SKATĪT PALIKUŠĀS KĻŪDAS</span>
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-2xl mx-auto px-3 sm:px-4 py-6">
        <div className="mc-card p-6 sm:p-8 border-4 border-black text-center">
          <div className="flex items-center justify-between gap-3 mb-4">
            <span className="inline-block px-3 py-1 mc-slot bg-[#a62e2e] text-white font-minecraft text-[10px]">
              KĻŪDU MINI-DIKTĀTS
            </span>
            <span className="font-minecraft text-xs text-[#333333]">
              {retestIndex + 1} no {activeMistakes.length}
            </span>
          </div>

          <div className="my-6 flex flex-col items-center justify-center">
            <button
              onClick={() => {
                playBlockClick();
                speakWord(currentRetestItem.targetWord.toLowerCase(), isSlowAudio);
              }}
              className="mc-btn-green px-6 py-4 font-minecraft text-sm text-white flex items-center gap-3 cursor-pointer shadow-md"
            >
              <Volume2 className="w-5 h-5 text-[#ffff55]" />
              <span>KLAUSĪTIES VĀRDU</span>
            </button>
          </div>

          <div className="my-4 max-w-sm mx-auto">
            <input
              type="text"
              value={typedInput}
              onChange={(e) => setTypedInput(e.target.value.toUpperCase())}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRetestSubmit();
              }}
              placeholder="Ieraksti vārdu pareizi..."
              className="w-full text-center font-minecraft text-xl py-3 mc-slot-empty text-[#ffff55] focus:outline-none focus:ring-2 focus:ring-[#55ff55]"
              autoFocus
            />
          </div>

          <LetterKeypad
            onLetterPress={(l) => setTypedInput((p) => p + l)}
            onBackspace={() => setTypedInput((p) => p.slice(0, -1))}
            onSubmit={handleRetestSubmit}
          />

          <div className="mt-5 flex justify-end">
            <button
              onClick={handleRetestSubmit}
              disabled={!typedInput.trim()}
              className="mc-btn-gold px-6 py-2.5 font-minecraft text-xs text-[#2b1c00] flex items-center gap-2 cursor-pointer disabled:opacity-40"
            >
              <span>APSTIPRINĀT</span>
              <CornerDownLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default: Review list view showing exact comparison as requested by user:
  // "Your answer: chese
  // Correct: cheese
  // Show: CH + EE + SE"
  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-4 py-6">
      <div className="mc-card p-6 sm:p-8 border-4 border-black">
        {/* Header */}
        <div className="text-center mb-6">
          <span className="inline-block px-4 py-1.5 mc-slot bg-[#a62e2e] text-white font-minecraft text-[11px]">
            12. POSMS: KĻŪDU LABOJUMS UN ANALĪZE
          </span>
          <h2 className="font-minecraft text-lg sm:text-xl text-[#1e1e1e] mt-3">
            APSVEDĪSIM PIEĻAUTĀS KĻŪDAS ({activeMistakes.length}):
          </h2>
        </div>

        {/* Mistakes List */}
        <div className="space-y-4 my-6">
          {activeMistakes.map((item, idx) => (
            <div
              key={idx}
              className="mc-card-dark p-4 sm:p-5 border-2 border-black flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 mc-slot-empty flex items-center justify-center text-3xl shrink-0">
                  {item.emoji}
                </div>
                <div>
                  <div className="font-bold text-xs text-[#ff7777] mb-1">
                    Tava atbilde:{' '}
                    <span className="line-through font-minecraft text-sm text-[#ffaaaa]">
                      {item.userAnswer || '(tukšs)'}
                    </span>
                  </div>
                  <div className="font-bold text-xs text-[#55ff55]">
                    Pareizi:{' '}
                    <span className="font-minecraft text-base text-[#ffff55]">
                      {item.targetWord}
                    </span>
                  </div>
                  <div className="font-minecraft text-xs text-[#00ffff] mt-1">
                    Sadalījums: {item.chunksFormula}
                  </div>
                  <div className="font-bold text-xs text-[#dddddd] mt-1">
                    {item.soundRule}
                  </div>
                </div>
              </div>

              {/* Pronunciation button */}
              <button
                onClick={() => {
                  playBlockClick();
                  speakWord(item.targetWord.toLowerCase(), isSlowAudio);
                }}
                className="mc-btn-green px-4 py-2 font-minecraft text-xs text-white flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-sm"
              >
                <Volume2 className="w-4 h-4" />
                <span>KLAUSĪTIES</span>
              </button>
            </div>
          ))}
        </div>

        {/* Start mini-dictation button */}
        <div className="mt-8 pt-4 border-t-2 border-[#8b8b8b] flex justify-center">
          <button
            onClick={handleStartRetest}
            className="mc-btn-gold px-8 py-4 font-minecraft text-xs sm:text-sm text-[#2b1c00] flex items-center gap-3 cursor-pointer shadow-lg hover:scale-102"
          >
            <span>SĀKT KĻŪDU MINI-DIKTĀTU ({activeMistakes.length})</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
