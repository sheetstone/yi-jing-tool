import type { TossLine } from '../types';
import type { ReadingDate } from './bazi';
import { computeDivinationResult, resultToYangLine, getLineType } from './divination';

// ── Color palette ────────────────────────────────────────────────────────────
const GOLD     = '#d4a843';
const GOLD_DIM = 'rgba(212,168,67,0.55)';
const TEXT_PRI = '#e8d5b7';
const TEXT_SEC = '#c4a97d';
const BG       = '#1a1a2e';
const YANG     = '#e8c547';
const YIN      = '#7a6a5a';
const RED      = '#e74c3c';
const DIVIDER  = 'rgba(212,168,67,0.14)';

const EL_COLOR: Record<string, string> = {
  木: '#4caf7d', 火: '#e05a3c', 土: '#c49b3c', 金: '#a8b8c8', 水: '#5b8bd4',
};

const W   = 390;
const DPR = 2;
const PAD = 22;
const IW  = W - PAD * 2;

const FONT = "'PingFang SC','Noto Sans CJK SC','Microsoft YaHei','Hiragino Sans GB',sans-serif";

// ── Canvas helpers ────────────────────────────────────────────────────────────

function sf(ctx: CanvasRenderingContext2D, size: number, weight = 'normal', italic = false) {
  ctx.font = `${italic ? 'italic ' : ''}${weight} ${size}px ${FONT}`;
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxW: number,
  maxLines: number,
  lang: 'zh' | 'en',
): string[] {
  const out: string[] = [];
  let cur = '';
  const units = lang === 'en' ? text.split(' ') : Array.from(text);
  const sep   = lang === 'en' ? ' ' : '';

  for (const unit of units) {
    const test = cur ? cur + sep + unit : unit;
    if (ctx.measureText(test).width > maxW && cur) {
      out.push(cur);
      cur = unit;
      if (out.length >= maxLines) break;
    } else {
      cur = test;
    }
  }
  if (cur && out.length < maxLines) out.push(cur);

  if (out.length >= maxLines) {
    const consumed = out.join(sep).length;
    if (consumed < text.length) {
      let last = out[out.length - 1];
      while (last.length > 0 && ctx.measureText(last + '…').width > maxW)
        last = lang === 'en' ? last.split(' ').slice(0, -1).join(' ') : last.slice(0, -1);
      out[out.length - 1] = last + '…';
    }
  }
  return out;
}

function hline(ctx: CanvasRenderingContext2D, y: number, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = DIVIDER;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PAD + 8, y); ctx.lineTo(W - PAD - 8, y);
  ctx.stroke();
  ctx.restore();
}

function secLabel(ctx: CanvasRenderingContext2D, text: string, y: number, color = GOLD_DIM): number {
  sf(ctx, 10, '600');
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.fillText(text, W / 2, y);
  return y + 16;
}

function bodyText(
  ctx: CanvasRenderingContext2D,
  text: string, x: number, y: number, maxW: number,
  size: number, color: string, maxLines: number, lh: number,
  lang: 'zh' | 'en',
): number {
  sf(ctx, size);
  ctx.fillStyle = color;
  ctx.textAlign = 'left';
  for (const ln of wrapText(ctx, text, maxW, maxLines, lang)) {
    ctx.fillText(ln, x, y); y += lh;
  }
  return y;
}

function drawHexLines(
  ctx: CanvasRenderingContext2D,
  cx: number, y: number,
  lines: TossLine[], showChanging: boolean,
): number {
  const LH = 7, GAP = 5, LW = 130, SEG = (LW - 10) / 2;
  const x0 = cx - LW / 2;

  [5, 4, 3, 2, 1, 0].forEach((idx, di) => {
    const l   = lines[idx];
    const yang = resultToYangLine(l.result) === 1;
    const chg  = showChanging && l.isChanging;
    const ly   = y + di * (LH + GAP);

    ctx.globalAlpha = chg ? 1 : yang ? 0.9 : 0.65;
    ctx.fillStyle   = chg ? RED : yang ? YANG : YIN;

    ctx.beginPath();
    if (yang) {
      ctx.roundRect(x0, ly, LW, LH, 3); ctx.fill();
    } else {
      ctx.roundRect(x0, ly, SEG, LH, 3); ctx.fill();
      ctx.beginPath();
      ctx.roundRect(x0 + SEG + 10, ly, SEG, LH, 3); ctx.fill();
    }
    ctx.globalAlpha = 1;

    if (chg) {
      ctx.beginPath();
      ctx.arc(cx + LW / 2 + 12, ly + LH / 2, 3.5, 0, Math.PI * 2);
      ctx.strokeStyle = RED; ctx.lineWidth = 1.5; ctx.stroke();
    }
  });

  return y + 6 * (LH + GAP);
}

