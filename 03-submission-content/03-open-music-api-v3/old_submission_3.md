# Proyek Message Broker, Storage, dan Cache

Selamat! Akhirnya Anda telah sampai di penghujung pembelajaran. Anda telah mempelajari:
 - Memahami Message Broker.
 - Menggunakan RabbitMQ sebagai Message Broker.
 - Mengimplementasikan Message Broker ke Proyek Back-End. 
 - Menulis dan Membaca Berkas pada Storage Lokal. 
 - Melayani Permintaan Menggunakan Berkas Statis di Hapi. 
 - Mengetahui Cara Menyimpan dan Menggunakan Berkas dari Amazon S3. 
 - Memahami Konsep Cache. 
 - Mengetahui Cara Memasang Redis secara Lokal. 
 - Menggunakan Redis untuk Caching Pada RESTful API.

Tentu Anda juga sudah mengerjakan seluruh latihan yang diberikan pada modul-modul tersebut.

Untuk menuju lulus dari kelas ini, Anda harus mengerjakan tugas yakni membuat proyek OpenMusic API versi 3 sesuai kriteria yang akan disampaikan nanti. Tim Reviewer akan memeriksa pekerjaan Anda dan memberikan reviu pada proyek yang Anda buat.


## Studi Kasus

Semenjak dirilisnya OpenMusic versi 2, pengguna OpenMusic semakin membludak. Mereka sangat antusias akan kehadiran platform pemutar musik gratis. Kehadiran fitur playlist membuat mereka nyaman menggunakan OpenMusic. Bahkan, mereka tidak segan untuk membagikan dan merekomendasikan OpenMusic hingga akhirnya melejit!

Karena pengguna OpenMusic semakin banyak, server kita seringkali mengalami down. Terutama pada server database yang selalu bekerja keras dalam menangani permintaan kueri playlist dari ribuan pengguna. Hingga akhirnya tim TSC memutuskan untuk menerapkan server-side caching pada OpenMusic API untuk mengurangi pekerjaan database.

Pengembangan OpenMusic versi 3 segera tiba dan ini adalah kontribusi terakhir Anda pada platform OpenMusic. Tim TSC kembali melakukan survey fitur apa yang hendak dibawa pada versi ke-3 ini. Hasilnya menunjukkan pengguna menginginkan fitur ekspor daftar lagu yang berada di playlist. Selain itu, mereka juga menginginkan hadirnya fitur upload gambar untuk sampul lagu.

Tugas terakhir Anda adalah mengembangkan OpenMusic API versi 3 dengan menerapkan server-side caching, fitur ekspor serta upload gambar sesuai spesifikasi yang dijelaskan di materi selanjutnya.


## Kriteria OpenMusic API versi 3

Terdapat 4 kriteria utama yang harus Anda penuhi dalam membuat proyek OpenMusic API.

### Kriteria 1 : Terdapat fitur ekspor lagu pada playlist

API yang Anda buat harus tersedia fitur ekspor lagu pada playlist melalui route:

- Method : POST
- URL : /exports/playlists/{playlistId}
- Body Request:
```json
{
    "targetEmail": "string"
}
```

Ketentuan:
- Payload targetEmail wajib bernilai email yang valid (bukan sembarang nilai string)
- Pengguna hanya bisa mengekspor playlist yang menjadi haknya sebagai pemilik atau kolaborator playlist.
- Wajib menggunakan message broker dengan menggunakan RabbitMQ.
  - Nilai host server RabbitMQ wajib menggunakan environment variable `RABBITMQ_SERVER`.
- Wajib mengirimkan program consumer. 
- Hasil ekspor berupa data json. 
- Dikirimkan melalui email menggunakan nodemailer. 
  - Kredensial alamat dan password email pengirim wajib menggunakan environment variable `MAIL_ADDRESS` dan `MAIL_PASSWORD`.


Response yang harus dikembalikan:
- Status Code: 201
- Response Body:
```json
{
    "status": "success",
    "message": "Permintaan Anda sedang kami proses"
}
```

### Kriteria 2 : Terdapat fitur mengunggah gambar

API yang Anda buat harus terdapat fitur mengunggah gambar melalui route:

-Method : POST
-URL : /upload/pictures
-Body Request (Form data):

