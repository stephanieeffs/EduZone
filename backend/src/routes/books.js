const express = require("express");
const router = express.Router();
const pool = require("../config/database");
const mockData = require("../config/mockData");

/**
 * Get all books
 * Returns a list of all books in the library
 */
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM books ORDER BY title ASC");
    res.json({ data: rows });
  } catch (error) {
    console.error("Error fetching books:", error);
    // Fallback to mock data if DB query fails
    res.json({
      data: mockData.books,
      message: "Error connecting to database, using mock data",
    });
  }
});

/**
 * Get a book by ID
 * Returns a single book by its ID
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query("SELECT * FROM books WHERE id = ?", [id]);

    if (rows.length === 0) {
      // Try to find in mock data
      const mockBook = mockData.books.find((b) => b.id === parseInt(id));
      if (mockBook) {
        return res.json({
          data: mockBook,
          message: "Using mock data",
        });
      }

      return res.status(404).json({ error: { message: "Book not found" } });
    }

    res.json({ data: rows[0] });
  } catch (error) {
    console.error("Error fetching book:", error);

    // Try to find in mock data
    const mockBook = mockData.books.find((b) => b.id === parseInt(id));
    if (mockBook) {
      return res.json({
        data: mockBook,
        message: "Error connecting to database, using mock data",
      });
    }

    res.status(500).json({ error: { message: "Error fetching book" } });
  }
});

/**
 * Create a new book
 * Adds a new book to the library
 */
router.post("/", async (req, res) => {
  const { title, author, isbn, category, quantity } = req.body;

  // Validate required fields
  if (!title || !author || !category || !quantity) {
    return res.status(400).json({
      error: { message: "Required fields: title, author, category, quantity" },
    });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO books (title, author, isbn, category, quantity, available) VALUES (?, ?, ?, ?, ?, ?)",
      [title, author, isbn || "", category, quantity, quantity]
    );

    const [newBook] = await pool.query("SELECT * FROM books WHERE id = ?", [
      result.insertId,
    ]);

    res.status(201).json({ data: newBook[0] });
  } catch (error) {
    console.error("Error creating book:", error);

    // Create a mock book
    const newId =
      mockData.books.length > 0
        ? Math.max(...mockData.books.map((b) => b.id)) + 1
        : 1;

    const newBook = {
      id: newId,
      title,
      author,
      isbn: isbn || "",
      category,
      quantity: parseInt(quantity),
      available: parseInt(quantity),
      created_at: new Date().toISOString(),
    };

    // Add to mock data
    mockData.books.push(newBook);

    res.status(201).json({
      data: newBook,
      message: "Error connecting to database, created mock book",
    });
  }
});

/**
 * Update an existing book
 * Updates book information by ID
 */
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, author, isbn, category, quantity, available } = req.body;

  // Validate required fields
  if (!title || !author || !category || !quantity) {
    return res.status(400).json({
      error: { message: "Required fields: title, author, category, quantity" },
    });
  }

  try {
    await pool.query(
      "UPDATE books SET title = ?, author = ?, isbn = ?, category = ?, quantity = ?, available = ? WHERE id = ?",
      [title, author, isbn || "", category, quantity, available || quantity, id]
    );

    const [updatedBook] = await pool.query("SELECT * FROM books WHERE id = ?", [
      id,
    ]);

    if (!updatedBook[0]) {
      // Try to find in mock data
      const bookIndex = mockData.books.findIndex((b) => b.id === parseInt(id));

      if (bookIndex !== -1) {
        // Update mock data
        mockData.books[bookIndex] = {
          ...mockData.books[bookIndex],
          title,
          author,
          isbn: isbn || "",
          category,
          quantity: parseInt(quantity),
          available: parseInt(available || quantity),
        };

        return res.json({
          data: mockData.books[bookIndex],
          message: "Updated mock book",
        });
      }

      return res.status(404).json({ error: { message: "Book not found" } });
    }

    res.json({ data: updatedBook[0] });
  } catch (error) {
    console.error("Error updating book:", error);

    // Try to find in mock data
    const bookIndex = mockData.books.findIndex((b) => b.id === parseInt(id));

    if (bookIndex !== -1) {
      // Update mock data
      mockData.books[bookIndex] = {
        ...mockData.books[bookIndex],
        title,
        author,
        isbn: isbn || "",
        category,
        quantity: parseInt(quantity),
        available: parseInt(available || quantity),
      };

      return res.json({
        data: mockData.books[bookIndex],
        message: "Error connecting to database, updated mock book",
      });
    }

    res.status(500).json({ error: { message: "Error updating book" } });
  }
});

