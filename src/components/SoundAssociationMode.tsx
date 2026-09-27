import React, { useState, useEffect, useCallback } from 'react';
import { Volume2, ArrowRight, RotateCcw, Check, HelpCircle, ShieldAlert } from 'lucide-react';
import { speakWord, playXpOrbSound, playGentleTryAgain, triggerCelebrationConfetti, playBlockClick, playLevelUpSound } from '../utils/audio';

interface Question {
  id: string;
  word: string;
  lowercase: string;
  latvianTranslation: string;
  emoji: string;
  promptQuestion: string;
  targetSoundNotice: string;
  options: {
    label: string;
    isCorrect: boolean;
    ruleSnippet: string;
  }[];
  explanationAfter: string;
  formula: string;
}

const QUESTIONS: Question[] = [
  {
    id: 'q-fish',
    word: 'FISH',
    lowercase: 'fish',
    latvianTranslation: 'zivs',
    emoji: '🐟',
    promptQuestion: 'Vārdā FISH beigās dzirdi skaņu Š. Kādus burtus rakstīsi beigās?',
    targetSoundNotice: 'Dzirdi Š → atceries burtus!',
    options: [
      { label: 'SH', isCorrect: true, ruleSnippet: '⭐ SH = Š' },
      { label: 'CH', isCorrect: false, ruleSnippet: 'CH skan kā Č, nevis Š' },
      { label: 'S', isCorrect: false, ruleSnippet: 'Viens S nav Š skaņa' },
    ],
    explanationAfter: 'Atceries: SH = Š (FI + SH = FISH)',
    formula: 'FI + SH',
  },
  {
    id: 'q-cheese-ch',
    word: 'CHEESE',
    lowercase: 'cheese',
    latvianTranslation: 'siers',
    emoji: '🧀',
    promptQuestion: 'Vārdā CHEESE sākumā dzirdi skaņu Č. Kādus burtus rakstīsi sākumā?',
    targetSoundNotice: 'Dzirdi Č → atceries burtus!',
    options: [
      { label: 'CH', isCorrect: true, ruleSnippet: '⭐ CH = Č' },
      { label: 'SH', isCorrect: false, ruleSnippet: 'SH skan kā Š' },
      { label: 'C', isCorrect: false, ruleSnippet: 'Viens C neskan kā Č' },
    ],
    explanationAfter: 'Atceries: CH = Č (CH + EE + SE = CHEESE)',
    formula: 'CH + EE + SE',
  },
  {
    id: 'q-cheese-ee',
    word: 'CHEESE',
    lowercase: 'cheese',
    latvianTranslation: 'siers',
    emoji: '🧀',
    promptQuestion: 'Vārdā CHEESE vidū dzirdi garu Ī skaņu. Kādus burtus rakstīsi?',
    targetSoundNotice: 'Dzirdi garu Ī vārdā cheese → atceries burtus!',
    options: [
      { label: 'EE', isCorrect: true, ruleSnippet: '⭐ EE = Ī' },
      { label: 'EA', isCorrect: false, ruleSnippet: 'Vārdā cheese rakstām divus E (EE)' },
      { label: 'I', isCorrect: false, ruleSnippet: 'Viens I nav garš Ī šeit' },
    ],
    explanationAfter: 'Atceries: EE = Ī (CH + EE + SE)',
    formula: 'CH + EE + SE',
  },
  {
    id: 'q-meat',
    word: 'MEAT',
    lowercase: 'meat',
    latvianTranslation: 'gaļa',
    emoji: '🥩',
    promptQuestion: 'Dzirdi vārdu MEAT (gaļa). Kādus burtus rakstīsim vārdā MEAT?',
    targetSoundNotice: 'Dzirdi meat → atceries, ka šajā vārdā rakstām...',
    options: [
      { label: 'EA', isCorrect: true, ruleSnippet: '⭐ EA = Ī vārdā MEAT' },
      { label: 'EE', isCorrect: false, ruleSnippet: 'EE ir vārdā cheese, bet gaļa ir MEAT ar EA!' },
      { label: 'E', isCorrect: false, ruleSnippet: 'Šeit vajag divus burtus: EA' },
    ],
    explanationAfter: 'Atceries: MEAT rakstām ar EA (skan kā garš Ī)!',
    formula: 'M + EA + T',
  },
  {
    id: 'q-bread',
    word: 'BREAD',
    lowercase: 'bread',
    latvianTranslation: 'maize',
    emoji: '🍞',
    promptQuestion: 'Vārdā BREAD dzirdi skaņu E. Atceries lielo noslēpumu: kādus burtus rakstām?',
    targetSoundNotice: 'Dzirdi bread → atceries, kādus burtus rakstām!',
    options: [
      { label: 'EA', isCorrect: true, ruleSnippet: '⭐ EA = E vārdā BREAD' },
      { label: 'E', isCorrect: false, ruleSnippet: 'BREAD raksta ar diviem burtiem: EA' },
      { label: 'EE', isCorrect: false, ruleSnippet: 'EE skan kā garš Ī' },
    ],
    explanationAfter: 'Svarīgi: MEAT un BREAD raksta vienādi ar EA, bet BREAD skan kā E!',
    formula: 'BR + EA + D',
  },
  {
    id: 'q-eggs',
    word: 'EGGS',
    lowercase: 'eggs',
    latvianTranslation: 'olas',
    emoji: '🥚',
    promptQuestion: 'Vārdā EGGS ir divi vienādi burti. Cik G burtus rakstīsi?',
    targetSoundNotice: 'Dzirdi eggs → atceries dvīņu burtus!',
    options: [
      { label: 'GG (divi G)', isCorrect: true, ruleSnippet: '⭐ Divi G!' },
      { label: 'G (viens G)', isCorrect: false, ruleSnippet: 'Atceries: vārdā EGGS ir DIVI G' },
      { label: 'CK', isCorrect: false, ruleSnippet: 'Olas raksta ar G burtiem' },
    ],
    explanationAfter: 'Atceries: vārdā EGGS ir divi G (E + GG + S)!',
    formula: 'E + GG + S',
  },
  {
    id: 'q-rice',
    word: 'RICE',
    lowercase: 'rice',
    latvianTranslation: 'rīsi',
    emoji: '🍚',
    promptQuestion: 'Vārdā RICE beigās dzirdi skaņu S. Kādus burtus rakstīsi beigās?',
    targetSoundNotice: 'Dzirdi S beigās → ko rakstām?',
    options: [
      { label: 'CE', isCorrect: true, ruleSnippet: '⭐ Beigās rakstām CE' },
      { label: 'S', isCorrect: false, ruleSnippet: 'Beigās dzirdam S, bet rakstām CE' },
      { label: 'SE', isCorrect: false, ruleSnippet: 'Rīsos raksta CE' },
    ],
    explanationAfter: 'Atceries: beigās dzirdam S skaņu, bet rakstām CE!',
    formula: 'RI + CE',
  },
  {
    id: 'q-juice',
    word: 'JUICE',
    lowercase: 'juice',
    latvianTranslation: 'sula',
    emoji: '🧃',
    promptQuestion: 'Vārdā JUICE beigās dzirdi skaņu S. Tāpat kā rīsiem, kādus burtus rakstīsi beigās?',
    targetSoundNotice: 'Dzirdi S beigās vārdā juice → ko rakstām?',
    options: [
      { label: 'CE', isCorrect: true, ruleSnippet: '⭐ Beigās rakstām CE' },
      { label: 'S', isCorrect: false, ruleSnippet: 'Sulā un rīsos beigās rakstām CE' },
      { label: 'IS', isCorrect: false, ruleSnippet: 'Beigās ir CE' },
    ],
    explanationAfter: 'Atceries: abi vārdi RICE un JUICE beidzas ar CE!',
    formula: 'JUI + CE',
  },
  {
    id: 'q-sandwiches',
    word: 'SANDWICHES',
    lowercase: 'sandwiches',
    latvianTranslation: 'sviestmaizes',
    emoji: '🥪',
    promptQuestion: 'Vārdā SANDWICHES vidū ir Č (CH). Kādus burtus rakstīsi pašās beigās?',
    targetSoundNotice: 'Dzirdi daudzskaitli sviestmaizēm → atceries vārda beigas!',
    options: [
      { label: 'ES', isCorrect: true, ruleSnippet: '⭐ Beigās ES' },
      { label: 'S', isCorrect: false, ruleSnippet: 'Pēc CH beigās vajag ES' },
      { label: 'AS', isCorrect: false, ruleSnippet: 'Beigās ir ES' },
    ],
    explanationAfter: 'Atceries: SAND + WICH + ES (CH = Č un beigās ES)!',
    formula: 'SAND + WICH + ES',
  },
  {
    id: 'q-chicken',
    word: 'CHICKEN',
    lowercase: 'chicken',
    latvianTranslation: 'vistas gaļa',
    emoji: '🍗',
    promptQuestion: 'Vārdā CHICKEN vidū dzirdi K skaņu. Kādus divus burtus rakstīsi?',
    targetSoundNotice: 'Dzirdi K vidū → atceries burtus!',
    options: [
      { label: 'CK', isCorrect: true, ruleSnippet: '⭐ CK = K' },
      { label: 'K', isCorrect: false, ruleSnippet: 'Angļu valodā šeit rakstām CK' },
      { label: 'CH', isCorrect: false, ruleSnippet: 'CH ir Č (sākumā), bet vidū ir CK' },
    ],
    explanationAfter: 'Atceries: CH skan kā Č, bet CK skan kā K!',
    formula: 'CH + I + CK + EN',
  },
];

