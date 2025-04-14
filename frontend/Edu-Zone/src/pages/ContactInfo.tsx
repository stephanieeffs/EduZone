import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useToast } from "../hooks/use-toast";
import { api } from "../lib/api";
import { useAuth } from "../lib/use-auth";

interface ContactInfo {
  id: number;
  name: string;
  email: string;
  phone: string;
  department?: string;
  office?: string;
  office_hours?: string;
  role: string;
}

interface Teacher extends ContactInfo {
  subject?: string;
  position?: string;
  bio?: string;
  image?: string;
}

const ContactInfo = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    id: 0,
    name: "",
    email: "",
    phone: "",
    department: "",
    office: "",
    office_hours: "",
    role: "",
  });
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingTeacher, setIsAddingTeacher] = useState(false);
  const [newTeacher, setNewTeacher] = useState<Teacher>({
    id: 0,
    name: "",
    email: "",
    phone: "",
    department: "",
    office: "",
    office_hours: "",
    role: "teacher",
    subject: "",
    position: "",
    bio: "",
    image: "/images/school-logo.png",
  });
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      // Skip fetching user info for admin users
      if (user.role === "admin") {
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.get<{ data: ContactInfo }>("/auth/me");

        if (response.error) {
          throw new Error(response.error.message);
        }

        if (response.data && response.data.data) {
          setContactInfo(response.data.data);
        } else {
          setContactInfo({
            id: parseInt(user.id) || 0,
            name: user.name || "User",
            email: user.email || "user@eduzone.com",
            phone: "(555) 123-4567",
            department: user.role === "teacher" ? "Teaching" : "",
            office: user.role === "teacher" ? "Room 205" : "",
            office_hours:
              user.role === "teacher"
                ? "Monday, Wednesday, Friday: 3:00 PM - 4:00 PM"
                : "",
            role: user.role,
          });
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        toast({
          title: "Error",
          description: "Failed to load user information. Using default values.",
          variant: "destructive",
        });

        setContactInfo({
          id: parseInt(user.id) || 0,
          name: user.name || "User",
          email: user.email || "user@eduzone.com",
          phone: "(555) 123-4567",
          department: user.role === "teacher" ? "Teaching" : "",
          office: user.role === "teacher" ? "Room 205" : "",
          office_hours:
            user.role === "teacher"
              ? "Monday, Wednesday, Friday: 3:00 PM - 4:00 PM"
              : "",
          role: user.role,
        });
      } finally {
        setIsLoading(false);
      }
    };

    const fetchTeachers = async () => {
      if (!user || user.role !== "admin") {
        return;
      }

      try {
        const response = await api.get<{ data: Teacher[] }>("/teachers");

        if (response.error) {
          throw new Error(response.error.message);
        }

        if (response.data && Array.isArray(response.data.data)) {
          setTeachers(response.data.data);
        } else {
          // Use mock data if API returns empty or invalid data
          setTeachers([
            {
              id: 1,
              name: "John Smith",
              email: "john.smith@eduzone.com",
              phone: "(555) 123-4567",
              department: "Science",
              office: "Room 101",
              office_hours: "Monday, Wednesday, Friday: 9:00 AM - 10:00 AM",
              role: "teacher",
              subject: "Physics",
              position: "Physics Teacher",
              bio: "Experienced physics teacher with a passion for making science accessible to all students.",
              image: "/images/school-logo.png",
            },
            {
              id: 2,
              name: "Jane Doe",
              email: "jane.doe@eduzone.com",
              phone: "(555) 123-4568",
              department: "Mathematics",
              office: "Room 102",
              office_hours: "Tuesday, Thursday: 2:00 PM - 3:00 PM",
              role: "teacher",
              subject: "Algebra",
              position: "Mathematics Teacher",
              bio: "Dedicated mathematics teacher focused on building strong foundational skills.",
              image: "/images/school-logo.png",
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching teachers:", error);
        toast({
          title: "Error",
          description: "Failed to load teachers list. Using mock data.",
          variant: "destructive",
        });

        // Use mock data as fallback
        setTeachers([
          {
            id: 1,
            name: "John Smith",
            email: "john.smith@eduzone.com",
            phone: "(555) 123-4567",
            department: "Science",
            office: "Room 101",
            office_hours: "Monday, Wednesday, Friday: 9:00 AM - 10:00 AM",
            role: "teacher",
            subject: "Physics",
            position: "Physics Teacher",
            bio: "Experienced physics teacher with a passion for making science accessible to all students.",
            image: "/images/school-logo.png",
          },
          {
            id: 2,
            name: "Jane Doe",
            email: "jane.doe@eduzone.com",
            phone: "(555) 123-4568",
            department: "Mathematics",
            office: "Room 102",
            office_hours: "Tuesday, Thursday: 2:00 PM - 3:00 PM",
            role: "teacher",
            subject: "Algebra",
            position: "Mathematics Teacher",
            bio: "Dedicated mathematics teacher focused on building strong foundational skills.",
            image: "/images/school-logo.png",
          },
        ]);
      }
    };

    fetchUserInfo();
    fetchTeachers();
  }, [user, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      return;
    }

    if (!contactInfo.name || !contactInfo.email || !contactInfo.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);
      const response = await api.put<{ data: ContactInfo }>(
        "/auth/me",
        contactInfo
      );

      if (response.error) {
        throw new Error(response.error.message);
      }

      toast({
        title: "Contact Information Updated",
        description: "Your contact information has been successfully updated.",
      });
    } catch (error) {
      console.error("Error updating user info:", error);
      toast({
        title: "Error",
        description: "Failed to update contact information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !newTeacher.name ||
      !newTeacher.email ||
      !newTeacher.phone ||
      !newTeacher.subject ||
      !newTeacher.position
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields for the teacher.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);
      const response = await api.post<{ data: Teacher }>(
        "/teachers",
        newTeacher
      );

      if (response.error) {
        throw new Error(response.error.message);
      }

      if (response.data && response.data.data) {
        setTeachers([...teachers, response.data.data]);
        setNewTeacher({
          id: 0,
          name: "",
          email: "",
          phone: "",
          department: "",
          office: "",
          office_hours: "",
          role: "teacher",
          subject: "",
          position: "",
          bio: "",
          image: "/images/school-logo.png",
        });
        setIsAddingTeacher(false);

        toast({
          title: "Teacher Added",
          description:
            "Teacher contact information has been successfully added.",
        });
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error adding teacher:", error);
      toast({
        title: "Error",
        description: "Failed to add teacher. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTeacher = async (id: number) => {
    try {
      const response = await api.delete(`/teachers/${id}`);

      if (response.error) {
        throw new Error(response.error.message);
      }

      setTeachers(teachers.filter((teacher) => teacher.id !== id));

      toast({
        title: "Teacher Removed",
        description:
          "Teacher contact information has been successfully removed.",
      });
    } catch (error) {
      console.error("Error deleting teacher:", error);
      toast({
        title: "Error",
        description: "Failed to remove teacher. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

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
            {user?.role === "admin"
              ? "Teacher Contact Information"
              : "Contact Information"}
          </h1>

          {user ? (
            <>
              {/* Only show personal contact info form for non-admin users */}
              {user.role !== "admin" && (
                <div className="bg-white p-6 rounded-xl shadow-md max-w-2xl mx-auto mb-8">
                  <h2 className="text-xl font-semibold text-eduBlue mb-6">
                    Update Your Contact Information
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={contactInfo.name}
                          onChange={(e) =>
                            setContactInfo((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={contactInfo.email}
                          onChange={(e) =>
                            setContactInfo((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                          placeholder="Enter your email address"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={contactInfo.phone}
                          onChange={(e) =>
                            setContactInfo((prev) => ({
                              ...prev,
                              phone: e.target.value,
                            }))
                          }
                          placeholder="Enter your phone number"
                        />
                      </div>

                      {user.role === "teacher" && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="department">Department</Label>
                            <Input
                              id="department"
                              value={contactInfo.department}
                              onChange={(e) =>
                                setContactInfo((prev) => ({
                                  ...prev,
                                  department: e.target.value,
                                }))
                              }
                              placeholder="Enter your department"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="office">Office Location</Label>
                            <Input
                              id="office"
                              value={contactInfo.office}
                              onChange={(e) =>
                                setContactInfo((prev) => ({
                                  ...prev,
                                  office: e.target.value,
                                }))
                              }
                              placeholder="Enter your office location"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="officeHours">Office Hours</Label>
                            <Input
                              id="officeHours"
                              value={contactInfo.office_hours}
                              onChange={(e) =>
                                setContactInfo((prev) => ({
                                  ...prev,
                                  office_hours: e.target.value,
                                }))
                              }
                              placeholder="Enter your office hours"
                            />
                          </div>
                        </>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full mt-6 bg-eduBlue text-white hover:bg-eduBlue/90"
                      disabled={isSaving}
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </form>
                </div>
              )}

              {/* Show teacher management for admin users */}
              {user.role === "admin" && (
                <div className="bg-white p-6 rounded-xl shadow-md max-w-4xl mx-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-eduBlue">
                      Manage Teacher Contact Information
                    </h2>
                    <Button
                      onClick={() => setIsAddingTeacher(!isAddingTeacher)}
                      className="bg-eduBlue text-white hover:bg-eduBlue/90"
                    >
                      {isAddingTeacher ? "Cancel" : "Add New Teacher"}
                    </Button>
                  </div>

                  {isAddingTeacher && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-50 p-4 rounded-lg mb-6"
                    >
                      <h3 className="text-lg font-medium mb-4">
                        Add New Teacher
                      </h3>
                      <form onSubmit={handleAddTeacher} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="teacherName">Full Name</Label>
                            <Input
                              id="teacherName"
                              value={newTeacher.name}
                              onChange={(e) =>
                                setNewTeacher((prev) => ({
                                  ...prev,
                                  name: e.target.value,
                                }))
                              }
                              placeholder="Enter teacher's full name"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="teacherEmail">Email Address</Label>
                            <Input
                              id="teacherEmail"
                              type="email"
                              value={newTeacher.email}
                              onChange={(e) =>
                                setNewTeacher((prev) => ({
                                  ...prev,
                                  email: e.target.value,
                                }))
                              }
                              placeholder="Enter teacher's email address"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="teacherPhone">Phone Number</Label>
                            <Input
                              id="teacherPhone"
                              value={newTeacher.phone}
                              onChange={(e) =>
                                setNewTeacher((prev) => ({
                                  ...prev,
                                  phone: e.target.value,
                                }))
                              }
                              placeholder="Enter teacher's phone number"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="teacherPosition">Position</Label>
                            <Input
                              id="teacherPosition"
                              value={newTeacher.position}
                              onChange={(e) =>
                                setNewTeacher((prev) => ({
                                  ...prev,
                                  position: e.target.value,
                                }))
                              }
                              placeholder="Enter teacher's position"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="teacherSubject">Subject</Label>
                            <Input
                              id="teacherSubject"
                              value={newTeacher.subject}
                              onChange={(e) =>
                                setNewTeacher((prev) => ({
                                  ...prev,
                                  subject: e.target.value,
                                }))
                              }
                              placeholder="Enter teacher's subject"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="teacherDepartment">
                              Department
                            </Label>
                            <Input
                              id="teacherDepartment"
                              value={newTeacher.department}
                              onChange={(e) =>
                                setNewTeacher((prev) => ({
                                  ...prev,
                                  department: e.target.value,
                                }))
                              }
                              placeholder="Enter teacher's department"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="teacherOffice">
                              Office Location
                            </Label>
                            <Input
                              id="teacherOffice"
                              value={newTeacher.office}
                              onChange={(e) =>
                                setNewTeacher((prev) => ({
                                  ...prev,
                                  office: e.target.value,
                                }))
                              }
                              placeholder="Enter teacher's office location"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="teacherOfficeHours">
                              Office Hours
                            </Label>
                            <Input
                              id="teacherOfficeHours"
                              value={newTeacher.office_hours}
                              onChange={(e) =>
                                setNewTeacher((prev) => ({
                                  ...prev,
                                  office_hours: e.target.value,
                                }))
                              }
                              placeholder="Enter teacher's office hours"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="teacherBio">Bio</Label>
                            <Input
                              id="teacherBio"
                              value={newTeacher.bio}
                              onChange={(e) =>
                                setNewTeacher((prev) => ({
                                  ...prev,
                                  bio: e.target.value,
                                }))
                              }
                              placeholder="Enter teacher's bio"
                            />
                          </div>
                        </div>

                        <Button
                          type="submit"
                          className="w-full mt-4 bg-eduBlue text-white hover:bg-eduBlue/90"
                          disabled={isSaving}
                        >
                          {isSaving ? "Adding..." : "Add Teacher"}
                        </Button>
                      </form>
                    </motion.div>
                  )}

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Position
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Subject
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Phone
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Department
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Office
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {Array.isArray(teachers) &&
                          teachers.map((teacher) => (
                            <tr key={teacher.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {teacher.name}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {teacher.position}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {teacher.subject}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {teacher.email}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {teacher.phone}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {teacher.department}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {teacher.office}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <Button
                                  variant="ghost"
                                  className="text-red-600 hover:text-red-900"
                                  onClick={() =>
                                    handleDeleteTeacher(teacher.id)
                                  }
                                >
                                  Delete
                                </Button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <h2 className="text-xl font-semibold text-eduBlue mb-4">
                Access Restricted
              </h2>
              <p className="text-gray-500">
                Please log in to update your contact information.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ContactInfo;
