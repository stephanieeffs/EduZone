import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Button } from "../components/ui/button";
import { useToast } from "../hooks/use-toast";
import { useAuth } from "../lib/use-auth";

// Calendar Management Component
const CalendarManagement = () => {
  const [events, setEvents] = useState([
    // School Terms
    {
      id: 1,
      title: "Term 1 (Michaelmas Term) Begins",
      date: new Date(2025, 8, 3),
      description: "First term of the academic year begins",
      category: "term",
    },
    {
      id: 2,
      title: "Term 1 (Michaelmas Term) Ends",
      date: new Date(2025, 11, 14),
      description: "First term of the academic year ends",
      category: "term",
    },
    {
      id: 3,
      title: "Term 2 (Hilary Term) Begins",
      date: new Date(2025, 0, 6),
      description: "Second term of the academic year begins",
      category: "term",
    },
    {
      id: 4,
      title: "Term 2 (Hilary Term) Ends",
      date: new Date(2025, 2, 28),
      description: "Second term of the academic year ends",
      category: "term",
    },
    {
      id: 5,
      title: "Term 3 (Trinity Term) Begins",
      date: new Date(2025, 3, 15),
      description: "Third term of the academic year begins",
      category: "term",
    },
    {
      id: 6,
      title: "Term 3 (Trinity Term) Ends",
      date: new Date(2025, 6, 3),
      description: "Third term of the academic year ends",
      category: "term",
    },

    // Main School Holidays
    {
      id: 7,
      title: "Christmas Break Begins",
      date: new Date(2025, 11, 15),
      description: "Christmas holiday break begins",
      category: "holiday",
    },
    {
      id: 8,
      title: "Christmas Break Ends",
      date: new Date(2025, 0, 5),
      description: "Christmas holiday break ends",
      category: "holiday",
    },
    {
      id: 9,
      title: "Easter Break Begins",
      date: new Date(2025, 3, 1),
      description: "Easter holiday break begins",
      category: "holiday",
    },
    {
      id: 10,
      title: "Easter Break Ends",
      date: new Date(2025, 3, 14),
      description: "Easter holiday break ends",
      category: "holiday",
    },
    {
      id: 11,
      title: "Summer Break Begins",
      date: new Date(2025, 6, 4),
      description: "Summer holiday break begins",
      category: "holiday",
    },
    {
      id: 12,
      title: "Summer Break Ends",
      date: new Date(2025, 7, 31),
      description: "Summer holiday break ends",
      category: "holiday",
    },

    // Public Holidays
    {
      id: 13,
      title: "New Year's Day",
      date: new Date(2025, 0, 1),
      description: "New Year's Day public holiday",
      category: "public",
    },
    {
      id: 14,
      title: "Ash Wednesday",
      date: new Date(2025, 1, 26),
      description: "Public holiday - school closed",
      category: "public",
    },
    {
      id: 15,
      title: "Good Friday",
      date: new Date(2025, 3, 10),
      description: "Public holiday - school closed",
      category: "public",
    },
    {
      id: 16,
      title: "Easter Monday",
      date: new Date(2025, 3, 13),
      description: "Public holiday - school closed",
      category: "public",
    },
    {
      id: 17,
      title: "Labour Day",
      date: new Date(2025, 4, 23),
      description: "Public holiday - school closed",
      category: "public",
    },
    {
      id: 18,
      title: "Emancipation Day",
      date: new Date(2025, 7, 1),
      description: "Public holiday - school closed",
      category: "public",
    },
    {
      id: 19,
      title: "Independence Day",
      date: new Date(2025, 7, 6),
      description: "Public holiday - school closed",
      category: "public",
    },
    {
      id: 20,
      title: "National Heroes Day",
      date: new Date(2025, 9, 20),
      description: "Public holiday - school closed",
      category: "public",
    },
    {
      id: 21,
      title: "Christmas Day",
      date: new Date(2025, 11, 25),
      description: "Public holiday - school closed",
      category: "public",
    },
  ]);

  const [newEvent, setNewEvent] = useState({
    title: "",
    date: new Date(),
    description: "",
    category: "event",
  });

  const { toast } = useToast();

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const eventToAdd = {
      id: events.length + 1,
      title: newEvent.title,
      date: new Date(newEvent.date),
      description: newEvent.description,
      category: newEvent.category,
    };

    setEvents([...events, eventToAdd]);
    setNewEvent({
      title: "",
      date: new Date(),
      description: "",
      category: "event",
    });

    toast({
      title: "Success",
      description: "Event added successfully",
    });
  };

  const handleDeleteEvent = (id: number) => {
    setEvents(events.filter((event) => event.id !== id));
    toast({
      title: "Success",
      description: "Event deleted successfully",
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Add New Event</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Event Title
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              value={newEvent.title}
              onChange={(e) =>
                setNewEvent({ ...newEvent, title: e.target.value })
              }
              placeholder="Enter event title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Event Date</label>
            <input
              type="date"
              className="w-full p-2 border rounded-md"
              value={newEvent.date.toISOString().split("T")[0]}
              onChange={(e) =>
                setNewEvent({ ...newEvent, date: new Date(e.target.value) })
              }
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              className="w-full p-2 border rounded-md"
              value={newEvent.description}
              onChange={(e) =>
                setNewEvent({ ...newEvent, description: e.target.value })
              }
              placeholder="Enter event description"
              rows={3}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              className="w-full p-2 border rounded-md"
              value={newEvent.category}
              onChange={(e) =>
                setNewEvent({ ...newEvent, category: e.target.value })
              }
            >
              <option value="event">Event</option>
              <option value="term">Term</option>
              <option value="holiday">Holiday</option>
              <option value="public">Public Holiday</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <Button onClick={handleAddEvent}>Add Event</Button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Current Events</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.map((event) => (
                <tr key={event.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{event.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {event.date.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">{event.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {event.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteEvent(event.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Teacher Management Component
const TeacherManagement = () => {
  const [teachers, setTeachers] = useState([
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      position: "Principal",
      department: "Administration",
      email: "sarah.johnson@fps.edu",
      phone: "(555) 123-4567",
    },
    {
      id: 2,
      name: "Mr. James Wilson",
      position: "Vice Principal",
      department: "Administration",
      email: "james.wilson@fps.edu",
      phone: "(555) 123-4568",
    },
    {
      id: 3,
      name: "Ms. Emily Rodriguez",
      position: "Grade 1 Teacher",
      department: "Teaching",
      email: "emily.rodriguez@fps.edu",
      phone: "(555) 123-4569",
    },
    {
      id: 4,
      name: "Mr. David Chen",
      position: "Grade 2 Teacher",
      department: "Teaching",
      email: "david.chen@fps.edu",
      phone: "(555) 123-4570",
    },
    {
      id: 5,
      name: "Ms. Lisa Thompson",
      position: "Grade 3 Teacher",
      department: "Teaching",
      email: "lisa.thompson@fps.edu",
      phone: "(555) 123-4571",
    },
    {
      id: 6,
      name: "Mr. Michael Brown",
      position: "Physical Education Teacher",
      department: "Specialist",
      email: "michael.brown@fps.edu",
      phone: "(555) 123-4572",
    },
    {
      id: 7,
      name: "Ms. Patricia Lee",
      position: "Art Teacher",
      department: "Specialist",
      email: "patricia.lee@fps.edu",
      phone: "(555) 123-4573",
    },
    {
      id: 8,
      name: "Mr. Robert Garcia",
      position: "Librarian",
      department: "Support",
      email: "robert.garcia@fps.edu",
      phone: "(555) 123-4574",
    },
    {
      id: 9,
      name: "Ms. Jennifer White",
      position: "School Nurse",
      department: "Support",
      email: "jennifer.white@fps.edu",
      phone: "(555) 123-4575",
    },
  ]);

  const [newTeacher, setNewTeacher] = useState({
    name: "",
    position: "",
    department: "",
    email: "",
    phone: "",
  });

  const { toast } = useToast();

  const handleAddTeacher = () => {
    if (!newTeacher.name || !newTeacher.position || !newTeacher.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const teacherToAdd = {
      id: teachers.length + 1,
      ...newTeacher,
    };

    setTeachers([...teachers, teacherToAdd]);
    setNewTeacher({
      name: "",
      position: "",
      department: "",
      email: "",
      phone: "",
    });

    toast({
      title: "Success",
      description: "Teacher added successfully",
    });
  };

  const handleDeleteTeacher = (id: number) => {
    setTeachers(teachers.filter((teacher) => teacher.id !== id));
    toast({
      title: "Success",
      description: "Teacher deleted successfully",
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Add New Teacher</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              value={newTeacher.name}
              onChange={(e) =>
                setNewTeacher({ ...newTeacher, name: e.target.value })
              }
              placeholder="Enter teacher name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Position</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              value={newTeacher.position}
              onChange={(e) =>
                setNewTeacher({ ...newTeacher, position: e.target.value })
              }
              placeholder="Enter position"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Department</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              value={newTeacher.department}
              onChange={(e) =>
                setNewTeacher({ ...newTeacher, department: e.target.value })
              }
              placeholder="Enter department"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full p-2 border rounded-md"
              value={newTeacher.email}
              onChange={(e) =>
                setNewTeacher({ ...newTeacher, email: e.target.value })
              }
              placeholder="Enter email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              value={newTeacher.phone}
              onChange={(e) =>
                setNewTeacher({ ...newTeacher, phone: e.target.value })
              }
              placeholder="Enter phone number"
            />
          </div>
        </div>
        <div className="mt-4">
          <Button onClick={handleAddTeacher}>Add Teacher</Button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Current Teachers</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {teachers.map((teacher) => (
                <tr key={teacher.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {teacher.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {teacher.position}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {teacher.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {teacher.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {teacher.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteTeacher(teacher.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Book Management Component
const BookListManagement = () => {
  const [books, setBooks] = useState([
    {
      id: 1,
      title: "New Integrated Approach Language Arts - Grade 1",
      author: "Carlong Publishers",
      category: "Language Arts",
      grade: "Grade 1",
      available: 1,
      quantity: 1,
    },
    {
      id: 2,
      title: "New Integrated Approach Language Arts - Grade 2",
      author: "Carlong Publishers",
      category: "Language Arts",
      grade: "Grade 2",
      available: 1,
      quantity: 1,
    },
    {
      id: 3,
      title: "Caribbean Primary Mathematics - Book 1",
      author: "Oxford",
      category: "Mathematics",
      grade: "Grade 1",
      available: 1,
      quantity: 1,
    },
    {
      id: 4,
      title: "Caribbean Primary Mathematics - Book 2",
      author: "Oxford",
      category: "Mathematics",
      grade: "Grade 2",
      available: 0,
      quantity: 1,
    },
    {
      id: 5,
      title: "Caribbean Primary Science - Book 1",
      author: "Heinemann",
      category: "Science",
      grade: "Grade 1",
      available: 1,
      quantity: 1,
    },
    {
      id: 6,
      title: "Caribbean Primary Science - Book 2",
      author: "Heinemann",
      category: "Science",
      grade: "Grade 2",
      available: 1,
      quantity: 1,
    },
    {
      id: 7,
      title: "Macmillan Primary Social Studies - Grade 1",
      author: "Macmillan",
      category: "Social Studies",
      grade: "Grade 1",
      available: 1,
      quantity: 1,
    },
    {
      id: 8,
      title: "PEP Practice Tests - Ability Test",
      author: "KC Publications",
      category: "PEP Preparation",
      grade: "Grade 6",
      available: 1,
      quantity: 1,
    },
  ]);

  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    category: "Language Arts",
    grade: "Grade 1",
    available: 1,
    quantity: 1,
  });

  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeGrade, setActiveGrade] = useState("All");
  const [isProcessing, setIsProcessing] = useState(false);

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

  const { toast } = useToast();

  const handleCheckout = (id: number) => {
    try {
      setIsProcessing(true);
      const updatedBooks = books.map((book) => {
        if (book.id === id) {
          if (book.available <= 0) {
            throw new Error("Book is not available for checkout");
          }
          return {
            ...book,
            available: book.available - 1,
          };
        }
        return book;
      });

      setBooks(updatedBooks);
      toast({
        title: "Success",
        description: "Book checked out successfully",
      });
    } catch (error) {
      console.error("Error checking out book:", error);
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

  const handleReturn = (id: number) => {
    try {
      setIsProcessing(true);
      const updatedBooks = books.map((book) => {
        if (book.id === id) {
          if (book.available >= book.quantity) {
            throw new Error("Cannot return more books than total quantity");
          }
          return {
            ...book,
            available: book.available + 1,
          };
        }
        return book;
      });

      setBooks(updatedBooks);
      toast({
        title: "Success",
        description: "Book returned successfully",
      });
    } catch (error) {
      console.error("Error returning book:", error);
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

      const bookToAdd = {
        ...newBook,
        id: Math.max(...books.map((b) => b.id), 0) + 1,
      };

      setBooks([...books, bookToAdd]);
      setShowAddBookModal(false);
      setNewBook({
        title: "",
        author: "",
        category: "Language Arts",
        grade: "Grade 1",
        available: 1,
        quantity: 1,
      });

      toast({
        title: "Success",
        description: "Book added successfully",
      });
    } catch (error) {
      console.error("Error adding book:", error);
      toast({
        title: "Error",
        description: "Failed to add book",
        variant: "destructive",
      });
    }
  };

  const handleDeleteBook = (id: number) => {
    try {
      setBooks(books.filter((book) => book.id !== id));
      toast({
        title: "Success",
        description: "Book deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting book:", error);
      toast({
        title: "Error",
        description: "Failed to delete book",
        variant: "destructive",
      });
    }
  };

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || book.category === activeCategory;
    const matchesGrade = activeGrade === "All" || book.grade === activeGrade;
    return matchesSearch && matchesCategory && matchesGrade;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Library Management</h2>
          <Button
            onClick={() => setShowAddBookModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Add New Book
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <input
            type="text"
            placeholder="Search books..."
            className="p-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="p-2 border rounded-md"
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select
            className="p-2 border rounded-md"
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

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBooks.map((book) => (
                <tr key={book.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {book.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{book.author}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{book.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{book.grade}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        book.available > 0
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {book.available > 0
                        ? `Available (${book.available})`
                        : "Checked Out"}
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
                    <Button
                      onClick={() => handleDeleteBook(book.id)}
                      disabled={isProcessing}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow-sm transition-colors duration-200"
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddBookModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Add New Book</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={newBook.title}
                  onChange={(e) =>
                    setNewBook({ ...newBook, title: e.target.value })
                  }
                  placeholder="Book title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Author
                </label>
                <input
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={newBook.author}
                  onChange={(e) =>
                    setNewBook({ ...newBook, author: e.target.value })
                  }
                  placeholder="Author name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={newBook.category}
                  onChange={(e) =>
                    setNewBook({ ...newBook, category: e.target.value })
                  }
                >
                  {categories.slice(1).map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Grade
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={newBook.grade}
                  onChange={(e) =>
                    setNewBook({ ...newBook, grade: e.target.value })
                  }
                >
                  {grades.slice(1).map((grade) => (
                    <option key={grade} value={grade}>
                      {grade}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={newBook.quantity}
                  onChange={(e) =>
                    setNewBook({
                      ...newBook,
                      quantity: parseInt(e.target.value),
                      available: parseInt(e.target.value),
                    })
                  }
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <Button
                onClick={() => setShowAddBookModal(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddBook}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Add Book
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Forms Management Component
const FormsManagement = () => {
  // State to store all forms in the system
  const [forms, setForms] = useState([
    {
      id: 1,
      title: "Student Registration Form",
      description: "Form for registering new students",
      category: "Registration",
      uploadDate: new Date(2023, 8, 15),
      fileSize: "245 KB",
      downloads: 42,
    },
    {
      id: 2,
      title: "Field Trip Permission Slip",
      description: "Parent/guardian permission for student field trips",
      category: "Field Trips",
      uploadDate: new Date(2023, 8, 10),
      fileSize: "180 KB",
      downloads: 78,
    },
    {
      id: 3,
      title: "Parent-Teacher Conference Request",
      description: "Form to request a meeting with teachers",
      category: "Conferences",
      uploadDate: new Date(2023, 8, 5),
      fileSize: "120 KB",
      downloads: 35,
    },
    {
      id: 4,
      title: "Student Transfer Certificate",
      description: "Certificate for transferring to another school",
      category: "Administrative",
      uploadDate: new Date(2023, 8, 30),
      fileSize: "150 KB",
      downloads: 28,
    },
    {
      id: 5,
      title: "Medical Information Form",
      description: "Student health and medication information",
      category: "Health",
      uploadDate: new Date(2023, 9, 5),
      fileSize: "200 KB",
      downloads: 56,
    },
  ]);

  // State to manage the new form being added
  const [newForm, setNewForm] = useState({
    title: "",
    description: "",
    category: "",
    file: null as File | null,
  });

  const { toast } = useToast();

  // Function to add a new form to the system
  const handleAddForm = () => {
    // Validate required fields
    if (!newForm.title || !newForm.category || !newForm.file) {
      toast({
        title: "Error",
        description: "Please fill in all required fields and upload a file",
        variant: "destructive",
      });
      return;
    }

    // Create a new form object with generated ID and current date
    const formToAdd = {
      id: forms.length + 1,
      title: newForm.title,
      description: newForm.description,
      category: newForm.category,
      uploadDate: new Date(),
      fileSize: `${Math.round(Math.random() * 500)} KB`,
      downloads: 0,
    };

    // Add the new form to the state
    setForms([...forms, formToAdd]);
    // Reset the form input fields
    setNewForm({ title: "", description: "", category: "", file: null });

    // Show success notification
    toast({
      title: "Success",
      description: "Form added successfully",
    });
  };

  // Function to delete a form by its ID
  const handleDeleteForm = (id: number) => {
    // Filter out the form with the matching ID
    setForms(forms.filter((form) => form.id !== id));
    // Show success notification
    toast({
      title: "Success",
      description: "Form deleted successfully",
    });
  };

  // Function to handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewForm({ ...newForm, file: e.target.files[0] });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Add New Form</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              value={newForm.title}
              onChange={(e) =>
                setNewForm({ ...newForm, title: e.target.value })
              }
              placeholder="Enter form title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              className="w-full p-2 border rounded-md"
              value={newForm.category}
              onChange={(e) =>
                setNewForm({ ...newForm, category: e.target.value })
              }
            >
              <option value="">Select a category</option>
              <option value="Field Trips">Field Trips</option>
              <option value="Health">Health</option>
              <option value="Library">Library</option>
              <option value="Enrollment">Enrollment</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              className="w-full p-2 border rounded-md"
              value={newForm.description}
              onChange={(e) =>
                setNewForm({ ...newForm, description: e.target.value })
              }
              placeholder="Enter form description"
              rows={3}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">
              Upload Form
            </label>
            <input
              type="file"
              className="w-full p-2 border rounded-md"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
            />
            <p className="text-xs text-gray-500 mt-1">
              Accepted formats: PDF, DOC, DOCX
            </p>
          </div>
        </div>
        <div className="mt-4">
          <Button onClick={handleAddForm}>Add Form</Button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Current Forms</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Upload Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Downloads
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {forms.map((form) => (
                <tr key={form.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{form.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {form.category}
                  </td>
                  <td className="px-6 py-4">{form.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {form.uploadDate.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {form.downloads}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteForm(form.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// User Management Component
const UserManagement = () => {
  // State to store all users in the system
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Admin User",
      email: "admin@eduzone.com",
      role: "admin",
    },
    {
      id: 2,
      name: "Teacher User",
      email: "teacher@eduzone.com",
      role: "teacher",
    },
    {
      id: 3,
      name: "Student User",
      email: "student@eduzone.com",
      role: "student",
    },
    {
      id: 4,
      name: "Parent User",
      email: "parent@eduzone.com",
      role: "parent",
    },
    {
      id: 5,
      name: "Librarian User",
      email: "librarian@eduzone.com",
      role: "librarian",
    },
  ]);

  // State to manage the new user being added
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "student",
    password: "",
  });

  const { toast } = useToast();

  // Function to add a new user to the system
  const handleAddUser = () => {
    // Validate required fields
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Create a new user object with generated ID
    const userToAdd = {
      id: users.length + 1,
      ...newUser,
    };

    // Add the new user to the state
    setUsers([...users, userToAdd]);
    // Reset the form input fields
    setNewUser({ name: "", email: "", role: "student", password: "" });

    // Show success notification
    toast({
      title: "Success",
      description: "User added successfully",
    });
  };

  // Function to delete a user by their ID
  const handleDeleteUser = (id: number) => {
    // Filter out the user with the matching ID
    setUsers(users.filter((user) => user.id !== id));
    // Show success notification
    toast({
      title: "Success",
      description: "User deleted successfully",
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Add New User</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              placeholder="Enter user name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full p-2 border rounded-md"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
              placeholder="Enter email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              className="w-full p-2 border rounded-md"
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            >
              <option value="admin">Admin</option>
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
              <option value="parent">Parent</option>
              <option value="librarian">Librarian</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className="w-full p-2 border rounded-md"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
              placeholder="Enter password"
            />
          </div>
        </div>
        <div className="mt-4">
          <Button onClick={handleAddUser}>Add User</Button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Current Users</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap capitalize">
                    {user.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const AdminManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("calendar");

  // Get tab from URL query parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get("tab");
    if (
      tabParam &&
      ["calendar", "teachers", "books", "forms", "users"].includes(tabParam)
    ) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  // Security check: Redirect if not admin
  if (!user || user.role !== "admin") {
    toast({
      title: "Access Denied",
      description: "You do not have permission to access this page",
      variant: "destructive",
    });
    navigate("/dashboard");
    return null;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "calendar":
        return <CalendarManagement />;
      case "teachers":
        return <TeacherManagement />;
      case "books":
        return <BookListManagement />;
      case "forms":
        return <FormsManagement />;
      case "users":
        return <UserManagement />;
      default:
        return <CalendarManagement />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-eduNavy">
              Admin Management
            </h1>
            <Button
              variant="outline"
              onClick={() => navigate("/dashboard")}
              className="text-eduNavy border-eduNavy hover:bg-eduNavy hover:text-white"
            >
              Back to Dashboard
            </Button>
          </div>

          <div className="p-4 bg-blue-50 rounded-md mb-6">
            <p className="text-eduBlue">
              Welcome to the Admin Management panel. Here you can manage various
              aspects of the school system.
            </p>
          </div>

          <div className="grid grid-cols-5 gap-2 mb-6">
            {["calendar", "teachers", "books", "forms", "users"].map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? "default" : "outline"}
                onClick={() => setActiveTab(tab)}
                className="capitalize"
              >
                {tab}
              </Button>
            ))}
          </div>

          <div className="mt-6">{renderTabContent()}</div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminManagement;
