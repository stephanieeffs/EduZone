const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/database");

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: { message: "No token provided" } });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: { message: "Invalid token" } });
  }
};

// Get current user
router.get("/me", verifyToken, async (req, res) => {
  try {
    const [users] = await pool.query(
      "SELECT id, name, email, role FROM users WHERE id = ?",
      [req.user.id]
    );
    if (users.length === 0) {
      return res.status(404).json({ error: { message: "User not found" } });
    }
    res.json({ data: users[0] });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: { message: "Error fetching user" } });
  }
});

// Register user
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    // Check if user already exists
    const [existingUsers] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (existingUsers.length > 0) {
      return res
        .status(400)
        .json({ error: { message: "User already exists" } });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role]
    );

    // Create token
    const token = jwt.sign(
      { id: result.insertId, email, role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      data: {
        token,
        user: {
          id: result.insertId,
          name,
          email,
          role,
        },
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: { message: "Error registering user" } });
  }
});

// Login user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Get user
    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (users.length === 0) {
      return res
        .status(401)
        .json({ error: { message: "Invalid credentials" } });
    }

    const user = users[0];

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res
        .status(401)
        .json({ error: { message: "Invalid credentials" } });
    }

    // Create token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: { message: "Error logging in" } });
  }
});

module.exports = router;
