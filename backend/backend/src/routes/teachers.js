const express = require("express");
const router = express.Router();
const pool = require("../config/database");

// Get all teachers
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM teachers ORDER BY name ASC");
    res.json({ data: rows });
  } catch (error) {
    res.status(500).json({ error: { message: "Error fetching teachers" } });
  }
});

// Create teacher
router.post("/", async (req, res) => {
  const { name, subject, email, phone } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO teachers (name, subject, email, phone) VALUES (?, ?, ?, ?)",
      [name, subject, email, phone]
    );
    const [newTeacher] = await pool.query(
      "SELECT * FROM teachers WHERE id = ?",
      [result.insertId]
    );
    res.json({ data: newTeacher[0] });
  } catch (error) {
    res.status(500).json({ error: { message: "Error creating teacher" } });
  }
});

// Update teacher
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, subject, email, phone } = req.body;
  try {
    await pool.query(
      "UPDATE teachers SET name = ?, subject = ?, email = ?, phone = ? WHERE id = ?",
      [name, subject, email, phone, id]
    );
    const [updatedTeacher] = await pool.query(
      "SELECT * FROM teachers WHERE id = ?",
      [id]
    );
    res.json({ data: updatedTeacher[0] });
  } catch (error) {
    res.status(500).json({ error: { message: "Error updating teacher" } });
  }
});

// Delete teacher
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM teachers WHERE id = ?", [id]);
    res.json({ data: { success: true } });
  } catch (error) {
    res.status(500).json({ error: { message: "Error deleting teacher" } });
  }
});

module.exports = router;
