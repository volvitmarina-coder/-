import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { WordItem } from '../types';
import { Volume2, ArrowRight, RotateCcw, Check, Hammer } from 'lucide-react';
import { speakWord, playCraftSuccess, playXpOrbSound, playGentleTryAgain, playBlockClick } from '../utils/audio';

interface StageChunkBuilderProps {
  currentWord: WordItem;
  isSlowAudio: boolean;
  onNext: () => void;
}

export const StageChunkBuilder: React.FC<StageChunkBuilderProps> = ({
  currentWord,
  isSlowAudio,
  onNext,
}) => {
  const [assembledChunks, setAssembledChunks] = useState<string[]>([]);
  const [availableTiles, setAvailableTiles] = useState<{ id: string; text: string }[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  const chunkTexts = useMemo(() => {
    return currentWord.chunks.map((c) => c.text);
  }, [currentWord]);

  const initTiles = useCallback(() => {
    const tiles = currentWord.chunks.map((c, idx) => ({
      id: `${c.text}-${idx}-${Math.random()}`,
      text: c.text,
    }));
    // Shuffle chunks
    for (let i = tiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }
    setAvailableTiles(tiles);
    setAssembledChunks([]);
    setIsSuccess(false);
  }, [currentWord]);

  useEffect(() => {
    initTiles();
    speakWord(currentWord.lowercase, isSlowAudio);
  }, [currentWord, initTiles, isSlowAudio]);

  const handleTileClick = (tile: { id: string; text: string }) => {
    if (isSuccess) return;
    playBlockClick();

    const nextIndex = assembledChunks.length;
    const expected = chunkTexts[nextIndex];

    if (tile.text === expected) {
      const newAssembled = [...assembledChunks, tile.text];
      setAssembledChunks(newAssembled);
      setAvailableTiles((prev) => prev.filter((t) => t.id !== tile.id));

      if (newAssembled.length === chunkTexts.length) {
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
          <span className="inline-block px-4 py-1.5 mc-slot bg-[#383838] text-[#ffd700] font-minecraft text-[11px]">
            7. POSMS: SALIEC VĀRDU NO DAĻĀM (BLOKIEM)
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

        {/* Crafting Slots Target */}
        <div className="my-5 p-4 sm:p-5 mc-card-dark border-4 border-[#141414]">
          <p className="font-minecraft text-[10px] text-[#aaaaaa] mb-3">
            TAVA DAĻU RINDA:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {chunkTexts.map((_, idx) => {
              const placed = assembledChunks[idx];
              return (
                <div
                  key={idx}
                  className={`min-w-16 h-16 px-3 flex items-center justify-center font-minecraft text-xl transition-all ${
                    placed
                      ? 'mc-slot bg-[#4b8b29] text-white shadow-[0_0_8px_#55ff55] animate-scaleIn'
                      : 'mc-slot-empty text-[#555555]'
                  }`}
                >
                  {placed || '?'}
                </div>
              );
            })}
          </div>
        </div>

        {/* Available Chunk Blocks */}
        <div className="my-5">
          <p className="font-minecraft text-[10px] text-[#333333] mb-3">
            NOSPIED DAĻAS PAREIZĀ SECĪBĀ:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 min-h-[64px]">
            {availableTiles.length > 0 ? (
              availableTiles.map((tile) => (
                <button
                  key={tile.id}
                  onClick={() => handleTileClick(tile)}
                  className="mc-btn px-6 py-3.5 font-minecraft text-xl sm:text-2xl text-white cursor-pointer hover:brightness-110 active:scale-95"
                >
                  {tile.text}
                </button>
              ))
            ) : (
              <span className="font-minecraft text-xs text-emerald-800 flex items-center gap-1.5 bg-[#88ff88]/40 px-3 py-1.5 border border-[#33aa33]">
                <Check className="w-4 h-4" /> VISI BLOKI SALIKTI!
              </span>
            )}
          </div>
        </div>

        {/* Success Alert */}
        {isSuccess && (
          <div className="p-4 mc-slot bg-[#5b8731] border-2 border-[#153308] text-center animate-fadeIn my-4 text-white">
            <h4 className="font-minecraft text-sm text-[#ffff55] mb-2">
              🎉 SALIKTS: {currentWord.word}!
            </h4>
            <p className="font-minecraft text-xs text-white my-1">
              {currentWord.chunkFormula}
            </p>
            <p className="font-bold text-xs text-[#e0e0e0] mt-2">
              {currentWord.memoryTip}
            </p>

            <div className="mt-4 flex justify-center">
              <button
                onClick={() => {
                  playBlockClick();
                  onNext();
                }}
                className="mc-btn-gold px-6 py-2.5 font-minecraft text-xs text-[#2b1c00] flex items-center gap-2 cursor-pointer shadow-md"
              >
                <span>NĀKAMAIS: SALIEC PA BURTIEM</span>
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
              <span>Sākt no jauna šim vārdam</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
