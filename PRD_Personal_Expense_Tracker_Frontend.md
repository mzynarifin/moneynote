# PRD — Personal Expense Tracker Frontend

## 1. Ringkasan Produk

**Nama sementara:** DompetKu  
**Jenis aplikasi:** Personal Finance / Expense Tracker  
**Platform:** Web  
**Tahap:** Frontend Only  
**Framework utama:** Next.js + TypeScript + Tailwind CSS

DompetKu adalah aplikasi pencatatan keuangan pribadi yang membantu user mencatat jumlah uang yang dimiliki, menambahkan uang masuk, mencatat pengeluaran, melihat saldo saat ini, serta memantau pola pengeluaran melalui grafik mingguan.

Pada tahap ini, aplikasi hanya berfokus pada sisi frontend. Semua data menggunakan mock data atau local state terlebih dahulu. Integrasi Supabase, autentikasi asli, database, API, dan backend dilakukan pada tahap berikutnya.

---

# 2. Tujuan Produk

Tujuan utama aplikasi:

1. Membantu user mengetahui jumlah saldo saat ini.
2. Memudahkan user mencatat uang masuk.
3. Memudahkan user mencatat pengeluaran.
4. Mengurangi saldo secara otomatis berdasarkan pengeluaran.
5. Menampilkan riwayat transaksi secara jelas.
6. Menampilkan grafik pengeluaran setiap minggu berdasarkan tanggal.
7. Memberikan pengalaman penggunaan yang sederhana, modern, cepat, dan tidak membingungkan.

---

# 3. Prinsip Utama Produk

Aplikasi harus terasa:

- Minimalis
- Modern
- Profesional
- Cepat dipahami
- Tidak terlalu banyak dekorasi
- Tidak terasa seperti template AI generik
- Fokus pada data dan fungsi utama
- Nyaman digunakan di desktop maupun mobile

Gunakan visual direction bernuansa **hijau dan putih** dengan dukungan warna netral agar tidak monoton.

---

# 4. Scope Frontend

## Termasuk

Frontend harus mencakup:

- Login page
- Register page
- Dashboard
- Initial balance onboarding
- Tambah uang masuk
- Tambah pengeluaran
- Edit transaksi
- Hapus transaksi
- Daftar seluruh transaksi
- Filter transaksi
- Search transaksi
- Weekly expense chart
- Navigasi minggu sebelumnya dan berikutnya
- Empty state
- Loading skeleton
- Form validation frontend
- Toast notification
- Responsive layout
- Accessibility dasar
- Mock authentication state
- Mock transaction data
- Local state / temporary frontend state

## Tidak Termasuk

Tahap ini belum mencakup:

- Supabase
- PostgreSQL
- Backend API
- Database asli
- Supabase Auth
- RLS
- User session permanen
- Cloud deployment
- Email verification
- Forgot password backend
- Multi-user data
- Server-side persistence

---

# 5. Target User

Target utama adalah user individu yang ingin mencatat keuangan pribadi secara sederhana.

Karakteristik user:

- Tidak membutuhkan fitur akuntansi kompleks
- Ingin mengetahui uang masuk dan uang keluar
- Ingin melihat saldo tersisa
- Ingin mengetahui pengeluaran minggu ini
- Ingin melihat riwayat transaksi dengan cepat
- Ingin aplikasi yang sederhana dan tidak penuh fitur yang tidak diperlukan

---

# 6. User Flow Utama

## Flow User Baru

1. User membuka aplikasi.
2. User masuk ke halaman login.
3. User melakukan login menggunakan mock authentication.
4. Jika user belum mempunyai transaksi:
   - diarahkan ke initial balance onboarding.
5. User memasukkan jumlah uang awal.
6. User memilih tanggal.
7. User menyimpan saldo awal.
8. Sistem membuat transaksi `income`.
9. User diarahkan ke dashboard.
10. Dashboard menampilkan saldo awal sebagai saldo saat ini.

## Flow Tambah Uang

1. User berada di dashboard.
2. User klik tombol `Tambah Uang`.
3. Form modal terbuka.
4. User mengisi jumlah uang.
5. User memilih tanggal uang masuk.
6. User dapat menambahkan keterangan.
7. User klik `Simpan`.
8. Data ditambahkan ke frontend state.
9. Saldo diperbarui.
10. Total uang masuk diperbarui.
11. Riwayat transaksi diperbarui.
12. Toast sukses muncul.

## Flow Catat Pengeluaran

