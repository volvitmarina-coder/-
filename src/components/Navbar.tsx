import React, { useState } from 'react';
import { Volume2, BookOpen, ChevronDown, Sparkles, Check, ChevronRight } from 'lucide-react';
import { LearningMode, WordItem } from '../types';
import { STAGES_INFO } from '../data/words';
import { playBlockClick } from '../utils/audio';

interface NavbarProps {
  currentMode: LearningMode;
  onSelectMode: (mode: LearningMode) => void;
  currentWord: WordItem;
  allWords: WordItem[];
  onSelectWord: (word: WordItem) => void;
  starsCount: number;
  isSlowAudio: boolean;
  onToggleSlowAudio: () => void;
  onOpenSecrets: () => void;
  mistakesCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMode,
  onSelectMode,
  currentWord,
  allWords,
  onSelectWord,
  starsCount,
  isSlowAudio,
  onToggleSlowAudio,
  onOpenSecrets,
  mistakesCount = 0,
}) => {
  const [isStageMenuOpen, setIsStageMenuOpen] = useState(false);
  const [isWordMenuOpen, setIsWordMenuOpen] = useState(false);

  const playerLevel = Math.floor(starsCount / 5) + 1;
  const progressInLevel = ((starsCount % 5) / 5) * 100;

  const currentStageInfo = STAGES_INFO.find((s) => s.id === currentMode) || STAGES_INFO[0];

  return (
    <header className="sticky top-0 z-30 bg-[#2b2b2b] border-b-4 border-[#141414] shadow-xl">
      {/* Minecraft Grass Top Border */}
      <div className="h-2 w-full bg-[#5b8731] border-b border-[#3e601f]" />

      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2.5">
        {/* Logo and Level */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-[#5b8731] border-2 border-[#1c3008] shadow-[inset_2px_2px_0_#79c54e,inset_-2px_-2px_0_#3e601f] flex items-center justify-center text-xl shrink-0 select-none">
            ⛏️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-minecraft text-sm sm:text-base text-white mc-text-shadow tracking-wider">
                MINE·SKAŅAS
              </h1>
              <span className="font-pixel text-[10px] text-[#55ff55] bg-[#1a3311] border border-[#2b591b] px-1.5 py-0.5">
                LVL {playerLevel}
              </span>
            </div>
            <p className="font-bold text-[11px] text-[#aaaaaa]">
              Pareizrakstības treniņš 7 gadiem
            </p>
          </div>
        </div>

        {/* Word Switcher & Stage Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Word Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                playBlockClick();
                setIsWordMenuOpen(!isWordMenuOpen);
                setIsStageMenuOpen(false);
              }}
              className="mc-slot bg-[#383838] px-3 py-1.5 flex items-center gap-1.5 text-xs text-white cursor-pointer hover:brightness-110"
              title="Izvēlēties vārdu"
            >
              <span className="text-base select-none">{currentWord.emoji}</span>
              <span className="font-minecraft text-[11px] text-[#ffff55]">
                {currentWord.word}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#aaaaaa]" />
            </button>

            {isWordMenuOpen && (
              <div className="absolute left-0 top-full mt-1 w-48 mc-card-dark p-2 border-2 border-black z-50 shadow-2xl grid grid-cols-2 gap-1 animate-fadeIn">
                {allWords.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => {
                      playBlockClick();
                      onSelectWord(w);
                      setIsWordMenuOpen(false);
                    }}
                    className={`p-1.5 flex items-center gap-1.5 text-left font-minecraft text-[10px] transition-all cursor-pointer ${
                      w.id === currentWord.id
                        ? 'mc-slot bg-[#4b8b29] text-white'
                        : 'mc-slot-empty text-[#cccccc] hover:text-white'
                    }`}
                  >
                    <span>{w.emoji}</span>
                    <span>{w.word}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Stage Dropdown Selector */}
          <div className="relative">
            <button
              onClick={() => {
                playBlockClick();
                setIsStageMenuOpen(!isStageMenuOpen);
                setIsWordMenuOpen(false);
              }}
              className="mc-btn-gold px-3 py-1.5 flex items-center gap-1.5 text-xs text-[#2b1c00] cursor-pointer shadow-xs"
              title="Visi 12 posmi"
            >
              <span className="text-sm select-none">{currentStageInfo.icon}</span>
              <span className="font-minecraft text-[10px]">
                {currentStageInfo.number}. {currentStageInfo.titleLv}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#4a3400]" />
            </button>

            {isStageMenuOpen && (
              <div className="absolute right-0 sm:left-0 top-full mt-1 w-72 sm:w-80 mc-card-dark p-2 border-4 border-black z-50 shadow-2xl max-h-96 overflow-y-auto animate-fadeIn">
                <p className="font-minecraft text-[10px] text-[#ffff55] mb-2 px-2 pb-1 border-b border-[#444444]">
                  IZVĒLIES POSMU (1 - 12):
                </p>
                <div className="space-y-1">
                  {STAGES_INFO.map((stage) => {
                    const isCurrent = stage.id === currentMode;
                    return (
                      <button
                        key={stage.id}
                        onClick={() => {
                          playBlockClick();
                          onSelectMode(stage.id);
                          setIsStageMenuOpen(false);
                        }}
                        className={`w-full p-2 flex items-center justify-between text-left transition-all cursor-pointer ${
                          isCurrent
                            ? 'mc-slot bg-[#4b8b29] text-white ring-2 ring-[#ffff55]'
                            : 'mc-slot-empty text-[#dddddd] hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base select-none">{stage.icon}</span>
                          <div>
                            <span className="font-minecraft text-[10px] block">
                              {stage.number}. {stage.titleLv}
                            </span>
                            <span className="text-[10px] text-[#aaaaaa] font-bold">
                              {stage.shortTitleLv}
                            </span>
                          </div>
                        </div>
                        {stage.id === 'mistake-review' && mistakesCount > 0 && (
                          <span className="font-minecraft text-[9px] bg-[#a62e2e] text-white px-1.5 py-0.5 border border-red-400">
                            {mistakesCount}
                          </span>
                        )}
                        {isCurrent && <Check className="w-4 h-4 text-[#ffff55]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Audio speed */}
          <button
            onClick={() => {
              playBlockClick();
              onToggleSlowAudio();
            }}
            className="mc-btn px-2.5 py-1.5 text-xs text-white font-bold flex items-center gap-1.5 cursor-pointer"
            title="Pārslēgt balss ātrumu"
          >
            <Volume2 className="w-3.5 h-3.5 text-[#55ffff]" />
            <span className="font-minecraft text-[10px]">
              {isSlowAudio ? '🐢' : '⚡'}
            </span>
          </button>

          {/* Secrets Book */}
          <button
            onClick={() => {
              playBlockClick();
              onOpenSecrets();
            }}
            className="mc-btn-diamond px-2.5 py-1.5 text-xs text-white font-bold flex items-center gap-1 cursor-pointer"
            title="Lielie noslēpumi"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#e0ffff]" />
            <span className="font-minecraft text-[10px] hidden sm:inline">LIKUMI</span>
          </button>

          {/* XP */}
          <div className="mc-card-dark px-2.5 py-1 flex items-center gap-1.5 border border-[#111]">
            <span className="text-sm select-none">🟩</span>
            <span className="font-minecraft text-[11px] text-[#55ff55] mc-text-shadow">
              {starsCount}
            </span>
          </div>
        </div>
      </div>

      {/* Minecraft XP Progress Bar */}
      <div className="w-full bg-[#1b1b1b] h-2.5 border-y border-black relative flex items-center justify-center">
        <div
          className="absolute left-0 top-0 bottom-0 bg-[#55ff55] shadow-[0_0_8px_#55ff55] transition-all duration-300"
          style={{ width: `${progressInLevel}%` }}
        />
        <span className="relative z-10 font-minecraft text-[8px] text-[#55ff55] mc-text-shadow">
          LĪMENIS {playerLevel}
        </span>
      </div>

      {/* Stage Hotbar Tracker (12 Stages) */}
      <div className="bg-[#1e1e1e] border-t border-[#333333] px-2 py-1 overflow-x-auto">
        <div className="max-w-6xl mx-auto flex items-center justify-start sm:justify-center gap-1 min-w-max">
          {STAGES_INFO.map((stage) => {
            const isCurrent = stage.id === currentMode;
            return (
              <button
                key={stage.id}
                onClick={() => {
                  playBlockClick();
                  onSelectMode(stage.id);
                }}
                className={`px-2 py-1 flex items-center gap-1 font-minecraft text-[9px] transition-all cursor-pointer ${
                  isCurrent
                    ? 'mc-slot bg-[#4b8b29] text-white border-[#153308] ring-1 ring-[#ffff55]'
                    : 'mc-slot-empty text-[#888888] hover:text-white'
                }`}
                title={stage.titleLv}
              >
                <span>{stage.icon}</span>
                <span>{stage.shortTitleLv}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
