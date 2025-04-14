import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Textarea } from "../components/ui/textarea";
import { useToast } from "../hooks/use-toast";
import { dbService, Feedback as FeedbackType } from "../lib/db";
import { mockFeedback } from "../lib/mock-data";
import { useAuth } from "../lib/use-auth";

const Feedback = () => {
  const [feedbackType, setFeedbackType] = useState("general");
  const [feedbackText, setFeedbackText] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [feedbackList, setFeedbackList] = useState<FeedbackType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    // Check if user is admin
    if (user) {
      setIsAdmin(user.role === "admin");
    }

    // Fetch feedback data
    fetchFeedback();
  }, [user]);

  const fetchFeedback = async () => {
    setIsLoading(true);
    try {
      // Try to fetch from API first
      const response = await dbService.feedback.getAll();

      // Check if we have valid data in the response
      if (
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data) &&
        response.data.data.length > 0
      ) {
        console.log("Using API data:", response.data.data);
        setFeedbackList(response.data.data);
      } else {
        // If API fails, returns empty array, or returns invalid data, use mock data
        console.log("Using mock data due to empty or invalid API response");
        setFeedbackList(mockFeedback);
      }
    } catch (error) {
      console.log("Using mock data due to API error:", error);
      setFeedbackList(mockFeedback);
    } finally {
      setIsLoading(false);
    }
  };

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
      const newFeedback = {
        type: feedbackType,
        text: feedbackText,
        userId: user?.id ? Number(user.id) : undefined,
        userName: user?.name,
      };

      // Try to submit to API first
      await dbService.feedback.create(newFeedback);

      // Create mock feedback regardless of API response
      const mockResponse: FeedbackType = {
        id: feedbackList.length + 1,
        type: feedbackType,
        text: feedbackText,
        date: new Date().toISOString(),
        status: "Pending",
        userId: user?.id ? Number(user.id) : undefined,
        userName: user?.name,
      };
      setFeedbackList([mockResponse, ...feedbackList]);

      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback!",
      });

      // Clear form
      setFeedbackText("");
      setFeedbackType("general");
    } catch (error) {
      // If API fails, create mock feedback
      const mockResponse: FeedbackType = {
        id: feedbackList.length + 1,
        type: feedbackType,
        text: feedbackText,
        date: new Date().toISOString(),
        status: "Pending",
        userId: user?.id ? Number(user.id) : undefined,
        userName: user?.name,
      };
      setFeedbackList([mockResponse, ...feedbackList]);

      toast({
        title: "Feedback Submitted (Mock)",
        description: "Thank you for your feedback! (Saved locally)",
      });

      // Clear form
      setFeedbackText("");
      setFeedbackType("general");
    }
  };

  const handleMarkAsReviewed = async (id: number) => {
    try {
      // Try to update via API first
      await dbService.feedback.updateStatus(id, "Reviewed");

      // Update local state regardless of API response
      setFeedbackList((prevList) =>
        prevList.map((item) =>
          item.id === id ? { ...item, status: "Reviewed" } : item
        )
      );

      toast({
        title: "Feedback Updated",
        description: "Feedback has been marked as reviewed.",
      });
    } catch (error) {
      // If API fails, update mock data
      setFeedbackList((prevList) =>
        prevList.map((item) =>
          item.id === id ? { ...item, status: "Reviewed" } : item
        )
      );

      toast({
        title: "Feedback Updated (Mock)",
        description: "Feedback has been marked as reviewed (saved locally).",
      });
    }
  };

  const handleDeleteFeedback = async (id: number) => {
    try {
      // Try to delete via API first
      await dbService.feedback.delete(id);

      // Update local state regardless of API response
      setFeedbackList((prevList) => prevList.filter((item) => item.id !== id));

      toast({
        title: "Feedback Deleted",
        description: "Feedback has been successfully deleted.",
      });
    } catch (error) {
      // If API fails, delete from mock data
      setFeedbackList((prevList) => prevList.filter((item) => item.id !== id));

      toast({
        title: "Feedback Deleted (Mock)",
        description: "Feedback has been successfully deleted (saved locally).",
      });
    }
  };

  // For debugging
  useEffect(() => {
    console.log("Current feedback list:", feedbackList);
  }, [feedbackList]);

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
                        {new Date(feedback.date).toLocaleDateString()}
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