1. User berada di dashboard.
2. User klik `Catat Pengeluaran`.
3. Form modal terbuka.
4. User mengisi:
   - nama pengeluaran
   - jumlah pengeluaran
   - tanggal pengeluaran
5. User klik `Simpan Pengeluaran`.
6. Sistem melakukan validasi.
7. Jika saldo cukup:
   - transaksi disimpan
   - saldo dikurangi
   - chart diperbarui
   - riwayat diperbarui
8. Jika saldo tidak cukup:
   - tampilkan error
   - transaksi tidak disimpan.

---

# 7. Informasi yang Ditampilkan

Dashboard harus menampilkan empat informasi utama:

## Saldo Saat Ini

Formula frontend:

```text
total income - total expense
```

Contoh:

```text
Rp2.450.000
```

## Total Uang Masuk

Jumlah seluruh transaksi dengan type:

```text
income
```

## Total Pengeluaran

Jumlah seluruh transaksi dengan type:

```text
expense
```

## Pengeluaran Minggu Ini

Jumlah seluruh transaksi expense pada rentang minggu aktif.

---

# 8. Model Data Frontend

Gunakan interface TypeScript:

```ts
type TransactionType = "income" | "expense";

interface Transaction {
    id: string;
    type: TransactionType;
    name: string;
    amount: number;
    transactionDate: string;
    createdAt: string;
}
```

Contoh mock data:

```ts
const transactions: Transaction[] = [
    {
        id: "trx-001",
        type: "income",
        name: "Saldo Awal",
        amount: 1000000,
        transactionDate: "2026-09-15",
        createdAt: "2026-09-15T08:00:00"
    },
    {
        id: "trx-002",
        type: "expense",
        name: "Makan Siang",
        amount: 35000,
        transactionDate: "2026-09-16",
        createdAt: "2026-09-16T12:30:00"
    }
];
```

---

# 9. Struktur Route

Gunakan Next.js App Router.

```text
/
├── login
├── register
├── dashboard
└── transactions
```

Route:

```text
/login
/register
/dashboard
/transactions
```

Optional:

```text
/
```

dapat langsung redirect ke:

```text
/dashboard
```

jika mock authentication aktif.

---

# 10. Halaman Login

## Tujuan

Memberikan interface login sederhana sebelum user masuk ke aplikasi.

## Konten

- Logo / nama aplikasi
- Judul:
  - `Masuk ke akun`
- Deskripsi singkat
- Input email
- Input password
- Button `Masuk`
- Link ke register

## Validasi

Email:

- wajib diisi
- format email valid

Password:

- wajib diisi
- minimal 6 karakter untuk frontend demo

## UX

Jangan membuat halaman login terlalu dekoratif.

Hindari:

- ilustrasi besar
- gradient besar
- testimonial palsu
- fake statistics
- glassmorphism

Gunakan layout centered dengan card sederhana.

---

# 11. Halaman Register

## Input

- Nama
- Email
- Password
- Konfirmasi Password

## Button

```text
Buat Akun
```

## Validasi

Nama:

- wajib diisi

Email:

- wajib
- valid

Password:

- minimal 6 karakter

Confirm password:

- harus sama dengan password

Pada tahap frontend, proses register cukup menggunakan mock flow.

---

# 12. Initial Balance Onboarding

Halaman atau state khusus ketika user belum mempunyai transaksi.

## Heading

```text
Mulai catat keuanganmu
```

## Description

```text
Masukkan jumlah uang yang kamu miliki saat ini.
```

## Field

### Saldo Awal

```text
Rp [................]
```

### Tanggal

Gunakan date input / date picker.

Default:

tanggal hari ini.

## Action

```text
Simpan Saldo Awal
```

Setelah submit:

```ts
{
    type: "income",
    name: "Saldo Awal"
}
```

Kemudian user diarahkan ke dashboard.

---

# 13. Dashboard

Dashboard merupakan halaman utama.

Struktur:

```text
Header
Summary
Weekly Expense Chart
Recent Transactions
```

---

# 14. Dashboard Header

## Kiri

Nama aplikasi:

```text
DompetKu
```

Subtitle:

```text
Ringkasan keuangan pribadi
```

## Kanan

Button secondary:

```text
+ Tambah Uang
```

Button primary:

```text
+ Catat Pengeluaran
```

Optional:

- Avatar
- Account dropdown
- Logout

Pada mobile, tombol dapat dipindahkan ke area bawah title atau menggunakan responsive action layout.

---

# 15. Summary Section

Tampilkan:

