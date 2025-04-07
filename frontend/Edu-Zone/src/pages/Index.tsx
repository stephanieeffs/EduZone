import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Button } from "../components/ui/button";
import { ImageWithFallback } from "../lib/image-utils";

const Index = () => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({ opacity: 1, y: 0 });
  }, [controls]);

  return (
    <div className="min-h-screen bg-white overflow-hidden flex flex-col">
      <Navbar />

      <div className="relative flex-grow flex flex-col">
        {/* Main content section */}
        <div className="relative z-10 w-full grid grid-cols-1 md:grid-cols-2 bg-gradient-to-r from-blue-50 to-white">
          {/* Left section with text */}
          <div className="px-8 md:px-16 lg:px-24 py-12 flex flex-col justify-center">
            <motion.div
              className="mb-8 flex flex-col items-center md:items-start"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <ImageWithFallback
                src="/lovable-uploads/dfa0455a-c492-4a07-b378-84116d082992.png"
                alt="Frankfield Primary & Infant School Crest"
                className="w-32 h-32 object-contain mb-4"
              />
              <h1 className="text-4xl md:text-5xl font-bold text-blue-800 text-center md:text-left">
                Frankfield Primary <br />
                <span className="text-blue-600">& Infant School</span>
              </h1>
              <div className="h-1 w-40 bg-blue-600 mt-4"></div>
            </motion.div>

            <motion.p
              className="mt-8 text-slate-600 max-w-xl text-lg leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              Welcome to Frankfield Primary & Infant School, where we believe
              education is the key to success. Our mission is to provide a
              nurturing environment for our students to learn, grow, and reach
              their full potential.
            </motion.p>

            <motion.div
              className="mt-10 flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Link to="/login">
                <Button className="bg-blue-700 hover:bg-blue-800 text-white px-10 py-7 rounded-md text-lg font-medium transition-opacity duration-300 group">
                  Log In
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="ml-2 group-hover:translate-x-1 transition-transform duration-300"
                  >
                    <path
                      d="M14.4301 5.93005L20.5001 12.0001L14.4301 18.0701"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M3.5 12H20.33"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Button>
              </Link>

              <Link to="/gallery">
                <Button
                  variant="outline"
                  className="px-10 py-7 rounded-md text-lg font-medium border-2 border-blue-300 hover:bg-blue-50 transition-colors duration-300"
                >
                  View Gallery
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Right section with images */}
          <div className="relative flex items-center justify-center px-8 py-12 bg-blue-50">
            <motion.div
              className="relative w-full h-96 rounded-xl overflow-hidden shadow-xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.6 }}
            >
              <ImageWithFallback
                src="/lovable-uploads/b37d01ae-820d-4841-b3a4-1ae1de4cb040.png"
                alt="Students learning outdoors"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">
                  Education is the key to success
                </h3>
                <p className="text-white/90">Reach for it!</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-blue-800 mb-12">
              School Resources
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                className="bg-blue-50 rounded-lg p-8 text-center shadow-md hover:shadow-lg transition-shadow"
                whileHover={{ y: -10 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="w-16 h-16 bg-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-blue-800 mb-2">
                  Library
                </h3>
                <p className="text-gray-600 mb-4">
                  Access our extensive collection of books and learning
                  resources.
                </p>
                <Link
                  to="/library"
                  className="text-blue-600 font-medium hover:underline"
                >
                  Explore Library →
                </Link>
              </motion.div>

              <motion.div
                className="bg-blue-50 rounded-lg p-8 text-center shadow-md hover:shadow-lg transition-shadow"
                whileHover={{ y: -10 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="w-16 h-16 bg-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-blue-800 mb-2">
                  Calendar
                </h3>
                <p className="text-gray-600 mb-4">
                  Stay updated with school events, holidays and important dates.
                </p>
                <Link
                  to="/calendar"
                  className="text-blue-600 font-medium hover:underline"
                >
                  View Calendar →
                </Link>
              </motion.div>

              <motion.div
                className="bg-blue-50 rounded-lg p-8 text-center shadow-md hover:shadow-lg transition-shadow"
                whileHover={{ y: -10 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="w-16 h-16 bg-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-blue-800 mb-2">
                  Staff Directory
                </h3>
                <p className="text-gray-600 mb-4">
                  Meet our dedicated teachers and staff members.
                </p>
                <Link
                  to="/staff"
                  className="text-blue-600 font-medium hover:underline"
                >
                  Meet Our Team →
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Index;
