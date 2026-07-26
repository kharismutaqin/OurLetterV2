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
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
        }}
      >
        <button
          onClick={goPrev}
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            border: '1px solid rgba(0,0,0,0.12)',
            background: 'rgba(0,0,0,0.04)',
            color: 'var(--color-text)',
            fontSize: 18,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            transition: 'background 0.2s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.08)')}
          onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.04)')}
          aria-label="Previous letter"
        >
          ←
        </button>

        <div style={{ display: 'flex', gap: 10 }}>
          {letters.map((letter, i) => (
            <button
              key={letter.id}
              onClick={() => goTo(i)}
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                background:
                  i === indicatorIndex
                    ? 'rgba(0,0,0,0.85)'
                    : 'rgba(0,0,0,0.2)',
                transition: 'background 0.25s, transform 0.25s',
                transform: i === indicatorIndex ? 'scale(1.3)' : 'scale(1)',
              }}
              aria-label={`Go to letter ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={goNext}
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            border: '1px solid rgba(0,0,0,0.12)',
            background: 'rgba(0,0,0,0.04)',
            color: 'var(--color-text)',
            fontSize: 18,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            transition: 'background 0.2s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.08)')}
          onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.04)')}
          aria-label="Next letter"
        >
          →
        </button>
      </div>
    </div>
  );
}