interface SoundAssociationModeProps {
  isSlowAudio: boolean;
  onAddStar: () => void;
  onOpenSecrets: () => void;
}

export const SoundAssociationMode: React.FC<SoundAssociationModeProps> = ({
  isSlowAudio,
  onAddStar,
  onOpenSecrets,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQ = QUESTIONS[currentIndex];

  const playCurrentWordAudio = useCallback(() => {
    if (currentQ) {
      speakWord(currentQ.lowercase, isSlowAudio);
    }
  }, [currentQ, isSlowAudio]);

  useEffect(() => {
    if (!isCompleted && currentQ) {
      playCurrentWordAudio();
    }
  }, [currentIndex, isCompleted, playCurrentWordAudio]);

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;

    setSelectedOptionIndex(idx);
    setIsAnswered(true);

    const chosen = currentQ.options[idx];
    if (chosen.isCorrect) {
      setIsCorrect(true);
      setFeedbackText(chosen.ruleSnippet);
      setScore((s) => s + 1);
      playXpOrbSound();
      triggerCelebrationConfetti();
      onAddStar();
    } else {
      setIsCorrect(false);
      setFeedbackText(chosen.ruleSnippet);
      playGentleTryAgain();
    }
  };

  const handleNext = () => {
    playBlockClick();
    setSelectedOptionIndex(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setFeedbackText('');

    if (currentIndex + 1 < QUESTIONS.length) {
      setCurrentIndex((i) => i + 1);
    } else {
      setIsCompleted(true);
      playLevelUpSound();
    }
  };

  const handleRestart = () => {
    playBlockClick();
    setCurrentIndex(0);
    setSelectedOptionIndex(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setFeedbackText('');
    setScore(0);
    setIsCompleted(false);
  };

  if (isCompleted) {
    return (
      <div className="max-w-2xl mx-auto px-3 sm:px-4 py-8">
        <div className="mc-card p-8 text-center text-slate-900 border-4 border-[#000]">
          <div className="text-6xl mb-4 select-none">🏆</div>
          <h2 className="font-minecraft text-xl sm:text-2xl text-[#222222] mb-3">
            UZVARA! MEDĪBAS PABEIGTAS!
          </h2>
          <p className="font-bold text-base text-[#444444] mb-6">
            Iegūti: <span className="font-minecraft text-emerald-700 font-black">{score}</span> no {QUESTIONS.length} XP punktiem!
          </p>

          <div className="mc-slot-empty p-5 mb-6 text-left border-2 border-[#111]">
            <h3 className="font-minecraft text-xs text-[#ffff55] mb-3 flex items-center gap-2">
              <span>📜</span> MINE-SKAŅU RECEPTES:
            </h3>
            <ul className="font-bold text-xs text-[#dddddd] space-y-2">
              <li>⭐ <span className="text-[#55ff55] font-minecraft">SH = Š</span> (fish)</li>
              <li>⭐ <span className="text-[#ffaa00] font-minecraft">CH = Č</span> (cheese, sandwiches, chicken)</li>
              <li>⭐ <span className="text-[#55ffff] font-minecraft">EE = Ī</span> (cheese)</li>
              <li>⭐ <span className="text-[#ff5555] font-minecraft">EA = Ī</span> (meat) pret <span className="text-[#ffaa00] font-minecraft">EA = E</span> (bread)</li>
              <li>⭐ <span className="text-[#55ff55] font-minecraft">BEIGĀS CE = S</span> (rice, juice)</li>
              <li>⭐ <span className="text-[#ff55ff] font-minecraft">DIVI G</span> (eggs)</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={handleRestart}
              className="mc-btn-gold px-6 py-3 font-minecraft text-xs text-[#2b1c00] flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <RotateCcw className="w-4 h-4" />
              <span>SPĒLĒT VĒLREIZ!</span>
            </button>
            <button
              onClick={() => {
                playBlockClick();
                onOpenSecrets();
              }}
              className="mc-btn-diamond px-6 py-3 font-minecraft text-xs text-white flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <HelpCircle className="w-4 h-4" />
              <span>NOSLĒPUMU GRĀMATA</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-4 py-6">
      {/* Minecraft Quest Bar */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="font-minecraft text-xs text-[#ffff55] mc-text-shadow">
          UZDEVUMS {currentIndex + 1} / {QUESTIONS.length}
        </span>
        <div className="flex items-center gap-2 font-minecraft text-xs text-[#55ff55] mc-text-shadow">
          <span>XP:</span>
          <span>+{score * 10}</span>
        </div>
      </div>

      {/* Main Quest Box */}
      <div className="mc-card p-6 sm:p-8 border-4 border-[#000]">
        {/* Sound prompt pill */}
        <div className="text-center mb-4">
          <span className="inline-block px-4 py-1.5 mc-slot bg-[#4b8b29] text-white font-minecraft text-[11px] shadow-[0_0_8px_#55ff55]">
            {currentQ.targetSoundNotice}
          </span>
        </div>

        {/* Word header */}
        <div className="flex flex-col items-center justify-center my-4">
          <div className="w-16 h-16 mc-slot-empty flex items-center justify-center text-4xl mb-2">
            {currentQ.emoji}
          </div>
          <div className="font-minecraft text-2xl text-[#1e1e1e] tracking-wider">
            {currentQ.word}
          </div>
          <div className="font-bold text-xs text-[#005500] bg-[#88ff88]/50 px-2 py-0.5 border border-[#33aa33] mt-1">
            {currentQ.latvianTranslation}
          </div>

          <button
            onClick={() => {
              playBlockClick();
              playCurrentWordAudio();
            }}
            className="mc-btn-green mt-4 px-5 py-2.5 font-minecraft text-xs text-white flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Volume2 className="w-4 h-4" />
            <span>KLAUSĪTIES: {currentQ.lowercase}</span>
          </button>
        </div>

        {/* Question prompt */}
        <p className="text-center font-bold text-base sm:text-lg text-[#1e1e1e] my-5 px-2">
          {currentQ.promptQuestion}
        </p>

        {/* 3 Minecraft Blocks Choices */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-5">
          {currentQ.options.map((opt, idx) => {
            const isSelected = selectedOptionIndex === idx;
            let blockClass = 'mc-btn text-white hover:brightness-110';

            if (isAnswered) {
              if (opt.isCorrect) {
                blockClass = 'mc-btn-green text-white ring-4 ring-[#ffff55]';
              } else if (isSelected && !opt.isCorrect) {
                blockClass = 'mc-btn-red text-white';
              } else {
                blockClass = 'mc-btn opacity-50 text-[#888888]';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                disabled={isAnswered}
                className={`py-4 px-4 font-minecraft text-xl sm:text-2xl cursor-pointer transition-all ${blockClass} ${
                  isSelected ? 'scale-102' : ''
                }`}
              >
                {opt.label}
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
              {isCorrect ? (
                <Check className="w-6 h-6 text-[#ffff55] shrink-0 mt-0.5" />
              ) : (
                <ShieldAlert className="w-6 h-6 text-[#ffff55] shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-minecraft text-xs text-[#ffff55] mb-1">
                  {isCorrect ? 'PAREIZI! XP PIEŠĶIRTS!' : 'IEGAUMĒ NOSLĒPUMU:'}
                </p>
                <p className="font-bold text-sm text-white">{feedbackText}</p>
                <p className="font-bold text-xs text-[#e0e0e0] mt-2 pt-2 border-t border-white/20">
                  {currentQ.explanationAfter}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Next Question */}
        {isAnswered && (
          <div className="mt-5 flex justify-end">
            <button
              onClick={handleNext}
              className="mc-btn-gold px-6 py-3 font-minecraft text-xs text-[#2b1c00] flex items-center gap-2 cursor-pointer shadow-md"
            >
              <span>NĀKAMAIS UZDEVUMS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