1. Saldo Saat Ini
2. Uang Masuk
3. Total Pengeluaran
4. Pengeluaran Minggu Ini

## Visual Hierarchy

`Saldo Saat Ini` harus memiliki bobot visual terbesar.

Contoh:

```text
Saldo Saat Ini

Rp2.450.000
```

Uang masuk:

```text
Rp3.250.000
```

Total pengeluaran:

```text
Rp800.000
```

Minggu ini:

```text
Rp325.000
```

Jangan membuat seluruh kartu memiliki emphasis yang sama.

---

# 16. Tambah Uang

Gunakan modal atau sheet.

## Field

### Jumlah Uang

```text
Rp [................]
```

Wajib.

### Tanggal Uang Masuk

Wajib.

Default tanggal hari ini.

### Keterangan

Optional.

Placeholder:

```text
Contoh: Uang tambahan
```

Jika kosong, gunakan:

```text
Uang Masuk
```

## Action

Primary:

```text
Simpan
```

Secondary:

```text
Batal
```

---

# 17. Catat Pengeluaran

Gunakan modal atau sheet.

## Field

### Nama Pengeluaran / Produk

Wajib.

Contoh:

```text
Makan Siang
```

### Jumlah Pengeluaran

Wajib.

Contoh:

```text
Rp35.000
```

### Tanggal Pengeluaran

Wajib.

Default tanggal hari ini.

## Action

```text
Simpan Pengeluaran
```

---

# 18. Validasi Pengeluaran

Pengeluaran harus memenuhi:

- nama tidak kosong
- amount > 0
- tanggal valid
- amount tidak boleh lebih besar daripada saldo

Jika saldo tidak cukup:

```text
Saldo tidak mencukupi untuk pengeluaran ini.
```

Jangan gunakan:

```js
alert()
```

Gunakan inline error atau toast.

---

# 19. Weekly Expense Chart

Gunakan:

```text
Recharts
```

Chart utama:

```text
Bar Chart
```

## Heading

```text
Pengeluaran Mingguan
```

## Subtitle

```text
Pengeluaran harian pada minggu ini
```

## Week Navigation

Contoh:

```text
<    14 – 20 September 2026    >
```

Left:

minggu sebelumnya.

Right:

minggu berikutnya.

---

# 20. Data Weekly Chart

Chart harus menggunakan `expense` saja.

Group berdasarkan:

```text
transactionDate
```

Bukan `createdAt`.

Contoh:

```text
Sen 14
Sel 15
Rab 16
Kam 17
Jum 18
Sab 19
Min 20
```

Jika transaksi:

```text
18 September
Makan = Rp30.000
Bensin = Rp50.000
```

maka:

```text
18 September = Rp80.000
```

Jika tidak ada transaksi:

```text
Rp0
```

---

# 21. Tooltip Chart

Saat hover:

```text
Jumat, 18 September 2026

Rp80.000
```

Tooltip harus:

- compact
- mudah dibaca
- tidak menggunakan desain besar
- mengikuti warna aplikasi

---

# 22. Recent Transactions

Dashboard menampilkan transaksi terbaru.

Heading:

```text
Transaksi Terbaru
```

Optional:

```text
Lihat Semua
```

Maksimal sekitar:

```text
5–8 transaksi
```

Format:

```text
Makan Siang
18 Sep 2026
-Rp35.000
```

Income:

```text
Uang Tambahan
18 Sep 2026
+Rp500.000
```

---

# 23. Transaction Type Indicator

Income:

- arrow up
- label `Uang Masuk`
- warna hijau

Expense:

- arrow down
- warna neutral-red / muted-danger

Jangan menggunakan merah terlalu agresif.

---

# 24. Halaman Riwayat Transaksi

Route:

```text
/transactions
```

Heading:

```text
Riwayat Transaksi
```

Deskripsi:

```text
Lihat seluruh uang masuk dan pengeluaranmu.
```

---

# 25. Search

Input:

```text
Cari transaksi...
```

Search berdasarkan:

- nama transaction

Search dilakukan langsung pada frontend state.

---

# 26. Filter Transaksi

Filter type:

```text
Semua
Uang Masuk
Pengeluaran
```

Optional filter tanggal:

```text
Dari Tanggal
Sampai Tanggal
```

Filter dapat digunakan bersamaan dengan search.

---

# 27. Transaction List Desktop

Desktop dapat menggunakan table.

Column:

```text
Nama
Jenis
Tanggal
Nominal
Action
```

Contoh:

```text
Makan Siang
Pengeluaran
18 Sep 2026
-Rp35.000
...
```

