# Next.js Fullstack Template

Template **Next.js App Router** untuk mulai cepat: UI modern (Tailwind v4 + shadcn/ui), dark mode, auth context, MongoDB (Mongoose + MongoClient), dan integrasi ImageKit.

<p>
  <a href="#-quick-start">Quick Start</a> ·
  <a href="#-tech-stack">Tech Stack</a> ·
  <a href="#-environment">Environment</a> ·
  <a href="#-struktur-folder">Struktur</a>
</p>

---

## ⚡ Quick Start

```bash
npm install
```

Buat file `.env.local` (lihat bagian **Environment**), lalu jalankan:

```bash
npm run dev
```

Buka `http://localhost:3000`.

---

## ✨ Fitur

- **App Router** (`app/`) + TypeScript alias `@/*`
- **UI kit**: shadcn/ui + Radix + `lucide-react`
- **Dark mode**: `next-themes`
- **Data fetching**: `@tanstack/react-query`
- **MongoDB**: koneksi (`lib/mongodb.ts`) + model Mongoose (`models/Account.ts`)
- **ImageKit**: instance helper (`lib/imgkit.ts`)
- **Auth context**: `context/AuthContext.tsx` (sign-in / sign-up / OTP / reset password)

> **Catatan penting**: Endpoint yang dipakai auth context sudah disiapkan di `lib/config.ts`, tapi di template ini belum terlihat route API (`app/api/*`). Kamu perlu implement API routes sesuai endpoint yang kamu gunakan.

---

## 🧱 Tech Stack

| Area      | Tools                                                                 |
| --------- | --------------------------------------------------------------------- |
| Framework | Next.js 16 (App Router), React 19                                     |
| Styling   | Tailwind CSS v4, `tailwind-merge`, `clsx`, `class-variance-authority` |
| UI        | shadcn/ui, Radix, lucide-react                                        |
| Data      | @tanstack/react-query                                                 |
| DB        | MongoDB + Mongoose                                                    |
| Media     | ImageKit                                                              |
| DX        | TypeScript, ESLint (Next)                                             |

---

## 🧾 Scripts

```bash
npm run dev     # next dev
npm run build   # next build
npm run start   # next start
npm run lint    # eslint
```

---

## 🔐 Environment

Template sudah menyediakan contoh `.env.local`.

| Key                               | Contoh                        | Dipakai untuk                                                        |
| --------------------------------- | ----------------------------- | -------------------------------------------------------------------- |
| `NEXT_PUBLIC_BASE_URL`            | `http://localhost:3000`       | Base URL untuk menyusun endpoint di `lib/config.ts`                  |
| `NEXT_PUBLIC_API_SECRET`          | `<your_secret_key>`           | Header `Authorization` dari client (lihat `context/AuthContext.tsx`) |
| `NEXT_PUBLIC_MONGO_DB_SERVER`     | `<your_mongodb_server>`       | MongoDB connection string (lihat `lib/mongodb.ts`)                   |
| `NEXT_PUBLIC_CLUSTER_ACCOUNTS`    | `<your_mongodb_cluster_name>` | Nama collection untuk `Account`                                      |
| `IMGKIT_PUBLIC_KEY`               | _(kosong)_                    | ImageKit public key                                                  |
| `IMGKIT_PRIVATE_KEY`              | _(kosong)_                    | ImageKit private key                                                 |
| `NEXT_PUBLIC_IMGKIT_URL_ENDPOINT` | _(kosong)_                    | ImageKit URL endpoint                                                |
| `NODE_ENV`                        | `development`                 | Environment Node                                                     |

> ⚠️ Untuk produksi, idealnya secrets **tidak** memakai prefix `NEXT_PUBLIC_` (agar tidak terekspos ke client). Saat ini sebagian key masih `NEXT_PUBLIC_` karena cara pemakaian di kode template.

---

## 📦 Packages yang ter-install

Sumber: `package.json`

<details>
<summary><strong>Dependencies</strong></summary>

| Package                                              |                Versi |
| ---------------------------------------------------- | -------------------: |
| `next`                                               |             `16.1.6` |
| `react`, `react-dom`                                 |             `19.2.3` |
| `@tanstack/react-query`                              |           `^5.90.21` |
| `firebase`                                           |           `^12.10.0` |
| `imagekit`                                           |             `^6.0.0` |
| `next-themes`                                        |             `^0.4.6` |
| `nodemailer`                                         |             `^8.0.1` |
| `lucide-react`                                       |           `^0.576.0` |
| `sonner`                                             |             `^2.0.7` |
| `clsx`, `tailwind-merge`, `class-variance-authority` | `^2.1.1`, `^3.5.0`, `^0.7.1` |
| `radix-ui`                                           |             `^1.4.3` |

</details>

<details>
<summary><strong>Dev dependencies</strong></summary>

| Package                    |      Versi |
| -------------------------- | ---------: |
| `typescript`               |       `^5` |
| `eslint`, `eslint-config-next` | `^9`, `16.1.6` |
| `tailwindcss`, `@tailwindcss/postcss` |       `^4` |
| `shadcn`                   |   `^3.8.5` |
| `tw-animate-css`           |   `^1.4.0` |
| `@types/node`              |      `^20` |
| `@types/nodemailer`        |  `^7.0.11` |
| `@types/react`             |      `^19` |
| `@types/react-dom`         |      `^19` |

</details>

---

## 🗂 Struktur folder

<details>
<summary><strong>Lihat struktur (tanpa node_modules)</strong></summary>

```text
.env.local
.gitignore
app/
  dashboard/page.tsx
  layout.tsx
  page.tsx
  signin/page.tsx
  signup/page.tsx
components/
  app-sidebar.tsx
  login-form.tsx
  signup-form.tsx
  ui/...
context/
  AuthContext.tsx
helper/
  fonts/Fonts.ts
  footer/Footer.tsx
  header/Header.tsx
  meta/Metadata.ts
  routing/Provider.tsx
  style/globals.css
hooks/
  use-mobile.ts
lib/
  config.ts
  imgkit.ts
  mongodb.ts
  utils.ts
models/
  Account.ts
public/
  (asset svg)
services/            # placeholder (kosong)
types/
  auth.d.ts
```

</details>

---

## 🧭 Dashboard layout & sidebar

Untuk halaman dashboard, template ini memakai pola layout shell:

- **`app/dashboard/layout.tsx`**: membungkus seluruh dashboard dengan:
  - `SidebarProvider` dan `AppSidebar`
  - `SidebarInset` sebagai kontainer utama
  - header dashboard (breadcrumb, `SidebarTrigger`, dll)
- **`app/dashboard/page.tsx`**: hanya berisi konten utama (grid/panel, dsb) tanpa sidebar dan header lagi.

Dengan pola ini, jika kamu menambah route baru di bawah `app/dashboard/*`, cukup fokus ke kontennya saja; layout, sidebar, dan header sudah otomatis disediakan oleh `layout.tsx`.

---

## 🔎 Titik penting

- **DB connection**: `lib/mongodb.ts`
- **Account model**: `models/Account.ts` (hash password pakai `bcryptjs`)
- **Endpoint config**: `lib/config.ts`
- **Global providers**: `app/layout.tsx` → `helper/routing/Provider.tsx`
- **Auth state**: `context/AuthContext.tsx`

---

## 🛡️ Proxy / Route Guard (opsional)

Di template ini ada file **`proxy.ts`** yang berisi logic redirect berdasarkan cookie `token` + role, dan sudah mengekspor `config.matcher`.
