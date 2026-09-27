import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { StagePictureChoice } from './components/StagePictureChoice';
import { StageWordCard } from './components/StageWordCard';
import { StageSoundAssociation } from './components/StageSoundAssociation';
import { StageMissingLettersEasy } from './components/StageMissingLettersEasy';
import { StageMissingLettersMedium } from './components/StageMissingLettersMedium';
import { StageMissingLettersHard } from './components/StageMissingLettersHard';
import { StageChunkBuilder } from './components/StageChunkBuilder';
import { StageLetterBuilder } from './components/StageLetterBuilder';
import { StagePictureWriting } from './components/StagePictureWriting';
import { StageAudioWriting } from './components/StageAudioWriting';
import { StageDictation } from './components/StageDictation';
import { StageMistakeReview } from './components/StageMistakeReview';
import { SecretsComparisonModal } from './components/SecretsComparisonModal';
import { WORDS_DATA } from './data/words';
import { LearningMode, WordItem, DictationResult } from './types';
import { Sparkles, Heart, ChevronRight, ChevronLeft } from 'lucide-react';
import { playBlockClick } from './utils/audio';

export default function App() {
  const [currentMode, setCurrentMode] = useState<LearningMode>('picture-choice');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isSlowAudio, setIsSlowAudio] = useState(false);
  const [isSecretsOpen, setIsSecretsOpen] = useState(false);

  // Dictation mistakes storage
  const [dictationMistakes, setDictationMistakes] = useState<DictationResult[]>(() => {
    try {
      const saved = localStorage.getItem('mc_dictation_mistakes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // XP / Stars counter
  const [starsCount, setStarsCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('mc_child_english_stars');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('mc_child_english_stars', starsCount.toString());
    } catch {
      // ignore
    }
  }, [starsCount]);

  useEffect(() => {
    try {
      localStorage.setItem('mc_dictation_mistakes', JSON.stringify(dictationMistakes));
    } catch {
      // ignore
    }
  }, [dictationMistakes]);

  const currentWord = WORDS_DATA[currentWordIndex] || WORDS_DATA[0];

  const handleAddStar = (amount: number = 1) => {
    setStarsCount((prev) => prev + amount);
  };

  // Progression logic
  const handleNextStage = () => {
    switch (currentMode) {
      case 'picture-choice':
        setCurrentMode('word-card');
        handleAddStar(1);
        break;
      case 'word-card':
        setCurrentMode('sound-association');
        break;
      case 'sound-association':
        setCurrentMode('missing-letters-easy');
        handleAddStar(1);
        break;
      case 'missing-letters-easy':
        setCurrentMode('missing-letters-medium');
        handleAddStar(1);
        break;
      case 'missing-letters-medium':
        setCurrentMode('missing-letters-hard');
        handleAddStar(1);
        break;
      case 'missing-letters-hard':
        setCurrentMode('chunk-builder');
        handleAddStar(1);
        break;
      case 'chunk-builder':
        setCurrentMode('letter-builder');
        handleAddStar(1);
        break;
      case 'letter-builder':
        setCurrentMode('picture-writing');
        handleAddStar(1);
        break;
      case 'picture-writing':
        setCurrentMode('audio-writing');
        handleAddStar(2);
        break;
      case 'audio-writing':
        handleAddStar(2);
        // Advance to next word or go to Dictation if at last word
        if (currentWordIndex + 1 < WORDS_DATA.length) {
          setCurrentWordIndex((i) => i + 1);
          setCurrentMode('picture-choice');
        } else {
          setCurrentMode('dictation');
        }
        break;
      default:
        break;
    }
  };

  const handleFinishDictation = (results: DictationResult[]) => {
    const mistakes = results.filter((r) => !r.isCorrect);
    setDictationMistakes(mistakes);
    handleAddStar(results.filter((r) => r.isCorrect).length * 2);
    if (mistakes.length > 0) {
      setCurrentMode('mistake-review');
    }
  };

  const handleFinishAllMistakes = () => {
    setDictationMistakes([]);
    handleAddStar(10);
    setCurrentMode('dictation');
  };

  const handlePrevWord = () => {
    playBlockClick();
    setCurrentWordIndex((prev) => (prev > 0 ? prev - 1 : WORDS_DATA.length - 1));
  };

  const handleNextWord = () => {
    playBlockClick();
    setCurrentWordIndex((prev) => (prev + 1 < WORDS_DATA.length ? prev + 1 : 0));
  };

  return (
    <div className="min-h-screen mc-dirt-bg text-[#e0e0e0] flex flex-col font-['Nunito',sans-serif]">
      {/* Top Navbar */}
      <Navbar
        currentMode={currentMode}
        onSelectMode={setCurrentMode}
        currentWord={currentWord}
        allWords={WORDS_DATA}
        onSelectWord={(w) => {
          const idx = WORDS_DATA.findIndex((x) => x.id === w.id);
          if (idx >= 0) setCurrentWordIndex(idx);
        }}
        starsCount={starsCount}
        isSlowAudio={isSlowAudio}
        onToggleSlowAudio={() => setIsSlowAudio((prev) => !prev)}
        onOpenSecrets={() => setIsSecretsOpen(true)}
        mistakesCount={dictationMistakes.length}
      />

      {/* Word Quick Navigation bar (for stages 1 to 10) */}
      {currentMode !== 'dictation' && currentMode !== 'mistake-review' && (
        <div className="bg-[#1c140d]/90 border-b-2 border-[#332211] py-1.5 px-3">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-2 text-xs">
            <button
              onClick={handlePrevWord}
              className="mc-btn px-2.5 py-1 font-minecraft text-[10px] text-white flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">IEPRIEKŠĒJAIS</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xl select-none">{currentWord.emoji}</span>
              <span className="font-minecraft text-xs text-[#ffff55] mc-text-shadow">
                {currentWord.word}
              </span>
              <span className="text-xs text-[#aaaaaa] font-bold">
                ({currentWordIndex + 1} / {WORDS_DATA.length})
              </span>
            </div>

            <button
              onClick={handleNextWord}
              className="mc-btn px-2.5 py-1 font-minecraft text-[10px] text-white flex items-center gap-1 cursor-pointer"
            >
              <span className="hidden sm:inline">NĀKAMAIS</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area: Stage Switcher */}
      <main className="flex-1 pb-16">
        {currentMode === 'picture-choice' && (
          <StagePictureChoice
            currentWord={currentWord}
            allWords={WORDS_DATA}
            isSlowAudio={isSlowAudio}
            onSuccess={handleNextStage}
          />
        )}

        {currentMode === 'word-card' && (
          <StageWordCard
            currentWord={currentWord}
            isSlowAudio={isSlowAudio}
            onNext={handleNextStage}
          />
        )}

        {currentMode === 'sound-association' && (
          <StageSoundAssociation
            currentWord={currentWord}
            onNext={handleNextStage}
          />
        )}

        {currentMode === 'missing-letters-easy' && (
          <StageMissingLettersEasy
            currentWord={currentWord}
            isSlowAudio={isSlowAudio}
            onNext={handleNextStage}
          />
        )}

        {currentMode === 'missing-letters-medium' && (
          <StageMissingLettersMedium
            currentWord={currentWord}
            isSlowAudio={isSlowAudio}
            onNext={handleNextStage}
          />
        )}

        {currentMode === 'missing-letters-hard' && (
          <StageMissingLettersHard
            currentWord={currentWord}
            isSlowAudio={isSlowAudio}
            onNext={handleNextStage}
          />
        )}

        {currentMode === 'chunk-builder' && (
          <StageChunkBuilder
            currentWord={currentWord}
            isSlowAudio={isSlowAudio}
            onNext={handleNextStage}
          />
        )}

        {currentMode === 'letter-builder' && (
          <StageLetterBuilder
            currentWord={currentWord}
            isSlowAudio={isSlowAudio}
            onNext={handleNextStage}
          />
        )}

        {currentMode === 'picture-writing' && (
          <StagePictureWriting
            currentWord={currentWord}
            isSlowAudio={isSlowAudio}
            onNext={handleNextStage}
          />
        )}

        {currentMode === 'audio-writing' && (
          <StageAudioWriting
            currentWord={currentWord}
            isSlowAudio={isSlowAudio}
            onNext={handleNextStage}
          />
        )}

        {currentMode === 'dictation' && (
          <StageDictation
            allWords={WORDS_DATA}
            isSlowAudio={isSlowAudio}
            onFinishDictation={handleFinishDictation}
          />
        )}

        {currentMode === 'mistake-review' && (
          <StageMistakeReview
            initialMistakes={dictationMistakes}
            allWords={WORDS_DATA}
            isSlowAudio={isSlowAudio}
            onFinishAllMistakes={handleFinishAllMistakes}
          />
        )}
      </main>

      {/* Secrets Modal */}
      <SecretsComparisonModal
        isOpen={isSecretsOpen}
        onClose={() => setIsSecretsOpen(false)}
        isSlowAudio={isSlowAudio}
      />

      {/* Minecraft Footer */}
      <footer className="bg-[#1b1b1b] border-t-4 border-[#000000] py-5 px-4 text-center">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold text-[#888888]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#55ff55]" />
            <span className="font-minecraft text-[10px] text-[#55ff55]">
              MINE-SKAŅAS: 10 vārdi, 12 posmi, 100% pareizrakstība
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[#aaaaaa]">
            <span className="font-minecraft text-[10px]">CRAFTED FOR</span>
            <Heart className="w-3.5 h-3.5 text-[#ff5555] fill-[#ff5555] inline" />
            <span className="font-minecraft text-[10px]">CHAMPION</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
