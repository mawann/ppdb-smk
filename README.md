# PPDB SMK

Aplikasi pengolah data PPDB untuk jenjang SMK menggunakan _Google Spreadshhet_ dan _Google Apps Script_.  
(C) Mawan A. Nugroho.

## Contoh Kasus

SMK Harapan Jaya membuka PPDB dengan peraturan begini:

1. Calon Murid menyetor rata-rata nilai rapor di SMP dan menentukan ingin masuk ke jurusan apa.
2. Jurusan yang dipilih maksimum adalah dua. Dengan demikian, boleh bila hanya memilih satu.
3. Calon Murid juga boleh menuliskan Prestasinya. Prestasi ini diberi nilai oleh panitia PPDB, misalkan juara tingkat kota nilainya 10, juara tingkat provinsi nilainya 20, dan seterusnya.
4. Calon Murid mengikuti Tes Khusus. Bentuk Tes Khusus ini dapat berupa Tes Berbasis Komputer, atau dapat pula hasil dari Wawancara.
5. Nilai Akhir adalah = Nilai Rata-Rata Rapor + Nilai Tes Khusus + Nilai Prestasi, di mana tiap nilai ini diberi bobot, misalkan Nilai Rata-Rata Rapor adalah 30%, nilai Tes Khusus adalah 50%, dan nilai Prestasi adalah 20%.

Bila murid yang mendaftar sedikit, menentukan siapa yang diterima dan diterima di jurusan apa, adalah mudah. Tapi akan menjadi melelahkan bila Calon Murid berjumlah ribuan orang sedangkan kursi yang tersisa hanya sedikit. Setelah selesai dilakukan perhitungan, eh tiba-tiba salah seorang Calon Murid menyusulkan sertifikat Juara Tingkat Internasional. Formasi pasti berubah. Yang tadinya diterima di pilihan ke 1 mungkin bergeser menjadi diterima di pilihan ke 2, atau malah menjadi tidak diterima bila nilainya lebih kecil. Panitia PPDB berarti harus menghitung ulang seluruh data. Capek kan?

Nah, dengan bantuan aplikasi ini, menghitung dan menghitung ulang menjadi semudah mengklik satu tombol.

## Petunjuk Instalasi

1. Jalankan [Google Spreadsheet](https://docs.google.com/spreadsheets). Ini semacam Microsoft Excel tapi dapat digunakan di peramban / web browser.
2. Buat Blank Spreadsheet.
3. Klik menu: File > Setelan. Lokasi tentukan **Amerika Serikat**. Jangan Indonesia, karena angka desimal di Indonesia adalah koma, sedangkan umumnya data angka pada file CSV memakai titik.
5. Klik menu: Ekstensi > Apps Script.
6. Copas isi file Kode.gs (ada di Github) ke dalam Kode.gs di editor Google Apps Script.
7. Tutup Spreadsheet, kemudian buka lagi. Ini dilakukan agar script membuatkan sheet-sheet baru dan mengisi label-label di sel.
8. Bila muncul peringatan keamanan, pilih izinkan. Jangan khawatir, script ini aman.
9. Daftarkan NPSN sekolah anda melalui pesan WhatsApp ke nomor [0816768911](https://wa.me/62816768911). Data yang ditulis: NPSN, Nama Sekolah, Nama Operator (nama Anda).
10. Tuliskan NPSN dan nama sekolah yang telah didaftarkan melalui WhatsApp ke sheet Konfigurasi. Untuk sementara, serial number boleh dikosongkan.
11. Pastekan data Calon Murid di Sheet1. Bobot nilai rata-rata rapor ada di Sheet1 sel G1. Bobot nilai Tes Khusus ada di Sheet1 sel H1.
12. Tulis nama jurusan dan kuota per jurusan di sheet Jurusan. Kolom Sisa dan kolom Passing Grade dikosongkan saja. Nanti otomatis diisi oleh script.
13. Klik menu: Hitung > Nilai akhir.
14. Data akan dikirim ke website Mawan.net untuk diolah. Tunggu beberapa detik.
15. Data olahan akan ditulis ulang secara otomatis ke Sheet1 dan data passing grade ditulis ke sheet Jurusan.

Mudah banget kan?

Tadi disebut bahwa script ini aman. Apa alasannya?  
Karena yang dikirim ke server Mawan.net hanya:
1. Tanggal lahir Calon Murid. Ini untuk penentu bila ada dua Calon Murid yang Nilai Akhirnya sama. Yang lebih tua mendapat prioritas diterima.
2. Nilai Rata-Rata Rapor, Nilai Tes Khusus, dan Nilai Prestasi.
3. Pilihan jurusan.

Yang tidak dikirim ke server Mawan.net adalah:
1. Nomor Peserta.
2. Nama Calon Murid.

Jadi kalau anda termasuk orang yang sangat berhati-hati, boleh saja nomor pendaftaran dan nama calon murid dikosongkan atau diisi data random (Lorem Ipsum). Cuma ini justru mempersulit anda sendiri ketika harus merevisi nilai.

Mengapa sebagian data harus dikirim ke server Mawan.net? Mengapa tidak langsung diolah di Google Spreadsheet?  
Jawabannya: Karena saya (programmer aplikasi ini) belum menemukan cara terbaik untuk pencarian data di Spreadsheet memakai index. Jadi saya harus mencari secara berurutan (sequential). Berbeda dengan database seperti MySQL / MariaDB / SQLite di mana kita dapat mencari data dengan perintah: `select * from nama_tabel where ... order by ....` 
Kalau pun bisa diakali (misalkan dengan filter dan sort), pasti algoritmanya menjadi panjang dan tidak secepat hasil eksekusi RDBMS (MySQL, PostgreSQL, dsb).  

## Batasan

1. Untuk versi demo, data Calon Murid maksimal 500 orang. Data ke 501 dan seterusnya tidak akan diproses. Bila data Calon Murid lebih dari 500 orang, mohon lakukan Registrasi. Saat ini cuma Rp 50.000 untuk pemakaian satu tahun. Serial Number akan dikirim melalui WhatsApp dan sila diisikan di sheet Konfigurasi.
2. Panjang string (misalkan nama Jurusan) maksimal 50 karakter.
3. Ini yang paling penting: Jangan meng-insert kolom atau menurunkan header (judul) tabel. Jangan mengganti nama sheet. Posisi telah dipatok absolut.

## Penyanggahan (Disclaimer)

> Walau pun script ini berfungsi baik di sekolah tempat saya bertugas, tapi mohon dicek ulang hasil perhitungan aplikasi ini dengan perhitungan manual, dan pastikan hasilnya sama. Saya khawatir hasil dari script ini tidak sesuai dengan aturan sekolah atau tidak sesuai yang diharapkan.
