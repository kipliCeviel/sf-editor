# SF Editor 🎮

Aplikasi Save Game Editor interaktif untuk game seri **Yakuza Rogue** (`.es3`) dan game **RPG Maker MV/MZ** (`.rpgsave`):
1. **Yakuza Rogue: Self Defense Dojo** (Yakuza Rogue 1 / Dojo NTR) - `.es3`
2. **Yakuza Rogue: Yokohama massage parlor chapter** (Yakuza Rogue 2 / Yokohama Massage Parlor) - `.es3`
3. **The Daily Life in My Countryside** - `.rpgsave`
4. **A Simple Life with My Unobtrusive Sister** - `.rpgsave`

Aplikasi ini mendukung dekripsi, dekompresi, pengeditan GUI, penyuntingan raw JSON, serta enkripsi/kompresi kembali file save game secara offline dan aman.

---

## ⚡ Fitur Utama

- **GUI Interface & Premium Sunset Theme:** Desain antarmuka modern dengan visual neon jingga-biru, efek glassmorphism transparan yang elegan, dan layout responsif yang dioptimalkan untuk kenyamanan mata (mendukung Day/Night Mode).
- **Auto-Detect Format & Game:** Tidak perlu memilih format di awal. Cukup unggah/drag-and-drop file save `.es3` atau `.rpgsave`, sistem akan secara otomatis mendeteksi format file serta mengenali game asal file save tersebut secara cerdas.
- **Dekripsi Otomatis & Seamless:** Enkripsi `.es3` (Yakuza Rogue) akan didekripsi secara otomatis menggunakan password default (`wanzg!1f**k`) saat diunggah. Jika menggunakan password kustom, panel input manual akan ditampilkan sebagai fallback.
- **LZ-String Decompression:** File `.rpgsave` (RPG Maker) akan didekompresi secara instan client-side menggunakan pustaka LZ-String tersemat.
- **Penyuntingan Komplet Terarah:**
  * **Self Defense Dojo:** Edit Uang (Coin), Koin Mancing (Fish Coin), Energi (Energy), Jam Aktif (Hour), Hari, Level Statistik (Sex, Power, Skill, Work), total sukses/gagal misi 401, EXP, dan status selesai game (Is Clear).
  * **Yokohama Massage Parlor:** Edit Uang Toko (Parlor Coin), Uang Saku Kouta (My Coin), Hari, Fase Waktu, Poin Riset (Develop Points), Kesulitan, dan kegagalan misi/tugas.
  * **RPG Maker Games (Countryside & Sister):**
    * **Gold & Level Editor:** Sunting jumlah emas (Gold) party dan level karakter utama (Actor #1).
    * **Inventory (Item Editor):** Tambah, ubah jumlah, atau hapus item biasa, senjata (weapon), dan pelindung (armor) dari tas secara interaktif.
    * **Variables Editor:** Cari, filter, dan ubah nilai variabel game apa pun berdasarkan ID variabel secara langsung.
    * **Switches Editor:** Cari, aktifkan (ON), atau matikan (OFF) switch game berdasarkan ID switch untuk membuka kunci event/galeri.
- **Raw JSON Editor:** Menyediakan text editor terintegrasi untuk melihat dan menyunting struktur data JSON mentah secara langsung jika ingin memodifikasi data tingkat lanjut.
- **100% Offline & Aman:** Pemrosesan enkripsi dan dekripsi sepenuhnya berjalan secara lokal pada browser pengguna menggunakan Web Cryptography API, tanpa mengirim data save game Anda ke server luar.
- **Instagram Request Game & Custom Author Profile:** Integrasi tombol banner untuk mengajukan permintaan game baru langsung ke Instagram penulis dan profil pembuat tersemat.

---

## 🎯 Lokasi Save Game Default (Windows)

* **Yakuza Rogue 1: Self Defense Dojo**
  `D:\SteamLibrary\steamapps\common\Self Defense Dojo\Dojo NTR_Data\game_data\user_data0.es3`
  *(atau slot lain: `user_data1.es3`)*

* **Yakuza Rogue 2: Yokohama Massage Parlor**
  `D:\SteamLibrary\steamapps\common\Massage Parlor\MassageShop_Data\game_data\user_data0.es3`
  *(atau folder `%LOCALAPPDATA%Low\Yakuza Rogue_ Yokohama massage parlor chapter\SaveGames\user_data1.es3`)*

* **RPG Maker Games (Countryside / Sister)**
  `[Folder Game]/www/save/file1.rpgsave`
  *(atau `[Folder Game]/save/file1.rpgsave` jika diletakkan langsung di root folder game)*

---

## 🔑 Password Enkripsi ES3 Game
Password dekripsi bawaan game Yakuza Rogue: **`wanzg!1f**k`** *(ditulis persis dengan dua tanda bintang)*.

---

*Dibuat dengan cinta oleh Vann sepulang kerja.*
