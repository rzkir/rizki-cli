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

| Template              | Keterangan                    |
| --------------------- | ----------------------------- |
| **next-js-fullstack** | Next.js + backend (fullstack) |
| **next-js-frontend**  | Next.js frontend saja         |
| **vue-dynamic-page**  | Vue, halaman dinamis          |
| **vue-landing-page**  | Vue, landing page             |

---

## 📁 Setelah project dibuat

```bash
cd nama-project
npm run dev
```

Project siap dikembangkan.

---

**Lisensi:** ISC
# rizki-cli
