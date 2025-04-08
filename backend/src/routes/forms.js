const express = require("express");
const router = express.Router();
const pool = require("../config/database");

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

// Create form
router.post("/", async (req, res) => {
  const { title, description, category, filePath, fileSize } = req.body;
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
    res.status(500).json({ error: { message: "Error creating form" } });
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
