const express = require("express");
const router = express.Router();
const pool = require("../config/database");
const mockData = require("../config/mockData");

/**
 * Get all staff members
 * Returns a list of all teaching staff
 */
router.get("/", async (req, res) => {
  console.log("GET /api/staff - Fetching all staff members");
  try {
    // First try to get staff from users table with role 'teacher'
    const [rows] = await pool.query(
      "SELECT id, name, email, role, created_at FROM users WHERE role = 'teacher'"
    );

    if (rows.length === 0) {
      console.log("No staff found in database, returning mock data");

      // Transform mock data to include all required fields for frontend
      const enhancedMockData = mockData.staff.map((staff) => {
        const department =
          staff.role === "teacher" ? "Teaching" : "Administration";
        const position =
          staff.role === "teacher"
            ? "Teacher"
            : staff.role.charAt(0).toUpperCase() + staff.role.slice(1);

        return {
          id: staff.id,
          name: staff.name,
          email: staff.email,
          role: staff.role,
          position,
          department,
          phone: "(555) 123-4567",
          image: "/images/school-logo.png",
          bio: `${staff.name} is a dedicated member of our staff.`,
          created_at: staff.created_at,
        };
      });

      console.log(`Returning ${enhancedMockData.length} mock staff members`);

      // Use a consistent data structure
      return res.json({
        data: enhancedMockData,
      });
    }

    // Transform database results to match frontend expectations
    const enhancedRows = rows.map((staff) => {
      const department =
        staff.role === "teacher" ? "Teaching" : "Administration";
      const position =
        staff.role === "teacher"
          ? "Teacher"
          : staff.role.charAt(0).toUpperCase() + staff.role.slice(1);

      return {
        id: staff.id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
        position,
        department,
        phone: "(555) 123-4567",
        image: "/images/school-logo.png",
        bio: `${staff.name} is a dedicated member of our staff.`,
        created_at: staff.created_at,
      };
    });

    console.log(`Returning ${enhancedRows.length} staff members from database`);

    // Use a consistent data structure
    res.json({
      data: enhancedRows,
    });
  } catch (error) {
    console.error("Error fetching staff:", error);

    // Transform mock data to include all required fields for frontend
    const enhancedMockData = mockData.staff.map((staff) => {
      const department =
        staff.role === "teacher" ? "Teaching" : "Administration";
      const position =
        staff.role === "teacher"
          ? "Teacher"
          : staff.role.charAt(0).toUpperCase() + staff.role.slice(1);

      return {
        id: staff.id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
        position,
        department,
        phone: "(555) 123-4567",
        image: "/images/school-logo.png",
        bio: `${staff.name} is a dedicated member of our staff.`,
        created_at: staff.created_at,
      };
    });

    console.log(
      `Error connecting to database, returning ${enhancedMockData.length} mock staff members`
    );

    // Use a consistent data structure
    res.json({
      data: enhancedMockData,
      message: "Error connecting to database, using enhanced mock data",
    });
  }
});

/**
 * Get staff member by ID
 * Returns a single staff member by their ID
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT id, name, email, role, created_at FROM users WHERE id = ? AND role = 'teacher'",
      [id]
    );

    if (rows.length === 0) {
      // Try to find in mock data
      const mockStaff = mockData.staff.find((s) => s.id === parseInt(id));
      if (mockStaff) {
        return res.json({
          data: mockStaff,
          message: "Using mock data",
        });
      }

      return res
        .status(404)
        .json({ error: { message: "Staff member not found" } });
    }

    res.json({ data: rows[0] });
  } catch (error) {
    console.error("Error fetching staff member:", error);
    // Try to find in mock data
    const mockStaff = mockData.staff.find((s) => s.id === parseInt(id));
    if (mockStaff) {
      return res.json({
        data: mockStaff,
        message: "Error connecting to database, using mock data",
      });
    }

    res.status(500).json({ error: { message: "Error fetching staff member" } });
  }
});

/**
 * Create staff member
 * Adds a new staff member to the system
 */
router.post("/", async (req, res) => {
  const { name, email, password, subject } = req.body;

  // Validate required fields
  if (!name || !email) {
    return res.status(400).json({
      error: { message: "Required fields: name, email" },
    });
  }

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
      [name, email, password || "defaultpassword"]
    );

    // Get the created user
    const [newStaff] = await pool.query(
      "SELECT id, name, email, role, created_at FROM users WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json({ data: newStaff[0] });
  } catch (error) {
    console.error("Error creating staff member:", error);

    // Create a mock staff member
    const newId =
      mockData.staff.length > 0
        ? Math.max(...mockData.staff.map((s) => s.id)) + 1
        : 1;

    const newStaff = {
      id: newId,
      name,
      email,
      role: "teacher",
      created_at: new Date().toISOString(),
    };

    // Add to mock data
    mockData.staff.push(newStaff);

    res.status(201).json({
      data: newStaff,
      message: "Error connecting to database, created mock staff member",
    });
  }
});

/**
 * Update staff member
 * Updates information for an existing staff member
 */
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  // Validate required fields
  if (!name || !email) {
    return res.status(400).json({
      error: { message: "Required fields: name, email" },
    });
  }

  try {
    // Check if staff member exists
    const [existingStaff] = await pool.query(
      "SELECT * FROM users WHERE id = ? AND role = 'teacher'",
      [id]
    );

    if (existingStaff.length === 0) {
      // Try to find in mock data
      const staffIndex = mockData.staff.findIndex((s) => s.id === parseInt(id));

      if (staffIndex !== -1) {
        // Update mock data
        mockData.staff[staffIndex] = {
          ...mockData.staff[staffIndex],
          name,
          email,
        };

        return res.json({
          data: mockData.staff[staffIndex],
          message: "Updated mock staff member",
        });
      }

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
    console.error("Error updating staff member:", error);

    // Try to find in mock data
    const staffIndex = mockData.staff.findIndex((s) => s.id === parseInt(id));

    if (staffIndex !== -1) {
      // Update mock data
      mockData.staff[staffIndex] = {
        ...mockData.staff[staffIndex],
        name,
        email,
      };

      return res.json({
        data: mockData.staff[staffIndex],
        message: "Error connecting to database, updated mock staff member",
      });
    }

    res.status(500).json({ error: { message: "Error updating staff member" } });
  }
});

/**
 * Delete staff member
 * Removes a staff member from the system
 */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // Check if staff member exists
    const [existingStaff] = await pool.query(
      "SELECT * FROM users WHERE id = ? AND role = 'teacher'",
      [id]
    );

    if (existingStaff.length === 0) {
      // Try to find in mock data
      const staffIndex = mockData.staff.findIndex((s) => s.id === parseInt(id));

      if (staffIndex !== -1) {
        // Remove from mock data
        mockData.staff.splice(staffIndex, 1);
        return res.json({
          data: { success: true },
          message: "Deleted mock staff member",
        });
      }

      return res
        .status(404)
        .json({ error: { message: "Staff member not found" } });
    }

    // Delete user
    await pool.query("DELETE FROM users WHERE id = ?", [id]);

    res.json({ data: { success: true } });
  } catch (error) {
    console.error("Error deleting staff member:", error);

    // Try to find in mock data
    const staffIndex = mockData.staff.findIndex((s) => s.id === parseInt(id));

    if (staffIndex !== -1) {
      // Remove from mock data
      mockData.staff.splice(staffIndex, 1);
      return res.json({
        data: { success: true },
        message: "Error connecting to database, deleted mock staff member",
      });
    }

    res.status(500).json({ error: { message: "Error deleting staff member" } });
  }
});

module.exports = router;