// ── Date + BaZi section ───────────────────────────────────────────────────────

function drawDateSection(
  ctx: CanvasRenderingContext2D,
  rd: ReadingDate,
  lang: 'zh' | 'en',
  y: number,
): number {
  const cx  = W / 2;
  const lx  = PAD + 4;

  // ── Gregorian date (Chinese chars, no Arabic numerals) ──────────────────
  sf(ctx, 17, '700');
  ctx.fillStyle = GOLD;
  ctx.textAlign = 'center';
  // Build display string with thin separators
  const solarStr = `${rd.yearCN}  ${rd.monthCN}  ${rd.dayCN}`;
  ctx.fillText(solarStr, cx, y);
  y += 22;

  sf(ctx, 11, '600');
  ctx.fillStyle = 'rgba(196,169,125,0.65)';
  ctx.fillText(rd.weekdayCN, cx, y);
  y += 18;

  // ── Ganzhi year + Lunar month/day ──────────────────────────────────────
  sf(ctx, 12);
  ctx.fillStyle = TEXT_SEC;
  ctx.textAlign = 'center';
  const lunarStr = rd.lunarMD
    ? `${rd.ganzhiYear}  ·  农历${rd.lunarMD}`
    : rd.ganzhiYear;
  ctx.fillText(lunarStr, cx, y);
  y += 20;

  hline(ctx, y); y += 14;

  // ── 八字 pillars ────────────────────────────────────────────────────────
  sf(ctx, 10, '600');
  ctx.fillStyle = GOLD_DIM;
  ctx.textAlign = 'center';
  ctx.fillText(lang === 'zh' ? '八  字' : 'Four Pillars', cx, y);
  y += 16;

  const pillarW = IW / 4;
  rd.pillars.forEach((p, i) => {
    const px = lx + i * pillarW + pillarW / 2;

    // label
    sf(ctx, 9, '400');
    ctx.fillStyle = 'rgba(196,169,125,0.55)';
    ctx.textAlign = 'center';
    ctx.fillText(p.label, px, y);

    // ganzhi
    sf(ctx, 16, '700');
    ctx.fillStyle = GOLD;
    ctx.fillText(p.ganzhi, px, y + 14);

    // elements (colored)
    sf(ctx, 10, '600');
    const elStr = p.stemEl + p.branchEl;
    // Draw each char with its element color
    const elW = ctx.measureText(elStr).width;
    const elX = px - elW / 2;
    sf(ctx, 10, '600');
    ctx.fillStyle = EL_COLOR[p.stemEl];
    ctx.textAlign = 'left';
    ctx.fillText(p.stemEl, elX, y + 33);
    ctx.fillStyle = EL_COLOR[p.branchEl];
    ctx.fillText(p.branchEl, elX + ctx.measureText(p.stemEl).width, y + 33);
  });
  y += 48;

  hline(ctx, y); y += 12;

  // ── 五行 bars ───────────────────────────────────────────────────────────
  sf(ctx, 10, '600');
  ctx.fillStyle = GOLD_DIM;
  ctx.textAlign = 'left';
  ctx.fillText(lang === 'zh' ? '五行' : 'Elements', lx, y);
  y += 16;

  const EL_ORDER = ['木', '火', '土', '金', '水'];
  const sorted   = [...EL_ORDER].sort((a, b) => rd.elementMap[b] - rd.elementMap[a]);
  const barX     = lx + 22;
  const barW     = IW - 22 - 14;
  const maxEl    = 8;

  sorted.forEach(el => {
    const cnt = rd.elementMap[el];
    const col = EL_COLOR[el];

    // char
    sf(ctx, 11, '700');
    ctx.fillStyle = col;
    ctx.textAlign = 'left';
    ctx.fillText(el, lx, y);

    // track
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    ctx.beginPath(); ctx.roundRect(barX, y + 1, barW, 8, 4); ctx.fill();

    // fill
    if (cnt > 0) {
      ctx.fillStyle = col;
      ctx.globalAlpha = 0.82;
      ctx.beginPath(); ctx.roundRect(barX, y + 1, barW * cnt / maxEl, 8, 4); ctx.fill();
      ctx.globalAlpha = 1;
    }

    // count
    sf(ctx, 10);
    ctx.fillStyle = cnt > 0 ? col : 'rgba(196,169,125,0.3)';
    ctx.textAlign = 'right';
    ctx.fillText(String(cnt), W - PAD - 2, y);

    y += 16;
  });

  y += 6;
  return y;
}

