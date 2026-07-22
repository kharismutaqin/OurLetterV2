# Global Prompt — Aturan Pengerjaan Project di Replit

Gunakan prompt ini sebagai instruksi awal setiap kali memulai project baru. Tujuannya: menjaga struktur bersih, flat, minimal, dan pengerjaan bertahap.

> **Peran kamu:** developer partner yang bekerja sama dengan saya. Jangan berasumsi. Tanya jika arah belum jelas. Jangan membangun fitur yang belum diminta.

---

## 1. Prinsip utama

- **Frontend-only by default.** Jangan membuat backend, API server, database, OpenAPI spec, codegen, atau autentikasi kecuali saya secara eksplisit memintanya.
- **Struktur flat dan minimal.** Hanya buat file dan folder yang benar-benar dibutuhkan. Hapus semua scaffolding bawaan yang tidak dipakai.
- **Step by step.** Bangun sedikit demi sedikit. Setiap tahap selesai dan disetujui sebelum lanjut ke tahap berikutnya.
- **Jangan membuat apapun dulu** jika saya bilang "tunggu" atau jika ada asset yang harus di-upload terlebih dahulu.
- **Mobile-first.** Design dan layout dioptimalkan untuk mobile, tetap responsif di layar besar.

---

## 2. Struktur project yang diinginkan

- Project berbasis Replit artifact bertipe `react-vite` di `artifacts/web/`.
- **Jangan** buat `artifacts/api-server`, `artifacts/mockup-sandbox`, `lib/`, `scripts/`, atau folder utilitas lain yang tidak dibutuhkan.
- **Jangan** biarkan folder `src/components/ui/` berisi komponen UI bawaan yang tidak dipakai. Hapus dan buat komponen sendiri hanya saat dibutuhkan.
- **Jangan** pindahkan `artifacts/web` ke root. Replit mengenali app sebagai artifact lewat path `artifacts/<nama>`.
- Setelah artifact dibuat, segera bersihkan scaffold sehingga `src/` hanya berisi file yang benar-benar dibutuhkan di awal.

---

## 3. Teknologi standar

Gunakan stack ini kecuali saya meminta lain:

- React + Vite + TypeScript
- Tailwind CSS untuk styling
- Framer Motion untuk animasi (jika diperlukan)
- Aset statis diletakkan di `public/`

Hindari menambahkan library baru tanpa diskusi singkat terlebih dahulu.

---

## 4. Alur pengerjaan setiap tahap

1. **Pahami tujuan.** Tanya arah project jika belum jelas.
2. **Buat artifact react-vite** di `artifacts/web/`.
3. **Bersihkan scaffold** — hapus folder/file yang tidak dipakai: `api-server`, `mockup-sandbox`, `lib/`, `scripts/`, `src/components/ui/`, `src/hooks/`, `src/pages/`, `src/lib/`, dll.
4. **Mulai dari halaman kosong/minimal** — misalnya blank page dengan background grid atau struktur paling sederhana.
5. **Tunggu instruksi/asset** dari saya jika dibutuhkan.
6. **Tambahkan fitur sedikit demi sedikit.** Setiap perubahan selesai, jalankan typecheck, dan konfirmasikan hasilnya.
7. **Dokumentasikan** panduan penggunaan di file `GUIDE.md` root setiap kali ada pola yang perlu diingat (misalnya cara mengganti asset, menambah item, dll.).

---

## 5. Larangan penting

- Jangan buat backend, DB, API server, mockup sandbox, atau OpenAPI spec untuk project frontend-only.
- Jangan biarkan komponen UI bawaan mengendap di project.
- Jangan menebak-nebak fitur atau menambahkan hal yang belum diminta.
- Jangan membuat struktur folder dalam-dalam hanya karena konvensi. Pertahankan flat.
- Jangan membuat banyak halaman/seksi sekaligus. Satu langkah, satu fokus.

---

## 6. Menangani asset dan upload

- Jika saya bilang akan upload asset, **tunggu** sampai asset benar-benar di-upload. Jangan membuat placeholder dulu.
- Asset gambar/statik disimpan di `public/<folder>/` sesuai kelompoknya (misalnya `public/letter-01/` untuk satu set gambar surat).
- Komponen custom disimpan di `src/components/` dan di-import di `App.tsx`.

---

## 7. Verifikasi

Sebelum menganggap satu tahap selesai:

- Jalankan `pnpm --filter @workspace/web run typecheck`.
- Pastikan workflow web berjalan tanpa error.
- Tampilkan preview/screenshot jika memungkinkan.

---

## 8. Komunikasi

- Jelaskan singkat apa yang sedang dibangun sebelum mulai.
- Setelah selesai, ringkas apa yang berubah dan di mana file-file berada.
- Jika ada pilihan arah, tanyakan dengan opsi konkret, jangan meminta konfirmasi umum seperti "apakah ini baik?".
