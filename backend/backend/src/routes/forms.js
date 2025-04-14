const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const pool = require("../config/database");

// Configure multer to save files to the 'uploads' folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Save files in the uploads folder
    cb(null, path.join(__dirname, "../public/uploads"));
  },
  filename: (req, file, cb) => {
    // Save the file with a unique name (timestamp + original extension)
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Get all forms
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM forms ORDER BY created_at DESC"
    );
    res.json({ data: rows });
  } catch (error) {
    res.status(500).json({ error: { message: "Error fetching forms" } });
  }
});

// Create form (with file upload)
router.post("/", upload.single('file'), async (req, res) => {
  const { title, description, category } = req.body;
  const file = req.file;

  // Check if file is uploaded
  if (!file) {
    return res.status(400).json({ error: { message: "No file uploaded" } });
  }

  const filePath = `/uploads/${file.filename}`;
  const fileSize = file.size;

  try {
    const [result] = await pool.query(
      "INSERT INTO forms (title, description, category, file_path, file_size) VALUES (?, ?, ?, ?, ?)",
      [title, description, category, filePath, fileSize]
    );

    const [newForm] = await pool.query("SELECT * FROM forms WHERE id = ?", [
      result.insertId,
    ]);
    res.json({ data: newForm[0] });
  } catch (error) {
    console.error("Error creating form:", error);
    res.status(500).json({ error: { message: "Error creating form" } });
  }
});

// Serve form file (for download)
router.get("/download/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // Get form by ID
    const [form] = await pool.query("SELECT * FROM forms WHERE id = ?", [id]);
    if (form.length === 0) {
      return res.status(404).json({ error: { message: "Form not found" } });
    }

    const filePath = form[0].file_path;
    res.sendFile(filePath, { root: path.join(__dirname, "../public") }, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: { message: "Error downloading file" } });
      }
    });
  } catch (error) {
    console.error("Error fetching form file:", error);
    res.status(500).json({ error: { message: "Error downloading form" } });
  }
});

// Delete form
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM forms WHERE id = ?", [id]);
    res.json({ data: { success: true } });
  } catch (error) {
    res.status(500).json({ error: { message: "Error deleting form" } });
  }
});

module.exports = router;
