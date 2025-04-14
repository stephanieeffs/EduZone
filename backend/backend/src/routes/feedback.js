const express = require("express");
const router = express.Router();
const pool = require("../config/database");

// Get all feedback
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM feedback ORDER BY created_at DESC"
    );
    res.json({ data: rows });
  } catch (error) {
    res.status(500).json({ error: { message: "Error fetching feedback" } });
  }
});

// Create feedback
router.post("/", async (req, res) => {
  const { type, text, userId, userName } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO feedback (type, text, user_id, user_name, status) VALUES (?, ?, ?, ?, ?)",
      [type, text, userId, userName, "Pending"]
    );
    const [newFeedback] = await pool.query(
      "SELECT * FROM feedback WHERE id = ?",
      [result.insertId]
    );
    res.json({ data: newFeedback[0] });
  } catch (error) {
    res.status(500).json({ error: { message: "Error creating feedback" } });
  }
});

// Update feedback status
router.put("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await pool.query("UPDATE feedback SET status = ? WHERE id = ?", [
      status,
      id,
    ]);
    const [updatedFeedback] = await pool.query(
      "SELECT * FROM feedback WHERE id = ?",
      [id]
    );
    res.json({ data: updatedFeedback[0] });
  } catch (error) {
    res
      .status(500)
      .json({ error: { message: "Error updating feedback status" } });
  }
});

// Delete feedback
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM feedback WHERE id = ?", [id]);
    res.json({ data: { success: true } });
  } catch (error) {
    res.status(500).json({ error: { message: "Error deleting feedback" } });
  }
});

module.exports = router;