// ── Main draw ────────────────────────────────────────────────────────────────

function draw(tossLines: TossLine[], lang: 'zh' | 'en', rd: ReadingDate): HTMLCanvasElement {
  const { primaryHexagram, transformedHexagram } = computeDivinationResult(tossLines);
  const changingPositions = tossLines
    .map((l, i) => (l.isChanging ? i : -1))
    .filter(i => i >= 0);

  const canvas = document.createElement('canvas');
  const TALL   = 2800;
  canvas.width  = W * DPR;
  canvas.height = TALL * DPR;

  const ctx = canvas.getContext('2d')!;
  ctx.scale(DPR, DPR);
  ctx.textBaseline = 'top';

  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, W, TALL);

  let y = 0;
  const cx  = W / 2;
  const lx  = PAD + 4;
  const ltw = IW - 8;

  // ── Header ──────────────────────────────────────────────────────────────
  ctx.fillStyle = GOLD;
  ctx.fillRect(PAD + 60, 0, IW - 120, 3);
  y = 14;

  sf(ctx, 18, '700');
  ctx.fillStyle = GOLD;
  ctx.textAlign = 'center';
  ctx.fillText(lang === 'zh' ? '易经占卜' : 'I Ching Reading', cx, y);
  y += 28;

  hline(ctx, y); y += 14;

  // ── Date + BaZi section ──────────────────────────────────────────────────
  y = drawDateSection(ctx, rd, lang, y);

  hline(ctx, y); y += 16;

  // ── Primary hexagram ────────────────────────────────────────────────────
  y = secLabel(ctx, lang === 'zh' ? '本  卦' : 'Primary Hexagram', y);

  sf(ctx, 36, '700');
  ctx.fillStyle = GOLD;
  ctx.textAlign = 'center';
  ctx.fillText(String(primaryHexagram.number), cx, y);
  y += 42;

  sf(ctx, 20, '700');
  ctx.fillStyle = GOLD;
  ctx.fillText(lang === 'zh' ? `${primaryHexagram.nameZh}卦` : primaryHexagram.nameEn, cx, y);
  y += 26;

  sf(ctx, 11, 'normal', true);
  ctx.fillStyle = TEXT_SEC;
  ctx.fillText(primaryHexagram.pinyin, cx, y);
  y += 20;

  y = drawHexLines(ctx, cx, y, tossLines, true);
  y += 14;

  hline(ctx, y); y += 12;

  ctx.textAlign = 'left';
  sf(ctx, 10, '600');
  ctx.fillStyle = GOLD_DIM;
  ctx.fillText(lang === 'zh' ? '卦辞' : 'Judgment', lx, y);
  y += 16;

  const judgment = lang === 'zh' ? primaryHexagram.judgmentZh : primaryHexagram.judgmentEn;
  y = bodyText(ctx, judgment, lx, y, ltw, 13, TEXT_PRI, 3, 20, lang) + 6;

  if (primaryHexagram.tuijuan) {
    hline(ctx, y); y += 12;
    sf(ctx, 10, '600');
    ctx.fillStyle = GOLD_DIM;
    ctx.textAlign = 'left';
    ctx.fillText(lang === 'zh' ? '推断' : 'Interpretation', lx, y);
    y += 16;
    const tuijuan = lang === 'zh' ? primaryHexagram.tuijuan.zh : primaryHexagram.tuijuan.en;
    y = bodyText(ctx, tuijuan, lx, y, ltw, 12, TEXT_SEC, 4, 18, lang) + 6;
  }

  y += 14;

  // ── Changing lines ───────────────────────────────────────────────────────
  if (changingPositions.length > 0) {
    hline(ctx, y); y += 14;
    y = secLabel(
      ctx,
      lang === 'zh' ? `变爻 (${changingPositions.length})` : `Changing Lines (${changingPositions.length})`,
      y, 'rgba(231,76,60,0.65)',
    );
    y += 6;

    for (const pos of changingPositions) {
      const line   = primaryHexagram.lines[pos];
      const isYang = resultToYangLine(tossLines[pos].result) === 1;
      const lt     = getLineType(tossLines[pos].result);

      const pZh = ['初', '二', '三', '四', '五', '上'];
      const pEn = ['1st', '2nd', '3rd', '4th', '5th', '6th'];
      const label   = lang === 'zh' ? `${pZh[pos]}${isYang ? '九' : '六'}` : `${pEn[pos]} Line`;
      const typeStr = lt === 'old_yang'
        ? (lang === 'zh' ? '老阳 → 阴' : 'Old Yang → Yin')
        : (lang === 'zh' ? '老阴 → 阳' : 'Old Yin → Yang');

      sf(ctx, 13, '700');
      ctx.fillStyle = RED; ctx.textAlign = 'left';
      ctx.fillText(label, lx, y);

      sf(ctx, 10);
      ctx.fillStyle = 'rgba(231,76,60,0.65)'; ctx.textAlign = 'right';
      ctx.fillText(typeStr, W - PAD - 4, y + 2);
      y += 20;

      const text = lang === 'zh' ? line.textZh : line.textEn;
      y = bodyText(ctx, text, lx, y, ltw, 12, TEXT_PRI, 2, 18, lang) + 10;
    }
  }

  // ── Transformed hexagram ────────────────────────────────────────────────
  if (transformedHexagram) {
    hline(ctx, y); y += 14;
    y = secLabel(ctx, lang === 'zh' ? '变  卦' : 'Transformed Hexagram', y);

    sf(ctx, 26, '700');
    ctx.fillStyle = TEXT_SEC; ctx.textAlign = 'center';
    ctx.fillText(String(transformedHexagram.number), cx, y); y += 32;

    sf(ctx, 17, '700');
    ctx.fillStyle = TEXT_SEC;
    ctx.fillText(lang === 'zh' ? `${transformedHexagram.nameZh}卦` : transformedHexagram.nameEn, cx, y);
    y += 22;

    sf(ctx, 11, 'normal', true);
    ctx.fillStyle = 'rgba(196,169,125,0.55)';
    ctx.fillText(transformedHexagram.pinyin, cx, y); y += 18;

    const tLines: TossLine[] = tossLines.map(l => {
      if (!l.isChanging) return l;
      return { ...l, result: (l.result === 6 ? 9 : 6) as TossLine['result'], isChanging: false };
    });
    y = drawHexLines(ctx, cx, y, tLines, false); y += 12;

    hline(ctx, y); y += 12;
    ctx.textAlign = 'left';
    sf(ctx, 10, '600');
    ctx.fillStyle = GOLD_DIM;
    ctx.fillText(lang === 'zh' ? '卦辞' : 'Judgment', lx, y); y += 16;

    const tJudg = lang === 'zh' ? transformedHexagram.judgmentZh : transformedHexagram.judgmentEn;
    y = bodyText(ctx, tJudg, lx, y, ltw, 12, TEXT_SEC, 2, 18, lang) + 8;
  }

  y += 12;

  // ── Footer ──────────────────────────────────────────────────────────────
  hline(ctx, y); y += 12;

  sf(ctx, 10);
  ctx.fillStyle = 'rgba(196,169,125,0.35)';
  ctx.textAlign = 'center';
  ctx.fillText('yi-jing-tool.web.app', cx, y); y += 20;

  ctx.fillStyle = GOLD;
  ctx.fillRect(PAD + 60, y, IW - 120, 2); y += 8;

  // ── Crop ────────────────────────────────────────────────────────────────
  const out = document.createElement('canvas');
  out.width  = W * DPR;
  out.height = y * DPR;
  out.getContext('2d')!.drawImage(canvas, 0, 0, W * DPR, y * DPR, 0, 0, W * DPR, y * DPR);
  return out;
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function shareOrDownload(
  tossLines: TossLine[],
  lang: 'zh' | 'en',
  rd: ReadingDate,
): Promise<void> {
  const canvas = draw(tossLines, lang, rd);

  return new Promise(resolve => {
    canvas.toBlob(async blob => {
      if (!blob) { resolve(); return; }

      const filename = `yijing-${new Date().toISOString().slice(0, 10)}.png`;
      const file = new File([blob], filename, { type: 'image/png' });

      if (navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: lang === 'zh' ? '易经占卜结果' : 'I Ching Reading',
          });
          resolve(); return;
        } catch { /* user cancelled, fall through */ }
      }

      const url = URL.createObjectURL(blob);
      if (/iPhone|iPad|iPod/.test(navigator.userAgent) && !/CriOS/.test(navigator.userAgent)) {
        window.open(url, '_blank');
      } else {
        const a = document.createElement('a');
        a.href = url; a.download = filename; a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
      resolve();
    }, 'image/png');
  });
}
