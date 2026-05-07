import { useState, useEffect } from 'react';
import { useShakeDetector } from '../utils/shake';
import { useLang } from '../contexts/LangContext';
import './StartScreen.css';

interface StartScreenProps {
  onStart: () => void;
}

export default function StartScreen({ onStart }: StartScreenProps) {
  const [showContent, setShowContent] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const { t } = useLang();

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 800);
    return () => clearTimeout(timer);
  }, []);

  useShakeDetector({ threshold: 18, cooldownMs: 1500, onShake: onStart });

  return (
    <div className="start-screen screen-enter">
      {/* Taiji + Bagua */}
      <div className="taiji-container">
        <div className="taiji-spin">
          <svg viewBox="0 0 200 200" className="taiji-svg">
            <circle cx="100" cy="100" r="95" fill="none" stroke="var(--accent-gold)" strokeWidth="2" />
            <path
              d="M100 5 A95 95 0 0 1 100 195 A47.5 47.5 0 0 1 100 100 A47.5 47.5 0 0 0 100 5"
              fill="var(--accent-gold)" opacity="0.9"
            />
            <path
              d="M100 195 A95 95 0 0 1 100 5 A47.5 47.5 0 0 1 100 100 A47.5 47.5 0 0 0 100 195"
              fill="var(--bg-primary)"
            />
            <circle cx="100" cy="52.5" r="14" fill="var(--accent-gold)" />
            <circle cx="100" cy="147.5" r="14" fill="var(--bg-primary)" />
          </svg>
        </div>
        <div className="bagua-ring">
          {['☰', '☱', '☲', '☳', '☷', '☶', '☵', '☴'].map((trigram, i) => (
            <span key={i} className="bagua-trigram" style={{ '--angle': `${i * 45}deg` } as React.CSSProperties}>
              <span className="bagua-char">{trigram}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Title */}
      <div className={`title-section ${showContent ? 'visible' : ''}`}>
        <h1 className="title-cn">{t('易经算卦', 'I Ching Divination')}</h1>
        <p className="subtitle-en">{t('诚心问卦，以明吉凶', 'Seek truth with sincerity')}</p>
      </div>

      {/* Start Button */}
      <div className={`action-section ${showContent ? 'visible' : ''}`}>
        <button className="btn-primary" onClick={onStart}>
          {t('开始算卦', 'Begin Divination')}
        </button>
        <p className="shake-hint">{t('或摇动手机开始', 'or shake your phone to begin')}</p>

        {/* Instructions toggle */}
        <button className="instructions-toggle" onClick={() => setShowInstructions(s => !s)}>
          {showInstructions
            ? t('收起说明 ▲', 'Hide instructions ▲')
            : t('查看说明 ▼', 'How to use ▼')}
        </button>
      </div>

      {/* Instructions panel */}
      {showInstructions && (
        <div className="instructions-card screen-enter">
          <p className="instructions-principle">
            {t(
              '自古以来易占家坚持一事一占的原则',
              'Since ancient times, I Ching practitioners have upheld the principle: one question per reading.'
            )}
          </p>
          <div className="instructions-divider" />
          <p className="instructions-label">{t('方法', 'Method')}</p>
          <p className="instructions-body">
            {t(
              '把你想要测的事在心头默念一至两遍，男用左手，女用右手，抽出一支完整卦签，然后把签放在桌子上，根据签上的图案和文字进行解读。',
              'Silently meditate on your question once or twice. Males use the left hand, females the right hand. Draw a complete lot, place it on the table, then interpret based on its symbols and text.'
            )}
          </p>
        </div>
      )}
    </div>
  );
}
