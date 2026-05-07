import type { TossResult } from '../types';
import './CoinToss.css';

interface CoinTossProps {
  isAnimating: boolean;
  result?: TossResult;
}

function getCoinFaces(result: TossResult): boolean[] {
  // true = yang (乾, heads), false = yin (坤, tails)
  // 6 = 2+2+2 (all yin), 7 = 3+2+2, 8 = 3+3+2, 9 = 3+3+3 (all yang)
  switch (result) {
    case 6: return [false, false, false];
    case 7: return [true,  false, false];
    case 8: return [true,  true,  false];
    case 9: return [true,  true,  true];
  }
}

export default function CoinToss({ isAnimating, result }: CoinTossProps) {
  const faces = !isAnimating && result != null ? getCoinFaces(result) : null;

  return (
    <div className="coin-toss-container">
      <div className="coin-area">
        {[0, 1, 2].map((i) => {
          const isYang = faces ? faces[i] : null;
          const cls = [
            'coin',
            isAnimating ? 'flipping' : '',
            !isAnimating && isYang === true  ? 'yang' : '',
            !isAnimating && isYang === false ? 'yin'  : '',
          ].filter(Boolean).join(' ');

          return (
            <div
              key={i}
              className={cls}
              style={{ '--i': i } as React.CSSProperties}
            >
              <div className="coin-hole" />
              <span className="coin-char">
                {!isAnimating && isYang === false ? '坤' : '乾'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
