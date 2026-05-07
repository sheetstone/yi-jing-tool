import type { TossLine } from '../types';
import { resultToYangLine } from '../utils/divination';
import { useLang } from '../contexts/LangContext';

interface HexagramBuilderProps {
  tossLines: TossLine[];
}

const POS_LABEL_ZH = ['初', '二', '三', '四', '五', '上'];
const POS_LABEL_EN = ['1', '2', '3', '4', '5', '6'];

export default function HexagramBuilder({ tossLines }: HexagramBuilderProps) {
  const { t } = useLang();
  const displayOrder = [5, 4, 3, 2, 1, 0];

  return (
    <div className="hexagram-builder">
      <h3 className="builder-title">{t('卦象', 'Hexagram')}</h3>
      <div className="builder-lines">
        {displayOrder.map((displayIdx) => {
          const lineIndex = 5 - displayIdx;
          const hasLine = lineIndex < tossLines.length;
          const line = hasLine ? tossLines[lineIndex] : null;
          const isYang = line ? resultToYangLine(line.result) === 1 : false;
          const isChanging = line?.isChanging ?? false;

          return (
            <div key={displayIdx} className={`builder-line-row ${hasLine ? 'active' : 'empty'}`}>
              <span className="builder-line-label">
                {t(POS_LABEL_ZH[lineIndex], POS_LABEL_EN[lineIndex])}
              </span>
              <div
                className={`builder-line-bar ${isChanging ? 'changing' : ''} ${isYang ? 'yang' : 'yin'}`}
              >
                {hasLine ? (
                  isYang ? (
                    <div className="line-yang-bar" />
                  ) : (
                    <>
                      <div className="line-yin-left" />
                      <div className="line-yin-gap" />
                      <div className="line-yin-right" />
                    </>
                  )
                ) : (
                  <div className="line-empty" />
                )}
              </div>
            </div>
          );
        })}
      </div>
      <p className="builder-hint">
        {tossLines.length < 6
          ? t(
              `${POS_LABEL_ZH[tossLines.length]}爻待定`,
              `Line ${POS_LABEL_EN[tossLines.length]} next`
            )
          : t('六爻已定', 'All 6 cast')}
      </p>
    </div>
  );
}
