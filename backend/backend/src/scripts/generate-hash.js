const bcrypt = require("bcryptjs");
const mysql = require("mysql2/promise");
require("dotenv").config();

async function generateHash() {
  const password = "admin123";
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  console.log(`Password: ${password}`);
  console.log(`Generated hash: ${hash}`);

  // Update the admin user in the database
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    await connection.query("UPDATE users SET password = ? WHERE email = ?", [
      hash,
      "admin@eduzone.com",
    ]);
    console.log("Admin user password updated successfully!");
  } catch (error) {
    console.error("Error updating admin user password:", error);
  } finally {
    await connection.end();
  }
}

generateHash();
