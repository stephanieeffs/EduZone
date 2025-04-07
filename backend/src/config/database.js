const mysql = require("mysql2/promise");
require("dotenv").config();
const mockData = require("./mockData");

// Always use mock data by default, especially for demo purposes
let useMockData = true;

// Attempt to create a MySQL connection pool
let pool;

try {
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  // Test connection immediately
  (async () => {
    try {
      const connection = await pool.getConnection();
      console.log("Database connected successfully");
      connection.release();
      // Even with successful connection, keep using mock data for demo
      console.log("Using mock data for consistency in demo environment");
    } catch (error) {
      console.error(
        "Database connection failed, using mock data:",
        error.message
      );
      // Already using mock data, this is just for logging
    }
  })();
} catch (error) {
  console.error(
    "Failed to create database pool, using mock data:",
    error.message
  );
  // Already using mock data, this is just for logging
}

// Create a mock pool interface that mimics the MySQL pool
const mockPool = {
  async query(sql, params) {
    // Log queries to help with debugging
    console.log(`Mock DB Query: ${sql}`, params || "");

    // Extract table name from the SQL query
    const getTable = (sql) => {
      if (sql.includes("FROM teachers")) return "teachers";
      if (sql.includes("FROM books")) return "books";
      if (sql.includes("FROM users") && sql.includes("role = 'teacher'"))
        return "staff";
      if (sql.includes("FROM users")) return "users";
      if (sql.includes("FROM forms")) return "forms";
      if (sql.includes("FROM calendar_events")) return "calendarEvents";
      if (sql.includes("FROM feedback")) return "feedback";
      return null;
    };

    const table = getTable(sql);

    // Handle special cases for book checkout/return
    if (
      sql.includes("UPDATE books SET available = available - 1") &&
      params &&
      params.length > 0
    ) {
      const id = parseInt(params[0]);
      const bookIndex = mockData.books.findIndex((book) => book.id === id);

      if (bookIndex !== -1) {
        const book = mockData.books[bookIndex];
        if (book.available > 0) {
          mockData.books[bookIndex].available -= 1;
          return [{ affectedRows: 1 }];
        }
      }
    }

    if (
      sql.includes("UPDATE books SET available = available + 1") &&
      params &&
      params.length > 0
    ) {
      const id = parseInt(params[0]);
      const bookIndex = mockData.books.findIndex((book) => book.id === id);

      if (bookIndex !== -1) {
        const book = mockData.books[bookIndex];
        if (book.available < book.quantity) {
          mockData.books[bookIndex].available += 1;
          return [{ affectedRows: 1 }];
        }
      }
    }

    // Handle authentication queries specially
    if (
      sql.includes("FROM users WHERE email = ?") &&
      params &&
      params.length > 0
    ) {
      const email = params[0];
      // Hard-coded admin user for demo purposes
      if (email === "admin@eduzone.com") {
        return [
          [
            {
              id: 1,
              name: "Admin User",
              email: "admin@eduzone.com",
              password:
                "$2a$10$FEKaXoMyd6FWe/JzH5rB1OouR.DplVnpCR.G0LFM.uJQ6bnpu0qOq", // 'password123'
              role: "admin",
              created_at: new Date().toISOString(),
            },
          ],
        ];
      }
      // Check if any user has this email
      const user = mockData.staff.find((s) => s.email === email);
      if (user) {
        return [
          [
            {
              id: user.id,
              name: user.name,
              email: user.email,
              password:
                "$2a$10$FEKaXoMyd6FWe/JzH5rB1OouR.DplVnpCR.G0LFM.uJQ6bnpu0qOq", // 'password123'
              role: user.role,
              created_at: user.created_at,
            },
          ],
        ];
      }
      // No user found
      return [[]];
    }

    // Handle SELECT queries
    if (sql.startsWith("SELECT") && table) {
      if (sql.includes("WHERE id = ?") && params && params.length > 0) {
        const id = parseInt(params[0]);
        const result = mockData[table].find((item) => item.id === id) || null;
        return [[result]];
      } else {
        return [mockData[table]];
      }
    }

    // Handle INSERT queries
    if (sql.startsWith("INSERT INTO")) {
      const newId =
        mockData[table]?.length > 0
          ? Math.max(...mockData[table].map((item) => item.id)) + 1
          : 1;

      // Handle special case for adding a book
      if (table === "books" && params && params.length >= 6) {
        const [title, author, isbn, category, quantity, available] = params;
        const newBook = {
          id: newId,
          title,
          author,
          isbn: isbn || "",
          category,
          quantity: parseInt(quantity),
          available: parseInt(available),
          created_at: new Date().toISOString(),
        };

        mockData.books.push(newBook);
      }

      // Handle special case for adding a staff member
      if (table === "staff" && params && params.length >= 3) {
        const [name, email, password] = params;
        const newStaff = {
          id: newId,
          name,
          email,
          role: "teacher",
          created_at: new Date().toISOString(),
        };

        mockData.staff.push(newStaff);
      }

      return [{ insertId: newId }];
    }

    // Handle UPDATE queries
    if (sql.startsWith("UPDATE")) {
      // For update queries with WHERE id = ?
      if (sql.includes("WHERE id = ?") && params && params.length > 0) {
        const id = parseInt(params[params.length - 1]);

        // Handle special case for updating a book
        if (table === "books" && params && params.length >= 7) {
          const [title, author, isbn, category, quantity, available] = params;
          const bookIndex = mockData.books.findIndex((book) => book.id === id);

          if (bookIndex !== -1) {
            mockData.books[bookIndex] = {
              ...mockData.books[bookIndex],
              title,
              author,
              isbn: isbn || "",
              category,
              quantity: parseInt(quantity),
              available: parseInt(available),
            };
          }
        }

        // Handle special case for updating a staff member
        if (table === "staff" && params && params.length >= 3) {
          const [name, email] = params;
          const staffIndex = mockData.staff.findIndex(
            (staff) => staff.id === id
          );

          if (staffIndex !== -1) {
            mockData.staff[staffIndex] = {
              ...mockData.staff[staffIndex],
              name,
              email,
            };
          }
        }
      }

      return [{ affectedRows: 1 }];
    }

    // Handle DELETE queries
    if (sql.startsWith("DELETE")) {
      if (sql.includes("WHERE id = ?") && params && params.length > 0) {
        const id = parseInt(params[0]);

        if (table === "books") {
          const bookIndex = mockData.books.findIndex((book) => book.id === id);
          if (bookIndex !== -1) {
            mockData.books.splice(bookIndex, 1);
          }
        }

        if (table === "staff") {
          const staffIndex = mockData.staff.findIndex(
            (staff) => staff.id === id
          );
          if (staffIndex !== -1) {
            mockData.staff.splice(staffIndex, 1);
          }
        }
      }

      return [{ affectedRows: 1 }];
    }

    // Default response
    return [[]];
  },

  async getConnection() {
    return {
      release: () => {},
      query: this.query,
    };
  },
};

// Always export mockPool for consistency in demo
module.exports = mockPool;
