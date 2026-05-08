export type TrigramName = '乾' | '坤' | '震' | '巽' | '坎' | '离' | '艮' | '兑';

export type AppScreen = 'start' | 'divining' | 'result';

export type TossResult = 6 | 7 | 8 | 9;

export type LineType = 'old_yin' | 'young_yang' | 'young_yin' | 'old_yang';

export interface HexagramLine {
  position: number;
  textZh: string;
  textEn: string;
  // Per-line divination content (populated for changing lines)
  tuijuan?: BilingualText;
  yunshi?: BilingualText;
  aiqing?: BilingualText;
  jibing?: BilingualText;
  shiwu?: BilingualText;
  susong?: BilingualText;
}

export interface BilingualText {
  zh: string;
  en: string;
}

export interface Hexagram {
  number: number;
  nameZh: string;
  pinyin: string;
  nameEn: string;
  upperTrigram: TrigramName;
  lowerTrigram: TrigramName;
  judgmentZh: string;
  judgmentEn: string;
  lines: HexagramLine[];
  // Extended divination fields (CR 5)
  daxiang?: BilingualText;   // 大象 — image from 象传
  buci?: BilingualText;      // 卜辞 — oracle text
  tuijuan?: BilingualText;   // 推断 — interpretation
  yunshi?: BilingualText;    // 运势 — overall fortune
  aiqing?: BilingualText;    // 爱情 — love & relationships
  jibing?: BilingualText;    // 疾病 — health
  shiwu?: BilingualText;     // 失物 — lost items
  susong?: BilingualText;    // 诉讼 — litigation
}

export interface TossLine {
  tossNumber: number;
  result: TossResult;
  lineType: LineType;
  isChanging: boolean;
}

export interface DivinationResult {
  primaryHexagram: Hexagram;
  transformedHexagram: Hexagram | null;
  tossLines: TossLine[];
  hasChangingLines: boolean;
}

export interface Trigrams {
  symbol: string;
  name: TrigramName;
  pinyin: string;
  element: string;
  direction: string;
}
