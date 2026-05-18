import { useMemo, useState } from 'react';
import type { TossLine } from '../types';
import { computeDivinationResult, resultToYangLine, getLineType } from '../utils/divination';
import { useLang } from '../contexts/LangContext';
import HexagramDiagram from './HexagramDiagram';
import AdBanner from './AdBanner';
import DateDisplay, { useReadingDate } from './DateDisplay';
import { shareOrDownload } from '../utils/shareImage';
import './ResultScreen.css';

interface ResultScreenProps {
  tossLines: TossLine[];
  onNewReading: () => void;
}

const PRIMARY_EXPLANATION = {
  zh: '本卦代表当前处境的核心状态，反映问题的本质与现在所处的能量格局。卦辞、大象与推断揭示此刻的整体运势与应对之道；变爻则指出正在发生的变化。',
  en: 'The primary hexagram represents the core state of your current situation — the essential nature of the matter and the energetic pattern you are in now. The judgment, image, and interpretation reveal your overall fortune and the right course of action; changing lines point to what is actively transforming.',
};

const TRANSFORMED_EXPLANATION = {
  zh: '变卦是由本卦的变爻翻转后形成的新卦，代表事态发展的方向与最终归宿。它揭示当下的变化将会引向何处，是对未来趋势的指引。无变爻时不现变卦。',
  en: 'The transformed hexagram is formed by flipping the changing lines of the primary hexagram. It represents where the situation is heading — the direction of change and its ultimate outcome. It appears only when there are changing lines.',
};

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

  const readingDate = useReadingDate();
  const [activeTab, setActiveTab] = useState<FortuneTab>('yunshi');
  const [transformedActiveTab, setTransformedActiveTab] = useState<FortuneTab>('yunshi');
  const [showPrimaryInfo, setShowPrimaryInfo] = useState(false);
  const [showTransformedInfo, setShowTransformedInfo] = useState(false);
  const [showChangingInfo, setShowChangingInfo] = useState(false);
  const [lineActiveTabs, setLineActiveTabs] = useState<Record<number, FortuneTab>>({});
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await shareOrDownload(tossLines, lang, readingDate);
    } finally {
      setIsSaving(false);
    }
  };

  const getLineTab = (pos: number): FortuneTab => lineActiveTabs[pos] ?? 'yunshi';
  const setLineTab = (pos: number, tab: FortuneTab) =>
    setLineActiveTabs(prev => ({ ...prev, [pos]: tab }));

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

        {/* Date + BaZi */}
        <DateDisplay readingDate={readingDate} lang={lang} />

        {/* Primary Hexagram */}
        <div className="hexagram-section primary">
          <div className="changing-lines-header">
            <h4 className="section-label">{t('本卦', 'Primary Hexagram')}</h4>
            <button
              className="info-btn"
              onClick={() => setShowPrimaryInfo(s => !s)}
              aria-label="Explain primary hexagram"
            >i</button>
          </div>
          {showPrimaryInfo && (
            <div className="info-popup fade-in">
              {t(PRIMARY_EXPLANATION.zh, PRIMARY_EXPLANATION.en)}
            </div>
          )}
          <div className="hexagram-info">
            <span className="hexagram-number">{primaryHexagram.number}</span>
            <h3 className="hexagram-name-zh">{primaryHexagram.nameZh}{t('卦', '')}</h3>
            <p className="hexagram-pinyin">{primaryHexagram.pinyin}</p>
            {lang === 'en' && <p className="hexagram-name-en">{primaryHexagram.nameEn}</p>}
          </div>

          <HexagramDiagram
            tossLines={tossLines}
            title={t('本卦', 'Primary')}
            showChanging={true}
          />

          {/* 卦辞 + 卜辞 supplement */}
          <div className="judgment-section">
            <h4 className="section-label">{t('卦辞', 'Judgment')}</h4>
            {lang === 'zh' && <p className="judgment-zh">{primaryHexagram.judgmentZh}</p>}
            {lang === 'en' && <p className="judgment-en">{primaryHexagram.judgmentEn}</p>}
            {primaryHexagram.buci && (
              <div className="buci-supplement">
                <span className="buci-supplement-label">{t('卜辞', 'Oracle')}</span>
                {lang === 'zh' && <p className="buci-supplement-text">{primaryHexagram.buci.zh}</p>}
                {lang === 'en' && <p className="buci-supplement-text">{primaryHexagram.buci.en}</p>}
              </div>
            )}
          </div>

          {/* 大象 */}
          {primaryHexagram.daxiang && (
            <div className="classical-section">
              <h4 className="section-label">{t('大象', 'Great Image')}</h4>
              {lang === 'zh' && <p className="classical-zh">{primaryHexagram.daxiang.zh}</p>}
              {lang === 'en' && <p className="classical-en">{primaryHexagram.daxiang.en}</p>}
            </div>
          )}

          {/* 推断 */}
          {primaryHexagram.tuijuan && (
            <div className="classical-section">
              <h4 className="section-label">{t('推断', 'Interpretation')}</h4>
              {lang === 'zh' && <p className="classical-zh">{primaryHexagram.tuijuan.zh}</p>}
              {lang === 'en' && <p className="classical-en">{primaryHexagram.tuijuan.en}</p>}
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
                    {lang === 'zh' && <p className="fortune-zh">{activeFortuneData.zh}</p>}
                    {lang === 'en' && <p className="fortune-en">{activeFortuneData.en}</p>}
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
              const activeLineTab = getLineTab(pos);
              const activeLineFortuneData = line[activeLineTab as keyof typeof line] as { zh: string; en: string } | undefined;
              const hasLineFortuneData = FORTUNE_TABS.some(tab => line[tab.key as keyof typeof line]);

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

                  {/* 爻辞 */}
                  {lang === 'zh' && <p className="changing-text-zh">{line.textZh}</p>}
                  {lang === 'en' && <p className="changing-text-en">{line.textEn}</p>}

                  {/* 推断 */}
                  {line.tuijuan && (
                    <div className="line-tuijuan">
                      <span className="line-tuijuan-label">{t('推断', 'Interpretation')}</span>
                      {lang === 'zh' && <p className="line-tuijuan-text">{line.tuijuan.zh}</p>}
                      {lang === 'en' && <p className="line-tuijuan-text">{line.tuijuan.en}</p>}
                    </div>
                  )}

                  {/* Per-line fortune tabs (运势 / 爱情 / 疾病 / 失物 / 诉讼) */}
                  {hasLineFortuneData && (
                    <div className="line-fortune-section">
                      <div className="line-fortune-tabs">
                        {FORTUNE_TABS.map(tab => (
                          <button
                            key={tab.key}
                            className={`line-fortune-tab ${activeLineTab === tab.key ? 'active' : ''}`}
                            onClick={() => setLineTab(pos, tab.key)}
                          >
                            {t(tab.zh, tab.en)}
                          </button>
                        ))}
                      </div>
                      <div className="line-fortune-content fade-in" key={`${pos}-${activeLineTab}`}>
                        {activeLineFortuneData ? (
                          <>
                            {lang === 'zh' && <p className="fortune-zh">{activeLineFortuneData.zh}</p>}
                            {lang === 'en' && <p className="fortune-en">{activeLineFortuneData.en}</p>}
                          </>
                        ) : (
                          <p className="fortune-empty">{t('暂无此项内容', 'No data available')}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Transformed Hexagram (变卦) */}
        {transformedHexagram && (
          <div className="hexagram-section transformed">
            <div className="changing-lines-header">
            <h4 className="section-label">{t('变卦', 'Transformed Hexagram')}</h4>
            <button
              className="info-btn"
              onClick={() => setShowTransformedInfo(s => !s)}
              aria-label="Explain transformed hexagram"
            >i</button>
          </div>
          {showTransformedInfo && (
            <div className="info-popup fade-in">
              {t(TRANSFORMED_EXPLANATION.zh, TRANSFORMED_EXPLANATION.en)}
            </div>
          )}
            <div className="hexagram-info">
              <span className="hexagram-number secondary">{transformedHexagram.number}</span>
              <h3 className="hexagram-name-zh secondary">{transformedHexagram.nameZh}{t('卦', '')}</h3>
              <p className="hexagram-pinyin">{transformedHexagram.pinyin}</p>
              {lang === 'en' && <p className="hexagram-name-en">{transformedHexagram.nameEn}</p>}
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
              {lang === 'zh' && <p className="judgment-zh">{transformedHexagram.judgmentZh}</p>}
              {lang === 'en' && <p className="judgment-en">{transformedHexagram.judgmentEn}</p>}
              {transformedHexagram.buci && (
                <div className="buci-supplement">
                  <span className="buci-supplement-label">{t('卜辞', 'Oracle')}</span>
                  {lang === 'zh' && <p className="buci-supplement-text">{transformedHexagram.buci.zh}</p>}
                  {lang === 'en' && <p className="buci-supplement-text">{transformedHexagram.buci.en}</p>}
                </div>
              )}
            </div>

            {transformedHexagram.daxiang && (
              <div className="classical-section">
                <h4 className="section-label">{t('大象', 'Great Image')}</h4>
                {lang === 'zh' && <p className="classical-zh">{transformedHexagram.daxiang.zh}</p>}
                {lang === 'en' && <p className="classical-en">{transformedHexagram.daxiang.en}</p>}
              </div>
            )}

            {transformedHexagram.tuijuan && (
              <div className="classical-section">
                <h4 className="section-label">{t('推断', 'Interpretation')}</h4>
                {lang === 'zh' && <p className="classical-zh">{transformedHexagram.tuijuan.zh}</p>}
                {lang === 'en' && <p className="classical-en">{transformedHexagram.tuijuan.en}</p>}
              </div>
            )}

            {FORTUNE_TABS.some(tab => transformedHexagram[tab.key]) && (
              <div className="fortune-tabs-section">
                <div className="fortune-tabs">
                  {FORTUNE_TABS.map(tab => (
                    <button
                      key={tab.key}
                      className={`fortune-tab ${transformedActiveTab === tab.key ? 'active' : ''}`}
                      onClick={() => setTransformedActiveTab(tab.key)}
                    >
                      {t(tab.zh, tab.en)}
                    </button>
                  ))}
                </div>
                <div className="fortune-content fade-in" key={`transformed-${transformedActiveTab}`}>
                  {transformedHexagram[transformedActiveTab] ? (
                    <>
                      {lang === 'zh' && <p className="fortune-zh">{transformedHexagram[transformedActiveTab]!.zh}</p>}
                      {lang === 'en' && <p className="fortune-en">{transformedHexagram[transformedActiveTab]!.en}</p>}
                    </>
                  ) : (
                    <p className="fortune-empty">{t('暂无此项内容', 'No data available')}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Ad — replace XXXXXXXXXX with your ad unit slot ID from AdSense */}
        <AdBanner adSlot="2883677619" style={{ margin: '8px 0' }} />

        {/* Action Buttons */}
        <div className="result-actions">
          <button
            className="btn-secondary save-reading-btn"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? t('生成中…', 'Generating…') : t('保存卦象', 'Save Reading')}
          </button>
          <button className="btn-primary new-reading-btn" onClick={onNewReading}>
            {t('重新占卜', 'New Reading')}
          </button>
        </div>
      </div>
    </div>
  );
}
