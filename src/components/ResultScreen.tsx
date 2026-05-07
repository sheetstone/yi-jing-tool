import { useMemo, useState } from 'react';
import type { TossLine } from '../types';
import { computeDivinationResult, resultToYangLine, getLineType } from '../utils/divination';
import { useLang } from '../contexts/LangContext';
import HexagramDiagram from './HexagramDiagram';
import './ResultScreen.css';

interface ResultScreenProps {
  tossLines: TossLine[];
  onNewReading: () => void;
}

const CHANGING_EXPLANATION = {
  zh: '变爻是占问中出现的老阳（九，三枚全正）或老阴（六，三枚全反）的爻。阳极必变阴，阴极必变阳，此乃易道之核心。变爻是本次占问中最需关注的爻辞，代表当下最活跃的转化力量。若有变爻，则以变卦为最终归宿，变卦揭示事态发展的方向。',
  en: "Changing lines arise when all three coins show heads (老阳=9) or all three tails (老阴=6). Yang at its peak transforms to yin; yin at its peak transforms to yang — this is the heart of the I Ching's teaching on change. Changing lines carry the most urgent message in a reading. When present, the transformed hexagram reveals the outcome and direction of events.",
};

const FORTUNE_TABS = [
  { key: 'yunshi', zh: '运势', en: 'Fortune'   },
  { key: 'aiqing', zh: '爱情', en: 'Love'       },
  { key: 'jibing', zh: '疾病', en: 'Health'     },
  { key: 'shiwu',  zh: '失物', en: 'Lost Items' },
  { key: 'susong', zh: '诉讼', en: 'Legal'      },
] as const;

type FortuneTab = typeof FORTUNE_TABS[number]['key'];

