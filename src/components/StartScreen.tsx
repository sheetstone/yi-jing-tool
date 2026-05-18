import { useState, useEffect } from 'react';
import { useShakeDetector } from '../utils/shake';
import { useLang } from '../contexts/LangContext';
import BaguaSVG from './BaguaSVG';
import './StartScreen.css';

interface StartScreenProps {
  onStart: () => void;
}

export default function StartScreen({ onStart }: StartScreenProps) {
  const [showContent, setShowContent] = useState(false);
  const [iosShakeReady, setIosShakeReady] = useState(false);
  const { t } = useLang();

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const { requestPermission } = useShakeDetector({ threshold: 18, cooldownMs: 1500, onShake: onStart });

  useEffect(() => {
    if (typeof (DeviceMotionEvent as any).requestPermission !== 'function') {
      requestPermission();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRequestIosShake = async () => {
    const granted = await requestPermission();
    if (granted) setIosShakeReady(true);
  };

  const needsIosPermission =
    typeof DeviceMotionEvent !== 'undefined' &&
    typeof (DeviceMotionEvent as any).requestPermission === 'function' &&
    !iosShakeReady;

  return (
    <div className="start-screen screen-enter">
      {/* Bagua */}
      <div className="taiji-container">
        <BaguaSVG className="bagua-img bagua-spin" />
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
        {needsIosPermission ? (
          <button className="shake-hint shake-hint-btn" onClick={handleRequestIosShake}>
            {t('点此开启摇动功能', 'Tap to enable shake')}
          </button>
        ) : (
          <p className="shake-hint">{t('或摇动手机开始', 'or shake your phone to begin')}</p>
        )}
      </div>

      {/* Educational content — always visible */}
      <div className="about-section">
        <div className="about-divider" />
        <h2 className="about-heading">{t('关于易经', 'About the I Ching')}</h2>
        <p className="about-body">
          {t(
            '易经，又称《周易》，是中国最古老的经典之一，约成书于三千年前。六十四卦象征宇宙万物的变化规律，融汇儒家与道家哲学，历代圣贤以此洞察天机、指引人生方向。',
            'The I Ching (易经, Yì Jīng), known as the Book of Changes, is one of China\'s oldest classical texts, composed over 3,000 years ago. Its 64 hexagrams map the patterns of change in the universe, drawing on Confucian and Daoist philosophy to offer timeless wisdom through life\'s uncertainties.'
          )}
        </p>

        <h3 className="about-subheading">{t('八卦', 'The Eight Trigrams')}</h3>
        <p className="about-body">
          {t(
            '乾☰（天）· 坤☷（地）· 震☳（雷）· 巽☴（风）· 坎☵（水）· 离☲（火）· 艮☶（山）· 兑☱（泽）。八卦两两相叠，化为六十四别卦，涵盖人生百态与万物变化。',
            'Qián ☰ Heaven · Kūn ☷ Earth · Zhèn ☳ Thunder · Xùn ☴ Wind · Kǎn ☵ Water · Lí ☲ Fire · Gèn ☶ Mountain · Duì ☱ Lake. Paired together, these eight trigrams form the 64 hexagrams that encompass every pattern of human experience.'
          )}
        </p>

        {/* How-to card — highlighted step-by-step guide */}
        <div className="how-to-card">
          <p className="how-to-title">{t('如何占卦', 'How to Consult the Oracle')}</p>
          <ol className="how-to-steps">
            <li>{t('静心冥想，在心中默念你想问的事情', 'Calm your mind and silently focus on your question')}</li>
            <li>{t('点击「开始算卦」，或直接摇动手机', 'Tap "Begin Divination" — or simply shake your phone')}</li>
            <li>{t('依次投掷铜钱六次，每次对应一爻，由下而上构成六爻', 'Toss the coins six times; each toss forms one line, building the hexagram from bottom to top')}</li>
            <li>{t('查看卦象与爻辞，获得运势、爱情、健康等多维度解读', 'Read your hexagram and line guidance across fortune, love, health, career, and more')}</li>
          </ol>
          <p className="how-to-note">
            {t(
              '自古以来，易占家坚持一事一占的原则。诚心诚意，静心冥想，方可得准确之卦象。',
              'Since ancient times, practitioners have upheld one rule: one question per reading. Approach with sincerity and an open mind for the most meaningful guidance.'
            )}
          </p>
        </div>

        <h3 className="about-subheading">{t('问卦须知', 'Forming a Good Question')}</h3>
        <p className="about-body">
          {t(
            '措辞宜具体明确，以"是否应该……"或"……的前景如何"为宜。避免同时询问多件事，专注一个疑问，方可得到最准确的指引。',
            'Frame your question clearly — "Should I…?" or "What is the outlook for…?" Avoid asking about multiple things at once. The more focused your question, the more precise the guidance you receive.'
          )}
        </p>
      </div>
    </div>
  );
}
