# Asesmen Arvin Yardhika - 92035 - Backend Developer - Software Prodigy - Telkomsel

* Source code terupdate ada di branch Main

## Software Needed

1. Visual Studio Code

![image](https://user-images.githubusercontent.com/65943502/161312534-4d46eb41-9b3f-435b-9f7d-10d396564ab0.png)

2. XAMPP

![image](https://user-images.githubusercontent.com/65943502/161312583-ebfafed7-53a2-4327-92e0-8166c2fd2446.png)


## How to Install 

1. Buat direktori/folder baru 

![image](https://user-images.githubusercontent.com/65943502/161312391-96cd41f9-93f9-4749-baee-55ed043b5528.png)

2. Buka Terminal dari Visual studio code dan arahkan ke folder/direktori baru

![image](https://user-images.githubusercontent.com/65943502/161312758-a48fd044-d171-4c8b-a7b4-b6f9a6e44569.png)

3. Masukkan command `git clone https://github.com/arvinyar/asesmen.git`

![image](https://user-images.githubusercontent.com/65943502/161313139-2ca47f5d-9c56-43a5-8837-566acd0f0e48.png)

4. Running command `npm install` untuk menginstall semua depedensi

![image](https://user-images.githubusercontent.com/65943502/161313381-380bb663-27eb-4d88-bd8f-0307ca395eef.png)

## Configure Database

1. Open XAMPP and start apache & MySQL service

![image](https://user-images.githubusercontent.com/65943502/161313656-b903e9f4-4fa6-4816-8bcb-55d2236c600e.png)

2. Open Localhost/phpmyadmin

![image](https://user-images.githubusercontent.com/65943502/161314107-676b5c51-29e4-48c2-8e58-b6acebcc4e5f.png)

3. Create new table bernama assesment_arvin

![image](https://user-images.githubusercontent.com/65943502/161314053-4183a084-1912-46e9-9410-8ae9d78f5406.png)

4. Buka terminal di Visual Studio

5. Running Command `npx sequelize-cli db:migrate`

![image](https://user-images.githubusercontent.com/65943502/161314269-a3605fef-04fe-428b-a3ce-fea712677829.png)

6. Seeding Data dengan command `npx sequelize-cli db:seed:all` hanya 2 table yang diseeding dari awal, tabel product dan tabel users

![image](https://user-images.githubusercontent.com/65943502/161314436-0c6cf348-e8ad-4e2d-beb7-1180c2c30547.png)

![image](https://user-images.githubusercontent.com/65943502/161314474-6712fb29-90a6-4a26-9a38-3171c042978d.png)

## Konfigurasi Database

1. Tabel Users, Menyimpan info user dari nama, email, dan password

![image](https://user-images.githubusercontent.com/65943502/161314751-77ab26af-bbfc-4036-b706-b0facc6d0bb0.png)

2. Tabel Product, Menyimpan informasi nama product, id product, quantity, promo (X bonus 1), dan harga per unit

![image](https://user-images.githubusercontent.com/65943502/161314862-e661d682-302d-4979-922e-403fe55deef3.png)

3. Tabel Transactions, Menyimpan informasi id transaksi user, user_id yang membeli, dan status transaksi (cart/checkouot/paid)

![image](https://user-images.githubusercontent.com/65943502/161315008-aa7e9556-338f-482e-a384-4f6633f7e9af.png)

Kolom user_id memiliki foreign key ke tabel user kolom id

4. Tabel carts, Menyimpan informasi product_id, transaction_id, harga per unit, jumlah pembelian product, dan id_transaksi dari item

![image](https://user-images.githubusercontent.com/65943502/161315230-67c40c47-8ebe-44a0-a1d9-5c2bc9de2736.png)

Kolom transaction_id memiliki foreign key ke tabel transaksi kolom id
Kolom product_id memiliki foreign key ke tabel product kolom id

**Apabila user memiliki cart dengan id 1 dan di cart tersebut ada 3 item, maka ia akan memiliki 1 entri di tabel transaksi dan 3 entri di tabel cart untuk masing-masing product_id**

## Term And Conditions

Peraturan dari service ini:

1. Semua API yang disediakan harus menggunakan API_KEY, API_KEY yang digunakan adalah 76f8a1fab09bc13f2e48be45689dd074
2. Semua API kecuali login menggunakan JWT Token, user akan mendapatkan token setelah melakukan login, token yang di-return dari API akan digunakan untuk seluruh request dari service ini
3. Ketentuan Cart:
- Setiap user hanya dapat memiliki 1 cart aktif untuk ditambahkan barang
- Untuk cart yang sudah selesai pemilihan barangnya dapat dilakukan Checkout
- Untuk membayar, user dapat membayar langsung dari item yang masih berada di cart/sudah dicheckout (tidak harus dicheckout baru dibayar)
- User dapat menambahkan item ke cart yang mereka miliki
- User hanya akan mendapatkan bonus berupa potongan harga, bukan merupakan penambahan dari item yang dipesan (Apabila untuk promo 5 gratis 1, apabila user membeli 15 item, maka ia akan tetap mendapatkan 15 item dengan potongan harga, bukan berupa penambahan item ke cartnya menjadi 18 buah
- Apabila di cart user telah memiliki product_id X, dan ia menambahkan product_id yang sama, maka item akan ditambahkan ke item eksisting, bukan merupakan 2 entri di tabel, harga setelah promo akan dilakukan penyesuaian sesuai jumlah product yang baru
- Apabila user melakukan penghapusan item, **semua** product id tersebut akan hilang dari cart
- Untuk pencarian item, user dapat melakukan filter berupa : 
  a. Nama full/sebagian item
  b. Harga, Quantity, dan Jumlah Promo, dapat dilakukan pencarian dengan memasukkan angka maksimum dan minimum, juga dapat melakukan pencarian untuk nilai (X) di mana   X di atas harga minimum Y atau X di bawah harga maksimum Z 9semua jenis kombinasi dapat dicari)
- Apabila user belum memiliki cart aktif, dan menambahkan 1 item yang ingin dibeli, akan dibuatkan transaction_id baru untuk user, akan tetapi apabila user menghapus item tersebut, transaction_id tidak akan hilang, dan akan dimaintain untuk pembelian selanjutnya
- User hanya bisa melakukan penghapusan dari cart aktif, item yang sudah dicheckout tidak bisa dihapus
  
## API

1. API Login

![image](https://user-images.githubusercontent.com/65943502/161317264-3721c199-967e-47a2-a714-8e1ddd11c9fe.png)

Setelah login user akan mendapatkan tokenm, tanpa token tidak akan bisa masuk ke API lain

2. Get Profile

![image](https://user-images.githubusercontent.com/65943502/161317465-59224c02-86e2-46d4-8b56-41d841128d96.png)

Mendapatkan profile pelanggan

3. Add to Cart

![image](https://user-images.githubusercontent.com/65943502/161317520-36bad18d-c717-4939-a914-2b40d1e0922a.png)

Melakukan penambahan item ke cart, memerlukan inputan product_id dan jumlah yang diinginkan, apabila item yang diinginkan > sisa, user tidak bisa menambahkan item tersebut ke cart

4. View Cart

![image](https://user-images.githubusercontent.com/65943502/161317760-7c510ad1-1c0c-469b-8c99-8bc2ee6c54c4.png)

Menampilkan informasi cart yang aktif, akan memberikan return array kosong apabila user tidak memiliki cart

5. Delete From Cart

![image](https://user-images.githubusercontent.com/65943502/161318156-fe968b69-cbb4-48e2-b0dc-58b439b38bf0.png)
![image](https://user-images.githubusercontent.com/65943502/161318193-bdf8247a-4102-4982-926b-993e65682916.png)

Apabila suer memiliki product_id yang diinput dalam cart aktifnya, item akan dihapus, apabila tidak akan mendapatkan respon item not found

6. Checkout Cart

![image](https://user-images.githubusercontent.com/65943502/161318399-c07d6f16-ccdd-4056-a48c-d8b488579253.png)

Memerlukan input transaction_id dari cart aktif, akan melakukan checkout (item terkunci) dan menampilkan total harga dari cart user

7. View Checkout Cart

![image](https://user-images.githubusercontent.com/65943502/161318504-5664abce-5b24-49f0-891a-322015f6595a.png)

User dapat melihat semua transaksinya yang berada dalam status checkout

8. Payment

![image](https://user-images.githubusercontent.com/65943502/161318792-81ccc607-135b-4401-8989-197efc438f25.png)

Akan melakukan payment terhadap item yang msaih di cart/sudah dicheckout, mengubah status menjadi paid

9. View Paid

![image](https://user-images.githubusercontent.com/65943502/161318923-a7848a81-a88b-4b60-a1f3-6acfd7281525.png)

Memberikan informasi mengenai cart user yang sudah dibayar

10. View All

![image](https://user-images.githubusercontent.com/65943502/161318991-af7d3112-5238-47da-9415-0fc2a72dcecf.png)

Menampilkan semua history transaksi user dari semua status

11. Search Item

![image](https://user-images.githubusercontent.com/65943502/161319158-f87a3eb7-08cf-4142-878d-71f59fb53c7e.png)

Melakukan pencarian dari quantity barang

![image](https://user-images.githubusercontent.com/65943502/161319271-1002c7ef-678a-4f21-958e-1a2f29cf8014.png)

Melakukan pencarian dari promo barang

![image](https://user-images.githubusercontent.com/65943502/161319352-3cb4d9ff-ef57-4d26-bd80-2ab5f9eef89a.png)

Melakukan pencarian dari harga barang

![image](https://user-images.githubusercontent.com/65943502/161319582-2ea707b0-f1c1-4eac-9173-4bd86ba2cc73.png)

Melakukan pencarian dari nama barang

![image](https://user-images.githubusercontent.com/65943502/161320280-cb464472-a42a-4820-ac29-1f57cfc90ae3.png)

Melakukan pencarian kombinasi

## Error Handling

1. No API_KEY

![image](https://user-images.githubusercontent.com/65943502/161320365-7723f096-b0a9-41bb-839e-3bc3958c0f0f.png)

2. No Bearer Token

![image](https://user-images.githubusercontent.com/65943502/161320491-af4be4f7-102b-47fa-99d5-96cb5fcacaaa.png)

3. Input Missing (Selain fungsi find)

![image](https://user-images.githubusercontent.com/65943502/161320545-e5da0072-3319-468d-b059-25c0405e66c6.png)

## Unit Test

Unit Testing menggunakan mocha dan chai (library node js), terdapat 12 test case yang diberikan, dan masing-masing telah memenuhi persyaratan dan input yang telah ditetapkan dapat dilakukan dengan cara:

1. `NPM start` di terminal

![image](https://user-images.githubusercontent.com/65943502/161320998-fd84c825-9d89-414b-81cf-c0473bbcef0d.png)

2. Buka terminal baru
3. `NPM test` di terminal baru

![image](https://user-images.githubusercontent.com/65943502/161321115-eb2c1fc5-9139-4a8e-95f1-5e3780b726de.png)

Respon dari semua testcase diberikan tepat di bawah testcase

## Docker

1. Install WSL, UBUNTU TSL dan Docker Desktop

2. Buka terminal Linux

3. Running Command `docker build -t assesmen_arvin https://github.com/arvinyar/asesmen.git`

![image](https://user-images.githubusercontent.com/65943502/161321345-4e930e68-090a-43d4-9912-ef8ac022a928.png)

4. Cek Docker Image

![image](https://user-images.githubusercontent.com/65943502/161321625-2fb44ddc-ba40-4598-996e-f1427e48d189.png)

5. Buat file baru bernama docker-compose.yml, dengan file docker-compose.yml yang terdapat pada repo

![image](https://user-images.githubusercontent.com/65943502/161321723-77232187-cfbf-4a9c-a6ef-055baac1e0af.png)

6. Buat file .env dengan kontek:

MYSQLDB_DOCKER_PORT=3306
NODE_DOCKER_PORT=8080
MYSQLDB_LOCAL_PORT=3307
NODE_LOCAL_PORT=6868

7. Running command `docker-compose up`

8. Service dapat dijalankan seperti biasa

## Postman Collection

1. Postman Collection dapat ditemukan di repo
2. Isi environment dengan content sebagai berikut:

![image](https://user-images.githubusercontent.com/65943502/161322168-2da81db5-03b3-429e-875b-651054d586ae.png)

URL : localhost:3000/api
api_key = 76f8a1fab09bc13f2e48be45689dd074
bearer : dapat diisi disesuaikan dengan bearer yang didapat saat login

## Pengembangan service

1. Pembuatan handling untuk method GET dan POST yang lebih lengkap
2. Pembuatan menu register
3. Pembuatan menu pembayaran dengan menggunakan berbagai merchant
4. Fitur loyalty untuk memberika poin kepada pelanggan sesuai transaksi
5. Fituer untuk user dapat menambah item penjualannya
6. Menambahkan fitur e-wallet, user dapat melakukan top up dan uang hasil penjualan barangnya akna masuk ke e-wallet yang dimiliki
7. Enkripsi dan memperkuat security
8. Membuat fiorum untuk produk yang ada
9. Membuat fasilitas delivery
10. Promo dapat berubah-ubah dan dapat disesuaikan (diskon/bonus/dll)
11. Rekomendasi barang untuk user lain
12. Sistem pertemanan dengan user lain, dan membuat mission pembelian barang apabila mencapai harga x (misalkan pembelian 5 juta), akan mendapatkan benegit yang dibagi pro rate kepada e-wallet user

Sekian penjelasan untuk project kali ini, apabila ada pertanyaan dan amsukan dapat menghubungi saya di

HP/WA : 08119345671
Email : arvin_yardhika@telkomsel.co.id





