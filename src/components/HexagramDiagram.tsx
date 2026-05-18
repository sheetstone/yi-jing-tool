import type { TossLine } from '../types';
import { resultToYangLine } from '../utils/divination-toss';

interface HexagramDiagramProps {
  tossLines: TossLine[];
  title?: string;
  showChanging?: boolean;
}

export default function HexagramDiagram({ tossLines, title, showChanging = true }: HexagramDiagramProps) {
  // Display from top (line 6) to bottom (line 1)
  const displayOrder = [5, 4, 3, 2, 1, 0];
  const lineWidth = 180;
  const lineHeight = 8;
  const gap = 6;
  const totalHeight = displayOrder.length * (lineHeight + gap) + 20;

  return (
    <div className="hexagram-diagram">
      {title && <h4 className="diagram-title">{title}</h4>}
      <svg
        viewBox={`0 0 ${lineWidth + 40} ${totalHeight}`}
        width={lineWidth + 40}
        height={totalHeight}
      >
        {displayOrder.map((lineIndex, displayIdx) => {
          const line = tossLines[lineIndex];
          const isYang = resultToYangLine(line.result) === 1;
          const isChanging = showChanging && line.isChanging;
          const y = 10 + displayIdx * (lineHeight + gap);

          return (
            <g key={lineIndex}>
              {/* Changing marker */}
              {isChanging && (
                <text
                  x={5}
                  y={y + lineHeight - 1}
                  fill="var(--changing-color)"
                  fontSize="10"
                  fontFamily="sans-serif"
                >
                  {isYang ? '⚊' : '⚋'}
                </text>
              )}

              {isYang ? (
                // Solid Yang line
                <rect
                  x={20}
                  y={y}
                  width={lineWidth}
                  height={lineHeight}
                  rx={4}
                  fill={isChanging ? 'var(--changing-color)' : 'var(--line-yang)'}
                  opacity={isChanging ? 1 : 0.9}
                />
              ) : (
                // Broken Yin line (two segments)
                <>
                  <rect
                    x={20}
                    y={y}
                    width={84}
                    height={lineHeight}
                    rx={4}
                    fill={isChanging ? 'var(--changing-color)' : 'var(--line-yin)'}
                    opacity={isChanging ? 1 : 0.8}
                  />
                  <rect
                    x={116}
                    y={y}
                    width={84}
                    height={lineHeight}
                    rx={4}
                    fill={isChanging ? 'var(--changing-color)' : 'var(--line-yin)'}
                    opacity={isChanging ? 1 : 0.8}
                  />
                </>
              )}

              {/* Changing line indicator */}
              {isChanging && (
                <circle
                  cx={lineWidth + 30}
                  cy={y + lineHeight / 2}
                  r={5}
                  fill="none"
                  stroke="var(--changing-color)"
                  strokeWidth="1.5"
                />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
