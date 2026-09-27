import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { WordItem } from '../types';
import { Volume2, ArrowRight, RotateCcw, Check } from 'lucide-react';
import { speakWord, playCraftSuccess, playXpOrbSound, playGentleTryAgain, playBlockClick } from '../utils/audio';

interface StageLetterBuilderProps {
  currentWord: WordItem;
  isSlowAudio: boolean;
  onNext: () => void;
}

export const StageLetterBuilder: React.FC<StageLetterBuilderProps> = ({
  currentWord,
  isSlowAudio,
  onNext,
}) => {
  const letters = useMemo(() => {
    return currentWord.word.toUpperCase().split('');
  }, [currentWord]);

  const [assembledLetters, setAssembledLetters] = useState<string[]>([]);
  const [availableTiles, setAvailableTiles] = useState<{ id: string; char: string }[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  const initTiles = useCallback(() => {
    const tiles = letters.map((char, idx) => ({
      id: `${char}-${idx}-${Math.random()}`,
      char,
    }));
    // Shuffle
    for (let i = tiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }
    setAvailableTiles(tiles);
    setAssembledLetters([]);
    setIsSuccess(false);
  }, [letters]);

  useEffect(() => {
    initTiles();
    speakWord(currentWord.lowercase, isSlowAudio);
  }, [currentWord, initTiles, isSlowAudio]);

  const handleTileClick = (tile: { id: string; char: string }) => {
    if (isSuccess) return;
    playBlockClick();

    const nextIndex = assembledLetters.length;
    const expected = letters[nextIndex];

    if (tile.char === expected) {
      const newAssembled = [...assembledLetters, tile.char];
      setAssembledLetters(newAssembled);
      setAvailableTiles((prev) => prev.filter((t) => t.id !== tile.id));

      if (newAssembled.length === letters.length) {
        setIsSuccess(true);
        playCraftSuccess();
        playXpOrbSound();
      }
    } else {
      playGentleTryAgain();
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-4 py-6">
      <div className="mc-card p-6 sm:p-8 border-4 border-black text-center">
        {/* Stage Badge */}
        <div className="mb-4">
          <span className="inline-block px-4 py-1.5 mc-slot bg-[#5b8731] text-white font-minecraft text-[11px] shadow-[0_0_8px_#55ff55]">
            8. POSMS: SALIEC VISU VĀRDU PA BURTIEM
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

        {/* Letter Slots */}
        <div className="my-5 p-4 mc-card-dark border-4 border-[#141414]">
          <p className="font-minecraft text-[10px] text-[#aaaaaa] mb-3">
            TAVA BURTU RINDA:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            {letters.map((_, idx) => {
              const placed = assembledLetters[idx];
              return (
                <div
                  key={idx}
                  className={`w-11 h-12 sm:w-13 sm:h-14 flex items-center justify-center font-minecraft text-lg sm:text-xl transition-all ${
                    placed
                      ? 'mc-slot bg-[#4b8b29] text-white shadow-[0_0_8px_#55ff55] animate-scaleIn'
                      : 'mc-slot-empty text-[#555555]'
                  }`}
                >
                  {placed || '_'}
                </div>
              );
            })}
          </div>
        </div>

        {/* Available Shuffled Letter Blocks */}
        <div className="my-5">
          <p className="font-minecraft text-[10px] text-[#333333] mb-3">
            NOSPIED BURTUS PAREIZĀ SECĪBĀ:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 min-h-[56px]">
            {availableTiles.length > 0 ? (
              availableTiles.map((tile) => (
                <button
                  key={tile.id}
                  onClick={() => handleTileClick(tile)}
                  className="mc-btn w-12 h-12 sm:w-14 sm:h-14 font-minecraft text-xl sm:text-2xl text-white cursor-pointer hover:brightness-110 active:scale-95"
                >
                  {tile.char}
                </button>
              ))
            ) : (
              <span className="font-minecraft text-xs text-emerald-800 flex items-center gap-1.5 bg-[#88ff88]/40 px-3 py-1.5 border border-[#33aa33]">
                <Check className="w-4 h-4" /> VISI BURTI SALIKTI!
              </span>
            )}
          </div>
        </div>

        {/* Success Alert */}
        {isSuccess && (
          <div className="p-4 mc-slot bg-[#5b8731] border-2 border-[#153308] text-center animate-fadeIn my-4 text-white">
            <h4 className="font-minecraft text-sm text-[#ffff55] mb-2">
              🎉 LIELISKI! VĀRDS SALIKTS: {currentWord.word}!
            </h4>
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => {
                  playBlockClick();
                  onNext();
                }}
                className="mc-btn-gold px-6 py-2.5 font-minecraft text-xs text-[#2b1c00] flex items-center gap-2 cursor-pointer shadow-md"
              >
                <span>NĀKAMAIS: UZRAKSTI PĒC ATTĒLA</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Reset button if stuck */}
        {!isSuccess && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={initTiles}
              className="text-xs font-bold text-[#555555] hover:text-[#000000] flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Sākt no jauna</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