---

# 28. Transaction List Mobile

Jangan memaksakan table besar.

Gunakan list/card compact:

```text
Makan Siang

18 Sep 2026
Pengeluaran

-Rp35.000
```

Action berada pada menu `...`.

---

# 29. Edit Transaction

Action:

```text
Edit
```

Klik edit membuka modal.

Field:

- nama
- amount
- tanggal

Untuk income dan expense.

Setelah disimpan:

- state transaksi berubah
- saldo berubah
- summary berubah
- chart berubah
- transaction list berubah

---

# 30. Delete Transaction

Action:

```text
Hapus
```

Gunakan confirmation dialog.

Contoh:

```text
Hapus transaksi?

Transaksi ini akan dihapus dari riwayat.
```

Buttons:

```text
Batal
Hapus
```

Jangan gunakan:

```js
window.confirm()
```

---

# 31. Empty State Dashboard

Jika belum ada expense:

Heading:

```text
Belum ada pengeluaran minggu ini
```

Description:

```text
Pengeluaran yang kamu catat akan muncul di sini.
```

Action:

```text
Catat Pengeluaran
```

Tidak perlu ilustrasi AI besar.

---

# 32. Empty State Transaction Search

Jika search tidak menghasilkan data:

```text
Transaksi tidak ditemukan
```

Description:

```text
Coba gunakan kata pencarian atau filter yang berbeda.
```

---

# 33. Toast

Success:

```text
Uang berhasil ditambahkan.
```

```text
Pengeluaran berhasil dicatat.
```

```text
Transaksi berhasil diperbarui.
```

```text
Transaksi berhasil dihapus.
```

Error:

```text
Terjadi kesalahan. Silakan coba lagi.
```

---

# 34. Loading State

Gunakan skeleton.

Dashboard:

- balance skeleton
- summary skeleton
- chart skeleton
- recent transaction skeleton

Jangan menggunakan spinner besar jika skeleton lebih sesuai.

---

# 35. Design Direction

Gunakan pendekatan dari UI/UX Pro Max sebagai referensi prinsip desain:

```text
https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
```

Fokus:

- visual hierarchy
- spacing
- typography
- usability
- responsive design
- accessibility
- readable dashboard
- simple interaction

Jangan menjadikan repository tersebut sebagai alasan untuk menambahkan fitur atau dekorasi yang tidak dibutuhkan.

---

# 36. Warna

Dominan:

```text
Hijau
Putih
Neutral
```

Contoh design token:

```css
--background: #F7F9F7;
--surface: #FFFFFF;

--primary: #166534;
--primary-hover: #14532D;
--primary-soft: #DCFCE7;

--text-primary: #17201B;
--text-secondary: #667085;

--border: #E5E7EB;

--danger: #B42318;
--danger-soft: #FEE4E2;
```

Warna dapat disesuaikan selama arah visual tetap hijau-putih modern.

---

# 37. Aturan Penggunaan Warna

Jangan membuat:

- semua card hijau
- seluruh background hijau
- semua tombol hijau terang
- semua icon hijau

Gunakan hijau sebagai:

- primary action
- income indicator
- active state
- small accent

Gunakan putih / off-white sebagai surface utama.

---

# 38. Typography

Prefer:

```text
Inter
```

atau sans-serif modern sejenis.

Suggested scale:

```text
Page title: 28–32px
Section title: 18–20px
Card value: 24–30px
Body: 14–16px
Label: 13–14px
Caption: 12–13px
```

Jangan menggunakan heading seperti landing page 60px+.

---

# 39. Spacing System

Gunakan spacing konsisten:

```text
4
8
12
16
20
24
32
40
48
```

Container:

```text
max-w-7xl
```

Jangan memberikan whitespace berlebihan.

---

# 40. Border Radius

Gunakan radius moderate:

```text
rounded-lg
rounded-xl
```

Hindari:

```text
rounded-[30px]
rounded-[40px]
```

pada hampir semua elemen.

---

# 41. Shadow

Gunakan:

- sangat ringan
- hanya jika dibutuhkan

Prefer:

```text
border
```

dibanding heavy shadow.

Hindari:

- neon
- floating cards
- large blur shadow
- glowing UI

---

# 42. Buttons

Primary:

```text
Catat Pengeluaran
```

Style:

- solid green
- white text
- subtle hover
- focus ring jelas

Secondary:

```text
Tambah Uang
```

Style:

- white / soft green
- border
- green text

Danger:

```text
Hapus
```

