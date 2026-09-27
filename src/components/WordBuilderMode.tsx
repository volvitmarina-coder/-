import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { WordItem } from '../types';
import { Volume2, ArrowRight, RotateCcw, Check, Hammer } from 'lucide-react';
import { speakWord, playCraftSuccess, playXpOrbSound, playGentleTryAgain, triggerCelebrationConfetti, playBlockClick } from '../utils/audio';

interface WordBuilderModeProps {
  words: WordItem[];
  isSlowAudio: boolean;
  onAddStar: () => void;
}

export const WordBuilderMode: React.FC<WordBuilderModeProps> = ({
  words,
  isSlowAudio,
  onAddStar,
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [assembledChunks, setAssembledChunks] = useState<string[]>([]);
  const [availableTiles, setAvailableTiles] = useState<{ id: string; text: string }[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  const currentWord = words[currentWordIndex];

  const chunkTexts = useMemo(() => {
    return currentWord ? currentWord.chunks.map((c) => c.text) : [];
  }, [currentWord]);

  const initTiles = useCallback(() => {
    if (!currentWord) return;
    const tiles = currentWord.chunks.map((c, idx) => ({
      id: `${c.text}-${idx}-${Math.random()}`,
      text: c.text,
    }));
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
    if (currentWord) {
      speakWord(currentWord.lowercase, isSlowAudio);
    }
  }, [currentWordIndex, initTiles, currentWord, isSlowAudio]);

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
        triggerCelebrationConfetti();
        onAddStar();
      }
    } else {
      playGentleTryAgain();
    }
  };

  const handleResetCurrent = () => {
    playBlockClick();
    initTiles();
  };

  const handleNextWord = () => {
    playBlockClick();
    if (currentWordIndex + 1 < words.length) {
      setCurrentWordIndex((i) => i + 1);
    } else {
      setCurrentWordIndex(0);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-4 py-6">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="font-minecraft text-xs text-[#ffff55] mc-text-shadow">
          KRAFTINGS {currentWordIndex + 1} / {words.length}
        </span>
        <button
          onClick={handleResetCurrent}
          className="font-minecraft text-[10px] text-[#e0e0e0] hover:text-[#ffff55] flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>ATTĪRĪT GALDU</span>
        </button>
      </div>

      {/* Crafting Table Box */}
      <div className="mc-card p-6 sm:p-8 border-4 border-[#000]">
        <div className="text-center mb-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 mc-slot bg-[#383838] text-[#ffd700] font-minecraft text-[11px]">
            <Hammer className="w-4 h-4 text-[#ffd700]" />
            <span>KRAFTINGS: IELIEC RECEPTĒ BLOKUS!</span>
          </span>
        </div>

        {/* Word Clue and Audio */}
        <div className="flex flex-col items-center justify-center my-3">
          <div className="w-16 h-16 mc-slot-empty flex items-center justify-center text-4xl mb-2">
            {currentWord.emoji}
          </div>
          <p className="font-bold text-sm text-[#333333] mb-2">
            Latviski: <span className="font-black text-[#005500]">{currentWord.latvianTranslation}</span>
          </p>

          <button
            onClick={() => {
              playBlockClick();
              speakWord(currentWord.lowercase, isSlowAudio);
            }}
            className="mc-btn-green px-5 py-2 font-minecraft text-xs text-white flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Volume2 className="w-4 h-4" />
            <span>NOKLAUSĪTIES IZRUNU</span>
          </button>
        </div>

        {/* Crafting Grid Table */}
        <div className="my-6 p-4 sm:p-5 mc-card-dark border-4 border-[#141414]">
          <p className="font-minecraft text-[10px] text-[#aaaaaa] text-center mb-3">
            KRAFTINGA REZULTĀTS:
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* Input Slots */}
            <div className="flex items-center gap-2 flex-wrap justify-center">
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

            {/* Crafting Arrow */}
            <span className="font-minecraft text-2xl text-[#ffff55] px-2 select-none">
              ➔
            </span>

            {/* Result Slot */}
            <div
              className={`w-20 h-20 flex flex-col items-center justify-center transition-all ${
                isSuccess
                  ? 'mc-slot bg-[#df9e10] border-4 border-[#ffea75] shadow-[0_0_12px_#ffea75] animate-scaleIn'
                  : 'mc-slot-empty'
              }`}
            >
              {isSuccess ? (
                <>
                  <span className="text-3xl">{currentWord.emoji}</span>
                  <span className="font-minecraft text-[9px] text-[#2b1c00] font-black">
                    {currentWord.word}
                  </span>
                </>
              ) : (
                <span className="font-minecraft text-sm text-[#555555]">?</span>
              )}
            </div>
          </div>
        </div>

        {/* Available Chunk Blocks in Inventory */}
        <div className="my-5 text-center">
          <p className="font-minecraft text-[10px] text-[#333333] mb-3">
            IZVĒLIES BLOKUS PAREIZĀ SECĪBĀ:
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
                <Check className="w-4 h-4" /> RECEPTES BLOKI SALIKTI!
              </span>
            )}
          </div>
        </div>

        {/* Craft Success Box */}
        {isSuccess && (
          <div className="p-5 mc-slot bg-[#5b8731] border-2 border-[#153308] text-center animate-fadeIn my-4 text-white">
            <h4 className="font-minecraft text-sm text-[#ffff55] mb-2">
              🎉 IKRAFTOTS: {currentWord.word}!
            </h4>

            <p className="font-minecraft text-xs text-[#ffffff] my-1">
              {currentWord.chunkFormula}
            </p>

            <div className="flex flex-col items-center gap-1 mt-3">
              {currentWord.stars.map((star, idx) => (
                <span
                  key={idx}
                  className="font-minecraft text-xs text-[#000000] bg-[#ffff55] border-2 border-[#999900] px-4 py-1.5"
                >
                  {star}
                </span>
              ))}
            </div>

            <p className="font-bold text-xs text-[#e0e0e0] mt-3">
              {currentWord.memoryTip}
            </p>

            <div className="mt-5 flex justify-center">
              <button
                onClick={handleNextWord}
                className="mc-btn-gold px-6 py-3 font-minecraft text-xs text-[#2b1c00] flex items-center gap-2 cursor-pointer shadow-md"
              >
                <span>NĀKAMAIS VĀRDS</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
