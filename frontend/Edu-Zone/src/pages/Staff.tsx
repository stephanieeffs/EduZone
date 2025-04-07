import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useToast } from "../hooks/use-toast";
import { api } from "../lib/api";

// Staff departments
const departments = [
  "All",
  "Administration",
  "Teaching",
  "Specialist",
  "Support",
];

// Define the Staff type
interface Staff {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  image: string;
  bio: string;
  role: string;
}

// Single source of mock data
const mockStaffData: Staff[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    position: "Principal",
    department: "Administration",
    email: "sarah.johnson@fps.edu",
    phone: "(555) 123-4567",
    image: "/images/school-logo.png",
    bio: "Dr. Johnson has been the principal of Frankfield Primary & Infant School for 10 years. She holds a Ph.D. in Educational Leadership and is committed to providing quality education for all students.",
    role: "principal",
  },
  {
    id: "2",
    name: "Mr. James Wilson",
    position: "Vice Principal",
    department: "Administration",
    email: "james.wilson@fps.edu",
    phone: "(555) 123-4568",
    image: "/images/school-logo.png",
    bio: "Mr. Wilson has been with the school for 8 years. He specializes in student discipline and parent communication.",
    role: "vice-principal",
  },
  {
    id: "3",
    name: "Ms. Emily Rodriguez",
    position: "Grade 1 Teacher",
    department: "Teaching",
    email: "emily.rodriguez@fps.edu",
    phone: "(555) 123-4569",
    image: "/images/school-logo.png",
    bio: "Ms. Rodriguez has been teaching for 5 years. She has a passion for early childhood education and creating engaging learning environments.",
    role: "teacher",
  },
  {
    id: "4",
    name: "Mr. David Chen",
    position: "Grade 2 Teacher",
    department: "Teaching",
    email: "david.chen@fps.edu",
    phone: "(555) 123-4570",
    image: "/images/school-logo.png",
    bio: "Mr. Chen has been teaching for 7 years. He specializes in mathematics education and incorporates technology into his lessons.",
    role: "teacher",
  },
  {
    id: "5",
    name: "Ms. Lisa Thompson",
    position: "Grade 3 Teacher",
    department: "Teaching",
    email: "lisa.thompson@fps.edu",
    phone: "(555) 123-4571",
    image: "/images/school-logo.png",
    bio: "Ms. Thompson has been teaching for 9 years. She has a background in special education and is dedicated to inclusive teaching practices.",
    role: "teacher",
  },
  {
    id: "6",
    name: "Mr. Michael Brown",
    position: "Physical Education Teacher",
    department: "Specialist",
    email: "michael.brown@fps.edu",
    phone: "(555) 123-4572",
    image: "/images/school-logo.png",
    bio: "Mr. Brown has been teaching PE for 6 years. He is a former athlete and promotes healthy living and physical activity among students.",
    role: "teacher",
  },
  {
    id: "7",
    name: "Ms. Patricia Lee",
    position: "Art Teacher",
    department: "Specialist",
    email: "patricia.lee@fps.edu",
    phone: "(555) 123-4573",
    image: "/images/school-logo.png",
    bio: "Ms. Lee has been teaching art for 8 years. She has a background in fine arts and encourages creative expression in her students.",
    role: "teacher",
  },
  {
    id: "8",
    name: "Mr. Robert Garcia",
    position: "Librarian",
    department: "Support",
    email: "robert.garcia@fps.edu",
    phone: "(555) 123-4574",
    image: "/images/school-logo.png",
    bio: "Mr. Garcia has been the school librarian for 5 years. He has a Master's in Library Science and is passionate about promoting literacy.",
    role: "librarian",
  },
  {
    id: "9",
    name: "Ms. Jennifer White",
    position: "School Nurse",
    department: "Support",
    email: "jennifer.white@fps.edu",
    phone: "(555) 123-4575",
    image: "/images/school-logo.png",
    bio: "Ms. White has been the school nurse for 7 years. She has a background in pediatric nursing and ensures the health and safety of all students.",
    role: "school-nurse",
  },
  {
    id: "10",
    name: "Mr. Thomas Anderson",
    position: "IT Specialist",
    department: "Support",
    email: "thomas.anderson@fps.edu",
    phone: "(555) 123-4576",
    image: "/images/school-logo.png",
    bio: "Mr. Anderson has been the IT specialist for 4 years. He manages the school's technology infrastructure and provides technical support.",
    role: "it-specialist",
  },
  {
    id: "11",
    name: "Ms. Maria Santos",
    position: "Grade 4 Teacher",
    department: "Teaching",
    email: "maria.santos@fps.edu",
    phone: "(555) 123-4577",
    image: "/images/school-logo.png",
    bio: "Ms. Santos has been teaching for 6 years. She specializes in language arts and creates an inclusive classroom environment.",
    role: "teacher",
  },
  {
    id: "12",
    name: "Mr. John Parker",
    position: "Grade 5 Teacher",
    department: "Teaching",
    email: "john.parker@fps.edu",
    phone: "(555) 123-4578",
    image: "/images/school-logo.png",
    bio: "Mr. Parker has been teaching for 10 years. He focuses on project-based learning and STEM education.",
    role: "teacher",
  },
  {
    id: "13",
    name: "Ms. Rachel Green",
    position: "Grade 6 Teacher",
    department: "Teaching",
    email: "rachel.green@fps.edu",
    phone: "(555) 123-4579",
    image: "/images/school-logo.png",
    bio: "Ms. Green has been teaching for 8 years. She excels in preparing students for their transition to secondary education.",
    role: "teacher",
  },
  {
    id: "14",
    name: "Mr. Kevin Williams",
    position: "Music Teacher",
    department: "Specialist",
    email: "kevin.williams@fps.edu",
    phone: "(555) 123-4580",
    image: "/images/school-logo.png",
    bio: "Mr. Williams has been teaching music for 12 years. He leads the school band and choir programs.",
    role: "teacher",
  },
  {
    id: "15",
    name: "Ms. Sarah Martinez",
    position: "ESL Teacher",
    department: "Specialist",
    email: "sarah.martinez@fps.edu",
    phone: "(555) 123-4581",
    image: "/images/school-logo.png",
    bio: "Ms. Martinez has been teaching ESL for 7 years. She helps students develop strong English language skills while celebrating their cultural diversity.",
    role: "teacher",
  },
  {
    id: "16",
    name: "Dr. Michael Chang",
    position: "Special Education Teacher",
    department: "Teaching",
    email: "michael.chang@fps.edu",
    phone: "(555) 123-4582",
    image: "/images/school-logo.png",
    bio: "Dr. Chang has been in special education for 15 years. He develops individualized learning plans and provides support for students with diverse needs.",
    role: "teacher",
  },
  {
    id: "17",
    name: "Ms. Amanda Foster",
    position: "Guidance Counselor",
    department: "Support",
    email: "amanda.foster@fps.edu",
    phone: "(555) 123-4583",
    image: "/images/school-logo.png",
    bio: "Ms. Foster has been a guidance counselor for 9 years. She provides academic and emotional support to students and their families.",
    role: "counselor",
  },
  {
    id: "18",
    name: "Mr. Christopher Lee",
    position: "Science Teacher",
    department: "Teaching",
    email: "christopher.lee@fps.edu",
    phone: "(555) 123-4584",
    image: "/images/school-logo.png",
    bio: "Mr. Lee has been teaching science for 8 years. He makes science fun and engaging through hands-on experiments and real-world applications.",
    role: "teacher",
  },
];