Hanya digunakan pada confirmation dialog / destructive action.

---

# 43. Icon

Gunakan:

```text
lucide-react
```

Recommended:

- Wallet
- Plus
- ArrowUpRight
- ArrowDownRight
- CalendarDays
- Search
- Pencil
- Trash2
- MoreHorizontal
- ChevronLeft
- ChevronRight

Jangan menggunakan emoji sebagai icon UI utama.

---

# 44. Responsive Design

## Mobile

Minimum:

```text
320px
```

Layout:

- single column
- compact spacing
- buttons mudah ditekan
- chart responsive
- transaction table berubah menjadi list

## Tablet

```text
768px+
```

Gunakan 2-column summary jika cocok.

## Desktop

```text
1024px+
```

Gunakan dashboard grid yang lebih luas.

## Large Desktop

```text
1440px+
```

Gunakan max width agar konten tidak terlalu melebar.

---

# 45. Mobile Action

Pada mobile, dua CTA utama dapat tampil seperti:

```text
[ Tambah Uang ]

[ Catat Pengeluaran ]
```

atau:

```text
[ Tambah Uang ] [ Catat Pengeluaran ]
```

jika space mencukupi.

Jangan membuat tombol terlalu kecil.

---

# 46. Accessibility

Pastikan:

- semua form memiliki label
- focus state terlihat
- contrast cukup
- keyboard navigation berfungsi
- icon-only button memiliki `aria-label`
- error message jelas
- button memiliki target area yang cukup
- state tidak hanya dibedakan dengan warna

---

# 47. Micro Interaction

Gunakan transisi:

```text
150–200ms
```

Untuk:

- hover
- focus
- modal
- row state
- button state

Jangan menggunakan animasi yang berlebihan.

Respect:

```css
prefers-reduced-motion
```

---

# 48. Hindari AI Slop

Jangan gunakan:

- gradient besar
- purple / pink AI gradient
- glassmorphism
- glowing card
- excessive blur
- floating blobs
- random illustration
- fake notification
- fake chart hanya untuk dekorasi
- fake badge
- fake trend percentage
- fake achievements
- bento layout tanpa alasan
- giant hero section
- marketing copy berlebihan
- excessive rounded cards
- setiap elemen dimasukkan card
- emoji sebagai icon UI
- random progress bar
- decorative data

Semua UI harus memiliki fungsi.

---

# 49. Frontend State Management

Untuk tahap awal dapat menggunakan:

```text
React useState
```

atau:

```text
Context API
```

jika state perlu digunakan di banyak halaman.

Jika kompleksitas meningkat, dapat menggunakan Zustand.

Jangan menggunakan Redux jika belum diperlukan.

---

# 50. Suggested Frontend Store

Contoh state:

```ts
interface FinanceState {
    transactions: Transaction[];
    addTransaction: (transaction: Transaction) => void;
    updateTransaction: (transaction: Transaction) => void;
    deleteTransaction: (id: string) => void;
}
```

Derived data:

```ts
currentBalance
totalIncome
totalExpense
weeklyExpense
```

Derived value sebaiknya dihitung dari `transactions`, bukan disimpan sebagai state terpisah tanpa alasan.

---

# 51. Utility Functions

Buat utility reusable.

## Currency Formatter

```ts
formatCurrency(1250000)
```

Hasil:

```text
Rp1.250.000
```

Gunakan:

```ts
Intl.NumberFormat("id-ID")
```

## Date Formatter

```ts
formatShortDate()
```

Contoh:

```text
18 Sep 2026
```

## Long Date

```text
18 September 2026
```

## Weekly Grouping

Buat helper untuk:

- mendapatkan awal minggu
- mendapatkan akhir minggu
- generate 7 hari
- group expense berdasarkan tanggal

---

# 52. Date Rules

Gunakan format user Indonesia.

Jangan gunakan format UI:

```text
09/18/2026
```

Gunakan:

```text
18 Sep 2026
```

atau:

```text
18 September 2026
```

---

# 53. Suggested Component Structure

