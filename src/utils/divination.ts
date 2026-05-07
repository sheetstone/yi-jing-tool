import type { TossResult, TossLine, LineType, DivinationResult, Hexagram, TrigramName } from '../types';
import { hexagrams } from '../data/hexagrams';

const indexToTrigram: TrigramName[] = ['坤', '艮', '坎', '巽', '震', '离', '兑', '乾'];

function tossCoins(): TossResult {
  const coin1 = Math.random() < 0.5 ? 2 : 3;
  const coin2 = Math.random() < 0.5 ? 2 : 3;
  const coin3 = Math.random() < 0.5 ? 2 : 3;
  return (coin1 + coin2 + coin3) as TossResult;
}

export function getLineType(result: TossResult): LineType {
  switch (result) {
    case 6: return 'old_yin';
    case 7: return 'young_yang';
    case 8: return 'young_yin';
    case 9: return 'old_yang';
  }
}

export function isChangingLine(result: TossResult): boolean {
  return result === 6 || result === 9;
}

export function resultToYangLine(result: TossResult): number {
  // Old Yin (6) = yin (0), Young Yang (7) = yang (1)
  // Young Yin (8) = yin (0), Old Yang (9) = yang (1)
  return (result === 7 || result === 9) ? 1 : 0;
}

export function performSingleToss(tossNumber: number): TossLine {
  const result = tossCoins();
  return {
    tossNumber,
    result,
    lineType: getLineType(result),
    isChanging: isChangingLine(result),
  };
}

export function performAllTosses(): TossLine[] {
  const lines: TossLine[] = [];
  for (let i = 1; i <= 6; i++) {
    lines.push(performSingleToss(i));
  }
  return lines;
}

function getTrigramFromLines(lines: number[]): TrigramName {
  // lines[0] = bottom line (bit 0), lines[2] = top line (bit 2)
  const index = lines[0] * 1 + lines[1] * 2 + lines[2] * 4;
  return indexToTrigram[index];
}

function findHexagramByTrigrams(upper: TrigramName, lower: TrigramName): Hexagram {
  const found = hexagrams.find(
    (h) => h.upperTrigram === upper && h.lowerTrigram === lower
  );
  if (!found) {
    throw new Error(`Hexagram not found: ${upper} over ${lower}`);
  }
  return found;
}

export function computeDivinationResult(tossLines: TossLine[]): DivinationResult {
  // Lines 0-2 = lower trigram (positions 1-3), lines 3-5 = upper trigram (positions 4-6)
  const primaryYangLines = tossLines.map((line) => resultToYangLine(line.result));

  const lowerTrigram = getTrigramFromLines(primaryYangLines.slice(0, 3));
  const upperTrigram = getTrigramFromLines(primaryYangLines.slice(3, 6));

  const primaryHexagram = findHexagramByTrigrams(upperTrigram, lowerTrigram);

  const changingPositions = tossLines
    .map((line, i) => (line.isChanging ? i : -1))
    .filter((i) => i >= 0);

  let transformedHexagram: Hexagram | null = null;
  if (changingPositions.length > 0) {
    const transformedYangLines = [...primaryYangLines];
    for (const pos of changingPositions) {
      transformedYangLines[pos] = transformedYangLines[pos] === 1 ? 0 : 1;
    }

    const tfLower = getTrigramFromLines(transformedYangLines.slice(0, 3));
    const tfUpper = getTrigramFromLines(transformedYangLines.slice(3, 6));

    transformedHexagram = findHexagramByTrigrams(tfUpper, tfLower);
  }

  return {
    primaryHexagram,
    transformedHexagram,
    tossLines,
    hasChangingLines: changingPositions.length > 0,
  };
}

/**
 * Returns the line name in Chinese based on position and whether it's yang or yin.
 * Yang lines: 初九, 九二, 九三, 九四, 九五, 上九
 * Yin lines:  初六, 六二, 六三, 六四, 六五, 上六
 */
export function getLineLabel(position: number, isYang: boolean): string {
  const posNames = ['初', '二', '三', '四', '五', '上'];
  const value = isYang ? '九' : '六';
  return `${posNames[position - 1]}${value}`;
}
