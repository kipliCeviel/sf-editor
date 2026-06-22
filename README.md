# Universal Save Editor 🎮

Aplikasi Save Game Editor interaktif untuk game seri **Yakuza Rogue** (.es3) buatan **WAKUWAKU** dan game **RPG Maker MV/MZ** (.rpgsave):
1. **Yakuza Rogue: Self Defense Dojo** (Yakuza Rogue 1 / Dojo NTR) - `.es3`
2. **Yakuza Rogue: Yokohama massage parlor chapter** (Yakuza Rogue 2 / Yokohama Massage Parlor) - `.es3`
3. **The Daily Life in My Countryside** - `.rpgsave`
4. **A Simple Life with My Unobtrusive Sister** - `.rpgsave`

Aplikasi ini mendukung dekripsi, dekompresi, pengeditan GUI, penyuntingan raw JSON, serta enkripsi/kompresi kembali file save game secara offline dan aman.

---

## 📁 Struktur Project

```text
D:\Projekto\YakuzaRogueSaveEditor\
├── index.html       # Antarmuka utama (Web GUI Editor)
├── server.js        # Server lokal Node.js untuk menjalankan index.html
├── package.json     # Konfigurasi npm scripts untuk menjalankan project
├── README.md        # File dokumentasi ini
└── cli\
    ├── yakuza_rogue_editor.js   # Script CLI Node.js (Interaktif & Auto Mode)
    └── yakuza_rogue_editor.py   # Script CLI Python (Cadangan)
```

---

## ⚡ Fitur Utama

- **GUI Interface & Dark Cyberpunk Aesthetics:** Desain antarmuka modern yang futuristik dengan visual neons, glassmorphism, dan responsif.
- **Auto-Detect Game:** Cukup unggah file save `.es3` atau `.rpgsave`, sistem akan secara otomatis mengenali file save tersebut berasal dari game yang mana.
- **Bypass Enkripsi & Dekompresi Otomatis:** Enkripsi `.es3` (Yakuza Rogue) didekripsi secara otomatis dengan password bawaan, dan `.rpgsave` (RPG Maker) didekompresi secara instan menggunakan LZ-String.
- **Editing Field Lengkap:**
  - **Self Defense Dojo:** Edit Uang (Coin), Koin Mancing (Fish Coin), Energi (Energy), Jam Aktif (Hour), Hari, Level Statistik (Sex, Power, Skill, Work), total sukses/gagal misi 401, EXP, dan status tamat game (Is Clear).
  - **Yokohama Massage Parlor:** Edit Uang Toko (Parlor Coin), Uang Saku Kouta (My Coin), Hari, Fase Waktu, Poin Riset (Develop Points), Kesulitan, dan kegagalan misi.
- **Raw JSON Editor:** Untuk pengeditan manual tingkat lanjut.
- **Keamanan Luring (100% Offline):** Pemrosesan menggunakan Web Cryptography API internal browser, tanpa mengirim file ke server internet mana pun.

---

## 🚀 Cara Menjalankan Aplikasi

### Opsi A: Langsung Buka File (Paling Cepat)
Cukup klik ganda (double-click) file `index.html` pada browser web kamu (Chrome, Edge, Firefox, dll).

### Opsi B: Menggunakan Local Server (Node.js)
Jika kamu ingin menjalankannya sebagai server lokal:
1. Pastikan **Node.js** sudah terinstal di komputer.
2. Buka folder `D:\Projekto\YakuzaRogueSaveEditor` di terminal / command prompt.
3. Jalankan perintah:
   ```bash
   npm start
   ```
4. Buka tautan berikut di browser kamu: **[http://localhost:3000](http://localhost:3000)**.

### Opsi C: Menggunakan Mode CLI (Command Line Interface)
Jika lebih menyukai mode terminal, kamu bisa menjalankan script CLI di folder `cli/`:
- **Mode CLI Interaktif:**
  ```bash
  npm run cli
  ```
- **Mode CLI Otomatis (Auto Patch Koin & Misi):**
  ```bash
  npm run cli:auto
  ```

---

## 🎯 Lokasi Save Game Default (Windows)

- **Yakuza Rogue 1: Self Defense Dojo**
  `D:\SteamLibrary\steamapps\common\Self Defense Dojo\Dojo NTR_Data\game_data\user_data0.es3`
  *(atau slot lain: `user_data1.es3`)*

- **Yakuza Rogue 2: Yokohama Massage Parlor**
  `D:\SteamLibrary\steamapps\common\Massage Parlor\MassageShop_Data\game_data\user_data0.es3`
  *(atau folder `%LOCALAPPDATA%Low\Yakuza Rogue_ Yokohama massage parlor chapter\SaveGames\user_data1.es3`)*

- **RPG Maker Games (Countryside / Sister)**
  `[Folder Game]/www/save/file1.rpgsave`
  *(atau `[Folder Game]/save/file1.rpgsave` jika diletakkan langsung di root folder game)*

---

## 🔑 Password Enkripsi ES3 Game
Password dekripsi bawaan game: **`wanzg!1f**k`** *(ditulis persis dengan dua tanda bintang)*.

---

*Project ini dikembangkan oleh Antigravity AI.*
