const express = require("express");
const router = express.Router();
const pool = require("../config/database");

// Get all events
router.get("/events", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM calendar_events ORDER BY date ASC"
    );
    res.json({ data: rows });
  } catch (error) {
    res.status(500).json({ error: { message: "Error fetching events" } });
  }
});

// Create event
router.post("/events", async (req, res) => {
  const { title, description, date, type } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO calendar_events (title, description, date, type) VALUES (?, ?, ?, ?)",
      [title, description, date, type]
    );
    const [newEvent] = await pool.query(
      "SELECT * FROM calendar_events WHERE id = ?",
      [result.insertId]
    );
    res.json({ data: newEvent[0] });
  } catch (error) {
    res.status(500).json({ error: { message: "Error creating event" } });
  }
});

// Update event
router.put("/events/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, date, type } = req.body;
  try {
    await pool.query(
      "UPDATE calendar_events SET title = ?, description = ?, date = ?, type = ? WHERE id = ?",
      [title, description, date, type, id]
    );
    const [updatedEvent] = await pool.query(
      "SELECT * FROM calendar_events WHERE id = ?",
      [id]
    );
    res.json({ data: updatedEvent[0] });
  } catch (error) {
    res.status(500).json({ error: { message: "Error updating event" } });
  }
});

// Delete event
router.delete("/events/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM calendar_events WHERE id = ?", [id]);
    res.json({ data: { success: true } });
  } catch (error) {
    res.status(500).json({ error: { message: "Error deleting event" } });
  }
});

module.exports = router;
