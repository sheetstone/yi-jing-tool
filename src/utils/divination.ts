export {
  getLineType,
  isChangingLine,
  resultToYangLine,
  performSingleToss,
  performAllTosses,
  getLineLabel,
} from './divination-toss';

import type { TossLine, DivinationResult, Hexagram, TrigramName } from '../types';
import { resultToYangLine } from './divination-toss';
import { hexagrams } from '../data/hexagrams';

const indexToTrigram: TrigramName[] = ['坤', '艮', '坎', '巽', '震', '离', '兑', '乾'];

function getTrigramFromLines(lines: number[]): TrigramName {
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
