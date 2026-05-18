/**
 * Batch 1 — Hexagram × BaZi resonance (五行生克 + 月令旺相休囚死)
 *
 * Given the primary hexagram's trigrams and the day's ReadingDate, computes:
 *  - The hexagram element (upper trigram)
 *  - The day-stem element
 *  - Their five-element relationship (生克比和)
 *  - The hexagram element's monthly energy state (旺相休囚死)
 */

import type { TrigramName } from '../types';
import type { ReadingDate } from './bazi';

// ── Five element mappings ────────────────────────────────────────────────────

export const TRIGRAM_EL: Record<TrigramName, string> = {
  乾: '金', 兑: '金',
  离: '火',
  震: '木', 巽: '木',
  坎: '水',
  艮: '土', 坤: '土',
};

// Generation cycle: element → what it generates
const GEN: Record<string, string> = { 木: '火', 火: '土', 土: '金', 金: '水', 水: '木' };
// Control cycle: element → what it controls
const CTL: Record<string, string> = { 木: '土', 土: '水', 水: '火', 火: '金', 金: '木' };

// Month branch (地支) → seasonal ruling element
const BRANCH_SEASON: Record<string, string> = {
  寅: '木', 卯: '木',
  巳: '火', 午: '火',
  申: '金', 酉: '金',
  亥: '水', 子: '水',
  辰: '土', 戌: '土', 丑: '土', 未: '土',
};

// ── Core calculations ────────────────────────────────────────────────────────

export type WangXiang = '旺' | '相' | '休' | '囚' | '死';
export type Resonance =
  | 'bihe'        // 同元比和
  | 'ri_sheng'    // 日干生卦 (day generates hex element)
  | 'gua_sheng'   // 卦生日干 (hex element generates day stem)
  | 'ri_ke'       // 日干克卦 (day controls hex element)
  | 'gua_ke';     // 卦克日干 (hex element controls day stem)

/**
 * 月令旺相休囚死：given hex element and current month branch,
 * returns the energy state of the hex element this month.
 */
export function wangXiangOf(hexEl: string, monthBranch: string): WangXiang {
  const s = BRANCH_SEASON[monthBranch] ?? '土';
  if (hexEl === s)          return '旺';   // same as season ruler
  if (GEN[s] === hexEl)     return '相';   // season generates hex element
  if (GEN[hexEl] === s)     return '休';   // hex element generates season (spent itself)
  if (CTL[s] === hexEl)     return '囚';   // season controls hex element
  return '死';                              // hex element controls season (but exhausted)
}

/**
 * 五行生克：relationship from day-stem element's perspective toward hex element.
 */
export function resonanceOf(dayEl: string, hexEl: string): Resonance {
  if (dayEl === hexEl)         return 'bihe';
  if (GEN[dayEl] === hexEl)    return 'ri_sheng';
  if (GEN[hexEl] === dayEl)    return 'gua_sheng';
  if (CTL[dayEl] === hexEl)    return 'ri_ke';
  return 'gua_ke';
}

// ── Interpretation text ──────────────────────────────────────────────────────

type Strength = 'strong' | 'normal' | 'weak';

function strength(wx: WangXiang): Strength {
  if (wx === '旺' || wx === '相') return 'strong';
  if (wx === '休')                return 'normal';
  return 'weak';
}

