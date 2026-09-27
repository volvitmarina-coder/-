import React, { useState } from 'react';
import { WordItem } from '../types';
import { WordCard } from './WordCard';
import { Play, Search, Filter } from 'lucide-react';
import { speakWord, playBlockClick } from '../utils/audio';

interface WordListViewProps {
  words: WordItem[];
  isSlowAudio: boolean;
  starredWords: Set<string>;
  onToggleStar: (wordId: string) => void;
  onOpenSecrets: () => void;
}

export const WordListView: React.FC<WordListViewProps> = ({
  words,
  isSlowAudio,
  starredWords,
  onToggleStar,
  onOpenSecrets,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'special-ea' | 'sound-sh-ch' | 'ending-ce' | 'double'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredWords = words.filter((w) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        w.word.toLowerCase().includes(q) ||
        w.latvianTranslation.toLowerCase().includes(q) ||
        w.chunkFormula.toLowerCase().includes(q) ||
        w.stars.some((s) => s.toLowerCase().includes(q));
      if (!match) return false;
    }

    if (activeFilter === 'special-ea') {
      return w.id === 'meat' || w.id === 'bread';
    }
    if (activeFilter === 'sound-sh-ch') {
      return w.id === 'fish' || w.id === 'cheese' || w.id === 'sandwiches' || w.id === 'chicken';
    }
    if (activeFilter === 'ending-ce') {
      return w.id === 'rice' || w.id === 'juice';
    }
    if (activeFilter === 'double') {
      return w.id === 'eggs' || w.id === 'apple';
    }
    return true;
  });

  const handlePlayAll = async () => {
    playBlockClick();
    for (const w of filteredWords) {
      speakWord(w.lowercase, isSlowAudio);
      await new Promise((res) => setTimeout(res, isSlowAudio ? 1800 : 1300));
    }
  };

  const handleFilterClick = (filter: typeof activeFilter) => {
    playBlockClick();
    setActiveFilter(filter);
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 py-6">
      {/* Minecraft Hero Banner */}
      <div className="mc-card-dark p-6 sm:p-7 border-4 border-[#000000] mb-6 relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#4b8b29] text-white font-minecraft text-[10px] mb-3 border-2 border-[#153308]">
            <span>🟩</span>
            <span>MĀCĪBU CEĻVEDIS</span>
          </div>

          <h2 className="font-minecraft text-lg sm:text-2xl text-[#ffff55] mc-text-shadow tracking-wide mb-3 leading-snug">
            UZBŪVĒ 10 VĀRDUS AR SKAŅĀM!
          </h2>

          <p className="font-bold text-sm sm:text-base text-[#d0d0d0] leading-relaxed mb-4">
            Dzirdi <span className="text-[#55ff55] font-black underline">Š</span> → liec <span className="text-[#55ff55] font-black underline">SH</span> bloku. 
            Dzirdi <span className="text-[#ffaa00] font-black underline">Č</span> → liec <span className="text-[#ffaa00] font-black underline">CH</span> bloku. 
            Spied uz pogām un klausies pareizu angļu izrunu!
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handlePlayAll}
              className="mc-btn-gold px-5 py-2.5 font-minecraft text-xs text-[#2b1c00] flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Play className="w-4 h-4 fill-[#2b1c00]" />
              <span>NOKLAUSĪTIES VISUS</span>
            </button>

            <button
              onClick={() => {
                playBlockClick();
                onOpenSecrets();
              }}
              className="mc-btn-diamond px-5 py-2.5 font-minecraft text-xs text-white flex items-center gap-2 cursor-pointer shadow-md"
            >
              <span>📖</span>
              <span>4 NOSLĒPUMU GRĀMATA</span>
            </button>
          </div>
        </div>

        {/* Decorative Pixel Grid Background */}
        <div className="absolute right-2 bottom-2 text-7xl select-none opacity-20 pointer-events-none sm:opacity-30">
          🧱⚔️🍗🍞
        </div>
      </div>

      {/* Minecraft Command Bar / Filters */}
      <div className="mc-card p-3 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-[#333333] shrink-0 ml-1" />
          <span className="font-minecraft text-[10px] text-[#333333] mr-1 hidden sm:inline">
            GRUPAS:
          </span>

          <button
            onClick={() => handleFilterClick('all')}
            className={`px-3 py-1.5 font-minecraft text-[10px] cursor-pointer transition-all ${
              activeFilter === 'all'
                ? 'mc-slot bg-[#4b8b29] text-white'
                : 'mc-btn text-white'
            }`}
          >
            VISI (10)
          </button>

          <button
            onClick={() => handleFilterClick('sound-sh-ch')}
            className={`px-3 py-1.5 font-minecraft text-[10px] cursor-pointer transition-all ${
              activeFilter === 'sound-sh-ch'
                ? 'mc-slot bg-[#4b8b29] text-white'
                : 'mc-btn text-white'
            }`}
          >
            SH un CH (Š/Č)
          </button>

          <button
            onClick={() => handleFilterClick('special-ea')}
            className={`px-3 py-1.5 font-minecraft text-[10px] cursor-pointer transition-all ${
              activeFilter === 'special-ea'
                ? 'mc-slot bg-[#4b8b29] text-white'
                : 'mc-btn text-white'
            }`}
          >
            EA NOSLĒPUMS
          </button>

          <button
            onClick={() => handleFilterClick('ending-ce')}
            className={`px-3 py-1.5 font-minecraft text-[10px] cursor-pointer transition-all ${
              activeFilter === 'ending-ce'
                ? 'mc-slot bg-[#4b8b29] text-white'
                : 'mc-btn text-white'
            }`}
          >
            BEIGĀS CE = S
          </button>

          <button
            onClick={() => handleFilterClick('double')}
            className={`px-3 py-1.5 font-minecraft text-[10px] cursor-pointer transition-all ${
              activeFilter === 'double'
                ? 'mc-slot bg-[#4b8b29] text-white'
                : 'mc-btn text-white'
            }`}
          >
            DVĪŅU BURTI
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#888888] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Meklēt vārdu..."
            className="w-full md:w-48 pl-9 pr-3 py-1.5 mc-slot-empty text-[#ffff55] font-minecraft text-[10px] focus:outline-none focus:ring-1 focus:ring-[#55ff55]"
          />
        </div>
      </div>

      {/* Grid of Word Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredWords.map((item) => (
          <WordCard
            key={item.id}
            item={item}
            isSlowAudio={isSlowAudio}
            onStarWord={onToggleStar}
            isStarred={starredWords.has(item.id)}
          />
        ))}
      </div>

      {filteredWords.length === 0 && (
        <div className="mc-card p-10 text-center text-slate-800">
          <p className="font-minecraft text-sm mb-3">NAV ATRISTS NEVIENS BLOKS!</p>
          <button
            onClick={() => {
              playBlockClick();
              setActiveFilter('all');
              setSearchQuery('');
            }}
            className="mc-btn-green px-4 py-2 font-minecraft text-xs text-white cursor-pointer"
          >
            RĀDĪT VISUS 10 BLOKUS
          </button>
        </div>
      )}
    </div>
  );
};