export default function ResultScreen({ tossLines, onNewReading }: ResultScreenProps) {
  const { lang, t } = useLang();
  const result = useMemo(() => computeDivinationResult(tossLines), [tossLines]);
  const { primaryHexagram, transformedHexagram } = result;

  const [activeTab, setActiveTab] = useState<FortuneTab>('yunshi');
  const [showChangingInfo, setShowChangingInfo] = useState(false);

  const changingLinePositions = tossLines
    .map((line, i) => (line.isChanging ? i : -1))
    .filter((i) => i >= 0);

  const getLineLabel = (position: number): string => {
    const isYang = resultToYangLine(tossLines[position].result) === 1;
    if (lang === 'zh') {
      const posNames = ['初', '二', '三', '四', '五', '上'];
      return `${posNames[position]}${isYang ? '九' : '六'}`;
    }
    const posNames = ['1st', '2nd', '3rd', '4th', '5th', '6th'];
    return `${posNames[position]} Line`;
  };

  const activeFortuneData = primaryHexagram[activeTab];
  const hasFortuneData = FORTUNE_TABS.some(tab => primaryHexagram[tab.key]);

  return (
    <div className="result-screen screen-enter">
      <div className="result-container">
        <h2 className="result-heading">{t('占卜结果', 'Reading Result')}</h2>

        {/* Primary Hexagram */}
        <div className="hexagram-section primary">
          <div className="hexagram-info">
            <span className="hexagram-number">{primaryHexagram.number}</span>
            <h3 className="hexagram-name-zh">{primaryHexagram.nameZh}{t('卦', '')}</h3>
            <p className="hexagram-pinyin">{primaryHexagram.pinyin}</p>
            <p className="hexagram-name-en">{primaryHexagram.nameEn}</p>
          </div>

          <HexagramDiagram
            tossLines={tossLines}
            title={t('本卦', 'Primary')}
            showChanging={true}
          />

          {/* Judgment (卦辞) */}
          <div className="judgment-section">
            <h4 className="section-label">{t('卦辞', 'Judgment')}</h4>
            <p className="judgment-zh">{primaryHexagram.judgmentZh}</p>
            <p className="judgment-en">{primaryHexagram.judgmentEn}</p>
          </div>

          {/* 大象 */}
          {primaryHexagram.daxiang && (
            <div className="classical-section">
              <h4 className="section-label">{t('大象', 'Great Image')}</h4>
              <p className="classical-zh">{primaryHexagram.daxiang.zh}</p>
              <p className="classical-en">{primaryHexagram.daxiang.en}</p>
            </div>
          )}

          {/* 卜辞 */}
          {primaryHexagram.buci && (
            <div className="classical-section buci-section">
              <h4 className="section-label">{t('卜辞', 'Oracle')}</h4>
              <p className="classical-zh buci-text">{primaryHexagram.buci.zh}</p>
              <p className="classical-en">{primaryHexagram.buci.en}</p>
            </div>
          )}

          {/* 推断 */}
          {primaryHexagram.tuijuan && (
            <div className="classical-section">
              <h4 className="section-label">{t('推断', 'Interpretation')}</h4>
              <p className="classical-zh">{primaryHexagram.tuijuan.zh}</p>
              <p className="classical-en">{primaryHexagram.tuijuan.en}</p>
            </div>
          )}

          {/* Fortune Tabs */}
          {hasFortuneData && (
            <div className="fortune-tabs-section">
              <div className="fortune-tabs">
                {FORTUNE_TABS.map(tab => (
                  <button
                    key={tab.key}
                    className={`fortune-tab ${activeTab === tab.key ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    {t(tab.zh, tab.en)}
                  </button>
                ))}
              </div>
              <div className="fortune-content fade-in" key={activeTab}>
                {activeFortuneData ? (
                  <>
                    <p className="fortune-zh">{activeFortuneData.zh}</p>
                    <p className="fortune-en">{activeFortuneData.en}</p>
                  </>
                ) : (
                  <p className="fortune-empty">{t('暂无此项内容', 'No data available')}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Changing Lines (变爻) */}
        {changingLinePositions.length > 0 && (
          <div className="changing-lines-section">
            <div className="changing-lines-header">
              <h4 className="section-label">
                {t('变爻', 'Changing Lines')} ({changingLinePositions.length})
              </h4>
              <button
                className="info-btn"
                onClick={() => setShowChangingInfo(s => !s)}
                aria-label="Explain changing lines"
              >i</button>
            </div>
            {showChangingInfo && (
              <div className="info-popup fade-in">
                {t(CHANGING_EXPLANATION.zh, CHANGING_EXPLANATION.en)}
              </div>
            )}
            {changingLinePositions.map((pos) => {
              const line = primaryHexagram.lines[pos];
              const label = getLineLabel(pos);
              const lineType = getLineType(tossLines[pos].result);

              return (
                <div key={pos} className="changing-line-card">
                  <div className="changing-line-header">
                    <span className="changing-label">{label}</span>
                    <span className="changing-type">
                      {lineType === 'old_yang'
                        ? t('老阳 → 阴', 'Old Yang → Yin')
                        : t('老阴 → 阳', 'Old Yin → Yang')}
                    </span>
                  </div>
                  <p className="changing-text-zh">{line.textZh}</p>
                  <p className="changing-text-en">{line.textEn}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Transformed Hexagram (变卦) */}
        {transformedHexagram && (
          <div className="hexagram-section transformed">
            <h4 className="section-label">{t('变卦', 'Transformed Hexagram')}</h4>
            <div className="hexagram-info">
              <span className="hexagram-number secondary">{transformedHexagram.number}</span>
              <h3 className="hexagram-name-zh secondary">{transformedHexagram.nameZh}{t('卦', '')}</h3>
              <p className="hexagram-pinyin">{transformedHexagram.pinyin}</p>
              <p className="hexagram-name-en">{transformedHexagram.nameEn}</p>
            </div>

            <HexagramDiagram
              tossLines={tossLines.map((line) => {
                if (line.isChanging) {
                  const flipped = line.result === 6 ? 9 : 6;
                  return {
                    ...line,
                    result: flipped as TossLine['result'],
                    lineType: line.result === 6 ? 'young_yang' as const : 'young_yin' as const,
                    isChanging: false,
                  };
                }
                return line;
              })}
              title={t('变卦', 'Transformed')}
              showChanging={false}
            />

            <div className="judgment-section">
              <p className="judgment-zh">{transformedHexagram.judgmentZh}</p>
              <p className="judgment-en">{transformedHexagram.judgmentEn}</p>
            </div>
          </div>
        )}

        {/* New Reading Button */}
        <button className="btn-primary new-reading-btn" onClick={onNewReading}>
          {t('重新占卜', 'New Reading')}
        </button>
      </div>
    </div>
  );
}
