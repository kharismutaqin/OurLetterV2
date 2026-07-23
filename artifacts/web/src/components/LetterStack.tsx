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

  const rotate = (dir: -1 | 1) => {
    // Close any open letter before restacking so the animation stays clean.
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

  const handleSwipe = (info: PanInfo) => {
    const dx = info.offset.x;
    const dy = info.offset.y;
    const vx = info.velocity.x;
    const vy = info.velocity.y;
    const threshold = 40;
    const vThreshold = 300;

    const horizontal = Math.abs(dx) > Math.abs(dy);

    if (horizontal) {
      if (dx < -threshold || vx < -vThreshold) {
        // Swipe left → bring the next letter forward.
        rotate(1);
      } else if (dx > threshold || vx > vThreshold) {
        // Swipe right → bring the previous letter forward.
        rotate(-1);
      }
    } else {
      if (dy < -threshold || vy < -vThreshold) {
        // Swipe up → open the front letter.
        setOpenId(frontId);
      } else if (dy > threshold || vy > vThreshold) {
        // Swipe down → close the open letter.
        setOpenId(null);
      }
    }
  };

  return (
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
      onPanEnd={(_, info) => handleSwipe(info)}
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
  );
}
