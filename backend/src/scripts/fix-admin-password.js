const bcrypt = require("bcryptjs");
const mysql = require("mysql2/promise");
require("dotenv").config();

async function fixAdminPassword() {
  // Create a connection to the database
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    // Generate a proper hash for the password "admin123"
    const password = "admin123";
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    console.log(`Password: ${password}`);
    console.log(`Generated hash: ${hash}`);

    // First, check if the admin user exists
    const [users] = await connection.query(
      "SELECT * FROM users WHERE email = ?",
      ["admin@eduzone.com"]
    );

    if (users.length === 0) {
      // Create the admin user if it doesn't exist
      await connection.query(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        ["Admin User", "admin@eduzone.com", hash, "admin"]
      );
      console.log("Admin user created successfully!");
    } else {
      // Update the admin user's password
      await connection.query("UPDATE users SET password = ? WHERE email = ?", [
        hash,
        "admin@eduzone.com",
      ]);
      console.log("Admin user password updated successfully!");
    }

    // Verify the password works
    const [updatedUsers] = await connection.query(
      "SELECT * FROM users WHERE email = ?",
      ["admin@eduzone.com"]
    );

    if (updatedUsers.length > 0) {
      const isValid = await bcrypt.compare(password, updatedUsers[0].password);
      console.log(`Password verification: ${isValid ? "SUCCESS" : "FAILED"}`);
    }
  } catch (error) {
    console.error("Error fixing admin password:", error);
  } finally {
    await connection.end();
  }
}

fixAdminPassword();
