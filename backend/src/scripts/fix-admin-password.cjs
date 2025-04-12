const bcrypt = require("bcryptjs");
const pool = require("../config/database"); // ✅ Use the working connection

async function fixAdminPassword() {
  const connection = await pool.getConnection(); // ✅ pull from working pool

  try {
    const password = "admin123";
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    console.log(`Password: ${password}`);
    console.log(`Generated hash: ${hash}`);

    const [users] = await connection.query(
      "SELECT * FROM users WHERE email = ?",
      ["admin@eduzone.com"]
    );

    if (users.length === 0) {
      await connection.query(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        ["Admin User", "admin@eduzone.com", hash, "admin"]
      );
      console.log("✅ Admin user created successfully!");
    } else {
      await connection.query("UPDATE users SET password = ? WHERE email = ?", [
        hash,
        "admin@eduzone.com",
      ]);
      console.log("✅ Admin user password updated successfully!");
    }

    const [updatedUsers] = await connection.query(
      "SELECT * FROM users WHERE email = ?",
      ["admin@eduzone.com"]
    );

    if (updatedUsers.length > 0) {
      const isValid = await bcrypt.compare(password, updatedUsers[0].password);
      console.log(`🔐 Password verification: ${isValid ? "SUCCESS" : "FAILED"}`);
    }
  } catch (error) {
    console.error("❌ Error fixing admin password:", error);
  } finally {
    connection.release(); // release back to pool
  }
}

fixAdminPassword();
