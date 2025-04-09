const mysql = require("mysql2/promise");
const fs = require("fs").promises;
const path = require("path");
require("dotenv").config();

async function initializeDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    // Read and execute the SQL script
    const sqlScript = await fs.readFile(
      path.join(__dirname, "init.sql"),
      "utf8"
    );

    // Split the script into individual statements
    const statements = sqlScript
      .split(";")
      .filter((statement) => statement.trim());

    // Execute each statement
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await connection.query(statement);
        } catch (error) {
          // If it's a duplicate entry error, log it but continue
          if (error.code === "ER_DUP_ENTRY") {
            console.log(`Skipping duplicate entry: ${error.sqlMessage}`);
          } else {
            throw error;
          }
        }
      }
    }

    console.log("Database initialized successfully!");
  } catch (error) {
    console.error("Error initializing database:", error);
  } finally {
    await connection.end();
  }
}

initializeDatabase();
