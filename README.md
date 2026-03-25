# Gwen Absensi

Sistem absensi QR Code berbasis Next.js (App Router) dengan Prisma dan dashboard ringkas.

## Setup Lokal

1. Install dependencies:

```bash
npm install
```

2. Siapkan env:

```bash
copy .env.example .env
```

Jika memakai Windows, pastikan `DATABASE_URL` menunjuk ke path absolut, contoh:

```
DATABASE_URL="file:D:/absensi-qrcode/prisma/dev.db"
```

3. Inisialisasi database lokal (SQLite):

```bash
npm run db:init
```

4. Seed data demo:

```bash
npm run seed
```

5. Jalankan server:

```bash
npm run dev
```

## Akun Demo

- Admin: `admin@gwenabsensi.com` / `admin123`
- Karyawan: `karyawan@gwenabsensi.com` / `karyawan123`

## Fitur Utama

- Generate QR sesi absensi (admin)
- Scan QR untuk absensi (karyawan)
- Dashboard ringkas + export CSV/Excel
- Riwayat absensi dengan filter tanggal/status

## Catatan

- Default database menggunakan SQLite untuk pengembangan lokal.
- Ubah `DATABASE_URL` di `.env` jika ingin memakai PostgreSQL/MySQL.
- Jika `prisma migrate` mengalami error di mesin Anda, gunakan `npm run db:init` sebagai init SQL lokal.
