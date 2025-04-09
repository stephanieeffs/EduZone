import { api } from "./api";

// API Response types
interface ApiResponse<T> {
  data: T;
  error?: {
    message: string;
    status: number;
  };
}

interface NestedApiResponse<T> {
  data: {
    data: T;
  };
  error?: {
    message: string;
    status: number;
  };
}

// Database service for handling database operations

// Feedback types
export interface Feedback {
  id: number;
  type: string;
  text: string;
  date: string;
  status: string;
  userId?: number;
  userName?: string;
}

// Form types
export interface Form {
  id: number;
  title: string;
  description: string;
  category: string;
  fileUrl: string;
  fileType: string;
  uploadedBy: string;
  uploadedAt: Date;
}

// Calendar event types
export interface CalendarEvent {
  id: number;
  title: string;
  description: string;
  date: string;
  type: string;
}

// Teacher types
export interface Teacher {
  id: number;
  name: string;
  position: string;
  email: string;
  phone: string;
  image: string;
  bio?: string;
}

// Book types
export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  category: string;
  available: boolean;
}

// Database service
export const dbService = {
  // Feedback operations
  feedback: {
    getAll: async () => {
      const response = await api.get<NestedApiResponse<Feedback[]>>(
        "/feedback"
      );
      return response;
    },

    create: async (feedback: Omit<Feedback, "id" | "date" | "status">) => {
      const response = await api.post<NestedApiResponse<Feedback>>(
        "/feedback",
        feedback
      );
      return response;
    },

    updateStatus: async (id: number, status: string) => {
      const response = await api.put<NestedApiResponse<Feedback>>(
        `/feedback/${id}`,
        { status }
      );
      return response;
    },

    delete: async (id: number) => {
      const response = await api.delete<
        NestedApiResponse<{ success: boolean }>
      >(`/feedback/${id}`);
      return response;
    },
  },

  // Forms operations
  forms: {
    getAll: async () => {
      const response = await api.get<NestedApiResponse<Form[]>>("/forms");
      return response;
    },

    create: async (formData: FormData) => {
      const response = await api.post<NestedApiResponse<Form>>(
        "/forms",
        formData
      );
      return response;
    },

    delete: async (id: number) => {
      const response = await api.delete<
        NestedApiResponse<{ success: boolean }>
      >(`/forms/${id}`);
      return response;
    },

    download: async (id: number) => {
      const response = await api.get<ApiResponse<{ downloadUrl: string }>>(
        `/forms/${id}/download`
      );
      return response;
    },
  },

  // Calendar operations
  calendar: {
    getAllEvents: async () => {
      const response = await api.get<NestedApiResponse<CalendarEvent[]>>(
        "/calendar/events"
      );
      return response;
    },

    createEvent: async (event: Omit<CalendarEvent, "id">) => {
      const response = await api.post<NestedApiResponse<CalendarEvent>>(
        "/calendar/events",
        event
      );
      return response;
    },

    updateEvent: async (id: number, event: Partial<CalendarEvent>) => {
      const response = await api.put<NestedApiResponse<CalendarEvent>>(
        `/calendar/events/${id}`,
        event
      );
      return response;
    },

    deleteEvent: async (id: number) => {
      const response = await api.delete<
        NestedApiResponse<{ success: boolean }>
      >(`/calendar/events/${id}`);
      return response;
    },
  },

  // Teachers operations
  teachers: {
    getAll: async () => {
      const response = await api.get<NestedApiResponse<Teacher[]>>("/teachers");
      return response;
    },

    create: async (teacher: Omit<Teacher, "id">) => {
      const response = await api.post<NestedApiResponse<Teacher>>(
        "/teachers",
        teacher
      );
      return response;
    },

    update: async (id: number, teacher: Partial<Teacher>) => {
      const response = await api.put<NestedApiResponse<Teacher>>(
        `/teachers/${id}`,
        teacher
      );
      return response;
    },

    delete: async (id: number) => {
      const response = await api.delete<
        NestedApiResponse<{ success: boolean }>
      >(`/teachers/${id}`);
      return response;
    },
  },

  // Books operations
  books: {
    getAll: async () => {
      const response = await api.get<NestedApiResponse<Book[]>>("/books");
      return response;
    },

    create: async (book: Omit<Book, "id">) => {
      const response = await api.post<NestedApiResponse<Book>>("/books", book);
      return response;
    },

    update: async (id: number, book: Partial<Book>) => {
      const response = await api.put<NestedApiResponse<Book>>(
        `/books/${id}`,
        book
      );
      return response;
    },

    delete: async (id: number) => {
      const response = await api.delete<
        NestedApiResponse<{ success: boolean }>
      >(`/books/${id}`);
      return response;
    },
  },
};
