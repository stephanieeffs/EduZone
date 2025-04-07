const express = require("express");
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

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Define route handlers
const feedbackRoutes = require("./routes/feedback");
const formsRoutes = require("./routes/forms");
const calendarRoutes = require("./routes/calendar");
const teachersRoutes = require("./routes/teachers");
const booksRoutes = require("./routes/books");
const authRoutes = require("./routes/auth");
const staffRoutes = require("./routes/staff");

// Apply routes
app.use("/api/feedback", feedbackRoutes);
app.use("/api/forms", formsRoutes);
app.use("/api/calendar", calendarRoutes);
app.use("/api/teachers", teachersRoutes);
app.use("/api/books", booksRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/staff", staffRoutes);

// API root endpoint - list available endpoints
app.get("/api", (req, res) => {
  res.json({
    message: "EduZone API",
    version: "1.0.0",
    endpoints: [
      {
        path: "/api/auth",
        methods: ["POST /login", "POST /register", "GET /me"],
      },
      {
        path: "/api/books",
        methods: [
          "GET",
          "POST",
          "PUT /:id",
          "DELETE /:id",
          "POST /:id/checkout",
          "POST /:id/return",
        ],
      },
      {
        path: "/api/calendar",
        methods: ["GET", "POST", "PUT /:id", "DELETE /:id"],
      },
      {
        path: "/api/feedback",
        methods: ["GET", "POST", "GET /:id", "DELETE /:id"],
      },
      {
        path: "/api/forms",
        methods: ["GET", "POST", "PUT /:id", "DELETE /:id"],
      },
      {
        path: "/api/staff",
        methods: ["GET", "POST", "GET /:id", "PUT /:id", "DELETE /:id"],
      },
      {
        path: "/api/teachers",
        methods: ["GET", "POST", "PUT /:id", "DELETE /:id"],
      },
    ],
    status: "Using mock data - database connection not required",
  });
});

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
      path: req.originalUrl,
    },
  });
});

const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API is available at http://localhost:${PORT}/api`);
  console.log("Available endpoints:");
  console.log("  GET    /api");
  console.log("  POST   /api/auth/login");
  console.log("  POST   /api/auth/register");
  console.log("  GET    /api/auth/me");
  console.log("  GET    /api/books");
  console.log("  POST   /api/books");
  console.log("  GET    /api/books/:id");
  console.log("  PUT    /api/books/:id");
  console.log("  DELETE /api/books/:id");
  console.log("  POST   /api/books/:id/checkout");
  console.log("  POST   /api/books/:id/return");
  console.log("  GET    /api/staff");
  console.log("  POST   /api/staff");
  console.log("  GET    /api/staff/:id");
  console.log("  PUT    /api/staff/:id");
  console.log("  DELETE /api/staff/:id");
  console.log(
    "Using mock data for all routes - no database connection required"
  );
});
