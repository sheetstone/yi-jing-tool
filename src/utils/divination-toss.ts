import type { TossResult, TossLine, LineType } from '../types';

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

export function getLineLabel(position: number, isYang: boolean): string {
  const posNames = ['初', '二', '三', '四', '五', '上'];
  const value = isYang ? '九' : '六';
  return `${posNames[position - 1]}${value}`;
}
