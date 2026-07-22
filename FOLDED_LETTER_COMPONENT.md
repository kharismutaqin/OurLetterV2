# Komponen FoldedLetter — Panduan Reusable

Komponen animasi surat terlipat yang bisa di-tap untuk dibuka/ditutup. Dibangun dengan React + Framer Motion. Cocok untuk personal letters gallery, greeting cards, atau portofolio interaktif.

---

## 1. Persyaratan asset

Satu surat memerlukan **3 file PNG** dengan rasio **3:2** (contoh: 600 × 400 px).

| File | Fungsi |
|------|--------|
| `cover.png` | Tampilan depan surat saat tertutup |
| `top.png` | Bagian dalam atas saat surat terbuka |
| `bottom.png` | Bagian dalam bawah yang selalu terlihat |

### Aturan penamaan & folder
- Nama file bebas, asalkan komponen menerima URL ketiga file tersebut.
- Untuk satu project, sebaiknya simpan dalam satu folder per surat, misalnya:
  ```
  public/letter-01/cover.png
  public/letter-01/top.png
  public/letter-01/bottom.png
  ```

---

## 2. Cara pakai

### Instalasi dependensi
```bash
npm install framer-motion
# atau
pnpm add framer-motion
```

### Contoh di App.tsx
```tsx
import { FoldedLetter } from './components/FoldedLetter';

export default function App() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        overflow: 'visible',
      }}
    >
      <FoldedLetter
        coverSrc="/letter-01/cover.png"
        topSrc="/letter-01/top.png"
        bottomSrc="/letter-01/bottom.png"
        noteWidth={320}
      />
    </div>
  );
}
```

### Catatan penting
- **Parent container wajib `overflow: visible`** agar panel atas saat terbuka tidak terpotong.
- `noteWidth` menentukan lebar surat. Tinggi panel = `noteWidth / 1.5` karena rasio 3:2.
- Komponen ini tidak menggunakan class Tailwind; styling-nya inline. Jadi tidak akan bentrok dengan tema UI yang sudah ada.

---

## 3. Kode komponen lengkap

Simpan sebagai `src/components/FoldedLetter.tsx`.