const DESC: Record<Resonance, Record<Strength, { zh: string; en: string }>> = {
  bihe: {
    strong: {
      zh: '同气当令共振，能量旺盛，卦象指引清晰有力，宜把握时机主动行动',
      en: 'Strong resonance with the season — the hexagram\'s guidance is amplified and clear. A good time to act.',
    },
    normal: {
      zh: '同气平稳共鸣，卦象信息稳定清晰，循序渐进最为适宜',
      en: 'Steady resonance — the hexagram speaks directly to your situation. Follow its guidance consistently.',
    },
    weak: {
      zh: '同气今月受制，能量有所收敛，宜内守静待，勿急于外张',
      en: 'Resonance is muted this month — conserve energy and act with restraint rather than pushing outward.',
    },
  },
  ri_sheng: {
    strong: {
      zh: '日元助力充沛，月令又得加持，运势顺遂，可主动进取，事半功倍',
      en: 'Day energy actively supports the hexagram, reinforced by the season — circumstances flow favorably. Act with confidence.',
    },
    normal: {
      zh: '日元扶助卦象，运势有所助力，按卦意稳步推进，可逐步成事',
      en: 'Day energy supports the hexagram — steady progress is favored. Follow the reading\'s guidance step by step.',
    },
    weak: {
      zh: '日元助卦有心，然卦气今月受制，虽有助力仍需量力而为，勿强求',
      en: 'Day energy helps, but the hexagram\'s element is weak this month — support exists, yet prudence is still needed.',
    },
  },
  gua_sheng: {
    strong: {
      zh: '卦气月令旺盛，精华归于日主，卦辞之意与你今日处境最为契合',
      en: 'The hexagram\'s strong seasonal energy flows into you — this reading speaks directly and powerfully to today.',
    },
    normal: {
      zh: '卦意滋养日元，细品爻辞，其中指引皆为今日量身而设',
      en: 'The hexagram nourishes your day — reflect on the lines carefully; their guidance is tailored to your situation.',
    },
    weak: {
      zh: '卦意虽归日主，然卦气今月偏弱，领悟卦意需多加用心方可受益',
      en: 'The hexagram feeds your day, though its energy is quiet this month — reflect more deeply to benefit fully.',
    },
  },
  ri_ke: {
    strong: {
      zh: '日元压制卦气，然卦象月令有韧，吉中有阻而阻力不大，宜审慎决策',
      en: 'Day tempers the hexagram — good omens are moderated but resilient. Be measured and deliberate in decisions.',
    },
    normal: {
      zh: '日元制约卦气，吉意有所减弱，诸事宜审慎，切忌冒进',
      en: 'Day restrains the hexagram — positive indicators are softened. Proceed carefully and avoid rushing.',
    },
    weak: {
      zh: '日克卦气，而卦气今月已衰，卦象所示之事宜降低期望，静观其变',
      en: 'Day and season both press the hexagram element — temper expectations and observe before acting.',
    },
  },
  gua_ke: {
    strong: {
      zh: '卦气月令旺盛，强势主导今日，卦中所示最为切要，务必认真对待',
      en: 'The hexagram strongly governs today, reinforced by the season — its message is urgent and demands close attention.',
    },
    normal: {
      zh: '卦气约束今日运势，此卦对今日影响深远，宜认真参详，主动应对',
      en: 'The hexagram governs the day — this reading has significant bearing on current events. Engage with it actively.',
    },
    weak: {
      zh: '卦气虽制日元，然今月卦气受压，影响趋于平和，顺势而为即可',
      en: 'The hexagram\'s control is present but weakened by the season — its influence is moderate; go with the flow.',
    },
  },
};

// Short label for each resonance type
export const RESONANCE_LABEL: Record<Resonance, { zh: string; en: string }> = {
  bihe:     { zh: '比和', en: 'Resonance' },
  ri_sheng: { zh: '日生卦', en: 'Day → Hex' },
  gua_sheng:{ zh: '卦生日', en: 'Hex → Day' },
  ri_ke:    { zh: '日克卦', en: 'Day ⊳ Hex' },
  gua_ke:   { zh: '卦克日', en: 'Hex ⊳ Day' },
};

// Visual symbol in the element-flow display
export const RESONANCE_SYMBOL: Record<Resonance, string> = {
  bihe:     '≈',
  ri_sheng: '→',
  gua_sheng:'←',
  ri_ke:    '⊳',
  gua_ke:   '⊲',
};

// ── Public result type ────────────────────────────────────────────────────────

export interface HexResonanceData {
  hexEl: string;       // upper trigram element (primary)
  hexElLower: string;  // lower trigram element (may differ)
  dayEl: string;       // day-stem element
  monthBranch: string; // for display
  wangXiang: WangXiang;
  resonance: Resonance;
}

export function calcHexResonance(
  upperTrigram: TrigramName,
  lowerTrigram: TrigramName,
  rd: ReadingDate,
): HexResonanceData {
  const hexEl      = TRIGRAM_EL[upperTrigram];
  const hexElLower = TRIGRAM_EL[lowerTrigram];
  const dayEl      = rd.pillars[2].stemEl;
  const monthBranch = rd.pillars[1].ganzhi[1];   // e.g. "巳" from "癸巳"

  return {
    hexEl, hexElLower, dayEl, monthBranch,
    wangXiang: wangXiangOf(hexEl, monthBranch),
    resonance:  resonanceOf(dayEl, hexEl),
  };
}

export function resonanceDesc(data: HexResonanceData, lang: 'zh' | 'en'): string {
  return DESC[data.resonance][strength(data.wangXiang)][lang];
}
