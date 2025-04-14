import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
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
  isbn: string;
  category: string;
  grade: string;
  available: number;
  quantity: number;
  lastUpdated?: string;
  notes?: string;
  condition?: "New" | "Good" | "Fair" | "Poor";
}

interface ApiResponse<T = any> {
  data: T;
  error?: {
    message: string;
  };
  success: boolean;
}

interface BookResponse {
  id: number;
  available: number;
  lastUpdated: string;
  [key: string]: any;
}

interface CreateBookResponse {
  id: number;
  lastUpdated: string;
  [key: string]: any;
}

interface BookUpdatePayload {
  available?: number;
  quantity?: number;
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
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [newBook, setNewBook] = useState<Omit<Book, "id">>({
    title: "",
    author: "",
    category: "Language Arts",
    isbn:"",
    grade: "Grade 1",
    available: 1,
    quantity: 1,
  });
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showManageModal, setShowManageModal] = useState(false);
  const [bookUpdate, setBookUpdate] = useState<BookUpdatePayload>({});
  const [returnNote, setReturnNote] = useState("");

  const categories = [
    "All",
    "Language Arts",
    "Mathematics",
    "Science",
    "Social Studies",
    "PEP Preparation",
  ];
  const grades = [
    "All",
    "Grade 1",
    "Grade 2",
    "Grade 3",
    "Grade 4",
    "Grade 5",
    "Grade 6",
  ];

  //Fetch books
  const fetchBooks = async (showLoadingState = true) => {
    try {
      if (showLoadingState) {
        setIsLoading(true);
      } else {
        setIsSyncing(true);
      }
  
      setSyncError(null);
  
      // Fetch from API
      const response = await fetch("http://localhost:5000/api/books");
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const rawData = await response.json();
  
      // Support for both flat array and wrapped { data: [...] }
      const booksData = Array.isArray(rawData) ? rawData : rawData.data;
  
      if (!Array.isArray(booksData)) {
        throw new Error("Invalid API response format – expected array of books");
      }
  
      // ✅ Attach `lastUpdated` to each book
      const booksWithTimestamps = booksData.map((book) => ({
        ...book,
        lastUpdated: book.lastUpdated || new Date().toISOString(), // fallback to now
      }));
  
      setBooks(booksWithTimestamps);
      setLastSync(new Date());
  
      if (!showLoadingState) {
        toast({
          title: "Sync Successful",
          description: "Library data refreshed from server",
        });
      }
  
      return booksWithTimestamps;
    } catch (error) {
      console.error("API Error:", error);
      setSyncError(
        error instanceof Error ? error.message : "Failed to fetch books"
      );
      toast({
        title: "Error",
        description: "Failed to load books from server",
        variant: "destructive",
      });
      return [];
    } finally {
      if (showLoadingState) {
        setIsLoading(false);
      } else {
        setIsSyncing(false);
      }
    }
  };
  
  // Manual sync function for refresh button
  const handleRefresh = async () => {
    if (isSyncing) return;
    await fetchBooks(false);
  };

    // Set up polling for updates every 30 seconds
    const pollInterval = setInterval(async () => {
      if (!isProcessing && !isSyncing) {
        // Don't fetch if we're in the middle of an operation
        const freshBooks = await fetchBooks(false);

        // If we got new data, check if any books have changed
        if (freshBooks && books.length > 0) {
          // Compare book quantities and availability to detect changes
          const hasChanges = freshBooks.some((newBook) => {
            const existingBook = books.find((b) => b.id === newBook.id);
            if (!existingBook) return true; // New book

            return (
              existingBook.available !== newBook.available ||
              existingBook.quantity !== newBook.quantity
            );
          });

          if (hasChanges) {
            toast({
              title: "Library Updated",
              description:
                "The library inventory has been updated with new changes.",
            });
          }
        }
      }
    }, 30000);

    // Cleanup polling on component unmount
    return () => clearInterval(pollInterval);
  }, [toast, isProcessing, books.length]);

  // Filter books based on search term, category, and grade
  useEffect(() => {
    let filtered = [...books]; // Create a new array from books

    // Filter by search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchLower) ||
          book.author.toLowerCase().includes(searchLower) ||
          book.category.toLowerCase().includes(searchLower)
      );
    }

    // Filter by category
    if (activeCategory !== "All") {
      filtered = filtered.filter((book) => book.category === activeCategory);
    }

    // Filter by grade
    if (activeGrade !== "All") {
      filtered = filtered.filter((book) => book.grade === activeGrade);
    }

    setFilteredBooks(filtered);
  }, [books, searchTerm, activeCategory, activeGrade]);

  const handleCheckout = async (id: number) => {
    try {
      setIsProcessing(true);

      // First, optimistically update UI
      const bookToCheckOut = books.find((book) => book.id === id);
      if (!bookToCheckOut) {
        throw new Error("Book not found");
      }

      if (bookToCheckOut.available < 1) {
        throw new Error("No copies available to check out");
      }

      // Update local state optimistically
      const updatedBooks = books.map((book) =>
        book.id === id
          ? {
              ...book,
              available: book.available - 1,
              lastUpdated: new Date().toISOString(),
            }
          : book
      );
      setBooks(updatedBooks);

      // Also update localStorage for consistency
      localStorage.setItem("libraryBooks", JSON.stringify(updatedBooks));

      // First try to use the checkout endpoint if it exists
      try {
        console.log(`Attempting to checkout book with ID ${id}`);
        const checkoutResponse = await api.post<any>(
          `/books/${id}/checkout`,
          {}
        );

        if (!checkoutResponse.error) {
          console.log("Checkout successful:", checkoutResponse);
          toast({
            title: "Success",
            description: "Book checked out successfully",
          });
          return;
        } else {
          console.warn("Checkout endpoint failed:", checkoutResponse.error);
        }
      } catch (checkoutError) {
        console.warn("Checkout endpoint not available:", checkoutError);
      }

      // Fallback: try regular update if checkout endpoint fails
      try {
        console.log("Trying regular update as fallback");
        const updateData = {
          ...bookToCheckOut,
          available: bookToCheckOut.available - 1,
          lastUpdated: new Date().toISOString(),
        };

        const response = await api.put<any>(`/books/${id}`, updateData);

        if (response.error) {
          console.warn(
            "Server update failed, using local state:",
            response.error.message
          );
        } else {
          console.log("Update successful via PUT endpoint:", response);
        }
      } catch (apiError) {
        console.warn(
          "Server communication failed, using local state only:",
          apiError
        );
      }

      toast({
        title: "Success",
        description: "Book checked out successfully",
      });
    } catch (error) {
      console.error("Error checking out book:", error);

      // Revert changes on error
      setBooks(books);
      setFilteredBooks(filteredBooks);

      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to check out book",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReturn = async (id: number) => {
    try {
      setIsProcessing(true);

      // First, optimistically update UI
      const bookToReturn = books.find((book) => book.id === id);
      if (!bookToReturn) {
        throw new Error("Book not found");
      }

      if (bookToReturn.available >= bookToReturn.quantity) {
        throw new Error("Cannot return more copies than total quantity");
      }

      // Update local state optimistically
      const updatedBooks = books.map((book) =>
        book.id === id
          ? {
              ...book,
              available: book.available + 1,
              lastUpdated: new Date().toISOString(),
            }
          : book
      );
      setBooks(updatedBooks);

      // Also update localStorage for consistency
      localStorage.setItem("libraryBooks", JSON.stringify(updatedBooks));

      // First try to use the return endpoint if it exists
      try {
        console.log(`Attempting to return book with ID ${id}`);
        const returnResponse = await api.post<any>(`/books/${id}/return`, {
          notes: returnNote,
        });

        if (!returnResponse.error) {
          console.log("Return successful:", returnResponse);
          toast({
            title: "Success",
            description: "Book returned successfully",
          });
          return;
        } else {
          console.warn("Return endpoint failed:", returnResponse.error);
        }
      } catch (returnError) {
        console.warn("Return endpoint not available:", returnError);
      }

      // Fallback: try regular update if return endpoint fails
      try {
        console.log("Trying regular update as fallback");
        const updateData = {
          ...bookToReturn,
          available: bookToReturn.available + 1,
          lastUpdated: new Date().toISOString(),
          notes: returnNote || bookToReturn.notes,
        };

        const response = await api.put<any>(`/books/${id}`, updateData);

        if (response.error) {
          console.warn(
            "Server update failed, using local state:",
            response.error.message
          );
        } else {
          console.log("Update successful via PUT endpoint:", response);
        }
      } catch (apiError) {
        console.warn(
          "Server communication failed, using local state only:",
          apiError
        );
      }

      // Reset return note
      setReturnNote("");

      toast({
        title: "Success",
        description: "Book returned successfully",
      });
    } catch (error) {
      console.error("Error returning book:", error);

      // Revert changes on error
      setBooks(books);
      setFilteredBooks(filteredBooks);

      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to return book",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddBook = () => {
    setShowAddBookModal(true);
  };

  const handleDeleteBook = async (id: number) => {
    try {
      setIsProcessing(true);

      // Optimistic update
      const updatedBooks = books.filter((book) => book.id !== id);
      setBooks(updatedBooks);
      setFilteredBooks(updatedBooks);

      // Send delete request to server
      const response = await api.delete(`/books/${id}`);

      if (response.error) {
        throw new Error(response.error.message);
      }

      toast({
        title: "Success",
        description: "Book deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting book:", error);

      // Revert changes on error
      setBooks(books);
      setFilteredBooks(filteredBooks);

      toast({
        title: "Error",
        description: "Failed to delete book",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmitNewBook = async () => {
    try {
      if (
        !newBook.title ||
        !newBook.author ||
        !newBook.category ||
        !newBook.grade
      ) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      setIsProcessing(true);

      // Create new book with ID
      const newBookWithId = {
        ...newBook,
        id: Math.max(...books.map((b) => b.id), 0) + 1,
        lastUpdated: new Date().toISOString(),
      };

      // Add to local state
      const updatedBooks = [...books, newBookWithId];
      setBooks(updatedBooks);

      // Also update localStorage for consistency
      localStorage.setItem("libraryBooks", JSON.stringify(updatedBooks));

      // Send create request to server
      const response = await api.post<any>("/books", newBook);

      if (response.error) {
        throw new Error(response.error.message);
      }

      console.log("Server response:", response);

      // Add book to state with either the server ID or the temporary ID
      let serverBookId = newBookWithId.id;
      try {
        // Try to extract ID from different response formats
        const responseData = response.data;
        if (responseData && typeof responseData === "object") {
          if (responseData.data && responseData.data.id) {
            // Format: { data: { id: number, ... } }
            serverBookId = responseData.data.id;
          } else if (responseData.id) {
            // Format: { id: number, ... }
            serverBookId = responseData.id;
          }
        }
      } catch (error) {
        console.warn("Unable to extract server ID, using temp ID:", error);
      }

      // Create the final book object with the correct ID
      const finalBook: Book = {
        ...newBookWithId,
        id: serverBookId,
      };

      // Update local state with the new book
      const updatedBooksWithNewBook = [...updatedBooks, finalBook];
      setBooks(updatedBooksWithNewBook);

      // Apply filtering happens via useEffect

      // Close the modal and reset form
      setShowAddBookModal(false);
      setNewBook({
        title: "",
        author: "",
        category: "Language Arts",
        isbn:"",
        grade: "Grade 1",
        available: 1,
        quantity: 1,
      });

      toast({
        title: "Success",
        description: "Book added successfully",
      });

      // Refresh data after a short delay to ensure server has processed the change
      setTimeout(() => {
        fetchBooks(false);
      }, 1000);
    } catch (error) {
      console.error("Error adding book:", error);

      toast({
        title: "Error",
        description: "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManageBook = (book: Book) => {
    setSelectedBook(book);
    setBookUpdate({
      available: book.available,
      quantity: book.quantity,
      condition: book.condition,
      notes: book.notes,
    });
    setShowManageModal(true);
  };

  const handleUpdateBook = async () => {
    if (!selectedBook) return;

    try {
      setIsProcessing(true);

      const available =
        typeof bookUpdate.available === "number"
          ? bookUpdate.available
          : selectedBook.available;
      const quantity =
        typeof bookUpdate.quantity === "number"
          ? bookUpdate.quantity
          : selectedBook.quantity;

      // Validate updates
      if (available > quantity) {
        throw new Error("Available books cannot exceed total quantity");
      }

      const updatedBookData = {
        ...bookUpdate,
        available,
        quantity,
      };

      // Optimistic update
      const updatedBooks = books.map((book) => {
        if (book.id === selectedBook.id) {
          return {
            ...book,
            ...updatedBookData,
            lastUpdated: new Date().toISOString(),
          };
        }
        return book;
      });

      setBooks(updatedBooks);
      setFilteredBooks(updatedBooks);

      // Try server update, but don't fail if server is not available
      try {
        const response = await api.put<ApiResponse<BookResponse>>(
          `/books/${selectedBook.id}`,
          updatedBookData
        );

        if (response.error) {
          console.warn(
            "Server update failed, using local state:",
            response.error.message
          );
        }
      } catch (apiError) {
        console.warn("Server communication failed, using local state only");
      }

      toast({
        title: "Success",
        description: "Book details updated successfully",
      });

      setShowManageModal(false);
    } catch (error) {
      console.error("Error updating book:", error);

      // Revert changes on error
      setBooks(books);
      setFilteredBooks(filteredBooks);

      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update book",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-grow">
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Library Books</h2>
            <div className="flex items-center gap-2">
              {lastSync && (
                <span className="text-xs text-gray-500">
                  Last updated: {lastSync.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search by title or author"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <select
                className="w-full p-2 border rounded-md"
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
            <div>
              <select
                className="w-full p-2 border rounded-md"
                value={activeGrade}
                onChange={(e) => setActiveGrade(e.target.value)}
              >
                {grades.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleRefresh}
                disabled={isSyncing}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-2 px-4 text-left border-b">Title</th>
                  <th className="py-2 px-4 text-left border-b">Author</th>
                  <th className="py-2 px-4 text-left border-b">Category</th>
                  <th className="py-2 px-4 text-left border-b">Grade</th>
                  <th className="py-2 px-4 text-center border-b">Available</th>
                  <th className="py-2 px-4 text-center border-b">Quantity</th>
                  <th className="py-2 px-4 text-center border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.length > 0 ? (
                  filteredBooks.map((book) => (
                    <tr key={book.id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">{book.title}</td>
                      <td className="py-2 px-4 border-b">{book.author}</td>
                      <td className="py-2 px-4 border-b">{book.category}</td>
                      <td className="py-2 px-4 border-b">{book.grade}</td>
                      <td className="py-2 px-4 text-center border-b">
                        <span
                          className={`inline-block w-8 h-8 rounded-full flex items-center justify-center text-white ${
                            book.available > 0 ? "bg-green-500" : "bg-red-500"
                          }`}
                        >
                          {book.available}
                        </span>
                      </td>
                      <td className="py-2 px-4 text-center border-b">
                        {book.quantity}
                      </td>
                      <td className="py-2 px-4 border-b">
                        <div className="flex gap-2 justify-center">
                          {book.available > 0 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCheckout(book.id)}
                              disabled={isProcessing}
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              Check Out
                            </Button>
                          )}
                          {book.available < book.quantity && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleReturn(book.id)}
                              disabled={isProcessing}
                              className="text-green-600 border-green-200 hover:bg-green-50"
                            >
                              Return
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-4 text-center text-gray-500">
                      No books found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {showManageModal && selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              Manage Book: {selectedBook.title}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Available Copies
                </label>
                <Input
                  type="number"
                  min="0"
                  max={
                    typeof bookUpdate.quantity === "number"
                      ? bookUpdate.quantity
                      : selectedBook.quantity
                  }
                  value={
                    typeof bookUpdate.available === "number"
                      ? bookUpdate.available
                      : selectedBook.available
                  }
                  onChange={(e) => {
                    const value =
                      e.target.value === ""
                        ? undefined
                        : parseInt(e.target.value);
                    setBookUpdate({
                      ...bookUpdate,
                      available: value,
                    });
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Total Quantity
                </label>
                <Input
                  type="number"
                  min="1"
                  value={
                    typeof bookUpdate.quantity === "number"
                      ? bookUpdate.quantity
                      : selectedBook.quantity
                  }
                  onChange={(e) => {
                    const value =
                      e.target.value === ""
                        ? undefined
                        : parseInt(e.target.value);
                    setBookUpdate({
                      ...bookUpdate,
                      quantity: value,
                    });
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Condition
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={bookUpdate.condition}
                  onChange={(e) =>
                    setBookUpdate({
                      ...bookUpdate,
                      condition: e.target.value as
                        | "New"
                        | "Good"
                        | "Fair"
                        | "Poor",
                    })
                  }
                >
                  <option value="New">New</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={bookUpdate.notes}
                  onChange={(e) =>
                    setBookUpdate({
                      ...bookUpdate,
                      notes: e.target.value,
                    })
                  }
                  rows={3}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <Button
                onClick={() => setShowManageModal(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md shadow-sm transition-colors duration-200"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateBook}
                disabled={isProcessing}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm transition-colors duration-200"
              >
                Update
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Library;
