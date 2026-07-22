# Panduan Personal Letters Gallery

Web ini adalah frontend-only mobile-first letters gallery. Semua surat ditampilkan menggunakan komponen animasi `FoldedLetter` yang bisa di-tap untuk dibuka/ditutup.

## Struktur file penting

- `artifacts/web/src/App.tsx` — tempat menentukan surat apa saja yang ditampilkan.
- `artifacts/web/src/components/FoldedLetter.tsx` — komponen animasi surat. Jangan diubah kecuali kamu paham cara kerjanya.
- `artifacts/web/public/letter-01/` — folder gambar untuk satu surat.
- `artifacts/web/src/index.css` — gaya global, grid background, dan penataan halaman.

## Cara mengganti konten surat yang sudah ada

1. Siapkan 3 file PNG untuk satu surat:
   - `cover.png` — tampilan depan saat surat tertutup.
   - `top.png` — bagian dalam atas saat surat terbuka.
   - `bottom.png` — bagian dalam bawah yang selalu terlihat.
2. Upload ketiga PNG ke folder `artifacts/web/public/letter-01/`.
3. Pastikan nama file tetap sama: `cover.png`, `top.png`, `bottom.png`.
4. File lama akan tertimpa. Refresh preview untuk melihat hasil.

Tidak perlu mengubah kode apapun.

## Cara menambah surat baru

1. Buat folder baru di `artifacts/web/public/`, misalnya `letter-02/`.
2. Upload 3 PNG ke folder tersebut: `cover.png`, `top.png`, `bottom.png`.
3. Buka `artifacts/web/src/App.tsx`.
4. Tambahkan komponen `FoldedLetter` baru dengan path yang menunjuk ke folder baru.

Contoh untuk dua surat:

```tsx
import { FoldedLetter } from './components/FoldedLetter';

export default function App() {
  return (
    <div className="page">
      <div className="letter-stage">
        <FoldedLetter
          coverSrc="/letter-01/cover.png"
          topSrc="/letter-01/top.png"
          bottomSrc="/letter-01/bottom.png"
          noteWidth={320}
        />

        <FoldedLetter
          coverSrc="/letter-02/cover.png"
          topSrc="/letter-02/top.png"
          bottomSrc="/letter-02/bottom.png"
          noteWidth={320}
        />
      </div>
    </div>
  );
}
```

Setiap `<FoldedLetter />` = satu surat. Tinggal salin dan ubah nomer folder untuk menambah surat.

## Cara menjalankan web

- `pnpm --filter @workspace/web run dev` — jalankan di lokal.
- `pnpm --filter @workspace/web run typecheck` — cek kesalahan tipe kode.
- `pnpm --filter @workspace/web run build` — build untuk produksi.

## Catatan

- Ukuran gambar yang disarankan: rasio 3:2 (misalnya 600 × 400 px). Komponen akan menyesuaikan tinggi berdasarkan lebar yang diberikan (`noteWidth`).
- Jangan memindahkan folder `artifacts/web` ke root. Replit mengenali app sebagai artifact lewat path `artifacts/<nama>`.
