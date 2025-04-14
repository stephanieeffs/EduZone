import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useToast } from "../hooks/use-toast";
import { api } from "../lib/api";
import { useAuth } from "../lib/use-auth";

interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
  grade: number; // Grade as number for proper comparison
  available: number;
  quantity: number;
  lastUpdated?: string;
  notes?: string;
  condition?: "New" | "Good" | "Fair" | "Poor";
}

const Library = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeGrade, setActiveGrade] = useState("All");
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [newBook, setNewBook] = useState<Omit<Book, "id">>({
    title: "",
    author: "",
    category: "Language Arts",
    grade: 1, // Numeric grade
    available: 1,
    quantity: 1,
  });

  const categories = [
    "All",
    "Language Arts",
    "Mathematics",
    "Science",
    "Social Studies",
    "PEP Preparation",
  ];
  const grades = [1, 2, 3, 4, 5, 6]; // Grades from 1 to 6

  // Fetch books from the backend
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/books");
        const data = await res.json();

        if (Array.isArray(data.data)) {
          setBooks(data.data);
          setFilteredBooks(data.data);
        } else {
          toast({
            title: "Error",
            description: "No books found in the backend or invalid response format",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching books:", error);
        toast({
          title: "Error",
          description: "Failed to fetch books. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchBooks();
  }, []);

  // Filter books based on search term, category, and grade
  useEffect(() => {
    let filtered = [...books];

    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchLower) ||
          book.author.toLowerCase().includes(searchLower) ||
          book.category.toLowerCase().includes(searchLower)
      );
    }

    if (activeCategory !== "All") {
      filtered = filtered.filter((book) => book.category === activeCategory);
    }

    if (activeGrade !== "All") {
      // Convert the activeGrade to numeric for comparison
      const numericGrade = parseInt(activeGrade as string, 10);
      filtered = filtered.filter((book) => book.grade === numericGrade);
    }

    setFilteredBooks(filtered);
  }, [books, searchTerm, activeCategory, activeGrade]);

  // Handle checkout of book
  const handleCheckout = async (id: number) => {
    try {
      setIsProcessing(true);

      const bookToUpdate = books.find((book) => book.id === id);
      if (!bookToUpdate) throw new Error("Book not found");

      if (bookToUpdate.available <= 0) throw new Error("Book is not available for checkout");

      const updatedBooks = books.map((book) => {
        if (book.id === id) {
          return { ...book, available: book.available - 1, lastUpdated: new Date().toISOString() };
        }
        return book;
      });

      setBooks(updatedBooks);
      setFilteredBooks(updatedBooks);

      const response = await api.post(`/api/books/${id}/checkout`, {});
      if (response.error) console.warn("Server update failed:", response.error.message);

      toast({ title: "Success", description: "Book checked out successfully" });
    } catch (error) {
      setBooks(books);
      setFilteredBooks(filteredBooks);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to check out book",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle return of book
  const handleReturn = async (id: number) => {
    try {
      setIsProcessing(true);

      const bookToUpdate = books.find((book) => book.id === id);
      if (!bookToUpdate) throw new Error("Book not found");

      if (bookToUpdate.available >= bookToUpdate.quantity) throw new Error("Cannot return more books than total quantity");

      const updatedBooks = books.map((book) => {
        if (book.id === id) {
          return { ...book, available: book.available + 1, lastUpdated: new Date().toISOString(), notes: "Returned" };
        }
        return book;
      });

      setBooks(updatedBooks);
      setFilteredBooks(updatedBooks);

      const response = await api.post(`/api/books/${id}/return`, {});
      if (response.error) console.warn("Server update failed:", response.error.message);

      toast({ title: "Success", description: "Book returned successfully" });
    } catch (error) {
      setBooks(books);
      setFilteredBooks(filteredBooks);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to return book",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle add book modal visibility
  const handleAddBook = () => {
    setShowAddBookModal(true);
  };

  // Handle form submission for adding new book
  const handleSubmitNewBook = async () => {
    try {
      if (!newBook.title || !newBook.author || !newBook.category || !newBook.grade) {
        toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
        return;
      }

      setIsProcessing(true);
      const response = await api.post("/api/books", newBook);
      if (response.error) throw new Error(response.error.message);

      toast({ title: "Success", description: "Book added successfully" });
      setShowAddBookModal(false);

      setNewBook({
        title: "",
        author: "",
        category: "Language Arts",
        grade: 1, // Reset grade to numeric
        available: 1,
        quantity: 1,
      });

      const fetchBooks = async () => {
        try {
          const response = await api.get("/api/books");
          setBooks(response.data as Book[]);
          setFilteredBooks(response.data as Book[]);
        } catch (error) {
          console.error("Error fetching updated books:", error);
        }
      };
      fetchBooks();
    } catch (error) {
      toast({ title: "Error", description: "Failed to add book", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle delete book
  const handleDeleteBook = async (id: number) => {
    try {
      setIsProcessing(true);

      const updatedBooks = books.filter((book) => book.id !== id);
      setBooks(updatedBooks);
      setFilteredBooks(updatedBooks);

      const response = await api.delete(`/api/books/${id}`);
      if (response.error) throw new Error(response.error.message);

      toast({ title: "Success", description: "Book deleted successfully" });
    } catch (error) {
      console.error("Error deleting book:", error);
      setBooks(books);
      setFilteredBooks(filteredBooks);
      toast({ title: "Error", description: "Failed to delete book", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col"
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-blue-800">Frankfield Primary School Library</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="md:col-span-2">
              <Input
                placeholder="Search by title, author, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="scrollable-dropdown">
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="scrollable-dropdown">
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={activeGrade}
                onChange={(e) => setActiveGrade(e.target.value)}
              >
                {grades.map((grade) => (
                  <option key={grade} value={grade}>
                    Grade {grade}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-auto" style={{ maxHeight: "500px", overflowY: "auto" }}>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBooks.map((book) => (
                  <tr key={book.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{book.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{book.author}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{book.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{book.grade}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          book.available > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {book.available > 0 ? `Available (${book.available})` : "Checked Out"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      {book.available > 0 ? (
                        <Button
                          onClick={() => handleCheckout(book.id)}
                          disabled={isProcessing}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm transition-colors duration-200"
                        >
                          Check Out
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleReturn(book.id)}
                          disabled={isProcessing}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md shadow-sm transition-colors duration-200"
                        >
                          Return
                        </Button>
                      )}
                      {(user?.role === "librarian" || user?.role === "admin") && (
                        <>
                          <Button
                            onClick={() => handleDeleteBook(book.id)}
                            disabled={isProcessing}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow-sm transition-colors duration-200"
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Library;
