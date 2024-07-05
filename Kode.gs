// Sisipkan kode di bawah ini ke Google Apps Script
// melalui menu: Ekstensi > Apps Script. 
//
// (C) Mawan A. Nugroho, 2024.

function proses() {
  var data = {};

  // +-------------+
  // | Konfigurasi |
  // +-------------+

  // Jangan gunakan serial number dari sekolah lain, karena dapat berakibat 
  // data bercampur sehingga merugikan sekolah anda dan sekolah lain.

  Logger.log("Membaca sheet Konfigurasi...");
  var konfigurasiSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Konfigurasi');
  data['sekolah'] = {};
  data['sekolah']['npsn'] = konfigurasiSheet.getRange("B1").getValue();
  data['sekolah']['nama'] = konfigurasiSheet.getRange("B2").getValue();
  data['sekolah']['sn'] = konfigurasiSheet.getRange("B3").getValue();

  // +-------------------+
  // | Jurusan dan kuota |
  // +-------------------+

  data['jurusan'] = [];
  var namaJurusan = '';
  var kuota = 0;

  Logger.log("Membaca sheet Jurusan...");
  var jurusanSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Jurusan');
  var baris = 2;
  var namaJurusan = jurusanSheet.getRange(baris, 1).getValue();
  while (namaJurusan != '') {
    kuota = jurusanSheet.getRange(baris, 2).getValue();
    data['jurusan'].push([namaJurusan, kuota]);
    baris = baris + 1;
    namaJurusan = jurusanSheet.getRange(baris, 1).getValue();
  }

  // +---------------------------------------------+
  // | Bobot nilai rapor, tes khusus, dan afirmasi |
  // +---------------------------------------------+

  var sheet1 = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');

  Logger.log("Membaca bobot pada Sheet1");
  var bobot = sheet1.getRange(1, 7, 1, 9).getValues();
  data['bobot'] = [];
  data['bobot'].push(bobot[0][0]);
  data['bobot'].push(bobot[0][1]);
  data['bobot'].push(bobot[0][2]);

  // +--------------------------+
  // | Data Calon Peserta Didik |
  // +--------------------------+

  // Script ini tidak mengirim nomor pendaftaran dan nama calon peserta didik.
  // Dengan demikian, privacy tetap terjaga. Yang dikirim ke server untuk diolah hanya:
  // 1. Tanggal lahir (untuk penentu bila nilai akhir sama).
  // 2. Pilihan ke 1 dan pilihan ke 2.
  // 3. Nilai-nilainya, yaitu rata-rata nilai rapor, nilai tes akhir, dan nilai prestasi.

  data['murid'] = [];
  var barisTerakhir = sheet1.getLastRow();
  Logger.log("Membaca data murid dari bari ke 3 sampai baris ke " + barisTerakhir);

  data['murid'] = [];
  sheet1.getRange(3, 3, sheet1.getLastRow() - 2, 7).getValues().forEach(function(row) {
    var tanggalLahir = row[0];
    var pilihan1 = row[2];
    var pilihan2 = row[3];
    var nilaiRapor = row[4];
    var nilaiTesKhusus = row[5];
    var nilaiPrestasi = row[6];
    data['murid'].push([tanggalLahir, pilihan1, pilihan2, nilaiRapor, nilaiTesKhusus, nilaiPrestasi]);
  });

  Logger.log("Mengubah array ke JSON...");
  var jsonData = JSON.stringify(data);

  Logger.log("Mengirim data ke Mawan.net ...");
  // Mengirim data ke website mawan.net
  var url = 'https://www.mawan.net/ppdb-smk/proses.php';
  var options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': jsonData
  };

  var response = UrlFetchApp.fetch(url, options);
  var responseText = response.getContentText();

  // Pengecekan apakah respons berupa JSON yang valid
  try {
    var responseData = JSON.parse(responseText);

    // Menulis hasil ke Sheet1 jika respons berupa JSON yang valid
    if (Array.isArray(responseData['murid'])) {      
      // Menghapus header dari respons
      responseData['murid'].shift();

      Logger.log("Menulis hasil perhitungan (diterima atau tidak diterima)...");
      // Menulis data ke kolom J dan K, yaitu nilai akhir dan diterima di jurusan apa.
      for (var i = 0; i < responseData['murid'].length; i++) {
        sheet1.getRange(i + 3, 10).setValue(responseData['murid'][i][0]); // Kolom J
        sheet1.getRange(i + 3, 11).setValue(responseData['murid'][i][1]); // Kolom K
      }
      // Sukses! Proses berakhir sampai di sini.
    }
    if (Array.isArray(responseData['passing_grade'])) {      
      // Menghapus header dari respons
      responseData['passing_grade'].shift();

      Logger.log("Menulis passing grade...");
      // Menulis data ke sheet jurusan kolom C (Sisa) dan kolom D (Passing Grade).
      for (var i = 0; i < responseData['passing_grade'].length; i++) {
        jurusanSheet.getRange(i + 2, 3).setValue(responseData['passing_grade'][i][1]);
        jurusanSheet.getRange(i + 2, 4).setValue(responseData['passing_grade'][i][2]);
      }
      // Sukses! Proses berakhir sampai di sini.
    }
    Logger.log("Selesai.");

  } catch (e) {
    SpreadsheetApp.getUi().alert(responseText);
  }
}

function siapkanSheet(sheetName) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName(sheetName);

  if (!sheet) {
    spreadsheet.insertSheet(sheetName);
    return true;
  }
  else {
    return false;
  }
}

function onOpen() {
  // Membuat menu.
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Hitung')
    .addItem('Nilai akhir', 'proses')
    .addToUi();

  siapkanSheet('Sheet1');
  var label = [
    ["Nomor Pendaftaran", "Nama", "Tanggal Lahir", "Sekolah Asal", "Pilihan 1", "Pilihan 2", "Rerata Rapor", "Tes Khusus", "Prestasi", "Nilai Akhir", "Diterima Di"]
  ];
  var sheet1 = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
  sheet1.getRange('A2:K2').setValues(label);

  var cell = sheet1.getRange('G1');
  if (cell.getValue() === '') cell.setValue('30%');
  var cell = sheet1.getRange('H1');
  if (cell.getValue() === '') cell.setValue('50%');
  var cell = sheet1.getRange('I1');
  if (cell.getValue() === '') cell.setValue('20%');

  if (siapkanSheet('Jurusan')) {
    var jurusan = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Jurusan');
    jurusan.getRange("A1").setValue("Jurusan");
    jurusan.getRange("B1").setValue("Quota");
    jurusan.getRange("C1").setValue("Sisa");
    jurusan.getRange("D1").setValue("Passing Grade");
  }

  if (siapkanSheet('Konfigurasi')) {
    var konfigurasi = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Konfigurasi');
    konfigurasi.getRange("A1").setValue("NPSN");
    konfigurasi.getRange("A2").setValue("Nama Sekolah");
    konfigurasi.getRange("A3").setValue("Serial Number");

    // Data default bila belum diset oleh operator sekolah masing-masing.
    konfigurasi.getRange("B1").setValue("20606915");
    konfigurasi.getRange("B1").setHorizontalAlignment('left');
    konfigurasi.getRange("B2").setValue("SMK Negeri 1 Tangerang");

  }
}
