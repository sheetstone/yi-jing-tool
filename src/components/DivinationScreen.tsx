import { useState, useCallback, useRef, useEffect } from 'react';
import type { TossLine, LineType } from '../types';
import { performSingleToss } from '../utils/divination';
import { useShakeDetector } from '../utils/shake';
import { playShakeSound } from '../utils/sound';
import { useLang } from '../contexts/LangContext';
import HexagramBuilder from './HexagramBuilder';
import CoinToss from './CoinToss';
import './DivinationScreen.css';

interface DivinationScreenProps {
  onComplete: (tossLines: TossLine[]) => void;
  onBack: () => void;
}

const LINE_INFO = {
  old_yang:   { labelZh: '老阳', labelEn: 'Old Yang',   value: 9, changing: true  },
  young_yang: { labelZh: '少阳', labelEn: 'Young Yang',  value: 7, changing: false },
  young_yin:  { labelZh: '少阴', labelEn: 'Young Yin',   value: 8, changing: false },
  old_yin:    { labelZh: '老阴', labelEn: 'Old Yin',     value: 6, changing: true  },
};

const LINE_TOOLTIP: Record<LineType, { zh: string; en: string }> = {
  old_yang: {
    zh: '三枚全正（乾）= 9 点。阳气极盛，此爻为变爻，将转化为阴爻，请重点关注。',
    en: 'All three coins heads (Qian) = 9. Yang at its peak — this is a moving line that transforms to yin. Pay special attention.',
  },
  young_yang: {
    zh: '一正（乾）+ 两反（坤）= 7 点。稳定阳爻，此次占问中不发生变化。',
    en: '1 head (Qian) + 2 tails (Kun) = 7. Stable yang line — no change in this reading.',
  },
  young_yin: {
    zh: '两正（乾）+ 一反（坤）= 8 点。稳定阴爻，此次占问中不发生变化。',
    en: '2 heads (Qian) + 1 tail (Kun) = 8. Stable yin line — no change in this reading.',
  },
  old_yin: {
    zh: '三枚全反（坤）= 6 点。阴气极盛，此爻为变爻，将转化为阳爻，请重点关注。',
    en: 'All three coins tails (Kun) = 6. Yin at its peak — this is a moving line that transforms to yang. Pay special attention.',
  },
};

const POS_LABEL_ZH = ['初', '二', '三', '四', '五', '上'];
const POS_LABEL_EN = ['1st', '2nd', '3rd', '4th', '5th', '6th'];

// Coin faces for each toss value: true=yang/乾(heads), false=yin/坤(tails)
const COIN_FACES: Record<number, [boolean, boolean, boolean]> = {
  9: [true,  true,  true ],
  7: [true,  false, false],
  8: [true,  true,  false],
  6: [false, false, false],
};

const COIN_DESC: Record<number, { zh: string; en: string }> = {
  9: { zh: '三乾 · 变爻', en: '3 heads · changing' },
  7: { zh: '一乾两坤',     en: '1 head  · 2 tails'  },
  8: { zh: '两乾一坤',     en: '2 heads · 1 tail'   },
  6: { zh: '三坤 · 变爻', en: '3 tails · changing' },
};

