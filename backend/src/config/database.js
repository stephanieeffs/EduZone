const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false, // ✅ Required for MySQL 8.4 auth to work
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;


pool.getConnection()
  .then(() => {
    console.log("✅ Connected to database successfully!");
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
  });


module.exports = pool;
