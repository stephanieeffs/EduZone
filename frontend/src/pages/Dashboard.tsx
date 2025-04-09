import { motion } from "framer-motion";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Button } from "../components/ui/button";
import { useToast } from "../hooks/use-toast";
import { useAuth } from "../lib/use-auth";

interface UserData {
  role: string;
  name: string;
  token: string;
}

interface DashboardCardProps {
  title: string;
  description: string;
  onClick?: () => void;
  icon?: React.ReactNode;
}

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check for authenticated user
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to access the dashboard",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
  }, [user, navigate, toast]);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

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
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard
            </h1>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="text-eduNavy border-eduNavy hover:bg-eduNavy hover:text-white"
            >
              Logout
            </Button>
          </div>

          <div className="p-4 bg-blue-50 rounded-md mb-6">
            <p className="text-eduBlue">
              Welcome back, <span className="font-semibold">{user.name}</span>!
              You are logged in as a{" "}
              <span className="font-semibold">{user.role}</span>.
            </p>
          </div>

          {/* Admin Features */}
          {user.role === "admin" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <DashboardCard
                title="Manage Calendar"
                description="Add and manage school events"
                onClick={() => navigate("/admin-management?tab=calendar")}
              />
              <DashboardCard
                title="User Management"
                description="Manage system users and roles"
                onClick={() => navigate("/admin-management?tab=users")}
              />
              <DashboardCard
                title="Review Feedback"
                description="View and manage parent feedback"
                onClick={() => navigate("/admin-management?tab=feedback")}
              />
            </div>
          )}

          {/* Parent Features */}
          {user.role === "parent" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <DashboardCard
                title="View Calendar"
                description="Check upcoming school events"
                onClick={() => navigate("/calendar")}
              />
              <DashboardCard
                title="School Library"
                description="Access the school library"
                onClick={() => navigate("/library")}
              />
              <DashboardCard
                title="Multimedia Gallery"
                description="View school photos and videos"
                onClick={() => navigate("/gallery")}
              />
              <DashboardCard
                title="Downloadable Forms"
                description="Access and download school forms"
                onClick={() => navigate("/forms")}
              />
              <DashboardCard
                title="Contact Teacher"
                description="Send messages to teachers"
                onClick={() => navigate("/contact-teacher")}
              />
              <DashboardCard
                title="Submit Feedback"
                description="Share your feedback with the school"
                onClick={() => navigate("/feedback")}
              />
              <DashboardCard
                title="Contact Information"
                description="Update your contact details"
                onClick={() => navigate("/contact-info")}
              />
            </div>
          )}

          {/* Teacher Features */}
          {user.role === "teacher" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <DashboardCard
                title="View Calendar"
                description="Check upcoming school events"
                onClick={() => navigate("/calendar")}
              />
              <DashboardCard
                title="School Library"
                description="Access the school library"
                onClick={() => navigate("/library")}
              />
              <DashboardCard
                title="Multimedia Gallery"
                description="View school photos and videos"
                onClick={() => navigate("/gallery")}
              />
              <DashboardCard
                title="Downloadable Forms"
                description="Access and download school forms"
                onClick={() => navigate("/forms")}
              />
              <DashboardCard
                title="Contact Information"
                description="Update your contact details"
                onClick={() => navigate("/contact-info")}
              />
            </div>
          )}

          {/* Librarian Features */}
          {user.role === "librarian" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <DashboardCard
                title="View Calendar"
                description="Check upcoming school events"
                onClick={() => navigate("/calendar")}
              />
              <DashboardCard
                title="Manage Library"
                description="Manage school library resources"
                onClick={() => navigate("/library")}
              />
              <DashboardCard
                title="Multimedia Gallery"
                description="View school photos and videos"
                onClick={() => navigate("/gallery")}
              />
              <DashboardCard
                title="Downloadable Forms"
                description="Access and download school forms"
                onClick={() => navigate("/forms")}
              />
              <DashboardCard
                title="Contact Information"
                description="Update your contact details"
                onClick={() => navigate("/contact-info")}
              />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

// Helper component for dashboard cards
const DashboardCard = ({
  title,
  description,
  onClick,
  icon,
}: DashboardCardProps) => (
  <motion.div
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    className="bg-white border border-gray-200 p-5 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer"
    onClick={onClick}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        {icon && <div className="mr-2">{icon}</div>}
        <h3 className="text-lg font-semibold text-eduNavy mb-2">{title}</h3>
      </div>
    </div>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

export default Dashboard;
