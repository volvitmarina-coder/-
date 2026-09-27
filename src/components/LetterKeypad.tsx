import React from 'react';
import { Delete, CornerDownLeft } from 'lucide-react';
import { playBlockClick } from '../utils/audio';

interface LetterKeypadProps {
  onLetterPress: (letter: string) => void;
  onBackspace: () => void;
  onSubmit: () => void;
  disabled?: boolean;
}

const ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

export const LetterKeypad: React.FC<LetterKeypadProps> = ({
  onLetterPress,
  onBackspace,
  onSubmit,
  disabled = false,
}) => {
  return (
    <div className="mc-card-dark p-2 sm:p-3 mt-4 border-2 border-black max-w-xl mx-auto select-none">
      <div className="flex flex-col gap-1.5 items-center">
        {ROWS.map((row, rIdx) => (
          <div key={rIdx} className="flex gap-1 sm:gap-1.5 justify-center w-full">
            {row.map((letter) => (
              <button
                key={letter}
                type="button"
                disabled={disabled}
                onClick={() => {
                  playBlockClick();
                  onLetterPress(letter);
                }}
                className="mc-btn min-w-[28px] sm:min-w-[38px] h-9 sm:h-11 px-1.5 sm:px-2.5 font-minecraft text-xs sm:text-sm text-white flex items-center justify-center cursor-pointer hover:brightness-110 active:scale-95 disabled:opacity-50"
              >
                {letter}
              </button>
            ))}
          </div>
        ))}

        {/* Action Row */}
        <div className="flex gap-2 justify-center w-full mt-1">
          <button
            type="button"
            disabled={disabled}
            onClick={() => {
              playBlockClick();
              onBackspace();
            }}
            className="mc-btn-red px-4 h-9 sm:h-11 font-minecraft text-xs text-white flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Delete className="w-4 h-4" />
            <span>DZĒST</span>
          </button>

          <button
            type="button"
            disabled={disabled}
            onClick={() => {
              playBlockClick();
              onSubmit();
            }}
            className="mc-btn-green px-5 h-9 sm:h-11 font-minecraft text-xs text-white flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <CornerDownLeft className="w-4 h-4" />
            <span>GATAVS</span>
          </button>
        </div>
      </div>
    </div>
  );
};
