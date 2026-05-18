// BaZi (八字) four pillars + five elements calculator

const STEMS    = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
const BRANCHES = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
const STEM_EL   = ['木','木','火','火','土','土','金','金','水','水'];
const BRANCH_EL = ['水','土','木','木','土','火','火','土','金','金','土','水'];
const WEEKDAY   = ['日','一','二','三','四','五','六'];
const MONTH_NAMES = ['一','二','三','四','五','六','七','八','九','十','十一','十二'];
const DIGITS    = '〇一二三四五六七八九';

// ── Gregorian → Julian Day Number ────────────────────────────────────────────
function jdn(y: number, m: number, d: number): number {
  const a = Math.floor((14 - m) / 12);
  const yy = y + 4800 - a, mm = m + 12 * a - 3;
  return d + Math.floor((153 * mm + 2) / 5) + 365 * yy
    + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;
}

// ── Day pillar ────────────────────────────────────────────────────────────────
// JDN 2451545 (Jan 1, 2000) = 庚辰 = index 16 in the 60-cycle
function dayIdx(y: number, m: number, d: number): number {
  return ((jdn(y, m, d) - 2451545 + 16) % 60 + 60) % 60;
}

// ── Year pillar (adjusted for 立春 ≈ Feb 4) ──────────────────────────────────
function yearPillarIdx(y: number, m: number, d: number): [number, number] {
  let yr = y;
  if (m < 2 || (m === 2 && d < 4)) yr--;
  return [((yr - 4) % 10 + 10) % 10, ((yr - 4) % 12 + 12) % 12];
}

// ── Month pillar ──────────────────────────────────────────────────────────────
// 节 boundaries: [gregorian_month, gregorian_day, branch_index]
const JIEQI: [number, number, number][] = [
  [1, 6, 1], [2, 4, 2], [3, 6, 3], [4, 5, 4], [5, 6, 5], [6, 6, 6],
  [7, 7, 7], [8, 7, 8], [9, 8, 9], [10, 8, 10], [11, 7, 11], [12, 7, 0],
];

function monthBranch(m: number, d: number): number {
  let b = 1;
  for (const [jm, jd, jb] of JIEQI) {
    if (m > jm || (m === jm && d >= jd)) b = jb;
  }
  return b;
}

function monthPillarIdx(y: number, m: number, d: number): [number, number] {
  const [yStem] = yearPillarIdx(y, m, d);
  const b = monthBranch(m, d);
  const stemStart = ((yStem % 5) * 2 + 2) % 10;
  return [(stemStart + (b - 2 + 12) % 12) % 10, b];
}

// ── Hour pillar ───────────────────────────────────────────────────────────────
function hourPillarIdx(y: number, m: number, d: number, h: number): [number, number] {
  const b = Math.floor((h + 1) / 2) % 12;
  const dStem = dayIdx(y, m, d) % 10;
  return [((dStem % 5) * 2 + b) % 10, b];
}

// ── Lunar date (browser Intl API) ─────────────────────────────────────────────
function lunarMonthDay(date: Date): string {
  try {
    return new Intl.DateTimeFormat('zh-CN-u-ca-chinese', {
      month: 'long',
      day: 'numeric',
    }).format(date);
  } catch {
    return '';
  }
}

// ── Chinese numeral helpers ───────────────────────────────────────────────────
function toCNDigits(n: number): string {
  return String(n).split('').map(c => DIGITS[+c]).join('');
}

function toCNNum(n: number): string {
  if (n < 10) return DIGITS[n];
  if (n === 10) return '十';
  const t = Math.floor(n / 10), o = n % 10;
  return (t === 1 ? '十' : DIGITS[t] + '十') + (o ? DIGITS[o] : '');
}

// ── Public types & main export ────────────────────────────────────────────────

export interface BaziPillar {
  ganzhi: string;   // "丙午"
  label: string;    // "年柱" etc
  stemEl: string;   // "火"
  branchEl: string; // "火"
}

export interface ReadingDate {
  yearCN: string;      // "二〇二六年"
  monthCN: string;     // "五月"
  dayCN: string;       // "十七日"
  weekdayCN: string;   // "星期日"
  ganzhiYear: string;  // "丙午年"
  lunarMD: string;     // "四月廿四" (from Intl, may include 闰)
  pillars: BaziPillar[];  // year, month, day, hour
  elementMap: Record<string, number>;
}

export function getReadingDate(date: Date): ReadingDate {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const h = date.getHours();

  const [ySt, yBr] = yearPillarIdx(y, m, d);
  const [mSt, mBr] = monthPillarIdx(y, m, d);
  const dI          = dayIdx(y, m, d);
  const [hSt, hBr] = hourPillarIdx(y, m, d, h);

  const make = (si: number, bi: number, lbl: string): BaziPillar => ({
    ganzhi: STEMS[si] + BRANCHES[bi],
    label: lbl,
    stemEl: STEM_EL[si],
    branchEl: BRANCH_EL[bi],
  });

  const pillars = [
    make(ySt, yBr,      '年柱'),
    make(mSt, mBr,      '月柱'),
    make(dI % 10, dI % 12, '日柱'),
    make(hSt, hBr,      '时柱'),
  ];

  const elMap: Record<string, number> = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
  for (const p of pillars) { elMap[p.stemEl]++; elMap[p.branchEl]++; }

  return {
    yearCN:    toCNDigits(y) + '年',
    monthCN:   MONTH_NAMES[m - 1] + '月',
    dayCN:     toCNNum(d) + '日',
    weekdayCN: '星期' + WEEKDAY[date.getDay()],
    ganzhiYear: STEMS[ySt] + BRANCHES[yBr] + '年',
    lunarMD:   lunarMonthDay(date),
    pillars,
    elementMap: elMap,
  };
}
