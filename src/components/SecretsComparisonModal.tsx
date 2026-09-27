import React from 'react';
import { X, Volume2, Sparkles } from 'lucide-react';
import { SOUND_COMPARISONS } from '../data/words';
import { speakWord, playBlockClick } from '../utils/audio';

interface SecretsComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSlowAudio: boolean;
}

export const SecretsComparisonModal: React.FC<SecretsComparisonModalProps> = ({
  isOpen,
  onClose,
  isSlowAudio,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-fadeIn">
      <div className="mc-card w-full max-w-3xl border-4 border-[#000000] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Enchanted Book Header */}
        <div className="px-5 py-3.5 bg-[#4a1c5d] text-white flex items-center justify-between border-b-4 border-[#240830]">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl select-none">📖</span>
            <div>
              <h3 className="font-minecraft text-xs sm:text-sm text-[#ff77ff] mc-text-shadow">
                APBURTĀ NOSLĒPUMU GRĀMATA
              </h3>
              <p className="font-bold text-[11px] text-[#e0b0ff]">
                Svarīgākie salīdzinājumi, lai nekad nesajauktu burtus!
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              playBlockClick();
              onClose();
            }}
            className="mc-btn p-1 text-white cursor-pointer"
            title="Aizvērt"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 bg-[#c6c6c6]">
          {/* Important note */}
          <div className="mc-slot bg-[#ffffa0] p-4 border-2 border-[#999900] text-[#332200]">
            <p className="font-bold text-xs sm:text-sm leading-relaxed">
              ⭐ <strong className="font-minecraft text-xs">SVARS NOTEIKUMS:</strong> Angļu valodā viena un tā pati skaņa var tikt rakstīta ar dažādiem burtiem, un vieni un tie paši burti var skanēt atšķirīgi! Tāpēc mēs iemācāmies tieši šo 10 vārdu receptes!
            </p>
          </div>

          {SOUND_COMPARISONS.map((group) => (
            <div
              key={group.id}
              className="mc-card-dark p-4 sm:p-5 border-2 border-[#141414] text-white shadow-xs"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <h4 className="font-minecraft text-xs sm:text-sm text-[#ffff55] mc-text-shadow flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#ffd700]" />
                  {group.title}
                </h4>
              </div>

              <p className="font-bold text-xs text-[#cccccc] mb-4">
                {group.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {group.words.map((w, idx) => (
                  <div
                    key={idx}
                    className="mc-card p-3.5 border-2 border-[#000] text-slate-900 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-3xl select-none">{w.emoji}</span>
                        <button
                          onClick={() => {
                            playBlockClick();
                            speakWord(w.word.toLowerCase(), isSlowAudio);
                          }}
                          className="mc-btn-green p-1.5 text-white cursor-pointer"
                          title="Noklausīties"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="font-minecraft text-base text-[#1e1e1e] mb-1">
                        {w.word}
                      </div>

                      <div className="font-minecraft text-[10px] text-[#555555] mb-2">
                        {w.spelling}
                      </div>

                      <div className="inline-block px-2 py-1 mc-slot bg-[#5b8731] text-white font-minecraft text-[10px] mb-2">
                        {w.soundHighlight}
                      </div>
                    </div>

                    <p className="font-bold text-xs text-[#2b2b2b] mt-2 pt-2 border-t border-[#8b8b8b]">
                      {w.tip}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#1e1e1e] border-t-4 border-[#000] flex justify-end">
          <button
            onClick={() => {
              playBlockClick();
              onClose();
            }}
            className="mc-btn-gold px-6 py-2.5 font-minecraft text-xs text-[#2b1c00] cursor-pointer shadow-md"
          >
            SAPRATU, AIZVĒRT!
          </button>
        </div>
      </div>
    </div>
  );
};
