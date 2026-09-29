const express = require("express");
const app = express();

app.use(express.json());


// ==========================================
// DATA PRODUK
// ==========================================

// Array data produk awal
// Minimal 3 data awal sesuai ketentuan tugas
let products = [
    {
        id: 1,
        nama: "Mouse Wireless",
        kategori: "elektronik",
        harga: 125000,
        stok: 40,
        deskripsi: "Mouse 2.4 GHz, baterai AA"
    },
    {
        id: 2,
        nama: "Keyboard Mechanical",
        kategori: "elektronik",
        harga: 350000,
        stok: 25,
        deskripsi: "Keyboard mechanical RGB"
    },
    {
        id: 3,
        nama: "Tas Laptop",
        kategori: "aksesoris",
        harga: 200000,
        stok: 15,
        deskripsi: "Tas laptop ukuran 15 inch"
    }
];

// ID berikutnya
let nextId = 4;


// ==========================================
// ROUTE UTAMA
// GET /
// ==========================================

// GET /
// Menampilkan informasi API
app.get("/", (req, res) => {
    res.status(200).json({
        nama_mahasiswa: "Zanesen",
        nim: "2327240066",
        topik: 2,
        resource: "products",
        endpoints: [
            "GET /products",
            "GET /products/:id",
            "POST /products",
            "PUT /products/:id",
            "DELETE /products/:id",
            "GET /products?kategori=elektronik"
        ]
    });
});


// ==========================================
// ENDPOINT 1
// GET /products
// Mengambil semua data produk
// ==========================================

app.get("/products", (req, res) => {

    // Mengambil parameter query kategori
    const { kategori } = req.query;

    // Jika terdapat filter kategori
    if (kategori) {

        const hasilFilter = products.filter(
            (product) =>
                product.kategori.toLowerCase() === kategori.toLowerCase()
        );

        // Response berupa array langsung
        return res.status(200).json(hasilFilter);
    }

    // Jika tidak ada filter
    // Mengembalikan semua produk
    res.status(200).json(products);
});


// ==========================================
// ENDPOINT 2
// GET /products/:id
// Mengambil satu produk berdasarkan ID
// ==========================================

app.get("/products/:id", (req, res) => {

    // Mengambil ID dari URL
    const id = parseInt(req.params.id);

    // Mencari produk berdasarkan ID
    const product = products.find(
        (product) => product.id === id
    );

    // Jika produk tidak ditemukan
    if (!product) {
        return res.status(404).json({
            status: "error",
            message: `Data dengan id ${id} tidak ditemukan`,
            data: null
        });
    }

    // Jika produk ditemukan
    res.status(200).json(product);
});



app.post("/products", (req, res) => {

    // Mengambil data dari request body
    const {
        nama,
        kategori,
        harga,
        stok,
        deskripsi
    } = req.body;

    // Validasi field wajib
    if (
        !nama ||
        !kategori ||
        harga === undefined ||
        harga === null
    ) {
        return res.status(400).json({
            status: "error",
            message: "nama, kategori, dan harga wajib diisi",
            data: null
        });
    }

    // Membuat data produk baru
    const produkBaru = {
        id: nextId++,
        nama: nama,
        kategori: kategori,
        harga: Number(harga),
        stok: stok !== undefined ? Number(stok) : 0,
        deskripsi: deskripsi || ""
    };

    // Menambahkan produk ke array
    products.push(produkBaru);

    // Response berhasil
    res.status(201).json({
        status: "success",
        message: "Data berhasil ditambahkan",
        data: produkBaru
    });
});


// ==========================================
// ENDPOINT 4
// PUT /products/:id
// Mengubah seluruh data produk
// ==========================================

// PUT /products/:id
// Body wajib:
// {
//     "nama": "...",
//     "kategori": "...",
//     "harga": 100000,
//     "stok": 10,
//     "deskripsi": "..."
// }

app.put("/products/:id", (req, res) => {

    // Mengambil ID dari URL
    const id = parseInt(req.params.id);

    // Mencari index produk
    const index = products.findIndex(
        (product) => product.id === id
    );

    // Jika ID tidak ditemukan
    if (index === -1) {
        return res.status(404).json({
            status: "error",
            message: `Data dengan id ${id} tidak ditemukan`,
            data: null
        });
    }

    // Mengambil data dari body
    const {
        nama,
        kategori,
        harga,
        stok,
        deskripsi
    } = req.body;

    // Validasi field wajib
    if (
        !nama ||
        !kategori ||
        harga === undefined ||
        harga === null
    ) {
        return res.status(400).json({
            status: "error",
            message: "nama, kategori, dan harga wajib diisi",
            data: null
        });
    }

    // Mengganti seluruh data produk
    const produkDiperbarui = {
        id: id,
        nama: nama,
        kategori: kategori,
        harga: Number(harga),
        stok: stok !== undefined ? Number(stok) : 0,
        deskripsi: deskripsi || ""
    };

    // Menyimpan perubahan
    products[index] = produkDiperbarui;

    // Response berhasil
    res.status(200).json({
        status: "success",
        message: "Data berhasil diubah",
        data: produkDiperbarui
    });
});


// ==========================================
// ENDPOINT 5
// DELETE /products/:id
// Menghapus produk
// ==========================================

app.delete("/products/:id", (req, res) => {

    // Mengambil ID dari URL
    const id = parseInt(req.params.id);

    // Mencari index produk
    const index = products.findIndex(
        (product) => product.id === id
    );

    // Jika produk tidak ditemukan
    if (index === -1) {
        return res.status(404).json({
            status: "error",
            message: `Data dengan id ${id} tidak ditemukan`,
            data: null
        });
    }

    // Menghapus produk
    products.splice(index, 1);

    // Response berhasil
    res.status(200).json({
        status: "success",
        message: `Data produk dengan id ${id} berhasil dihapus`,
        data: null
    });
});


// ==========================================
// CATCH-ALL 404
// Harus diletakkan setelah semua route
// ==========================================

app.use((req, res) => {

    res.status(404).json({
        status: "error",
        message: "Endpoint tidak ditemukan",
        data: null
    });

});


// ==========================================
// MENJALANKAN SERVER
// ==========================================

const PORT = process.env.PORT || 3000;

// Menjalankan server hanya ketika bukan production
if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, () => {
        console.log(`Server berjalan di http://localhost:${PORT}`);
    });
}


// ==========================================
// EXPORT APP
// Dibutuhkan untuk deployment Vercel
// ==========================================

module.exports = app;