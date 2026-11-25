# Grammar Lab
Web latihan grammar Inggris: pre-test, belajar, post-test, lalu hasil perbandingan skor. HTML/CSS/JS murni + Firebase (Auth + Firestore). Cocok di-host di GitHub Pages.

## Coba cepat (mode demo)
Buka `index.html` (atau pakai Live Server). Data di localStorage. Admin demo: `admin@demo.id` / `admin123`.

## Sambungkan ke Firebase
1. Buat project, aktifkan Authentication (Email/Password) dan Firestore.
2. Isi `js/config.js` dengan config web app.
3. Salin isi `firestore.rules` ke Firestore > Rules, lalu Publish.
4. Daftar akun lewat web, lalu di Firestore Console buat dokumen `admins/{UID akun itu}` (isi field bebas, mis. `ok: true`). Akun itu jadi admin. UID ada di Authentication > Users.
5. Login sebagai admin, buka tab mana saja, klik "Isi data awal" untuk memasukkan isi `js/seed.js`.
6. GitHub Pages: push repo, Settings > Pages > Deploy from branch. Tambahkan domain `username.github.io` di Authentication > Settings > Authorized domains.

## Update materi dan soal
- Lewat panel admin (tab materi dan soal).
- Atau edit `js/seed.js` di GitHub, lalu klik "Isi data awal" (hanya menambah ID yang belum ada, tidak menimpa).

## Aturan alur
Pre-test sekali saja, materi terbuka setelah pre-test, post-test terbuka setelah semua materi ditandai selesai, sekali saja. Aturan sekali-kerja juga dijaga Security Rules.

## Catatan
- Kunci jawaban ikut tersimpan di dokumen soal dan bisa dibaca user yang login lewat devtools. Untuk skala 100-200 responden biasanya cukup. Kalau perlu lebih ketat, nilai di Cloud Function.
- Belum ada reset tes per responden dan uji statistik. Ekspor CSV di tab responden untuk dianalisis.
