const express = require("express");
const router = express.Router();
const pool = require("../config/database");

// Get all books
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM books ORDER BY title ASC");
    res.json({ data: rows });
  } catch (error) {
    res.status(500).json({ error: { message: "Error fetching books" } });
  }
});

// Create book
// Create book
router.post("/", async (req, res) => {
  const { title, author, isbn, category, quantity } = req.body;
  
  // Validate that isbn is provided
  if (!isbn || isbn.trim() === "") {
    return res.status(400).json({ error: { message: "ISBN is required" } });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO books (title, author, isbn, category, quantity, available) VALUES (?, ?, ?, ?, ?, ?)",
      [title, author, isbn, category, quantity, quantity]
    );
    const [newBook] = await pool.query("SELECT * FROM books WHERE id = ?", [
      result.insertId,
    ]);
    res.json({ data: newBook[0] });
  } catch (error) {
    res.status(500).json({ error: { message: "Error creating book" } });
  }
});


// Update book
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, author, isbn, category, quantity, available } = req.body;
  try {
    await pool.query(
      "UPDATE books SET title = ?, author = ?, isbn = ?, category = ?, quantity = ?, available = ? WHERE id = ?",
      [title, author, isbn, category, quantity, available, id]
    );
    const [updatedBook] = await pool.query("SELECT * FROM books WHERE id = ?", [
      id,
    ]);
    res.json({ data: updatedBook[0] });
  } catch (error) {
    res.status(500).json({ error: { message: "Error updating book" } });
  }
});

// Delete book
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM books WHERE id = ?", [id]);
    res.json({ data: { success: true } });
  } catch (error) {
    res.status(500).json({ error: { message: "Error deleting book" } });
  }
});

// Checkout book
router.post("/:id/checkout", async (req, res) => {
  const { id } = req.params;
  try {
    // First check if the book exists and is available
    const [book] = await pool.query("SELECT * FROM books WHERE id = ?", [id]);
    if (!book[0]) {
      return res.status(404).json({ error: { message: "Book not found" } });
    }
    if (book[0].available <= 0) {
      return res
        .status(400)
        .json({ error: { message: "Book is not available" } });
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
    res.status(500).json({ error: { message: "Error checking out book" } });
  }
});

// Return book
router.post("/:id/return", async (req, res) => {
  const { id } = req.params;
  try {
    // First check if the book exists
    const [book] = await pool.query("SELECT * FROM books WHERE id = ?", [id]);
    if (!book[0]) {
      return res.status(404).json({ error: { message: "Book not found" } });
    }
    if (book[0].available >= book[0].quantity) {
      return res
        .status(400)
        .json({ error: { message: "Book is already fully returned" } });
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
    res.status(500).json({ error: { message: "Error returning book" } });
  }
});

module.exports = router;
