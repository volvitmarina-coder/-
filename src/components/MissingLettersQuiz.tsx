import React, { useState } from 'react';
import { Volume2, Check, ArrowRight, RotateCcw } from 'lucide-react';
import { speakWord, playXpOrbSound, playGentleTryAgain, triggerCelebrationConfetti, playBlockClick, playLevelUpSound } from '../utils/audio';

interface MissingLetterQuizItem {
  id: string;
  word: string;
  lowercase: string;
  latvianTranslation: string;
  emoji: string;
  displayPrefix: string;
  missingLetters: string;
  displaySuffix: string;
  audioPromptWord: string;
  options: string[];
  ruleTip: string;
  explanation: string;
}

const QUIZ_ITEMS: MissingLetterQuizItem[] = [
  {
    id: 'm-fish',
    word: 'FISH',
    lowercase: 'fish',
    latvianTranslation: 'zivs',
    emoji: '🐟',
    displayPrefix: 'FI + ',
    missingLetters: 'SH',
    displaySuffix: '',
    audioPromptWord: 'fish',
    options: ['SH', 'CH', 'S'],
    ruleTip: '⭐ SH = Š',
    explanation: 'Vārdā FISH beigās rakstām SH, jo tas skan kā Š!',
  },
  {
    id: 'm-cheese-ch',
    word: 'CHEESE',
    lowercase: 'cheese',
    latvianTranslation: 'siers',
    emoji: '🧀',
    displayPrefix: '',
    missingLetters: 'CH',
    displaySuffix: ' + EE + SE',
    audioPromptWord: 'cheese',
    options: ['CH', 'SH', 'C'],
    ruleTip: '⭐ CH = Č',
    explanation: 'Vārdā CHEESE sākumā rakstām CH, jo tas skan kā Č!',
  },
  {
    id: 'm-cheese-ee',
    word: 'CHEESE',
    lowercase: 'cheese',
    latvianTranslation: 'siers',
    emoji: '🧀',
    displayPrefix: 'CH + ',
    missingLetters: 'EE',
    displaySuffix: ' + SE',
    audioPromptWord: 'cheese',
    options: ['EE', 'EA', 'II'],
    ruleTip: '⭐ EE = Ī',
    explanation: 'Vārdā CHEESE vidū ir divi E (EE), kas skan kā garš Ī!',
  },
  {
    id: 'm-meat',
    word: 'MEAT',
    lowercase: 'meat',
    latvianTranslation: 'gaļa',
    emoji: '🥩',
    displayPrefix: 'M + ',
    missingLetters: 'EA',
    displaySuffix: ' + T',
    audioPromptWord: 'meat',
    options: ['EA', 'EE', 'E'],
    ruleTip: '⭐ EA = Ī vārdā MEAT',
    explanation: 'Atceries: MEAT rakstām ar EA (skan kā garš Ī)!',
  },
  {
    id: 'm-bread',
    word: 'BREAD',
    lowercase: 'bread',
    latvianTranslation: 'maize',
    emoji: '🍞',
    displayPrefix: 'BR + ',
    missingLetters: 'EA',
    displaySuffix: ' + D',
    audioPromptWord: 'bread',
    options: ['EA', 'E', 'EE'],
    ruleTip: '⭐ EA = E vārdā BREAD',
    explanation: 'Atceries: vārdā BREAD rakstām EA, bet skan kā E!',
  },
  {
    id: 'm-eggs',
    word: 'EGGS',
    lowercase: 'eggs',
    latvianTranslation: 'olas',
    emoji: '🥚',
    displayPrefix: 'E + ',
    missingLetters: 'GG',
    displaySuffix: ' + S',
    audioPromptWord: 'eggs',
    options: ['GG', 'G', 'CK'],
    ruleTip: '⭐ Divi G!',
    explanation: 'Atceries: vārdā EGGS ir divi G burti (GG)!',
  },
  {
    id: 'm-rice',
    word: 'RICE',
    lowercase: 'rice',
    latvianTranslation: 'rīsi',
    emoji: '🍚',
    displayPrefix: 'RI + ',
    missingLetters: 'CE',
    displaySuffix: '',
    audioPromptWord: 'rice',
    options: ['CE', 'SE', 'S'],
    ruleTip: '⭐ Beigās rakstām CE',
    explanation: 'Atceries: beigās dzirdam S skaņu, bet rakstām CE!',
  },
  {
    id: 'm-juice',
    word: 'JUICE',
    lowercase: 'juice',
    latvianTranslation: 'sula',
    emoji: '🧃',
    displayPrefix: 'JUI + ',
    missingLetters: 'CE',
    displaySuffix: '',
    audioPromptWord: 'juice',
    options: ['CE', 'SE', 'C'],
    ruleTip: '⭐ Beigās rakstām CE',
    explanation: 'Atceries: tāpat kā RICE, arī JUICE beidzas ar CE!',
  },
  {
    id: 'm-sandwiches',
    word: 'SANDWICHES',
    lowercase: 'sandwiches',
    latvianTranslation: 'sviestmaizes',
    emoji: '🥪',
    displayPrefix: 'SAND + WICH + ',
    missingLetters: 'ES',
    displaySuffix: '',
    audioPromptWord: 'sandwiches',
    options: ['ES', 'S', 'IS'],
    ruleTip: '⭐ Beigās ES',
    explanation: 'Atceries vārda beigas: ES (un vidū CH = Č)!',
  },
  {
    id: 'm-chicken',
    word: 'CHICKEN',
    lowercase: 'chicken',
    latvianTranslation: 'vistas gaļa',
    emoji: '🍗',
    displayPrefix: 'CH + I + ',
    missingLetters: 'CK',
    displaySuffix: ' + EN',
    audioPromptWord: 'chicken',
    options: ['CK', 'K', 'C'],
    ruleTip: '⭐ CK = K',
    explanation: 'Atceries: vārdā CHICKEN vidū rakstām CK!',
  },
];