```json
{
    "data": "file"
}
```

Ketentuan:
- Tipe konten yang diunggah harus merupakan MIME types dari images.
- Ukuran file gambar maksimal 500KB.
- Anda bisa menggunakan File System (lokal) atau S3 Bucket dalam menampung object.
- Bila menggunakan S3 Bucket, nama bucket wajib menggunakan variable environment `AWS_BUCKET_NAME`.

Response yang harus dikembalikan:
- Status Code: 201 
- Response Body:

```json
{
    "status": "success",
    "message": "Gambar berhasil diunggah",
    "data": {
    "pictureUrl": "http://…"
    }
}
```

### Kriteria 3 : Menerapkan Server-Side Cache

- Menerapkan server-side cache pada resource `GET playlists/{playlistId}/songs` (Mendapatkan daftar lagu pada playlist).
- Cache harus selalu dihapus ketika ada lagu yang dimasukkan atau dihapus dari playlist tersebut.
- Memory caching engine wajib menggunakan Redis atau Memurai (Windows).
- Nilai host server Redis wajib menggunakan environment variable `REDIS_SERVER`.

### Kriteria 4 : Pertahankan Fitur OpenMusic API versi 2 dan 1

Pastikan fitur dan kriteria OpenMusic API versi 2 dan 1 tetap dipertahankan seperti:

- Menyimpan lagu
- Menampilkan seluruh lagu
- Menampilkan detail lagu
- Mengubah data lagu
- Menghapus data lagu
- Fitur registrasi pengguna
- Fitur login pengguna
- Fitur refresh access token
- Fitur logout pengguna
- Menambahkan playlist
- Melihat daftar playlist yang dimiliki
- Menghapus playlist
- Menambahkan lagu ke playlist
- Melihat daftar lagu pada playlist
- Menghapus lagu dari playlist


### Pengujian API

Ketika membangun OpenMusic API versi 3, tentu Anda perlu menguji untuk memastikan API berjalan sesuai dengan kriteria yang ada. Kami sudah menyediakan berkas Postman Collection dan Environment yang dapat Anda gunakan untuk pengujian. Silakan unduh berkasnya pada tautan berikut:

