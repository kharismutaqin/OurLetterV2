import { useEffect, useRef, useState } from 'react';
import { motion, PanInfo } from 'framer-motion';
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
  const [openId, setOpenId] = useState<string | null>(null);
  const [shuffle, setShuffle] = useState(false);
  const isFirstRender = useRef(true);

  // Trigger a one-time shuffle animation whenever the selected letter changes.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    let raf = 0;
    setShuffle(false);
    raf = requestAnimationFrame(() => setShuffle(true));
    const timer = setTimeout(() => setShuffle(false), 600);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [activeIndex]);

  // Close an open letter when the selection changes.
  useEffect(() => {
    setOpenId(null);
  }, [activeIndex]);

  const goTo = (index: number) => setActiveIndex(((index % n) + n) % n);
  const goNext = () => goTo(activeIndex + 1);
  const goPrev = () => goTo(activeIndex - 1);

  const handleTap = () => {
    const frontId = letters[activeIndex]?.id;
    if (!frontId) return;
    setOpenId((prev) => (prev === frontId ? null : frontId));
  };

  const handleSwipe = (_: unknown, info: PanInfo) => {
    const dx = info.offset.x;
    const dy = info.offset.y;
    const vx = info.velocity.x;
    const vy = info.velocity.y;
    const threshold = 40;
    const vThreshold = 300;

    const horizontal = Math.abs(dx) > Math.abs(dy);

    if (horizontal) {
      if (dx < -threshold || vx < -vThreshold) {
        goNext();
      } else if (dx > threshold || vx > vThreshold) {
        goPrev();
      }
    } else {
      if (dy < -threshold || vy < -vThreshold) {
        const frontId = letters[activeIndex]?.id;
        if (frontId) setOpenId(frontId);
      } else if (dy > threshold || vy > vThreshold) {
        setOpenId(null);
      }
    }
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
          touchAction: 'none',
          userSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
          cursor: 'pointer',
        }}
        onTap={handleTap}
        onPanEnd={handleSwipe}
      >
        {letters.map((letter, index) => {
          const isSelected = index === activeIndex;
          const distance = (index - activeIndex + n) % n;
          const zIndex = 20 - distance;
          const angle = isSelected ? 0 : ANGLES[index % ANGLES.length];
          const animation = shuffle
            ? isSelected
              ? 'shuffle-reveal 0.6s cubic-bezier(0.33, 1, 0.68, 1) forwards'
              : 'shuffle-straighten 0.6s cubic-bezier(0.33, 1, 0.68, 1) forwards'
            : 'none';

          return (
            <div
              key={letter.id}
              style={{
                gridArea: '1 / 1',
                placeSelf: 'center',
                zIndex,
                pointerEvents: isSelected ? 'auto' : 'none',
                rotate: 'var(--angle)',
                animation,
                ['--angle' as string]: `${angle}deg`,
              } as React.CSSProperties}
            >
              <FoldedLetter
                coverSrc={letter.coverSrc}
                topSrc={letter.topSrc}
                bottomSrc={letter.bottomSrc}
                noteWidth={noteWidth}
                isOpen={isSelected && openId === letter.id}
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
            border: '1px solid rgba(255,255,255,0.15)',
            background: 'rgba(255,255,255,0.06)',
            color: '#fff',
            fontSize: 18,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            transition: 'background 0.2s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.14)')}
          onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
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
                  i === activeIndex
                    ? 'rgba(255,255,255,0.9)'
                    : 'rgba(255,255,255,0.2)',
                transition: 'background 0.25s, transform 0.25s',
                transform: i === activeIndex ? 'scale(1.3)' : 'scale(1)',
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
            border: '1px solid rgba(255,255,255,0.15)',
            background: 'rgba(255,255,255,0.06)',
            color: '#fff',
            fontSize: 18,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            transition: 'background 0.2s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.14)')}
          onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
          aria-label="Next letter"
        >
          →
        </button>
      </div>
    </div>
  );
}