export default function DivinationScreen({ onComplete, onBack }: DivinationScreenProps) {
  const [tossLines, setTossLines] = useState<TossLine[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shakeEnabled, setShakeEnabled] = useState(false);
  const [showLineInfo, setShowLineInfo] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useLang();

  const currentToss = tossLines.length + 1;

  const handleToss = useCallback(() => {
    if (isAnimating || currentToss > 6) return;
    playShakeSound();
    setIsAnimating(true);
    setShowLineInfo(false);
    setTimeout(() => {
      const newLine = performSingleToss(currentToss);
      const updatedLines = [...tossLines, newLine];
      setTossLines(updatedLines);
      setIsAnimating(false);
      if (updatedLines.length === 6) {
        setTimeout(() => onComplete(updatedLines), 500);
      }
    }, 850);
  }, [isAnimating, currentToss, tossLines, onComplete]);

  const { requestPermission } = useShakeDetector({ threshold: 18, cooldownMs: 1200, onShake: handleToss });

  const enableShake = async () => {
    const granted = await requestPermission();
    if (granted) setShakeEnabled(true);
  };

  useEffect(() => {
    if (typeof (DeviceMotionEvent as any).requestPermission !== 'function') {
      enableShake();
    }
  }, []);

  const lastLine = tossLines[tossLines.length - 1];

  const tossBtnLabel = (n: number) => t(
    `投掷第${n}次`,
    `Toss #${n}`
  );

  return (
    <div className="divination-screen screen-enter" ref={containerRef}>
      {/* Header */}
      <div className="divination-header">
        <button className="btn-back" onClick={onBack}>{t('← 返回', '← Back')}</button>
        <h2 className="divination-title">{t('起卦中', 'Casting')}</h2>
        <div className="toss-counter">
          <span className="toss-current">{currentToss > 6 ? 6 : currentToss}</span>
          <span className="toss-divider">/</span>
          <span className="toss-total">6</span>
        </div>
      </div>

      {/* Main content */}
      <div className="divination-content">
        {/* Left: hexagram builder */}
        <HexagramBuilder tossLines={tossLines} />

        {/* Centre: coin toss */}
        <div className="toss-area">
          <CoinToss
            isAnimating={isAnimating}
            result={isAnimating ? undefined : lastLine?.result}
          />

          {isAnimating && (
            <div className="toss-status tossing">{t('投掷中...', 'Tossing...')}</div>
          )}

          {!isAnimating && lastLine && (
            <div className="toss-result-wrapper fade-in">
              <div className="toss-result">
                <div className="result-label">
                  <span className={`result-cn ${LINE_INFO[lastLine.lineType].changing ? 'changing' : ''}`}>
                    {t(LINE_INFO[lastLine.lineType].labelZh, LINE_INFO[lastLine.lineType].labelEn)}
                  </span>
                  <span className="result-value">{LINE_INFO[lastLine.lineType].value}</span>
                </div>
                <button
                  className="info-btn"
                  onClick={() => setShowLineInfo(s => !s)}
                  aria-label="Explain this result"
                >i</button>
              </div>
              {showLineInfo && (
                <div className="info-popup">
                  {t(LINE_TOOLTIP[lastLine.lineType].zh, LINE_TOOLTIP[lastLine.lineType].en)}
                </div>
              )}
            </div>
          )}

          {!isAnimating && currentToss <= 6 && (
            <button className="btn-primary toss-btn" onClick={handleToss}>
              {tossBtnLabel(currentToss)}
            </button>
          )}

          {currentToss > 6 && !isAnimating && (
            <div className="toss-complete fade-in">
              <span className="complete-icon">{t('卦成', 'Complete')}</span>
              <p className="complete-text">{t('六爻已成，查看结果', 'All six lines cast')}</p>
            </div>
          )}
        </div>

        {/* Right: history */}
        <div className="toss-history">
          <h3 className="history-title">{t('爻象记录', 'Line History')}</h3>
          {tossLines.length === 0 && (
            <p className="history-empty">{t('等待投掷...', 'Waiting...')}</p>
          )}
          {tossLines.map((line) => {
            const info = LINE_INFO[line.lineType];
            const posLabel = t(
              POS_LABEL_ZH[line.tossNumber - 1],
              POS_LABEL_EN[line.tossNumber - 1]
            );
            const faces = COIN_FACES[info.value];
            const desc  = COIN_DESC[info.value];
            return (
              <div key={line.tossNumber} className={`history-item ${info.changing ? 'changing' : ''}`}>
                <div className="history-main">
                  <span className="history-pos">{posLabel}</span>
                  <span className="history-label">{t(info.labelZh, info.labelEn)}</span>
                  <span className="history-value">{info.value}</span>
                </div>
                <div className="history-detail">
                  <span className="history-coins">
                    {faces.map((isYang, ci) => (
                      <span key={ci} className={`history-coin ${isYang ? 'yang' : 'yin'}`} />
                    ))}
                  </span>
                  <span className="history-desc">{t(desc.zh, desc.en)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Shake */}
      {!shakeEnabled && currentToss <= 6 && (
        <button className="shake-enable-btn" onClick={enableShake}>
          {t('📱 开启摇动起卦', '📱 Enable shake to toss')}
        </button>
      )}
      {shakeEnabled && currentToss <= 6 && (
        <p className="shake-active-hint">{t('摇动手机即可投掷', 'Shake phone to toss')}</p>
      )}
    </div>
  );
}
