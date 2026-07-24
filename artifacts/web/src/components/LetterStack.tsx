import { useEffect, useState } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { FoldedLetter } from './FoldedLetter';

// Each asset is 600 × 400 px → 3 : 2 aspect ratio
const ASPECT = 600 / 400;

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

  const frontId = letters[activeIndex]?.id ?? null;

  // Close any open letter when the active letter changes — keeps the stack clean.
  useEffect(() => {
    setOpenId(null);
  }, [activeIndex]);

  const goTo = (index: number) => {
    setActiveIndex((index % n + n) % n);
  };

  const goNext = () => goTo(activeIndex + 1);
  const goPrev = () => goTo(activeIndex - 1);

  const handleTap = () => {
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
        // Swipe left → next letter.
        goNext();
      } else if (dx > threshold || vx > vThreshold) {
        // Swipe right → previous letter.
        goPrev();
      }
    } else {
      if (dy < -threshold || vy < -vThreshold) {
        // Swipe up → open the front letter.
        if (frontId) setOpenId(frontId);
      } else if (dy > threshold || vy > vThreshold) {
        // Swipe down → close the open letter.
        setOpenId(null);
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>
      <motion.div
        className="letter-stack"
        style={{
          position: 'relative',
          width: noteWidth,
          height: panelH + 180,
          perspective: 1100,
          cursor: 'pointer',
          touchAction: 'none',
          userSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
        }}
        onTap={handleTap}
        onPanEnd={handleSwipe}
      >
        {letters.map((letter, index) => {
          const position = (index - activeIndex + n) % n;
          const isFront = position === 0;

          return (
            <motion.div
              key={letter.id}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: noteWidth,
                height: panelH,
                transformStyle: 'preserve-3d',
                pointerEvents: isFront ? 'auto' : 'none',
                zIndex: 30 - position * 10,
              }}
              animate={{
                y: position * 30,
                z: position * -60,
                scale: 1 - position * 0.05,
                rotateX: position * -6,
                rotateZ: position === 0 ? 0 : position % 2 === 1 ? 3 : -3,
                opacity: 1 - position * 0.08,
              }}
              transition={{ type: 'spring', stiffness: 220, damping: 24 }}
            >
              <FoldedLetter
                coverSrc={letter.coverSrc}
                topSrc={letter.topSrc}
                bottomSrc={letter.bottomSrc}
                noteWidth={noteWidth}
                isOpen={isFront && openId === letter.id}
                onOpenChange={(open) => setOpenId(open ? letter.id : null)}
                interactive={false}
              />
            </motion.div>
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
