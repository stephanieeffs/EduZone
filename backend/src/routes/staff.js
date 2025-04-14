const express = require("express");
const router = express.Router();
const pool = require("../config/database");

// Get all staff members
router.get("/", async (req, res) => {
  try {
    // First try to get staff from users table with role 'teacher'
    const [rows] = await pool.query(
      "SELECT id, name, email, role, created_at FROM users WHERE role = 'teacher'"
    );

    if (rows.length === 0) {
      return res.json({
        data: [],
        message: "No staff members found in the database, using mock data",
      });
    }

    res.json({ data: rows });
  } catch (error) {
    console.error("Error fetching staff:", error);
    res
      .status(500)
      .json({ error: { message: "Error fetching staff members" } });
  }
});

// Get staff member by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT id, name, email, role, created_at FROM users WHERE id = ? AND role = 'teacher'",
      [id]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: { message: "Staff member not found" } });
    }

    res.json({ data: rows[0] });
  } catch (error) {
    res.status(500).json({ error: { message: "Error fetching staff member" } });
  }
});

// Create staff member
router.post("/", async (req, res) => {
  const { name, email, password, subject } = req.body;
  try {
    // Check if user already exists
    const [existingUsers] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      return res
        .status(400)
        .json({ error: { message: "Email already in use" } });
    }

    // Create user with teacher role
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'teacher')",
      [name, email, password]
    );

    // Get the created user
    const [newStaff] = await pool.query(
      "SELECT id, name, email, role, created_at FROM users WHERE id = ?",
      [result.insertId]
    );

    res.json({ data: newStaff[0] });
  } catch (error) {
    console.error("Error creating staff member:", error);
    res.status(500).json({ error: { message: "Error creating staff member" } });
  }
});

// Update staff member
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    // Check if staff member exists
    const [existingStaff] = await pool.query(
      "SELECT * FROM users WHERE id = ? AND role = 'teacher'",
      [id]
    );

    if (existingStaff.length === 0) {
      return res
        .status(404)
        .json({ error: { message: "Staff member not found" } });
    }

    // Update user
    await pool.query("UPDATE users SET name = ?, email = ? WHERE id = ?", [
      name,
      email,
      id,
    ]);

    // Get updated user
    const [updatedStaff] = await pool.query(
      "SELECT id, name, email, role, created_at FROM users WHERE id = ?",
      [id]
    );

    res.json({ data: updatedStaff[0] });
  } catch (error) {
    res.status(500).json({ error: { message: "Error updating staff member" } });
  }
});

// Delete staff member
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // Check if staff member exists
    const [existingStaff] = await pool.query(
      "SELECT * FROM users WHERE id = ? AND role = 'teacher'",
      [id]
    );

    if (existingStaff.length === 0) {
      return res
        .status(404)
        .json({ error: { message: "Staff member not found" } });
    }

    // Delete user
    await pool.query("DELETE FROM users WHERE id = ?", [id]);

    res.json({ data: { success: true } });
  } catch (error) {
    res.status(500).json({ error: { message: "Error deleting staff member" } });
  }
});

module.exports = router;
