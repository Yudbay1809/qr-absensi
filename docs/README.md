# Dokumentasi Gwen Absensi

Dokumentasi ini menjelaskan cara instalasi, arsitektur, dan API utama untuk Gwen Absensi.

## Daftar Isi

1. Instalasi & Setup
2. Arsitektur Sistem
3. Struktur Folder
4. API Reference
5. Troubleshooting

## 1. Instalasi & Setup

### Prasyarat

- Node.js 20+ (disarankan LTS)
- NPM

### Langkah Instalasi

1. Install dependency:

```bash
npm install
```

2. Salin environment:

```bash
copy .env.example .env
```

3. Atur database (SQLite lokal):

```bash
npm run db:init
```

4. Seed data demo:

```bash
npm run seed
```

5. Jalankan aplikasi:

```bash
npm run dev
```

### Akun Demo

- Admin: `admin` / `admin123`
- Karyawan: `karyawan` / `karyawan123`

### Environment Variables

Wajib:
- `AUTH_SECRET` - secret JWT session
- `DATABASE_URL` - string koneksi DB

Contoh untuk SQLite lokal:

```
DATABASE_URL="file:D:/absensi-qrcode/prisma/dev.db"
AUTH_SECRET="ganti-dengan-random-string"
```

## 2. Arsitektur Sistem

### Peran

- **Admin**: membuat QR sesi, mengelola karyawan, shift, pengaturan.
- **Karyawan**: scan QR, lihat riwayat absensi pribadi.

### Alur Absensi

1. Admin menampilkan QR (auto refresh sebelum jam terlambat).
2. Karyawan scan QR di halaman scan.
3. Sistem validasi token & simpan absensi.
4. Admin melihat log secara realtime (SSE).

### QR Session

- Sebelum jam masuk: QR auto refresh (rolling).
- Setelah terlambat: QR locked (statis hingga akhir hari).

## 3. Struktur Folder

```
app/
  (landing)/     Landing page
  (auth)/        Login
  (app)/
    (admin)/     Halaman admin
    (user)/      Halaman user
  api/
    (admin)/     API admin
    (user)/      API user
    (auth)/      API auth
    (public)/    API public

components/
  (shared)/      UI reusable
  admin/         Komponen admin
  user/          Komponen user
  public/        Komponen landing

lib/
  public/        Prisma + util umum
  user/          Auth + session
  admin/         Helper admin
```

## 4. API Reference

### Auth

**POST** `/api/auth/login`  
Login dengan username + password.

Body:
```json
{
  "username": "admin",
  "password": "admin123"
}
```

Response:
```json
{
  "success": true
}
```

**POST** `/api/auth/logout`  
Menghapus session cookie.

---

### QR

**GET** `/api/qr/active`  
Mengambil QR aktif saat ini (rolling/locked).

Response:
```json
{
  "session": {
    "id": 1,
    "token": "uuid",
    "url": "http://localhost:3000/scan?token=uuid",
    "expiresAt": "2026-03-29T08:00:00.000Z",
    "mode": "rolling"
  }
}
```

---

### Attendance

**POST** `/api/attendance`  
Menyimpan absensi berdasarkan token QR.

Body:
```json
{
  "token": "http://localhost:3000/scan?token=uuid"
}
```

Response:
```json
{ "success": true }
```

**GET** `/api/attendance/export`  
Export CSV dengan query `from`, `to`, `status`.

**GET** `/api/attendance/export-xlsx`  
Export Excel dengan query `from`, `to`, `status`.

---

### Admin

**GET** `/api/admin/employees`  
List karyawan.

**POST** `/api/admin/employees`  
Tambah karyawan.

**PUT** `/api/admin/employees/:id`  
Update karyawan.

**DELETE** `/api/admin/employees/:id`  
Hapus karyawan.

**GET** `/api/admin/shifts`  
List shift.

**POST** `/api/admin/shifts`  
Tambah shift.

**PUT** `/api/admin/shifts/:id`  
Update shift.

**DELETE** `/api/admin/shifts/:id`  
Hapus shift.

**GET** `/api/admin/settings`  
Ambil setting default shift.

**PUT** `/api/admin/settings`  
Update default shift.

**GET (SSE)** `/api/admin/qr-sessions/:id/stream`  
Realtime log absensi untuk QR session.

## 5. Troubleshooting

### Prisma generate error

Jika `prisma generate` gagal di Windows:
- Pastikan tidak ada proses Node yang mengunci file.
- Tutup dev server, lalu jalankan ulang.

### DB schema mismatch

Jika seed error karena kolom tidak cocok:
- Jalankan ulang `npm run db:init`
- Jalankan `npm run seed`
