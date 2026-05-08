// Pre-heaven (先天) arrangement, clockwise from top
// Each entry: [bottom-line, middle-line, top-line], true = yang (solid), false = yin (broken)
const TRIGRAMS: Array<[boolean, boolean, boolean]> = [
  [true,  true,  true ],  // 0°   ☰ Qian (乾)
  [true,  true,  false],  // 45°  ☱ Dui  (兑)
  [true,  false, true ],  // 90°  ☲ Li   (离)
  [true,  false, false],  // 135° ☳ Zhen (震)
  [false, false, false],  // 180° ☷ Kun  (坤)
  [false, false, true ],  // 225° ☶ Gen  (艮)
  [false, true,  false],  // 270° ☵ Kan  (坎)
  [false, true,  true ],  // 315° ☴ Xun  (巽)
];

const TRIGRAM_NAMES = ['乾', '兑', '离', '震', '坤', '艮', '坎', '巽'];

interface BaguaSVGProps {
  className?: string;
}

export default function BaguaSVG({ className }: BaguaSVGProps) {
  const C = 200;        // center
  const R = 188;        // outer octagon radius (vertex-to-center)
  const R_BAND = 100;   // inner edge of trigram band
  const R_TAIJI = 90;   // taiji radius
  const R_L0 = 110;     // bottom (inner) line of trigram
  const R_L1 = 126;     // middle line
  const R_L2 = 142;     // top (outer) line
  const HALF = 19;      // half-length of a full yang line
  const GAP  = 5.5;     // half-gap for broken yin line

  const GOLD     = '#d4a843';
  const GOLD_YIN = 'rgba(212,168,67,0.55)';
  const GOLD_60  = 'rgba(212,168,67,0.6)';
  const GOLD_35  = 'rgba(212,168,67,0.35)';
  const GOLD_18  = 'rgba(212,168,67,0.18)';
  const BG       = '#1a1a2e';
  const BG_BAND  = 'rgba(26,26,46,0.55)';

  // Octagon vertices — flat sides face the 8 trigram directions
  const octPoints = Array.from({ length: 8 }, (_, i) => {
    const a = ((i * 45 + 22.5) * Math.PI) / 180;
    return `${C + R * Math.sin(a)},${C - R * Math.cos(a)}`;
  }).join(' ');

  // One trigram group at the given clockwise angle from top
  function Trigram({ lines, angleDeg, idx }: { lines: [boolean, boolean, boolean]; angleDeg: number; idx: number }) {
    const θ = (angleDeg * Math.PI) / 180;
    const rx = Math.sin(θ);    // radial unit vector
    const ry = -Math.cos(θ);
    const tx = Math.cos(θ);   // tangent unit vector (perpendicular)
    const ty = Math.sin(θ);

    const radii = [R_L0, R_L1, R_L2];
    const nameR = R - 16;
    const nx = C + nameR * Math.sin(θ);
    const ny = C - nameR * Math.cos(θ);

    return (
      <g>
        {/* Chinese name near outer edge */}
        <text
          x={nx} y={ny}
          textAnchor="middle" dominantBaseline="middle"
          fontSize="11" fontFamily="PingFang SC, Noto Sans SC, sans-serif"
          fill={GOLD_60} letterSpacing="0"
          transform={`rotate(${angleDeg}, ${nx}, ${ny})`}
        >
          {TRIGRAM_NAMES[idx]}
        </text>

        {/* Three yao lines (bottom=inner → top=outer) */}
        {lines.map((isYang, i) => {
          const r = radii[i];
          const lx = C + r * rx;
          const ly = C + r * ry;
          const stroke = isYang ? GOLD : GOLD_YIN;
          const sw = isYang ? 4 : 3.5;

          if (isYang) {
            return (
              <line key={i}
                x1={lx - HALF * tx} y1={ly - HALF * ty}
                x2={lx + HALF * tx} y2={ly + HALF * ty}
                stroke={stroke} strokeWidth={sw} strokeLinecap="round"
              />
            );
          }
          return (
            <g key={i}>
              <line
                x1={lx - HALF * tx} y1={ly - HALF * ty}
                x2={lx - GAP  * tx} y2={ly - GAP  * ty}
                stroke={stroke} strokeWidth={sw} strokeLinecap="round"
              />
              <line
                x1={lx + GAP  * tx} y1={ly + GAP  * ty}
                x2={lx + HALF * tx} y2={ly + HALF * ty}
                stroke={stroke} strokeWidth={sw} strokeLinecap="round"
              />
            </g>
          );
        })}
      </g>
    );
  }

  // Taiji (yin-yang) — same arc logic as the original component, scaled to R_TAIJI
  const r  = R_TAIJI;   // 90
  const r2 = r / 2;     // 45
  const T  = C - r;     // 110  (top)
  const B  = C + r;     // 290  (bottom)
  const yangPath = `M${C} ${T} A${r} ${r} 0 0 1 ${C} ${B} A${r2} ${r2} 0 0 1 ${C} ${C} A${r2} ${r2} 0 0 0 ${C} ${T}Z`;
  const yinPath  = `M${C} ${B} A${r} ${r} 0 0 1 ${C} ${T} A${r2} ${r2} 0 0 1 ${C} ${C} A${r2} ${r2} 0 0 0 ${C} ${B}Z`;
  const dotR = Math.round(r2 * 0.38); // ~17px
  const yangDotY = C - r2;  // 155 — yang dot inside yin (dark) region
  const yinDotY  = C + r2;  // 245 — yin  dot inside yang (gold) region

  return (
    <svg viewBox="0 0 400 400" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="glow-gold" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="glow-soft" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* === Background fill (octagon only, semi-transparent) === */}
      <polygon points={octPoints} fill={BG_BAND} />

      {/* Inner band fill (solid bg so taiji is readable) */}
      <circle cx={C} cy={C} r={R_BAND} fill={BG} />

      {/* === Radial dividers (8 sectors) === */}
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i * 45 * Math.PI) / 180;
        return (
          <line key={i}
            x1={C + R_BAND * Math.sin(a)} y1={C - R_BAND * Math.cos(a)}
            x2={C + R      * Math.sin(a)} y2={C - R      * Math.cos(a)}
            stroke={GOLD_35} strokeWidth="1"
          />
        );
      })}

      {/* === Outer octagon border (with glow) === */}
      <polygon points={octPoints}
        fill="none" stroke={GOLD} strokeWidth="2"
        filter="url(#glow-gold)"
      />
      {/* Second, thinner inner octagon for depth */}
      <polygon
        points={Array.from({ length: 8 }, (_, i) => {
          const a = ((i * 45 + 22.5) * Math.PI) / 180;
          const r2 = R - 8;
          return `${C + r2 * Math.sin(a)},${C - r2 * Math.cos(a)}`;
        }).join(' ')}
        fill="none" stroke={GOLD_18} strokeWidth="1"
      />

      {/* === Inner band separators === */}
      <circle cx={C} cy={C} r={R_BAND}     fill="none" stroke={GOLD_60} strokeWidth="1.5" />
      <circle cx={C} cy={C} r={R_BAND - 5} fill="none" stroke={GOLD_18} strokeWidth="1"   />

      {/* === Trigrams === */}
      {TRIGRAMS.map((lines, i) => (
        <Trigram key={i} lines={lines} angleDeg={i * 45} idx={i} />
      ))}

      {/* === Taiji === */}
      <path d={yinPath}  fill={BG}   />
      <path d={yangPath} fill={GOLD} opacity="0.92" />
      {/* Yin dot (dark) in yang half */}
      <circle cx={C} cy={yinDotY}  r={dotR} fill={BG} />
      {/* Yang dot (gold) in yin half */}
      <circle cx={C} cy={yangDotY} r={dotR} fill={GOLD} opacity="0.88" />
      {/* Taiji border */}
      <circle cx={C} cy={C} r={r} fill="none" stroke={GOLD_60} strokeWidth="1.5" filter="url(#glow-soft)" />
    </svg>
  );
}
