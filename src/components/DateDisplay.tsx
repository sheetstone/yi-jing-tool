import { useMemo, useRef } from 'react';
import type { ReadingDate } from '../utils/bazi';
import { getReadingDate } from '../utils/bazi';
import './DateDisplay.css';

const EL_COLOR: Record<string, string> = {
  木: '#4caf7d', 火: '#e05a3c', 土: '#c49b3c', 金: '#b0b8c6', 水: '#5b8bd4',
};
const EL_ORDER = ['木', '火', '土', '金', '水'];

interface Props {
  readingDate: ReadingDate;
  lang: 'zh' | 'en';
}

// Standalone hook so ResultScreen can create the date once on mount
export function useReadingDate(): ReadingDate {
  const ref = useRef<ReadingDate | null>(null);
  if (!ref.current) ref.current = getReadingDate(new Date());
  return ref.current;
}

export default function DateDisplay({ readingDate: rd, lang }: Props) {
  const sorted = useMemo(
    () => [...EL_ORDER].sort((a, b) => rd.elementMap[b] - rd.elementMap[a]),
    [rd],
  );

  return (
    <div className="date-display-card">
      {/* ── Gregorian date ──────────────────────────────────────────── */}
      <div className="solar-date-row">
        <span className="solar-year">{rd.yearCN}</span>
        <span className="solar-sep" />
        <span className="solar-month">{rd.monthCN}</span>
        <span className="solar-sep" />
        <span className="solar-day">{rd.dayCN}</span>
        <span className="solar-sep" />
        <span className="solar-weekday">{rd.weekdayCN}</span>
      </div>

      {/* ── Lunar + Ganzhi year ──────────────────────────────────────── */}
      <div className="lunar-date-row">
        <span className="lunar-gz-year">{rd.ganzhiYear}</span>
        {rd.lunarMD && (
          <>
            <span className="lunar-dot">·</span>
            <span className="lunar-md">农历{rd.lunarMD}</span>
          </>
        )}
      </div>

      <div className="date-hr" />

      {/* ── 八字 pillars ─────────────────────────────────────────────── */}
      <div className="bazi-section">
        <div className="bazi-header">{lang === 'zh' ? '八  字' : 'Four Pillars'}</div>
        <div className="bazi-pillars">
          {rd.pillars.map(p => (
            <div key={p.label} className="bazi-pillar">
              <span className="pillar-label">{p.label}</span>
              <span className="pillar-gz">{p.ganzhi}</span>
              <span className="pillar-el">
                <span style={{ color: EL_COLOR[p.stemEl] }}>{p.stemEl}</span>
                <span style={{ color: EL_COLOR[p.branchEl] }}>{p.branchEl}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="date-hr" />

      {/* ── 五行 ─────────────────────────────────────────────────────── */}
      <div className="wuxing-section">
        <span className="wuxing-title">{lang === 'zh' ? '五行' : 'Elements'}</span>
        <div className="wuxing-bars">
          {sorted.map(el => {
            const cnt = rd.elementMap[el];
            return (
              <div key={el} className="wuxing-item">
                <span className="wuxing-char" style={{ color: EL_COLOR[el] }}>{el}</span>
                <div className="wuxing-track">
                  <div
                    className="wuxing-fill"
                    style={{ width: `${(cnt / 8) * 100}%`, background: EL_COLOR[el] }}
                  />
                </div>
                <span className="wuxing-cnt" style={{ color: cnt > 0 ? EL_COLOR[el] : undefined }}>
                  {cnt}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