```tsx
import { useRef, useState } from 'react';
import { animate, motion, useMotionValue, useTransform } from 'framer-motion';

// Each asset is 600 × 400 px → 3 : 2 aspect ratio
const ASPECT = 600 / 400;

export interface FoldedLetterProps {
  /** URL of the outside/front face (visible when closed) */
  coverSrc: string;
  /** URL of the inside-top face (visible when open, upper half) */
  topSrc: string;
  /** URL of the inside-bottom face (always visible once note is open) */
  bottomSrc: string;
  /** Width of the note in pixels. Height of each panel = noteWidth / ASPECT */
  noteWidth: number;
}

/**
 * FoldedLetter — a single folded paper note with a realistic CSS 3-D open/close animation.
 *
 * Layout:
 *   • The component's own bounding box is ONE panel tall (noteWidth / ASPECT).
 *   • In the **closed** state the top panel (cover.png) has rotated –180° onto the
 *     bottom panel, so the note appears as a single-panel square/rect.
 *   • In the **open** state the top panel has rotated back to 0° and extends
 *     ABOVE the component's own bounding box. Make sure the parent container
 *     allows overflow: visible so the open panel is not clipped.
 *
 * Click/tap anywhere on the component to toggle open ↔ closed.
 */
export function FoldedLetter({
  coverSrc,
  topSrc,
  bottomSrc,
  noteWidth,
}: FoldedLetterProps) {
  const panelH = noteWidth / ASPECT;
  const [isOpen, setIsOpen] = useState(false);
  const animating = useRef(false);

  // –180 = closed (cover.png on top), 0 = open (top.png flat above bottom)
  const rotX = useMotionValue(-180);

  // Mid-fold darkness on the inside-top face — depth / shadow cue
  const topFaceShadow = useTransform(
    rotX,
    [-180, -135, -90, -45, 0],
    [0, 0.18, 0.38, 0.18, 0],
  );

  // Shadow cast by the cover resting on the bottom panel when closed
  const bottomFaceShadow = useTransform(rotX, [-180, -90, 0], [0.22, 0.08, 0]);

  // Subtle upward drift as the note lifts off the surface
  const liftY = useTransform(rotX, [-180, -90, 0], [0, -8, 0]);

  // Drop-shadow depth tracks the lift
  const dropShadowFilter = useTransform(rotX, [-180, -90, 0], [
    'drop-shadow(0 3px 8px rgba(0,0,0,0.16))',
    'drop-shadow(0 14px 28px rgba(0,0,0,0.24))',
    'drop-shadow(0 6px 16px rgba(0,0,0,0.14))',
  ]);

  // Fold-crease hairline only visible when fully open
  const creaseOpacity = useTransform(rotX, [-180, -60, 0], [0, 0, 0.45]);

  const toggle = async (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (animating.current) return;
    animating.current = true;
    const next = isOpen ? -180 : 0;
    setIsOpen(!isOpen);
    await animate(rotX, next, {
      duration: 0.92,
      ease: [0.4, 0.0, 0.2, 1.0],
    });
    animating.current = false;
  };

  return (
    <div
      onClick={toggle}
      style={{
        cursor: 'pointer',
        userSelect: 'none',
        touchAction: 'manipulation',
        WebkitTapHighlightColor: 'transparent',
        display: 'inline-block',
      }}
    >
      <motion.div
        style={{
          perspective: '1100px',
          perspectiveOrigin: '50% 50%',
          y: liftY,
          filter: dropShadowFilter,
        }}
      >
        {/* Scene root — preserve-3d; sized to ONE panel height */}
        <div
          style={{
            position: 'relative',
            width: noteWidth,
            height: panelH,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* ── Bottom panel (stationary) ─────────────────────────────── */}
          <div style={{ position: 'absolute', inset: 0 }}>
            <img
              src={bottomSrc}
              alt=""
              draggable={false}
              style={{ width: '100%', height: '100%', display: 'block', objectFit: 'fill' }}
            />
            <motion.div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.4) 100%)',
                opacity: bottomFaceShadow,
                pointerEvents: 'none',
              }}
            />
          </div>

          {/* ── Top panel (rotates around fold axis = its bottom edge) ── */}
          <motion.div
            style={{
              position: 'absolute',
              top: -panelH,
              left: 0,
              width: noteWidth,
              height: panelH,
              transformOrigin: 'bottom center',
              transformStyle: 'preserve-3d',
              rotateX: rotX,
            }}
          >
            {/* Front face — top.png (inside, visible when open) */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
            >
              <img
                src={topSrc}
                alt=""
                draggable={false}
                style={{ width: '100%', height: '100%', display: 'block', objectFit: 'fill' }}
              />
              <motion.div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0,0,0,1)',
                  opacity: topFaceShadow,
                  pointerEvents: 'none',
                }}
              />
            </div>

            {/* Back face — cover.png (outside, visible when closed) */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateX(180deg)',
              }}
            >
              <img
                src={coverSrc}
                alt=""
                draggable={false}
                style={{ width: '100%', height: '100%', display: 'block', objectFit: 'fill' }}
              />
            </div>
          </motion.div>

          {/* Fold crease — hairline at the fold axis */}
          <motion.div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 1,
              background: 'rgba(0,0,0,0.15)',
              opacity: creaseOpacity,
              pointerEvents: 'none',
              zIndex: 10,
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}
```

---

## 4. Integrasi dengan tema UI yang sudah ada

- Letakkan komponen di dalam halaman atau card yang sudah ada.
- Jangan timpa CSS tema. Komponen hanya membutuhkan `overflow: visible` di parent.
- Untuk banyak surat, tambahkan `gap` atau `padding` di parent agar tidak saling menumpuk saat terbuka.

---

## 5. Cara share ke komunitas dengan preview panel

### Opsi A: CodeSandbox (direkomendasikan)
1. Buka [codesandbox.io](https://codesandbox.io) dan buat sandbox baru: **React + Vite + TypeScript**.
2. Upload 3 PNG ke folder `public/letter-01/`.
3. Buat file `src/components/FoldedLetter.tsx` dan paste kode komponen di atas.
4. Edit `src/App.tsx` seperti contoh di bagian 2.
5. Klik **Share** → salin URL atau klik **Embed** untuk mendapatkan iframe snippet.
6. Lampirkan iframe di dokumentasi, blog, atau forum.

### Opsi B: CodePen
1. Buka [codepen.io](https://codepen.io) dan buat Pen baru.
2. Di setting Pen, pilih **JS Preprocessor: TypeScript** dan tambahkan external scripts:
   - React
   - ReactDOM
   - Framer Motion
3. Upload 3 PNG ke hosting gambar (misalnya Imgur, Cloudinary, atau CDN) dan salin URL-nya.
4. Paste kode komponen dan gunakan URL gambar tersebut di props.
5. Simpan Pen dan dapatkan link/embed untuk dibagikan.

### Opsi C: StackBlitz
1. Buka [stackblitz.com](https://stackblitz.com) dan buat project React + Vite.
2. Upload PNG dan paste komponen.
3. Share URL atau embed.

---

## 6. Tips tambahan

- Gunakan `noteWidth` responsif jika ingin menyesuaikan ukuran layar.
- Jangan lupa menambahkan `alt` text pada gambar jika dibutuhkan untuk accessibility.
- Untuk performa, pastikan PNG sudah di-compress sebelum di-upload.
