import { motion } from "framer-motion";
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { useToast } from "../hooks/use-toast";

const ContactTeacher = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const { toast } = useToast();

  const teachers = [
    { id: 1, name: "Ms. Johnson", subject: "Mathematics" },
    { id: 2, name: "Mr. Smith", subject: "Science" },
    { id: 3, name: "Ms. Davis", subject: "English" },
    { id: 4, name: "Mr. Wilson", subject: "History" },
    { id: 5, name: "Ms. Brown", subject: "Art" },
    { id: 6, name: "Mr. Miller", subject: "Physical Education" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTeacher || !subject || !message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields before sending.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Message Sent",
      description: "Your message has been sent to the teacher.",
    });

    // Clear form
    setSubject("");
    setMessage("");
    setSelectedTeacher("");
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col"
        >
          <h1 className="text-3xl font-bold text-eduNavy mb-6">
            Contact Teacher
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1 bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold text-eduBlue mb-4">
                Teachers Directory
              </h2>

              <div className="space-y-3">
                {teachers.map((teacher) => (
                  <motion.div
                    key={teacher.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedTeacher === teacher.name
                        ? "bg-eduBlue text-white"
                        : "bg-gray-50 text-gray-800 hover:bg-gray-100"
                    }`}
                    onClick={() => setSelectedTeacher(teacher.name)}
                  >
                    <h3 className="font-medium">{teacher.name}</h3>
                    <p
                      className={`text-sm ${
                        selectedTeacher === teacher.name
                          ? "text-blue-100"
                          : "text-gray-500"
                      }`}
                    >
                      {teacher.subject}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold text-eduBlue mb-4">
                Send Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="teacher">To</Label>
                  <Input
                    id="teacher"
                    value={selectedTeacher}
                    readOnly
                    placeholder="Select a teacher from the list"
                    className={!selectedTeacher ? "italic text-gray-400" : ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter message subject"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here..."
                    rows={6}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-eduBlue text-white hover:bg-eduBlue/90"
                >
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactTeacher;
