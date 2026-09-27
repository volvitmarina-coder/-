export type LearningMode =
  | 'picture-choice'
  | 'word-card'
  | 'sound-association'
  | 'missing-letters-easy'
  | 'missing-letters-medium'
  | 'missing-letters-hard'
  | 'chunk-builder'
  | 'letter-builder'
  | 'picture-writing'
  | 'audio-writing'
  | 'dictation'
  | 'mistake-review';

export interface WordChunk {
  text: string;
  isSpecial?: boolean;
  explanation?: string;
  color?: string;
}

export interface MissingLettersEasyTask {
  display: string; // e.g. "FI __"
  missing: string; // "SH"
  options: string[]; // ["SH", "CH", "S"]
  ruleTip: string; // "SH = Š"
}

export interface MissingLettersMediumTask {
  display: string; // e.g. "FI _ _"
  missing: string; // "SH"
  placeholder: string; // "__"
  hint?: string;
}

export interface MissingLettersHardTask {
  display: string; // e.g. "C _ _ E _ E" or "_ _ _ _ _"
  template: string; // with underscores
  missing: string; // what needs to be typed, or whole word / missing parts
  fullWord: string;
}

export interface WordItem {
  id: string;
  word: string; // e.g. "FISH"
  lowercase: string; // "fish"
  latvianTranslation: string; // "zivs"
  emoji: string;
  chunks: WordChunk[];
  chunkFormula: string; // "FI + SH"
  stars: string[]; // ["⭐ SH = Š"]
  memoryTip: string; // "Atceries: SH = Š"
  soundAssociation: {
    latvianSound: string; // "Š"
    englishLetters: string; // "SH"
    explanation: string; // "dzirdi Š → atceries SH"
  };
  missingEasy: MissingLettersEasyTask;
  missingMedium: MissingLettersMediumTask;
  missingHard: MissingLettersHardTask;
  specialComparison?: {
    partnerWordId: string;
    note: string;
  };
}

export interface DictationResult {
  wordId: string;
  targetWord: string;
  userAnswer: string;
  isCorrect: boolean;
  chunksFormula: string;
  emoji: string;
  soundRule: string;
}

export interface StageInfo {
  id: LearningMode;
  number: number;
  titleLv: string;
  shortTitleLv: string;
  icon: string;
  descriptionLv: string;
}

export interface SoundComparisonGroup {
  id: string;
  title: string;
  ruleTitle: string;
  description: string;
  highlightText: string;
  words: {
    word: string;
    spelling: string;
    sound: string;
    soundHighlight: string;
    emoji: string;
    tip: string;
  }[];
}

