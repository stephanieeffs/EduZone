/**
 * Mock Data for the EduZone API
 * This file provides mock data for all API endpoints when database is not available
 */

// Mock Books Data
const books = [
    {
      id: 1,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      isbn: "9780061120084",
      category: "Fiction",
      quantity: 10,
      available: 8,
      created_at: "2023-04-01T12:00:00Z",
    },
    {
      id: 2,
      title: "1984",
      author: "George Orwell",
      isbn: "9780451524935",
      category: "Science Fiction",
      quantity: 15,
      available: 12,
      created_at: "2023-04-02T14:30:00Z",
    },
    {
      id: 3,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      isbn: "9780743273565",
      category: "Classic",
      quantity: 8,
      available: 5,
      created_at: "2023-04-03T09:15:00Z",
    },
    {
      id: 4,
      title: "Pride and Prejudice",
      author: "Jane Austen",
      isbn: "9780141439518",
      category: "Classic",
      quantity: 10,
      available: 7,
      created_at: "2023-04-04T16:45:00Z",
    },
    {
      id: 5,
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      isbn: "9780547928227",
      category: "Fantasy",
      quantity: 12,
      available: 9,
      created_at: "2023-04-05T11:20:00Z",
    },
  ];
  
  // Mock Teachers Data
  const teachers = [
    {
      id: 1,
      name: "John Smith",
      subject: "Mathematics",
      email: "john.smith@eduzone.com",
      phone: "555-1234",
      created_at: "2023-03-15T08:00:00Z",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      subject: "Science",
      email: "sarah.johnson@eduzone.com",
      phone: "555-2345",
      created_at: "2023-03-16T09:30:00Z",
    },
    {
      id: 3,
      name: "Michael Brown",
      subject: "English",
      email: "michael.brown@eduzone.com",
      phone: "555-3456",
      created_at: "2023-03-17T10:45:00Z",
    },
    {
      id: 4,
      name: "Emily Davis",
      subject: "History",
      email: "emily.davis@eduzone.com",
      phone: "555-4567",
      created_at: "2023-03-18T14:15:00Z",
    },
    {
      id: 5,
      name: "David Wilson",
      subject: "Physical Education",
      email: "david.wilson@eduzone.com",
      phone: "555-5678",
      created_at: "2023-03-19T15:30:00Z",
    },
  ];
  
  // Mock Staff Data (Users with teacher role)
  const staff = [
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@eduzone.com",
      role: "teacher",
      created_at: "2023-03-15T08:00:00Z",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.johnson@eduzone.com",
      role: "teacher",
      created_at: "2023-03-16T09:30:00Z",
    },
    {
      id: 3,
      name: "Michael Brown",
      email: "michael.brown@eduzone.com",
      role: "teacher",
      created_at: "2023-03-17T10:45:00Z",
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily.davis@eduzone.com",
      role: "teacher",
      created_at: "2023-03-18T14:15:00Z",
    },
    {
      id: 5,
      name: "David Wilson",
      email: "david.wilson@eduzone.com",
      role: "teacher",
      created_at: "2023-03-19T15:30:00Z",
    },
  ];
  
  // Mock Forms Data
  const forms = [
    {
      id: 1,
      title: "Student Registration Form",
      description: "Form for registering new students",
      category: "administrative",
      uploadDate: "2023-04-01T12:00:00Z",
      fileUrl: "/forms/student-registration.pdf",
      fileSize: "245 KB",
      downloads: 42,
      editable: true,
    },
    {
      id: 2,
      title: "Field Trip Permission Slip",
      description: "Parent/guardian permission for student field trips",
      category: "permission",
      uploadDate: "2023-04-02T14:30:00Z",
      fileUrl: "/forms/field-trip-permission.pdf",
      fileSize: "180 KB",
      downloads: 78,
      editable: true,
    },
    {
      id: 3,
      title: "Parent-Teacher Conference Request",
      description: "Form to request a meeting with teachers",
      category: "academic",
      uploadDate: "2023-04-03T09:15:00Z",
      fileUrl: "/forms/conference-request.pdf",
      fileSize: "120 KB",
      downloads: 35,
      editable: true,
    },
    {
      id: 4,
      title: "Medical Information Form",
      description: "Student health and medication information",
      category: "health",
      uploadDate: "2023-04-05T11:20:00Z",
      fileUrl: "/forms/medical-information.pdf",
      fileSize: "200 KB",
      downloads: 56,
      editable: true,
    },
  ];
  
  // Mock Calendar Events
  const calendarEvents = [
    {
      id: 1,
      title: "Parent-Teacher Conference",
      description: "Annual parent-teacher conference day",
      start: "2023-05-15T09:00:00Z",
      end: "2023-05-15T16:00:00Z",
      category: "academic",
      created_at: "2023-04-01T10:00:00Z",
    },
    {
      id: 2,
      title: "Science Fair",
      description: "Annual science fair for all grades",
      start: "2023-05-20T10:00:00Z",
      end: "2023-05-20T15:00:00Z",
      category: "event",
      created_at: "2023-04-02T11:30:00Z",
    },
    {
      id: 3,
      title: "Field Day",
      description: "Outdoor sports and activities",
      start: "2023-05-25T09:30:00Z",
      end: "2023-05-25T14:30:00Z",
      category: "event",
      created_at: "2023-04-03T12:45:00Z",
    },
    {
      id: 4,
      title: "Professional Development Day",
      description: "Teacher training and development",
      start: "2023-05-30T08:00:00Z",
      end: "2023-05-30T16:00:00Z",
      category: "holiday",
      created_at: "2023-04-04T13:15:00Z",
    },
  ];
  
  // Mock Feedback Data
  const feedback = [
    {
      id: 1,
      name: "John Parent",
      email: "john.parent@example.com",
      subject: "Great Science Fair",
      message:
        "I wanted to express my appreciation for the wonderful science fair last week. My child had a great time and learned so much!",
      created_at: "2023-04-10T09:30:00Z",
    },
    {
      id: 2,
      name: "Mary Student",
      email: "mary.student@example.com",
      subject: "Library Hours Suggestion",
      message:
        "I would like to suggest extending the library hours during exam weeks. This would be very helpful for students who need a quiet place to study.",
      created_at: "2023-04-11T14:45:00Z",
    },
    {
      id: 3,
      name: "Robert Teacher",
      email: "robert.teacher@example.com",
      subject: "Technology Resources",
      message:
        "The new technology resources provided to the classrooms have been excellent. The students are more engaged and learning has improved.",
      created_at: "2023-04-12T11:15:00Z",
    },
  ];
  
  // Mock Users (for authentication)
  const users = [
    {
      id: 1,
      name: "Admin User",
      email: "admin@eduzone.com",
      password: "Password123",
      role: "admin",
      created_at: "2023-03-01T08:00:00Z",
    },
    {
      id: 2,
      name: "Teacher User",
      email: "teacher@eduzone.com",
      password: "Password123",
      role: "teacher",
      created_at: "2023-03-02T09:30:00Z",
    },
    {
      id: 3,
      name: "Student User",
      email: "student@eduzone.com",
      password: "Password123",
      role: "student",
      created_at: "2023-03-03T10:45:00Z",
    },
    {
      id: 4,
      name: "Parent User",
      email: "parent@eduzone.com",
      password: "Password123",
      role: "parent",
      created_at: "2023-03-04T14:15:00Z",
    },
  ];
  
  // Export all mock data
  module.exports = {
    books,
    teachers,
    staff,
    forms,
    calendarEvents,
    feedback,
    users,
  };
  