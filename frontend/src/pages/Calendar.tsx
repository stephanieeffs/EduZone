import { motion } from "framer-motion";
import { Circle, Plus } from "lucide-react";
import { useState } from "react";
import Navbar from "../components/Navbar";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Calendar as CalendarComponent } from "../components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { useToast } from "../hooks/use-toast";
import { useAuth } from "../lib/use-auth";

const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState<Omit<CalendarEvent, "id">>({
    title: "",
    date: new Date(),
    description: "",
    category: "event",
  });

  type EventCategory = "term" | "holiday" | "exam" | "event" | "public";

  type CalendarEvent = {
    id: number;
    title: string;
    date: Date;
    description: string;
    category: EventCategory;
  };

  const categoryColors = {
    term: "bg-blue-100 text-blue-800",
    holiday: "bg-green-100 text-green-800",
    exam: "bg-red-100 text-red-800",
    event: "bg-purple-100 text-purple-800",
    public: "bg-yellow-100 text-yellow-800",
  };

  const [events, setEvents] = useState<CalendarEvent[]>([
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
    {
      id: 22,
      title: "Boxing Day",
      date: new Date(2025, 11, 26),
      description: "Public holiday - school closed",
      category: "public",
    },

    // Major School Events
    {
      id: 23,
      title: "PEP Exams Begin",
      date: new Date(2025, 2, 18),
      description: "Primary Exit Profile exams for Grade 6 students",
      category: "exam",
    },
    {
      id: 24,
      title: "CSEC Exams Begin",
      date: new Date(2025, 4, 5),
      description: "Caribbean Secondary Education Certificate exams",
      category: "exam",
    },
    {
      id: 25,
      title: "CAPE Exams Begin",
      date: new Date(2025, 4, 5),
      description: "Caribbean Advanced Proficiency Examination",
      category: "exam",
    },
    {
      id: 26,
      title: "JCDC Music Competition",
      date: new Date(2025, 1, 10),
      description: "Jamaica Cultural Development Commission music competition",
      category: "event",
    },
    {
      id: 27,
      title: "School Sports Day",
      date: new Date(2025, 1, 20),
      description: "Annual school sports competition",
      category: "event",
    },
    {
      id: 28,
      title: "JTA Primary Schools Athletics",
      date: new Date(2025, 4, 12),
      description:
        "Jamaica Teachers' Association Primary Schools Athletics Championship",
      category: "event",
    },
    {
      id: 29,
      title: "Graduation Ceremony",
      date: new Date(2025, 5, 25),
      description: "Annual graduation ceremony",
      category: "event",
    },
    {
      id: 30,
      title: "Academic Award Ceremony",
      date: new Date(2025, 5, 28),
      description: "Annual prize-giving and academic awards",
      category: "event",
    },
    {
      id: 31,
      title: "Back-to-School Expo",
      date: new Date(2025, 7, 20),
      description: "Back-to-school preparation fair",
      category: "event",
    },
    {
      id: 32,
      title: "ISSA/GraceKennedy Boys and Girls Championships",
      date: new Date(2025, 2, 25),
      description:
        "Jamaica's premier high school track and field competition (March 25-29, 2025)",
      category: "event",
    },

    // Previous events from original file
    {
      id: 33,
      title: "Parent-Teacher Meeting",
      date: new Date(2025, 3, 10),
      description: "Discuss student progress",
      category: "event",
    },
    {
      id: 34,
      title: "Science Fair",
      date: new Date(2025, 3, 15),
      description: "Annual science exhibition",
      category: "event",
    },
    {
      id: 35,
      title: "Sports Day",
      date: new Date(2025, 3, 20),
      description: "Annual sports competition",
      category: "event",
    },
    {
      id: 36,
      title: "Book Fair",
      date: new Date(2025, 3, 25),
      description: "Book exhibition and sale",
      category: "event",
    },
  ]);

  const { user } = useAuth();
  const { toast } = useToast();

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      const dayEvents = events.filter(
        (e) =>
          e.date.getDate() === selectedDate.getDate() &&
          e.date.getMonth() === selectedDate.getMonth() &&
          e.date.getFullYear() === selectedDate.getFullYear()
      );
      if (dayEvents.length > 0) {
        setSelectedEvent(dayEvents[0]);
      }
    }
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(
      (e) =>
        e.date.getDate() === date.getDate() &&
        e.date.getMonth() === date.getMonth() &&
        e.date.getFullYear() === date.getFullYear()
    );
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const eventToAdd: CalendarEvent = {
      ...newEvent,
      id: Math.max(...events.map((e) => e.id), 0) + 1,
    };

    setEvents([...events, eventToAdd]);
    setShowAddEventModal(false);
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
    setSelectedEvent(null);
    toast({
      title: "Success",
      description: "Event deleted successfully",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="flex items-center gap-4">
              <h1 className="text-4xl font-bold">Academic Calendar</h1>
              {user?.role === "admin" && (
                <Button
                  onClick={() => setShowAddEventModal(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2"
                >
                  <Plus className="h-5 w-5" />
                </Button>
              )}
            </div>
            <p className="text-muted-foreground text-center max-w-2xl">
              View and track important academic dates, holidays, and events
              throughout the year.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card rounded-lg shadow-lg p-6">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                className="rounded-md border"
                modifiers={{
                  hasEvent: (date) => getEventsForDate(date).length > 0,
                }}
                modifiersStyles={{
                  hasEvent: {
                    fontWeight: "bold",
                    textDecoration: "underline",
                  },
                }}
              />
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                  Terms
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-green-100 text-green-800"
                >
                  Holidays
                </Badge>
                <Badge variant="outline" className="bg-red-100 text-red-800">
                  Exams
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-purple-100 text-purple-800"
                >
                  Events
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-yellow-100 text-yellow-800"
                >
                  Public Holidays
                </Badge>
              </div>
            </div>

            <div className="bg-card rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
              <div className="space-y-4">
                {events
                  .filter((event) => event.date >= new Date())
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .slice(0, 5)
                  .map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <Circle
                        className={`h-2 w-2 mt-2 ${
                          categoryColors[event.category]
                        }`}
                      />
                      <div>
                        <h3 className="font-medium">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {event.date.toLocaleDateString()}
                        </p>
                        <p className="text-sm mt-1">{event.description}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <Dialog
        open={!!selectedEvent}
        onOpenChange={() => setSelectedEvent(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge
                  className={categoryColors[selectedEvent?.category || "event"]}
                >
                  {selectedEvent?.category}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {selectedEvent?.date.toLocaleDateString()}
                </span>
              </div>
              {user?.role === "admin" && (
                <Button
                  onClick={() =>
                    selectedEvent && handleDeleteEvent(selectedEvent.id)
                  }
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  Delete Event
                </Button>
              )}
            </div>
            <p className="text-sm">{selectedEvent?.description}</p>
          </div>
        </DialogContent>
      </Dialog>

      {showAddEventModal && (
        <Dialog open={showAddEventModal} onOpenChange={setShowAddEventModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Event</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <Input
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                  placeholder="Event title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={newEvent.category}
                  onChange={(e) =>
                    setNewEvent({
                      ...newEvent,
                      category: e.target.value as EventCategory,
                    })
                  }
                >
                  <option value="event">Event</option>
                  <option value="term">Term</option>
                  <option value="holiday">Holiday</option>
                  <option value="exam">Exam</option>
                  <option value="public">Public Holiday</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <Input
                  type="date"
                  value={newEvent.date.toISOString().split("T")[0]}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, date: new Date(e.target.value) })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={newEvent.description}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, description: e.target.value })
                  }
                  rows={3}
                  placeholder="Event description"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <Button
                  onClick={() => setShowAddEventModal(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddEvent}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Add Event
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Calendar;
