import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FoldedLetter } from './FoldedLetter';

// Each asset is 600 × 400 px → 3 : 2 aspect ratio
const ASPECT = 600 / 400;

// Resting rotation for each card. Selected card is always 0°; others are subtle.
const ANGLES = [2, -3, 1, -2, 3, -1, 2];

interface LetterData {
  id: string;
  coverSrc: string;
  topSrc: string;
  bottomSrc: string;
}

export interface LetterStackProps {
  letters: LetterData[];
  noteWidth: number;
}

export function LetterStack({ letters, noteWidth }: LetterStackProps) {
  const panelH = noteWidth / ASPECT;
  const n = letters.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [transitionTo, setTransitionTo] = useState<number | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const indicatorIndex = transitionTo ?? activeIndex;

  // Complete the transition after the new card flies out, then back in.
  useEffect(() => {
    if (transitionTo === null) return;
    const timer = setTimeout(() => {
      setActiveIndex(transitionTo);
      setTransitionTo(null);
    }, 750);
    return () => clearTimeout(timer);
  }, [transitionTo]);

  const goTo = (index: number) => {
    const target = ((index % n) + n) % n;
    if (target === activeIndex || transitionTo !== null) return;
    setOpenId(null);
    setTransitionTo(target);
  };
  const goNext = () => goTo(activeIndex + 1);
  const goPrev = () => goTo(activeIndex - 1);

  const handleTap = () => {
    if (transitionTo !== null) return;
    const frontId = letters[activeIndex]?.id;
    if (!frontId) return;
    setOpenId((prev) => (prev === frontId ? null : frontId));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>
      <motion.div
        className="letter-deck"
        style={{
          display: 'grid',
          gridTemplateAreas: '"stack"',
          width: noteWidth,
          height: panelH + 40,
          touchAction: 'manipulation',
          userSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
          cursor: 'pointer',
        }}
        onTap={handleTap}
      >
        {letters.map((letter, index) => {
          const isTransitioning = transitionTo !== null;
          const isTarget = isTransitioning && index === transitionTo;
          const isActive = index === activeIndex;
          const distance = (index - activeIndex + n) % n;

          // During transition: current card stays on top, target card is just below it,
          // all other cards sit below the target so the target can fly out and in cleanly.
          const zIndex = isTransitioning
            ? isActive
              ? 20
              : isTarget
              ? undefined
              : 18 - distance
            : 20 - distance;

          const angle = isActive ? 0 : ANGLES[index % ANGLES.length];
          const animation = isTarget
            ? 'fly-out-in 0.75s ease-in-out forwards'
            : 'none';

          return (
            <div
              key={letter.id}
              style={{
                gridArea: '1 / 1',
                placeSelf: 'center',
                zIndex,
                pointerEvents: isActive && !isTransitioning ? 'auto' : 'none',
                rotate: 'var(--angle)',
                animation,
                transition: isTarget ? 'none' : 'rotate 0.3s ease-out',
                ['--angle' as string]: `${angle}deg`,
              } as React.CSSProperties}
            >
              <FoldedLetter
                coverSrc={letter.coverSrc}
                topSrc={letter.topSrc}
                bottomSrc={letter.bottomSrc}
                noteWidth={noteWidth}
                isOpen={isActive && openId === letter.id}
                onOpenChange={(open) => setOpenId(open ? letter.id : null)}
                interactive={false}
              />
            </div>
          );
        })}
      </motion.div>

      {/* ── Controls & indicator ─────────────────────────────── */}
      <div className="nb-controls">
        <button className="nb-btn" onClick={goPrev} aria-label="Previous letter">
          ←
        </button>

        <div className="nb-dots">
          {letters.map((letter, i) => (
            <button
              key={letter.id}
              className={`nb-dot ${i === indicatorIndex ? 'active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Go to letter ${i + 1}`}
            />
          ))}
        </div>

        <button className="nb-btn" onClick={goNext} aria-label="Next letter">
          →
        </button>
      </div>
    </div>
  );
}
