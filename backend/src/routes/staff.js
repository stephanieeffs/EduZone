const express = require("express");
const router = express.Router();
const pool = require("../config/database");

// Get all staff members
// Get all staff members
router.get("/", async (req, res) => {
  const { role } = req.query;  
  try {
    let query = "SELECT id, name, position, department, email, phone, imagefilepath, bio, role, created_at FROM staff";  // Updated SELECT query
    let queryParams = [];

    if (role) {
      query += " WHERE role IN ('admin', 'teacher', 'librarian')";
    }

    const [rows] = await pool.query(query, queryParams);

    if (rows.length === 0) {
      return res.json({
        data: [],
        message: "No staff members found in the database.",
      });
    }

    res.json({ data: rows });
  } catch (error) {
    console.error("Error fetching staff:", error);
    res.status(500).json({ error: { message: "Error fetching staff members" } });
  }
});


// Get staff member by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT id, name, email, role, created_at FROM staff WHERE id = ? AND role IN ('admin', 'staff', 'librarian')",
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
  const { name, email, phone, role, position, department, imagefilepath, bio } = req.body;

  if (!role || !['admin', 'staff', 'librarian'].includes(role)) {
    return res.status(400).json({ error: { message: "Invalid role. Role must be 'admin', 'staff', or 'librarian'." } });
  }

  try {
    const [existingUsers] = await pool.query(
      "SELECT * FROM staff WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      return res
        .status(400)
        .json({ error: { message: "Email already in use" } });
    }

    const [result] = await pool.query(
      "INSERT INTO staff (name, email, phone, role, position, department, imagefilepath, bio) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [name, email, phone, role, position, department, imagefilepath, bio]
    );

    const [newStaff] = await pool.query(
      "SELECT id, name, email, role, created_at FROM staff WHERE id = ?",
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
  const { name, email, phone, role, position, department, imagefilepath, bio } = req.body;

  if (role && !['admin', 'staff', 'librarian'].includes(role)) {
    return res.status(400).json({ error: { message: "Invalid role. Role must be 'admin', 'staff', or 'librarian'." } });
  }

  try {
    const [existingStaff] = await pool.query(
      "SELECT * FROM staff WHERE id = ? AND role IN ('admin', 'staff', 'librarian')",
      [id]
    );

    if (existingStaff.length === 0) {
      return res
        .status(404)
        .json({ error: { message: "Staff member not found" } });
    }

    await pool.query("UPDATE staff SET name = ?, email = ?, phone = ?, role = ?, position = ?, department = ?, imagefilepath = ?, bio = ? WHERE id = ?", [
      name, email, phone, role || existingStaff[0].role, position, department, imagefilepath, bio, id
    ]);

    const [updatedStaff] = await pool.query(
      "SELECT id, name, email, role, created_at FROM staff WHERE id = ?",
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
    const [existingStaff] = await pool.query(
      "SELECT * FROM staff WHERE id = ? AND role IN ('admin', 'staff', 'librarian')",
      [id]
    );

    if (existingStaff.length === 0) {
      return res
        .status(404)
        .json({ error: { message: "Staff member not found" } });
    }

    await pool.query("DELETE FROM staff WHERE id = ?", [id]);

    res.json({ data: { success: true } });
  } catch (error) {
    res.status(500).json({ error: { message: "Error deleting staff member" } });
  }
});

module.exports = router;
