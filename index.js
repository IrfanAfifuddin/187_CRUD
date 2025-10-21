const express = require("express");
let mysql = require("mysql2");
const app = express();
const PORT = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Afif2005',
    database: 'mahasiswa',
    port: 3309
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});

app.get('/api/mahasiswa', (req, res) => {
    db.query('SELECT * FROM biodata', (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send('Error fetching users');
        }
        res.json(results);
    });
});

app.post('/api/mahasiswa', (req, res) => {
    const { nama, alamat, agama } = req.body;

    if (!nama || !alamat || !agama) {
        return res.status(400).json({ message: "nama, alamat, dan agama harus diisi" });
    }

    db.query(
        'INSERT INTO biodata (nama, alamat, agama) VALUES (?, ?, ?)',
        [nama, alamat, agama],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Databse Error" });
            }
            res.status(201).json({ message: "User added successfully" });
        }
    );
});

app.put('/api/mahasiswa/:id', (req, res) => {
    const userId = req.params.id;
    const { nama, alamat, agama } = req.body;
    db.query(
        "UPDATE biodata SET nama = ?, alamat = ?, agama = ? WHERE id = ?",
        [nama, alamat, agama, userId],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Database Error" });
            }
            res.json({ message: "User updated successfully" });
        }
    );
});

app.delete('/api/mahasiswa/:id', (req, res) => {
    const userId = req.params.id;
    db.query('DELETE FROM biodata WHERE id = ?', [userId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Database Error" });
        }
        res.json({ message: "User deleted successfully" });
    });
});