interface MissingLettersQuizProps {
  isSlowAudio: boolean;
  onAddStar: () => void;
}

export const MissingLettersQuiz: React.FC<MissingLettersQuizProps> = ({
  isSlowAudio,
  onAddStar,
}) => {
  const [index, setIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isDone, setIsDone] = useState(false);

  const current = QUIZ_ITEMS[index];

  const handleSelect = (option: string) => {
    if (isAnswered) return;
    playBlockClick();
    setSelectedOption(option);
    setIsAnswered(true);

    if (option === current.missingLetters) {
      setScore((s) => s + 1);
      playXpOrbSound();
      triggerCelebrationConfetti();
      onAddStar();
    } else {
      playGentleTryAgain();
    }
  };

  const handleNext = () => {
    playBlockClick();
    setSelectedOption(null);
    setIsAnswered(false);
    if (index + 1 < QUIZ_ITEMS.length) {
      setIndex((i) => i + 1);
    } else {
      setIsDone(true);
      playLevelUpSound();
    }
  };

  const handleRestart = () => {
    playBlockClick();
    setIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsDone(false);
  };

  if (isDone) {
    return (
      <div className="max-w-2xl mx-auto px-3 sm:px-4 py-8">
        <div className="mc-card p-8 border-4 border-[#000] text-center text-slate-900">
          <div className="text-6xl mb-4 select-none">💎</div>
          <h2 className="font-minecraft text-xl sm:text-2xl text-[#1e1e1e] mb-3">
            TESTS PABEIGTS AR DIAMANTIEM!
          </h2>
          <p className="font-bold text-base text-[#444444] mb-6">
            Rezultāts: <span className="font-minecraft text-emerald-700">{score}</span> no {QUIZ_ITEMS.length} pareizām atbildēm!
          </p>

          <button
            onClick={handleRestart}
            className="mc-btn-diamond px-6 py-3 font-minecraft text-xs text-white flex items-center justify-center gap-2 mx-auto cursor-pointer shadow-md"
          >
            <RotateCcw className="w-4 h-4" />
            <span>IZPILDĪT VĒLREIZ!</span>
          </button>
        </div>
      </div>
    );
  }

  const isCorrect = selectedOption === current.missingLetters;

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-4 py-6">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="font-minecraft text-xs text-[#ffff55] mc-text-shadow">
          JAUTĀJUMS {index + 1} / {QUIZ_ITEMS.length}
        </span>
        <span className="font-minecraft text-xs text-[#55ff55] mc-text-shadow">
          XP: +{score * 10}
        </span>
      </div>

      <div className="mc-card p-6 sm:p-8 border-4 border-[#000]">
        <div className="text-center mb-4">
          <span className="inline-block px-4 py-1 mc-slot bg-[#a62e2e] text-white font-minecraft text-[10px]">
            🏹 NOSLĒPUMA TESTS: KURŠ BLOKS TRŪKST?
          </span>
        </div>

        {/* Word Info & Audio */}
        <div className="flex flex-col items-center justify-center my-4">
          <div className="w-16 h-16 mc-slot-empty flex items-center justify-center text-4xl mb-2">
            {current.emoji}
          </div>
          <div className="font-bold text-xs text-[#333333] mb-2">
            Latviski: <span className="font-black text-[#005500]">{current.latvianTranslation}</span>
          </div>

          <button
            onClick={() => {
              playBlockClick();
              speakWord(current.audioPromptWord, isSlowAudio);
            }}
            className="mc-btn-green px-5 py-2 font-minecraft text-xs text-white flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Volume2 className="w-4 h-4" />
            <span>KLAUSĪTIES ({current.lowercase})</span>
          </button>
        </div>

        {/* Missing Formula Display */}
        <div className="my-6 p-4 mc-card-dark border-4 border-[#141414] text-center">
          <div className="font-minecraft text-xl sm:text-2xl text-[#ffffff] flex items-center justify-center gap-2 flex-wrap">
            {current.displayPrefix && <span>{current.displayPrefix}</span>}
            <span
              className={`min-w-20 px-3 py-1.5 inline-block transition-all ${
                isAnswered
                  ? isCorrect
                    ? 'mc-slot bg-[#4b8b29] text-white shadow-[0_0_8px_#55ff55] scale-105'
                    : 'mc-slot bg-[#a62e2e] text-white'
                  : 'mc-slot-empty text-[#ffff55] border-2 border-dashed border-[#ffff55]'
              }`}
            >
              {isAnswered ? selectedOption : '? ?'}
            </span>
            {current.displaySuffix && <span>{current.displaySuffix}</span>}
          </div>
        </div>

        {/* Options */}
        <div className="grid grid-cols-3 gap-3 my-5">
          {current.options.map((opt) => {
            const isSelected = selectedOption === opt;
            let style = 'mc-btn text-white';

            if (isAnswered) {
              if (opt === current.missingLetters) {
                style = 'mc-btn-green text-white ring-4 ring-[#ffff55]';
              } else if (isSelected) {
                style = 'mc-btn-red text-white';
              } else {
                style = 'mc-btn opacity-50 text-[#888888]';
              }
            }

            return (
              <button
                key={opt}
                onClick={() => handleSelect(opt)}
                disabled={isAnswered}
                className={`py-4 px-3 font-minecraft text-lg sm:text-2xl cursor-pointer transition-all ${style}`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {/* Feedback Alert */}
        {isAnswered && (
          <div
            className={`p-4 border-2 my-4 animate-fadeIn ${
              isCorrect
                ? 'mc-slot bg-[#5b8731] text-white border-[#153308]'
                : 'mc-slot bg-[#a62e2e] text-white border-[#400f0f]'
            }`}
          >
            <div className="flex items-start gap-2.5">
              <Check className={`w-5 h-5 mt-0.5 ${isCorrect ? 'text-[#ffff55]' : 'text-white'}`} />
              <div>
                <p className="font-minecraft text-xs text-[#ffff55] mb-1">
                  {isCorrect ? 'LIELISKI! BLOKS ATRASTS!' : 'IEGAUMĒ PAREIZO RECEPTI:'}
                </p>
                <p className="font-minecraft text-xs text-white bg-black/40 px-2 py-1 inline-block border border-white/20 mb-1">
                  {current.ruleTip}
                </p>
                <p className="font-bold text-xs text-[#e0e0e0] mt-1">
                  {current.explanation}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Next Button */}
        {isAnswered && (
          <div className="mt-5 flex justify-end">
            <button
              onClick={handleNext}
              className="mc-btn-gold px-6 py-3 font-minecraft text-xs text-[#2b1c00] flex items-center gap-2 cursor-pointer shadow-md"
            >
              <span>NĀKAMAIS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