/**
 * Delete a book
 * Removes a book from the library by ID
 */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [checkBook] = await pool.query("SELECT * FROM books WHERE id = ?", [
      id,
    ]);

    if (checkBook.length === 0) {
      // Try to find in mock data
      const bookIndex = mockData.books.findIndex((b) => b.id === parseInt(id));

      if (bookIndex !== -1) {
        // Remove from mock data
        mockData.books.splice(bookIndex, 1);
        return res.json({
          data: { success: true },
          message: "Deleted mock book",
        });
      }

      return res.status(404).json({ error: { message: "Book not found" } });
    }

    await pool.query("DELETE FROM books WHERE id = ?", [id]);
    res.json({ data: { success: true } });
  } catch (error) {
    console.error("Error deleting book:", error);

    // Try to find in mock data
    const bookIndex = mockData.books.findIndex((b) => b.id === parseInt(id));

    if (bookIndex !== -1) {
      // Remove from mock data
      mockData.books.splice(bookIndex, 1);
      return res.json({
        data: { success: true },
        message: "Error connecting to database, deleted mock book",
      });
    }

    res.status(500).json({ error: { message: "Error deleting book" } });
  }
});

/**
 * Checkout a book
 * Decreases the available count of a book
 */
router.post("/:id/checkout", async (req, res) => {
  const { id } = req.params;
  try {
    // First check if the book exists and is available
    const [book] = await pool.query("SELECT * FROM books WHERE id = ?", [id]);

    if (!book[0]) {
      // Try to find in mock data
      const bookIndex = mockData.books.findIndex((b) => b.id === parseInt(id));

      if (bookIndex !== -1) {
        const mockBook = mockData.books[bookIndex];

        // Check if book is available
        if (mockBook.available <= 0) {
          return res.status(400).json({
            error: { message: "Book is not available" },
          });
        }

        // Update mock data
        mockData.books[bookIndex] = {
          ...mockBook,
          available: mockBook.available - 1,
        };

        return res.json({
          data: mockData.books[bookIndex],
          message: "Checked out mock book",
        });
      }

      return res.status(404).json({ error: { message: "Book not found" } });
    }

    if (book[0].available <= 0) {
      return res.status(400).json({
        error: { message: "Book is not available" },
      });
    }

    // Update the book's available count
    await pool.query(
      "UPDATE books SET available = available - 1 WHERE id = ?",
      [id]
    );

    // Get the updated book
    const [updatedBook] = await pool.query("SELECT * FROM books WHERE id = ?", [
      id,
    ]);

    res.json({ data: updatedBook[0] });
  } catch (error) {
    console.error("Error checking out book:", error);

    // Try to find in mock data
    const bookIndex = mockData.books.findIndex((b) => b.id === parseInt(id));

    if (bookIndex !== -1) {
      const mockBook = mockData.books[bookIndex];

      // Check if book is available
      if (mockBook.available <= 0) {
        return res.status(400).json({
          error: { message: "Book is not available" },
        });
      }

      // Update mock data
      mockData.books[bookIndex] = {
        ...mockBook,
        available: mockBook.available - 1,
      };

      return res.json({
        data: mockData.books[bookIndex],
        message: "Error connecting to database, checked out mock book",
      });
    }

    res.status(500).json({ error: { message: "Error checking out book" } });
  }
});

/**
 * Return a book
 * Increases the available count of a book
 */
router.post("/:id/return", async (req, res) => {
  const { id } = req.params;
  try {
    // First check if the book exists
    const [book] = await pool.query("SELECT * FROM books WHERE id = ?", [id]);

    if (!book[0]) {
      // Try to find in mock data
      const bookIndex = mockData.books.findIndex((b) => b.id === parseInt(id));

      if (bookIndex !== -1) {
        const mockBook = mockData.books[bookIndex];

        // Check if book can be returned
        if (mockBook.available >= mockBook.quantity) {
          return res.status(400).json({
            error: { message: "Book is already fully returned" },
          });
        }

        // Update mock data
        mockData.books[bookIndex] = {
          ...mockBook,
          available: mockBook.available + 1,
        };

        return res.json({
          data: mockData.books[bookIndex],
          message: "Returned mock book",
        });
      }

      return res.status(404).json({ error: { message: "Book not found" } });
    }

    if (book[0].available >= book[0].quantity) {
      return res.status(400).json({
        error: { message: "Book is already fully returned" },
      });
    }

    // Update the book's available count
    await pool.query(
      "UPDATE books SET available = available + 1 WHERE id = ?",
      [id]
    );

    // Get the updated book
    const [updatedBook] = await pool.query("SELECT * FROM books WHERE id = ?", [
      id,
    ]);

    res.json({ data: updatedBook[0] });
  } catch (error) {
    console.error("Error returning book:", error);

    // Try to find in mock data
    const bookIndex = mockData.books.findIndex((b) => b.id === parseInt(id));

    if (bookIndex !== -1) {
      const mockBook = mockData.books[bookIndex];

      // Check if book can be returned
      if (mockBook.available >= mockBook.quantity) {
        return res.status(400).json({
          error: { message: "Book is already fully returned" },
        });
      }

      // Update mock data
      mockData.books[bookIndex] = {
        ...mockBook,
        available: mockBook.available + 1,
      };

      return res.json({
        data: mockData.books[bookIndex],
        message: "Error connecting to database, returned mock book",
      });
    }

    res.status(500).json({ error: { message: "Error returning book" } });
  }
});

module.exports = router;
