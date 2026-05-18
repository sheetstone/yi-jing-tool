import type { TrigramName } from '../types';
import type { ReadingDate } from './bazi';

// ── Types ─────────────────────────────────────────────────────────────────────

export type NaJiaState = 'assisted' | 'restrained' | 'neutral';

export interface NaJiaResult {
  ganzhi:  string;   // e.g. '甲子'
  stem:    string;   // e.g. '甲'
  branch:  string;   // e.g. '子'
  element: string;   // e.g. '木'
  state:   NaJiaState;
}

// ── Nà-Jiǎ lookup table ───────────────────────────────────────────────────────
//
// Each trigram stores 6 ganzhi indexed by line position (0 = 初爻 … 5 = 上爻):
//   index 0–2 → used when this trigram is the LOWER trigram
//   index 3–5 → used when this trigram is the UPPER trigram
//
// Source: 京房纳甲法

const NAJA_TABLE: Record<TrigramName, readonly [string,string,string,string,string,string]> = {
  乾: ['甲子', '甲寅', '甲辰', '壬午', '壬申', '壬戌'],
  坤: ['乙未', '癸丑', '癸卯', '甲午', '甲申', '甲戌'],
  震: ['庚子', '庚寅', '庚辰', '庚午', '庚申', '庚戌'],
  巽: ['辛丑', '辛亥', '辛酉', '辛未', '辛巳', '辛卯'],
  坎: ['戊寅', '戊子', '戊戌', '戊申', '戊午', '戊辰'],
  离: ['己卯', '己巳', '己未', '己酉', '己亥', '己丑'],
  艮: ['丙辰', '丙寅', '丙子', '丙戌', '丙申', '丙午'],
  兑: ['丁巳', '丁卯', '丁丑', '丁亥', '丁酉', '丁未'],
};

// ── Five-element mappings ─────────────────────────────────────────────────────

const STEM_EL: Record<string, string> = {
  甲: '木', 乙: '木',
  丙: '火', 丁: '火',
  戊: '土', 己: '土',
  庚: '金', 辛: '金',
  壬: '水', 癸: '水',
};

// day generates line → line is aided
const GEN: Record<string, string> = { 木: '火', 火: '土', 土: '金', 金: '水', 水: '木' };
// day controls line → line is restrained
const CTL: Record<string, string> = { 木: '土', 土: '水', 水: '火', 火: '金', 金: '木' };

// ── State classification ──────────────────────────────────────────────────────
//
// Viewed from the day's effect on the line:
//   assisted  — GEN[dayEl] === lineEl  (日生爻: day nourishes the line)
//   restrained — CTL[dayEl] === lineEl  (日克爻: day suppresses the line)
//   neutral   — everything else         (比和 / 爻生日 / 爻克日)

function classifyState(lineEl: string, dayEl: string): NaJiaState {
  if (GEN[dayEl] === lineEl) return 'assisted';
  if (CTL[dayEl] === lineEl) return 'restrained';
  return 'neutral';
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Returns the Nà-Jiǎ ganzhi and day-relationship state for a changing line.
 *
 * @param upperTrigram  upper trigram name of the primary hexagram
 * @param lowerTrigram  lower trigram name of the primary hexagram
 * @param linePos       0-indexed line position (0 = 初爻 … 5 = 上爻)
 * @param rd            reading date (day stem element comes from pillars[2].stemEl)
 */
export function getChangingLineNaJia(
  upperTrigram: TrigramName,
  lowerTrigram: TrigramName,
  linePos: number,
  rd: ReadingDate,
): NaJiaResult {
  const trigram = linePos < 3 ? lowerTrigram : upperTrigram;
  const ganzhi  = NAJA_TABLE[trigram][linePos];
  const stem    = ganzhi[0];
  const branch  = ganzhi[1];
  const element = STEM_EL[stem];
  const dayEl   = rd.pillars[2].stemEl;

  return { ganzhi, stem, branch, element, state: classifyState(element, dayEl) };
}
