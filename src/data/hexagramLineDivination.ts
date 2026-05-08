import type { BilingualText } from '../types';

interface LineDivination {
  tuijuan: BilingualText;
  yunshi: BilingualText;
  aiqing: BilingualText;
  jibing: BilingualText;
  shiwu: BilingualText;
  susong: BilingualText;
}

// Outer key: hexagram number (1–64)
// Inner key: line position (1–6)
export const hexagramLineDivination: Record<number, Record<number, LineDivination>> = {};
