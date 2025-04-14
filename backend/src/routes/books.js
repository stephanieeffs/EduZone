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

// Get book by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [book] = await pool.query("SELECT * FROM books WHERE id = ?", [id]);

    if (book.length === 0) {
      return res.status(404).json({ error: { message: "Book not found" } });
    }
    res.json({ data: book[0] });
  } catch (error) {
    console.error("Error fetching book:", error);
    res.status(500).json({ error: { message: "Error fetching book" } });
  }
});

router.get("/grade/:grade", async (req, res) => {
  const { grade } = req.params;
  try {
    const [books] = await pool.query("SELECT * FROM books WHERE grade = ?", [grade]);

    if (books.length === 0) {
      return res.status(404).json({ error: { message: "No books found for the specified grade" } });
    }

    // Return all books for the specified grade
    res.json({ data: books });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ error: { message: "Error fetching books" } });
  }
});

router.get("/title/:title", async (req, res) => {
  const { title } = req.params;  
  try {
    const [books] = await pool.query("SELECT * FROM books WHERE title = ?", [title]);

    if (books.length === 0) {
      return res.status(404).json({ error: { message: "No books found with the specified title" } });
    }

    
    res.json({ data: books });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ error: { message: "Error fetching books" } });
  }
});



// Create book
router.post("/", async (req, res) => {
  const { title, author, isbn, category, quantity } = req.body;
  
  // Validate that isbn is provided
  if (!isbn || isbn.trim() === "") {
    return res.status(400).json({ error: { message: "ISBN is required" } });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO books (title, author, category, quantity, available, grade ) VALUES (?, ?, ?, ?, ?, ?, )",
      [title, author, category, quantity, quantity]
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
  const { title, author, category, quantity, available } = req.body;
  try {
    await pool.query(
      "UPDATE books SET title = ?, author = ?, category = ?, quantity = ?, available = ?, grade = ?, WHERE id = ?",
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
