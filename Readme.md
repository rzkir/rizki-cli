# Rizki CLI

> Buat project baru dari template — satu perintah, siap dipakai.

---

## 📖 Cara pakai — Buat project baru

```bash
rizki create <nama-project>
```

**Contoh:**

```bash
rizki create toko-online
```

**Yang terjadi:**

1. Muncul pilihan template (pakai panah + Enter).
2. Folder project dibuat di direktori saat ini.
3. `npm install` jalan otomatis.
4. `git init` jalan otomatis.

> ⚠️ Kalau nama folder sudah dipakai, CLI akan berhenti dan tampil error.

---

## 📦 Template

| Langkah 1 (Kategori)  | Langkah 2 (Varian)     | Folder template                        |
| --------------------- | ---------------------- | -------------------------------------- |
| **next-js-fullstack** | MongoDB / Firebase     | `next-js-fullstack-with-*`             |
| **next-js-frontend**  | -                      | `next-js-frontend`                     |
| **vue**               | Landing / Dynamic Page | `vue-landing-page`, `vue-dynamic-page` |
| **php native**        | PHP Native Landing     | `php-native-landing`                   |

---

## 📁 Setelah project dibuat

```bash
cd nama-project
npm run dev
```

Project siap dikembangkan.

---

**Lisensi:** ISC
