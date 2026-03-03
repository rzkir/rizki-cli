## PHP Native Landing Template

Template **PHP native** untuk landing page + dashboard admin ringan. Cocok untuk demo cepat, latihan PHP procedural, atau proyek kecil tanpa framework.

<p>
  <a href="#-quick-start">Quick Start</a> ·
  <a href="#-fitur">Fitur</a> ·
  <a href="#-environment--database">Environment & Database</a> ·
  <a href="#-struktur-folder">Struktur</a>
</p>

---

## ⚡ Quick Start

1. **Clone / copy** folder template ini ke web root server lokal kamu, misalnya ke `htdocs/php-native-landing` (XAMPP) atau `www/php-native-landing` (Laragon/WAMP).
2. Import database (jika ingin mode terhubung DB):
   - Buka `phpMyAdmin`.
   - Buat database baru, misalnya `php_native_landing`.
   - Import file SQL yang kamu siapkan sendiri (struktur tabel `accounts`, `logs`, dan konten landing) atau sesuaikan dengan kebutuhanmu.
3. Sesuaikan konfigurasi database di `config/db.php` (host, user, password, nama database).
4. Buka di browser:
   - `http://localhost/php-native-landing` → halaman landing (public)
   - `http://localhost/php-native-landing/login.php` → halaman login admin

> Jika kamu hanya ingin **demo tampilan** tanpa database, kamu bisa mengisi dummy data di beberapa file (misalnya di dashboard) seperti yang sudah dicontohkan di `dashboard/index.php`.

---

## ✨ Fitur

- **Landing page**:
  - Halaman utama (`index.php`) untuk tampilan publik.
  - Konten bisa dihubungkan dengan database (Home, Mission, Services, dll.) atau statis.
- **Auth sederhana**:
  - Halaman `login.php` dan `register.php` untuk akun admin / user.
  - Session-based auth (`$_SESSION['user']`) untuk proteksi halaman dashboard.
- **Dashboard admin**:
  - Layout dashboard modern (header, sidebar, konten utama) menggunakan Tailwind CDN / utility-class style.
  - Halaman overview `dashboard/index.php` dengan section **Recent Activity** (bisa pakai data dari DB atau dummy).
- **Logging aktivitas** (opsional):
  - Struktur tabel `logs` dapat dipakai untuk mencatat aktivitas (login, create/update/delete konten, dsb.).
  - Di template demo, mapping action→modul dan label aksi sudah disiapkan di `dashboard/index.php`.
- **Struktur modular**:
  - Komponen header, footer, dan sidebar dipisah di file sendiri untuk memudahkan reuse.

---

## 🧱 Tech Stack

- **Backend**: PHP native (procedural, tanpa framework).
- **Frontend**:
  - HTML5 + meta tags SEO basic (description, keywords, author, robots).
  - Open Graph & Twitter Card meta untuk sharing sosial (`og:type`, `og:url`, `og:title`, `og:description`, `og:image`, dll.).
- **Styling**:
  - Tailwind CSS via CDN (`https://cdn.tailwindcss.com`) di `index.php` dan file dashboard.
  - Custom CSS tambahan di `style/globals.css`.
- **Ikon & animasi**:
  - Boxicons (`boxicons.min.css`) untuk ikon.
  - AOS (Animate On Scroll) via CDN untuk animasi scroll.
- **JavaScript**:
  - `js/breadchumb.js` untuk structured data / breadcrumb script.
  - `js/main.js` untuk interaksi UI tambahan di landing.

---

## 🔐 Environment & Database

Konfigurasi dasar tersimpan di `config/db.php`.

Contoh isi (sesuaikan dengan environment kamu):

```php
<?php
$dbHost = '127.0.0.1';
$dbUser = 'root';
$dbPass = '';
$dbName = 'php_native_landing';

$db = new mysqli($dbHost, $dbUser, $dbPass, $dbName);

if ($db->connect_error) {
    die('Connection failed: ' . $db->connect_error);
}
```

> Untuk keamanan production, hindari commit credential sensitif ke repository publik dan gunakan environment terpisah atau file konfigurasi di luar web root.

**Tabel yang umumnya dibutuhkan (disarankan, tapi bebas kamu modifikasi):**

- **`accounts`**: menyimpan data user/admin.
  - Kolom umum: `id`, `fullname`, `email`, `password_hash`, `role`, `created_at`, `updated_at`.
- **`logs`**: menyimpan jejak aktivitas.
  - Kolom umum: `id`, `user_id`, `action`, `description`, `created_at`.
- Tabel konten landing (opsional, sesuai modul yang kamu butuhkan): misalnya `home_sections`, `services`, `missions`, `company_kpis`, dll.

---

## 🗂 Struktur folder

Struktur ringkas (tanpa vendor / file tambahan lain):

```text
php-native-landing/
  config/
    db.php              # konfigurasi koneksi database (mysqli)
  dashboard/
    index.php           # halaman dashboard overview (Recent Activity, dsb)
    header.php          # header layout dashboard
    sidebar.php         # sidebar navigation dashboard
    footer.php          # footer layout dashboard
    process.php         # proses action tertentu di dashboard (CRUD / update konten)
  index.php             # landing page utama (public)
  login.php             # halaman login admin/user
  register.php          # halaman registrasi user baru
  logout.php            # proses logout (destroy session)
  process.php           # proses umum (misalnya handle form dari public)
  Readme.md             # dokumentasi template ini
```

> Beberapa file proses mungkin kamu sesuaikan lagi isinya (misalnya memindahkan logic validasi/form ke file lain) tergantung gaya penulisan kode kamu.

---

## 🔎 Titik penting

- **Proteksi halaman dashboard** ada di awal file `dashboard/index.php` menggunakan `session_start()` dan pengecekan `$_SESSION['user']`.
- **Komponen layout dashboard** dipisah ke `header.php`, `sidebar.php`, dan `footer.php` untuk memudahkan maintenance.
- **Recent Activity (log)**:
  - Bisa diisi dari database (`SELECT` dari tabel `logs` + join `accounts`).
  - Atau bisa menggunakan **dummy array** seperti contoh saat kamu tidak ingin bergantung pada DB.
- **Konfigurasi database** hanya di satu tempat (`config/db.php`) sehingga mudah diganti/di-nonaktifkan.

---

## 💡 Tips Pengembangan

- Jika ingin menambah modul baru (misalnya "Partnership" atau "Ship Types"):
  - Tambah tabel baru di database (jika perlu).
  - Tambah file PHP baru di `dashboard/` untuk halaman CRUD-nya.
  - Tambah link menu di `dashboard/sidebar.php`.
  - (Opsional) Tambah mapping di fungsi log di `dashboard/index.php` agar aktivitas modul baru muncul rapi di Recent Activity.
- Untuk testing cepat tanpa database, kamu bisa:
  - Comment `require_once 'config/db.php';` di file tertentu.
  - Ganti query ke array dummy seperti di contoh `dashboard/index.php`.

---

Selamat menggunakan **PHP Native Landing Template** ini. Silakan modifikasi struktur, gaya penulisan, dan fitur sesuai kebutuhan proyekmu. 💻