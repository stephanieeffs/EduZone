const bcrypt = require("bcryptjs");
const mysql = require("mysql2/promise");
require("dotenv").config();

async function createDemoUsers() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  const demoUsers = [
    {
      name: "Teacher User",
      email: "teacher@eduzone.com",
      password: "teacher123",
      role: "teacher",
    },
    {
      name: "Parent User",
      email: "parent@eduzone.com",
      password: "parent123",
      role: "parent",
    },
    {
      name: "Librarian User",
      email: "librarian@eduzone.com",
      password: "librarian123",
      role: "librarian",
    },
  ];

  try {
    for (const user of demoUsers) {
      // Hash the password
      const hashedPassword = await bcrypt.hash(user.password, 10);

      // Check if user already exists
      const [existingUsers] = await connection.query(
        "SELECT * FROM users WHERE email = ?",
        [user.email]
      );

      if (existingUsers.length === 0) {
        // Create user if they don't exist
        await connection.query(
          "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
          [user.name, user.email, hashedPassword, user.role]
        );
        console.log(`Created ${user.role} user: ${user.email}`);
      } else {
        console.log(`User ${user.email} already exists`);
      }
    }

    console.log("Demo users created successfully!");
  } catch (error) {
    console.error("Error creating demo users:", error);
  } finally {
    await connection.end();
  }
}

createDemoUsers();
