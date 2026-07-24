import { useMemo, useState } from 'react';
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
  const initialOrder = useMemo(() => letters.map((l) => l.id), [letters]);
  const [order, setOrder] = useState<string[]>(initialOrder);
  const [openId, setOpenId] = useState<string | null>(null);

  const frontId = order[0];
  const frontIndex = initialOrder.indexOf(frontId);

  const rotate = (dir: -1 | 1) => {
    setOpenId(null);
    setOrder((prev) => {
      const next = [...prev];
      if (dir === 1) {
        const first = next.shift();
        if (first) next.push(first);
      } else {
        const last = next.pop();
        if (last) next.unshift(last);
      }
      return next;
    });
  };

  const handleTap = () => {
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
        rotate(1);
      } else if (dx > threshold || vx > vThreshold) {
        rotate(-1);
      }
    } else {
      if (dy < -threshold || vy < -vThreshold) {
        setOpenId(frontId);
      } else if (dy > threshold || vy > vThreshold) {
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
          height: panelH + 120,
          perspective: 1100,
          cursor: 'pointer',
          touchAction: 'none',
          userSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
        }}
        onTap={handleTap}
        onPanEnd={handleSwipe}
      >
        {letters.map((letter) => {
          const position = order.indexOf(letter.id);
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
                y: position * 42,
                z: position * -90,
                scale: 1 - position * 0.08,
                rotateX: position * -12,
                opacity: 1 - position * 0.14,
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
        {/* Prev */}
        <button
          onClick={() => rotate(-1)}
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

        {/* Dot indicator */}
        <div style={{ display: 'flex', gap: 10 }}>
          {letters.map((letter, i) => (
            <button
              key={letter.id}
              onClick={() => {
                const currentIndex = initialOrder.indexOf(frontId);
                const targetIndex = i;
                const diff = targetIndex - currentIndex;
                const n = letters.length;
                // Shortest rotation direction
                const dir =
                  ((diff + n) % n) <= n / 2 ? diff : diff - n;
                const absDir = dir > 0 ? 1 : -1;
                const steps = Math.abs(dir);
                for (let s = 0; s < steps; s++) {
                  setTimeout(() => rotate(absDir), s * 180);
                }
              }}
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                background:
                  i === frontIndex
                    ? 'rgba(255,255,255,0.9)'
                    : 'rgba(255,255,255,0.2)',
                transition: 'background 0.25s, transform 0.25s',
                transform: i === frontIndex ? 'scale(1.3)' : 'scale(1)',
              }}
              aria-label={`Go to letter ${i + 1}`}
            />
          ))}
        </div>

        {/* Next */}
        <button
          onClick={() => rotate(1)}
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
