import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Textarea } from "../components/ui/textarea";
import { useToast } from "../hooks/use-toast";
import { useAuth } from "../lib/use-auth";

// Define the feedback item type based on your backend columns.
// Adjust property names if you want to remap, e.g. created_at -> date.
export interface FeedbackType {
  id: number;
  type: string;
  text: string;
  user_id?: number;
  user_name?: string;
  status: "Pending" | "Reviewed";
  created_at: string;
}

const Feedback = () => {
  const [feedbackType, setFeedbackType] = useState("general");
  const [feedbackText, setFeedbackText] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [feedbackList, setFeedbackList] = useState<FeedbackType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  // When the component mounts or user changes, check user role and fetch feedback
  useEffect(() => {
    if (user) {
      setIsAdmin(user.role === "admin");
    }
    fetchFeedback();
  }, [user]);

  // Fetch feedback data from the API endpoint
  const fetchFeedback = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/feedback");
      const data = await res.json();

      if (data.data && Array.isArray(data.data)) {
        console.log("Using API feedback data:", data.data);
        setFeedbackList(data.data);
      } else {
        toast({
          title: "Error",
          description: "No feedback found",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching feedback:", error);
      toast({
        title: "Error",
        description: "Failed to fetch feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle feedback form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) {
      toast({
        title: "Empty Feedback",
        description: "Please enter your feedback before submitting.",
        variant: "destructive",
      });
      return;
    }
    try {
      const newFeedbackPayload = {
        type: feedbackType,
        text: feedbackText,
        userId: user?.id ? Number(user.id) : null,
        userName: user?.name,
      };

      const res = await fetch("http://localhost:5000/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newFeedbackPayload),
      });
      const data = await res.json();

      if (data.data) {
        // Assuming the API returns the created feedback object.
        setFeedbackList([data.data, ...feedbackList]);
        toast({
          title: "Feedback Submitted",
          description: "Thank you for your feedback!",
        });
      } else {
        toast({
          title: "Error",
          description: "No feedback data returned",
          variant: "destructive",
        });
      }

      // Clear form fields
      setFeedbackText("");
      setFeedbackType("general");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle marking feedback as reviewed (admin only)
  const handleMarkAsReviewed = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:5000/api/feedback/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Reviewed" }),
      });
      const data = await res.json();
      if (data.data) {
        setFeedbackList((prevList) =>
          prevList.map((item) =>
            item.id === id ? { ...item, status: "Reviewed" } : item
          )
        );
        toast({
          title: "Feedback Updated",
          description: "Feedback has been marked as reviewed.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update feedback status",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating feedback:", error);
      toast({
        title: "Error",
        description: "Failed to update feedback. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle feedback deletion (admin only)
  const handleDeleteFeedback = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:5000/api/feedback/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.data && data.data.success) {
        setFeedbackList((prevList) => prevList.filter((item) => item.id !== id));
        toast({
          title: "Feedback Deleted",
          description: "Feedback has been successfully deleted.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete feedback",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting feedback:", error);
      toast({
        title: "Error",
        description: "Failed to delete feedback. Please try again.",
        variant: "destructive",
      });
    }
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
            {isAdmin ? "Feedback Management" : "Submit Feedback"}
          </h1>

          {!isAdmin && (
            <div className="bg-white p-6 rounded-xl shadow-md mb-8">
              <h2 className="text-xl font-semibold text-eduBlue mb-4">
                Share Your Thoughts
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Feedback Type</Label>
                  <RadioGroup
                    value={feedbackType}
                    onValueChange={setFeedbackType}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="general" id="general" />
                      <Label htmlFor="general">General</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="academic" id="academic" />
                      <Label htmlFor="academic">Academic</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="facilities" id="facilities" />
                      <Label htmlFor="facilities">Facilities</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="feedback">Your Feedback</Label>
                  <Textarea
                    id="feedback"
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Please share your thoughts, suggestions, or concerns..."
                    rows={5}
                  />
                </div>

                <Button
                  type="submit"
                  className="bg-eduBlue text-white hover:bg-eduBlue/90"
                >
                  Submit Feedback
                </Button>
              </form>
            </div>
          )}

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-eduBlue mb-4">
              {isAdmin ? "All Feedback" : "Your Previous Feedback"}
            </h2>

            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading feedback...</p>
              </div>
            ) : feedbackList.length > 0 ? (
              <div className="space-y-4">
                {feedbackList.map((feedback) => (
                  <motion.div
                    key={feedback.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 capitalize">
                          {feedback.type}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            feedback.status === "Reviewed"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {feedback.status}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(feedback.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-gray-700 mb-3">{feedback.text}</p>

                    {isAdmin && (
                      <div className="flex justify-end gap-2">
                        {feedback.status === "Pending" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarkAsReviewed(feedback.id)}
                            className="text-green-600 border-green-200 hover:bg-green-50"
                          >
                            Mark as Reviewed
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteFeedback(feedback.id)}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No feedback found.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Feedback;