```text
components/
│
├── layout/
│   ├── app-header.tsx
│   └── app-shell.tsx
│
├── dashboard/
│   ├── balance-card.tsx
│   ├── summary-card.tsx
│   ├── summary-grid.tsx
│   ├── weekly-expense-chart.tsx
│   ├── week-navigation.tsx
│   └── recent-transactions.tsx
│
├── transaction/
│   ├── transaction-list.tsx
│   ├── transaction-row.tsx
│   ├── transaction-mobile-card.tsx
│   ├── transaction-filter.tsx
│   └── transaction-search.tsx
│
├── forms/
│   ├── income-form.tsx
│   ├── expense-form.tsx
│   ├── initial-balance-form.tsx
│   └── edit-transaction-form.tsx
│
├── dialogs/
│   ├── add-income-dialog.tsx
│   ├── add-expense-dialog.tsx
│   ├── edit-transaction-dialog.tsx
│   └── delete-transaction-dialog.tsx
│
└── ui/
    ├── button.tsx
    ├── input.tsx
    ├── modal.tsx
    ├── skeleton.tsx
    ├── empty-state.tsx
    └── toast.tsx
```

---

# 54. Suggested App Structure

```text
app/
│
├── layout.tsx
├── page.tsx
│
├── login/
│   └── page.tsx
│
├── register/
│   └── page.tsx
│
├── dashboard/
│   └── page.tsx
│
└── transactions/
    └── page.tsx
```

---

# 55. Mock Authentication

Tahap frontend cukup menggunakan mock state:

```ts
const user = {
    id: "user-001",
    name: "Muzayin",
    email: "user@example.com"
};
```

Login tidak perlu terhubung database.

Tetapi struktur halaman dibuat agar mudah diganti ke Supabase Auth pada tahap backend.

---

# 56. Mock Data Rules

Gunakan mock data secukupnya untuk menguji UI.

Jangan membuat:

- puluhan transaksi random
- fake notification
- fake income trend
- fake badge

Gunakan sekitar 8–15 transaksi realistis.

Contoh:

```text
Saldo Awal
Uang Tambahan
Makan Siang
Bensin
Parkir
Pulsa
Belanja
Kopi
```

---

# 57. Acceptance Criteria

Frontend dianggap selesai jika:

- Login page tersedia
- Register page tersedia
- Dashboard tersedia
- User dapat membuat initial balance
- User dapat menambahkan income
- User dapat menambahkan expense
- Saldo dihitung otomatis
- Expense mengurangi saldo
- Income menambah saldo
- Expense tidak boleh lebih dari saldo
- Weekly chart bekerja
- Week navigation bekerja
- Transaction history tersedia
- Search bekerja
- Filter type bekerja
- Edit transaction bekerja
- Delete transaction bekerja
- UI responsive
- Empty state tersedia
- Loading state tersedia
- Toast tersedia
- Tidak ada horizontal overflow pada mobile
- Format Rupiah benar
- Format tanggal Indonesia
- UI konsisten
- Tidak terlihat seperti template AI generik

---

# 58. Definition of Done

Frontend selesai jika seluruh user flow dapat disimulasikan tanpa backend:

```text
Login
→ Initial Balance
→ Dashboard
→ Tambah Income
→ Tambah Expense
→ Saldo berubah
→ Weekly Chart berubah
→ Riwayat berubah
→ Search / Filter
→ Edit
→ Delete
```

Semua fitur harus berjalan menggunakan frontend state terlebih dahulu.

---

# 59. Tahap Berikutnya

Setelah frontend selesai dan disetujui, baru lanjut ke:

```text
Supabase
Supabase Auth
Database
RLS
Persistent transactions
Server-side data fetching
Production security
Deployment
```

Jangan mulai implementasi backend sebelum frontend utama selesai dan design system sudah konsisten.

---

# 60. Instruksi Implementasi untuk AI Coding Agent

Implementasikan PRD ini secara bertahap.

Urutan:

1. Setup Next.js + TypeScript + Tailwind CSS.
2. Buat design tokens.
3. Buat App Shell.
4. Buat Login.
5. Buat Register.
6. Buat initial balance onboarding.
7. Buat transaction type dan mock data.
8. Buat global frontend state.
9. Buat summary calculations.
10. Buat Dashboard.
11. Buat add income.
12. Buat add expense.
13. Buat weekly chart.
14. Buat transaction history.
15. Buat search dan filter.
16. Buat edit.
17. Buat delete confirmation.
18. Buat empty state.
19. Buat loading skeleton.
20. Review responsive design.
21. Review accessibility.
22. Review typography dan spacing.
23. Bersihkan komponen yang tidak digunakan.

Jangan membuat seluruh aplikasi dalam satu file.

Jangan menambahkan backend.

Jangan menambahkan Supabase pada tahap ini.

Jangan menambahkan fitur di luar PRD tanpa alasan yang jelas.

Prioritaskan:

```text
clarity
simplicity
data readability
responsive behavior
consistent spacing
professional typography
clean UI
```
