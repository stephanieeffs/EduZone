import { motion } from "framer-motion";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DiagonalBackground from "../components/DiagonalBackground";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useToast } from "../hooks/use-toast";
import { ImageWithFallback } from "../lib/image-utils";
import { useAuth } from "../lib/use-auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password);
      toast({
        title: "Success",
        description: "Welcome back!",
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Login failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left side with login form */}
        <motion.div
          className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-full max-w-md">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="flex items-center mb-8">
                <div className="relative w-12 h-12 mr-3">
                  <ImageWithFallback
                    src="/images/school-logo.png"
                    alt="School Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <h1 className="text-3xl font-bold text-blue-800">FPS Portal</h1>
              </div>
            </motion.div>

            <motion.h2
              className="text-2xl font-bold mb-6 text-blue-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Welcome back
            </motion.h2>

            <motion.form
              onSubmit={handleLogin}
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="text-sm text-blue-600 hover:underline">
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3"
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-700 hover:bg-blue-800 text-white py-6"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </motion.form>

            <motion.div
              className="mt-8 text-center text-gray-500 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <p>For demo, use these accounts:</p>
              <p className="mt-2">admin@eduzone.com / admin123</p>
              <p>teacher@eduzone.com / teacher123</p>
              <p>parent@eduzone.com / parent123</p>
              <p>librarian@eduzone.com / librarian123</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Right side with background */}
        <div className="relative hidden md:block md:w-1/2 bg-blue-700">
          <DiagonalBackground />
          <motion.div
            className="relative z-10 w-full h-full flex flex-col justify-center items-center p-16 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <img
              src="/images/school-logo.png"
              alt="School Logo"
              className="w-32 h-32 object-contain mb-6"
            />
            <h2 className="text-3xl font-bold mb-6 text-center">
              Frankfield Primary & Infant School
            </h2>
            <p className="text-lg max-w-md text-center leading-relaxed">
              Education is the key to success. Connect with teachers, track
              academic progress, and stay updated with school events.
            </p>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