const Staff = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [staff, setStaff] = useState<Staff[]>(mockStaffData);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Fetch staff data from the API
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setLoading(true);

        // Check if we're using demo mode
        const token = localStorage.getItem("eduzone-token");
        const isUsingDemoMode = token && token.startsWith("demo_");

        // If using demo mode, use mock data directly
        if (isUsingDemoMode) {
          console.log("Using demo mode for staff data");
          setStaff(mockStaffData);
          toast({
            title: "Demo Mode",
            description: "Using sample staff information",
            variant: "default",
          });
          setLoading(false);
          return;
        }

        // Otherwise try to fetch from API
        const response = await api.get<any>("/staff");

        // Check if we have a valid response with data
        if (response.error) {
          throw new Error(
            response.error.message || "Failed to fetch staff data"
          );
        }

        // Handle different response formats from the backend
        let staffData = [];

        // The backend might return data in different formats:
        // 1. { data: Staff[] } - direct array of staff members
        // 2. { data: { data: Staff[] } } - nested data object
        // 3. { data: mockData.staff } - mock data structure

        if (response.data) {
          if (Array.isArray(response.data)) {
            staffData = response.data;
          } else if (response.data.data && Array.isArray(response.data.data)) {
            staffData = response.data.data;
          } else if (
            response.data.data &&
            response.data.data.data &&
            Array.isArray(response.data.data.data)
          ) {
            staffData = response.data.data.data;
          }
        }

        // If we have API data, transform and use it
        if (staffData.length > 0) {
          const transformedStaff = staffData.map((member: any) => ({
            id: member.id.toString(),
            name: member.name,
            position:
              member.position ||
              (member.role === "teacher"
                ? "Teacher"
                : member.role.charAt(0).toUpperCase() + member.role.slice(1)),
            department:
              member.department ||
              (member.role === "teacher" ? "Teaching" : "Administration"),
            email: member.email,
            phone: member.phone || "N/A",
            image: member.image || "/images/school-logo.png",
            bio:
              member.bio ||
              `${member.name} is a dedicated member of our staff.`,
            role: member.role,
          }));
          setStaff(transformedStaff);
          toast({
            title: "Staff Loaded",
            description: "Successfully loaded staff data",
            variant: "default",
          });
        } else {
          // No valid data received, use mock data
          console.log("No staff data received from API, using mock data");
          setStaff(mockStaffData);
          toast({
            title: "Using Demo Data",
            description: "Displaying sample staff information",
            variant: "default",
          });
        }
      } catch (error) {
        console.error("Error fetching staff:", error);
        // Fall back to mock data on error
        console.log("Error fetching staff data, using mock data instead");
        setStaff(mockStaffData);
        toast({
          title: "Using Demo Data",
          description: "Displaying sample staff information",
          variant: "default",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [toast]);

  // Filter staff based on search term and department
  const filteredStaff = staff.filter((staff) => {
    const matchesSearch = staff.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDepartment =
      selectedDepartment === "All" || staff.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
        <Footer />
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
          <h1 className="text-3xl font-bold text-eduNavy mb-6">Our Staff</h1>
          <p className="text-gray-600 mb-8">
            Meet the dedicated professionals who make Frankfield Primary &
            Infant School a nurturing environment for learning and growth.
          </p>

          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Staff</Label>
              <Input
                id="search"
                placeholder="Search by name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-64">
              <Label htmlFor="department">Filter by Department</Label>
              <select
                id="department"
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                {departments.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading staff data...</p>
            </div>
          ) : selectedStaff ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gray-50 p-6 rounded-lg mb-8"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3">
                  <img
                    src={selectedStaff.image}
                    alt={selectedStaff.name}
                    className="w-full h-auto rounded-lg shadow-md"
                  />
                </div>
                <div className="w-full md:w-2/3">
                  <h2 className="text-2xl font-bold text-eduNavy mb-2">
                    {selectedStaff.name}
                  </h2>
                  <p className="text-lg text-eduBlue mb-1">
                    {selectedStaff.position}
                  </p>
                  <p className="text-gray-600 mb-4">
                    {selectedStaff.department}
                  </p>
                  <div className="mb-4">
                    <p className="text-gray-700">
                      <span className="font-semibold">Email:</span>{" "}
                      <a
                        href={`mailto:${selectedStaff.email}`}
                        className="text-eduBlue hover:underline"
                      >
                        {selectedStaff.email}
                      </a>
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Phone:</span>{" "}
                      <a
                        href={`tel:${selectedStaff.phone}`}
                        className="text-eduBlue hover:underline"
                      >
                        {selectedStaff.phone}
                      </a>
                    </p>
                  </div>
                  <p className="text-gray-700">{selectedStaff.bio}</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setSelectedStaff(null)}
                  >
                    Back to Staff List
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStaff.map((staff) => (
                <motion.div
                  key={staff.id}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden"
                  onClick={() => setSelectedStaff(staff)}
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={staff.image}
                      alt={staff.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-eduNavy mb-1">
                      {staff.name}
                    </h3>
                    <p className="text-eduBlue mb-1">{staff.position}</p>
                    <p className="text-gray-600 text-sm">{staff.department}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {!loading && filteredStaff.length === 0 && !selectedStaff && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No staff members found matching your criteria.
              </p>
            </div>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Staff;
