import type { HexResonanceData } from '../utils/hexResonance';
import { RESONANCE_LABEL, RESONANCE_SYMBOL, resonanceDesc } from '../utils/hexResonance';
import './HexResonance.css';

const EL_COLOR: Record<string, string> = {
  木: '#4caf7d', 火: '#e05a3c', 土: '#c49b3c', 金: '#a8b8c8', 水: '#5b8bd4',
};

const WX_COLOR: Record<string, string> = {
  旺: '#e8c547', 相: '#d4a843', 休: '#c4a97d', 囚: '#7a6a5a', 死: '#5a5060',
};

interface Props {
  data: HexResonanceData;
  lang: 'zh' | 'en';
  secondary?: boolean;   // true for transformed hexagram (subtler style)
}

export default function HexResonance({ data, lang, secondary = false }: Props) {
  const label = RESONANCE_LABEL[data.resonance][lang];
  const sym   = RESONANCE_SYMBOL[data.resonance];
  const desc  = resonanceDesc(data, lang);
  const isDiff = data.hexEl !== data.hexElLower;

  return (
    <div className={`hex-resonance ${secondary ? 'hex-resonance--secondary' : ''}`}>
      {/* ── Header ─────────────────────────────────── */}
      <div className="hre-header">
        <span className="hre-title">{lang === 'zh' ? '今日卦运' : "Today's Influence"}</span>
        <span className="hre-wx-badge" style={{ color: WX_COLOR[data.wangXiang] }}>
          {data.hexEl}·{lang === 'zh' ? data.wangXiang : data.wangXiang}
        </span>
      </div>

      {/* ── Element flow ────────────────────────────── */}
      <div className="hre-flow">
        {/* Day stem */}
        <div className="hre-chip">
          <span className="hre-chip-el" style={{ color: EL_COLOR[data.dayEl] }}>
            {data.dayEl}
          </span>
          <span className="hre-chip-sub">{lang === 'zh' ? '日干' : 'Day stem'}</span>
        </div>

        {/* Relationship */}
        <div className="hre-rel">
          <span className="hre-rel-sym">{sym}</span>
          <span className="hre-rel-label">{label}</span>
        </div>

        {/* Hex element */}
        <div className="hre-chip">
          <span className="hre-chip-el" style={{ color: EL_COLOR[data.hexEl] }}>
            {data.hexEl}
          </span>
          <span className="hre-chip-sub">
            {lang === 'zh'
              ? `${isDiff ? '上卦' : '卦象'}`
              : `${isDiff ? 'upper' : 'hexagram'}`}
          </span>
          {isDiff && (
            <span className="hre-chip-lower" style={{ color: EL_COLOR[data.hexElLower] }}>
              +{data.hexElLower}
            </span>
          )}
        </div>
      </div>

      {/* ── Description ─────────────────────────────── */}
      <p className="hre-desc">{desc}</p>
    </div>
  );
}
