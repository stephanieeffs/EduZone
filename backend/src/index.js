const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "http://localhost:3000",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api/feedback", require("./routes/feedback"));
app.use("/api/forms", require("./routes/forms"));
app.use("/api/calendar", require("./routes/calendar"));
app.use("/api/teachers", require("./routes/teachers"));
app.use("/api/books", require("./routes/books"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/staff", require("./routes/staff"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal server error",
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      message: "Route not found",
    },
  });
});

const PORT = process.env.PORT || 5000;

// Test database connection before starting server
const pool = require("./config/database");
pool
  .getConnection()
  .then((connection) => {
    console.log("Database connected successfully");
    connection.release();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1);
  });