- [Postman OpenMusic API V3 Test Collection dan Environment](https://github.com/dicodingacademy/a271-backend-menengah-labs/raw/0ca1099916f443df0871a4efd9c8f7c57117993e/03-submission-content/03-open-music-api-v3/OpenMusic%20API%20V3%20Test.zip)

Anda perlu meng-import kedua berkas tersebut pada Postman untuk menggunakannya. Caranya, ekstrak berkas yang sudah diunduh hingga menghasilkan dua berkas file JSON.

### Cara Import Collection dan Environment OpenMusic V3

1. Silakan unduh tautan yang diberikan di atas.
2. Ekstrak berkas yang sudah diunduh hingga menghasilkan dua berkas file JSON.
![Ekstrak](https://d17ivq9b7rppb3.cloudfront.net/original/academy/2021053001591119e399e4857a9273647731c4a1e70fc7.jpeg)
3. Kemudian import kedua berkas tersebut pada Postman. Caranya, buka aplikasi Postman, klik tombol Import yang berada di atas panel kiri aplikasi Postman.
![Import](https://d17ivq9b7rppb3.cloudfront.net/original/academy/20210530015907a438fcc5dad71d097f3c20da6a04bbbf.jpeg)
4. Kemudian klik tombol Upload Files untuk meng-import kedua berkas JSON hasil ekstraksi.
![Upload](https://d17ivq9b7rppb3.cloudfront.net/original/academy/20210530015910615b66afc2544f785b7ccc68edea5e50.jpeg)
5. Pilih kedua berkas JSON hasil ekstraksi dan klik tombol `Open`.
![Open](https://d17ivq9b7rppb3.cloudfront.net/original/academy/20210530015910f2e56f042480fdda6f76014b5f6fcdd4.jpeg)
6. Kemudian klik Import.
![Import](https://d17ivq9b7rppb3.cloudfront.net/original/academy/202105300159101116f1cc28086bd4163fe0d0b017ce24.jpeg)
7. Setelah itu, OpenMusic API V3 Test Collection dan Environment akan tersedia pada Postman Anda.
![Import](https://d17ivq9b7rppb3.cloudfront.net/original/academy/202105300159113b289e7fa810eb5c6d1e27c779135e44.jpeg)
8. Jangan lupa untuk gunakan Environment OpenMusic API V3.
![Import](https://d17ivq9b7rppb3.cloudfront.net/original/academy/20210530015912e2b2bbbf3c6b8a5a567706b058c0d1c8.jpeg)


### Konfigurasi Pengujian OpenMusic API V3

Sebelum menjalankan dan menggunakan pengujian OpenMusic API V3, Anda perlu melakukan sedikit konfigurasi. Silakan ikuti instruksi berikut:

1. Buka **OpenMusic API V3 Test Environment**
![Environment](https://d17ivq9b7rppb3.cloudfront.net/original/academy/20210530020048d71b3380ed0b03860cea0c16727bd915.jpeg)
2. Kemudian pada variabel `targetEmail` berikan nilai dengan email Anda. Tujuannya, agar pengujian ekspor lagu di playlist akan terkirim ke email Anda. Sehingga Anda bisa memvalidasi program consumer Anda dapat mengirimkan email dengan baik.
![Environment](https://d17ivq9b7rppb3.cloudfront.net/original/academy/20210530020049ed9428d4e28a2685821f0093ae009d45.jpeg)
3. Konfigurasi Environment selesai. Selanjutnya buka OpenMusic V3 Test collections.
![Environment](https://d17ivq9b7rppb3.cloudfront.net/original/academy/20210530020049b1f34a6293a9e67404495f682c438bd5.jpeg)
4. Kemudian buka request Uploads (Manual Run) -> Upload Image. Di sini Anda perlu menetapkan berkas yang akan digunakan dalam mengunggah gambar. Silakan unduh [gambar berikut](https://github.com/dicodingacademy/a271-backend-menengah-labs/raw/099-shared-files/03-submission-content/03-open-music-api-v3/picture-small.jpg).
5. Kemudian buka tabs Body dan gunakan gambar tersebut pada key data.
![Environment](https://d17ivq9b7rppb3.cloudfront.net/original/academy/2021053002004940877ad02f1abfe8bf45803a6b1fdb36.jpeg)
6. Simpan perubahan pada request `Upload Image`. 
7. Kemudian lakukan hal yang sama pada request Upload Image More Than 500KB dan Upload Non-Image File. Namun gunakanlah berkas-berkas berikut:
   - **Upload Image More Than 500KB**: [picture-large.jpg](https://github.com/dicodingacademy/a271-backend-menengah-labs/raw/099-shared-files/03-submission-content/03-open-music-api-v3/picture-large.jpg) 
   - **Upload Non-Image File**: [text-small.txt](https://raw.githubusercontent.com/dicodingacademy/a271-backend-menengah-labs/099-shared-files/03-submission-content/03-open-music-api-v3/text-small.txt?token=AGEIPCMVW4LW6RCA6WZFEHTAXPECY)

### Tips Menjalankan Pengujian OpenMusic V3

- Pastikan Anda selalu menjalankan pengujian secara berurutan. Karena beberapa request nilai yang didapat dari request sebelumnya. Contoh, pengujian pada folder Authentications membutuhkan folder Users untuk dijalankan. Karena untuk mendapatkan melakukan autentikasi, tentu harus ada data pengguna di database.
- Untuk menjalankan request secara berurutan sekaligus, Anda bisa memanfaatkan fitur collection runner.
![Environment](https://d17ivq9b7rppb3.cloudfront.net/original/academy/20210530020345d4f3d08a1cd5b5dccad8186cadcfa2ca.jpeg)
- Khusus untuk permintaan pada folder Uploads, jangan ikut sertakan untuk dijalankan menggunakan collections. Karena pengujian akan selalu gagal. Jadi pastikan ketika hendak menjalankan seluruh permintaan pada collection, pengujian pada folder Uploads tidak dicentang.
![Environment](https://d17ivq9b7rppb3.cloudfront.net/original/academy/20210530020345f486ccb9639417daac0a1fcc3e95c390.jpeg)
- Kerjakanlah proyek fitur demi fitur, agar Anda mudah dalam menjalankan pengujiannya. 
- Jika merasa seluruh fitur yang dibangun sudah benar namun pengujiannya selalu gagal, kemungkinan database Anda kotor dengan data pengujian yang Anda lakukan sebelum-sebelumnya, dan itu bisa menjadi salah satu penyebab pengujian selalu gagal. Solusinya, silakan hapus seluruh data pada tabel melalui `psql` dengan perintah: (Seuaikan nama tabel dengan yang Anda gunakan)
```SQL
TRUNCATE songs, users, authentications, playlists, playlistsongs;
```

### Kriteria Penilaian Submission
Submission Anda akan dinilai oleh Reviewer guna menentukkan kelulusan Anda. Untuk lulus dari kelas ini, proyek OpenMusic API versi 3 harus memenuhi seluruh pengujian otomatis pada seluruh Postman Request, terkecuali request yang bertanda [optional]. Bila salah satu pengujiannya gagal, maka proyek Anda akan kami tolak.

Submission Anda akan dinilai oleh Reviewer dengan skala 1-5. Untuk mendapatkan nilai tinggi, Anda bisa menerapkan beberapa saran berikut:

- Menerapkan server-side caching pada resource di luar yang sudah ditentukan.
- Menyelesaikan Kriteria Opsional, yakni kolaborasi playlist.
- Menggunakan Hapi Plugin dalam mengelola kode.
- Menggunakan Joi untuk proses validasi data.
- Menerapkan CORS pada seluruh resource yang ada.
- Menggunakan ESLint dan salah satu style guide agar gaya penulisan kode JavaScript lebih konsisten.
- Menuliskan kode dengan bersih:
  - Menghapus kode yang redundan (tidak perlu).
  - Menghapus impor kode yang tidak digunakan.
  - Menghapus berkas yang tidak digunakan.
  - Menghidari disable linter yang tidak diperlukan.

Berikut adalah detail penilaian submission:

- Bintang 1 : Semua ketentuan wajib terpenuhi, namun terdapat indikasi kecurangan dalam mengerjakan submission.
- Bintang 2 : Semua ketentuan wajib terpenuhi, namun terdapat kekurangan pada penulisan kode. Seperti tidak menerapkan modularization atau gaya penulisan tidak konsisten.
- Bintang 3 : Semua ketentuan wajib terpenuhi, namun tidak terdapat improvisasi atau persyaratan opsional yang dipenuhi.
- Bintang 4 : Semua ketentuan wajib terpenuhi, menerapkan minimal tiga persyaratan opsional dan menuliskan kode dengan bersih.
- Bintang 5 : Semua ketentuan wajib terpenuhi dan menerapkan seluruh persyaratan opsional yang ada.

**Catatan:**
Jika submission Anda ditolak maka tidak ada penilaian. Kriteria penilaian bintang di atas hanya berlaku jika submission Anda lulus.


### Ketentuan Berkas Submission

- Berkas submission yang dikirim merupakan folder proyek dari OpenMusic API versi 3 **dan proyek consumer** dalam bentuk ZIP.
- Pastikan di dalam folder proyek yang Anda kirim terdapat berkas **package.json**.
- Untuk menjaga kredensial Anda, diperbolehkan untuk tidak melampirkan berkas `.env` selama penamaan variable environment sesuai dengan persyaratan.
- Pastikan Anda hapus dulu berkas `node_modules` pada folder proyek sebelum mengkompresi dalam bentuk ZIP.


### Submission Anda akan Ditolak bila

- Kriteria wajib OpenMusic API versi 3 tidak terpenuhi.
- Ketentuan berkas submission tidak terpenuhi.
- Proyek yang Anda kirim tidak dapat dijalankan dengan baik (Reviewer menggunakan Node.js versi LTS 14.17.0).
- Menggunakan bahasa pemrograman dan teknologi lain, selain JavaScript dan Node.js.
- Menggunakan Framework Node.js selain Hapi Framework.
- Melakukan kecurangan seperti tindakan plagiasi.


## Forum Diskusi
Jika mengalami kesulitan, Anda bisa menanyakan langsung ke forum diskusi. [https://www.dicoding.com/academies/271/discussions](https://www.dicoding.com/academies/271/discussions).
