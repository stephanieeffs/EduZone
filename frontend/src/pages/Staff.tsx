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

const Staff = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Fetch staff data from the API
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setLoading(true);
        
        // Fetch from your API endpoint
        const response = await fetch("http://localhost:5000/api/staff");
        
        if (!response.ok) {
          throw new Error("Failed to fetch staff data");
        }
        
        const data = await response.json();
        
        // Handle different response formats from the backend
        let staffData = [];
        
        if (data.data && Array.isArray(data.data)) {
          staffData = data.data;
        } else if (Array.isArray(data)) {
          staffData = data;
        } else {
          throw new Error("Invalid staff data format");
        }
        
        // Transform the data to match the Staff interface
        const transformedStaff = staffData.map((member: any) => ({
          id: member.id.toString(),
          name: member.name || `${member.first_name} ${member.last_name}`,
          position: member.position || "Staff Member",
          department: member.department || "Teaching",
          email: member.email || "N/A",
          phone: member.phone || "N/A",
          image: member.image || "/images/school-logo.png",
          bio: member.bio || `${member.name} is a dedicated member of our staff.`,
          role: member.role || "staff",
        }));
        
        setStaff(transformedStaff);
        toast({
          title: "Success",
          description: "Staff data loaded successfully",
          variant: "default",
        });
      } catch (error) {
        console.error("Error fetching staff:", error);
        toast({
          title: "Error",
          description: "Failed to load staff data",
          variant: "destructive",
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
