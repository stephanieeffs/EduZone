import { motion } from "framer-motion";
import { Download, Filter, Pencil, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../components/ui/dropdown-menu";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { useToast } from "../hooks/use-toast";
import { useAuth } from "../lib/use-auth";

// Available form categories
type Category = "academic" | "administrative" | "permission" | "health" | "other";

// Interface for form upload/edit data
interface FormData {
  title: string;
  description: string;
  file: File | null;
  category: Category;
}

// Forms component
const Forms = () => {
  // Form management state
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    file: null,
    category: "administrative",
  });

  // UI state management
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedForm, setSelectedForm] = useState<any | null>(null);

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

  // Auth and notifications
  const { user } = useAuth();
  const { toast } = useToast();

  // Available form categories for filtering
  const categories: Category[] = [
    "academic",
    "administrative",
    "permission",
    "health",
    "other",
  ];

  // Fetch forms from the backend (on port 5000)
  const [forms, setForms] = useState<any[]>([]);
  useEffect(() => {
    const fetchForms = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/forms");  // Full API URL with port
        const data = await res.json();
        if (data.data) {
          setForms(data.data);  // Store the form data
        } else {
          toast({
            title: "Error",
            description: "No forms found in the backend",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching forms:", error);
        toast({
          title: "Error",
          description: "Failed to fetch forms. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchForms();
  }, []);  // Fetch forms on component mount

  // Filters the forms based on search and categories
  const availableForms = forms.filter((form) => {
    const matchesSearch = form.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(form.category);

    return matchesSearch && matchesCategory;
  });

  // Handle file change for form upload/edit
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
    }
  };

  // Handle form submission for new form upload
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("category", formData.category);

      if (formData.file) {
        formDataToSend.append("file", formData.file);
      }

      const res = await fetch("http://localhost:5000/api/forms", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await res.json();
      toast({
        title: "Success",
        description: "Form uploaded successfully",
      });

      setFormData({
        title: "",
        description: "",
        file: null,
        category: "administrative",
      });
      setShowUploadForm(false);
    } catch (error) {
      console.error("Error uploading form:", error);
      toast({
        title: "Error",
        description: "Failed to upload form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Handle form editing
  const handleEdit = (form: any) => {
    setSelectedForm(form);
    setFormData({
      title: form.title,
      description: form.description,
      category: form.category,
      file: null,
    });
    setShowEditForm(true);
  };

  // Handle form deletion
  const handleDelete = (form: any) => {
    setSelectedForm(form);
    setShowDeleteDialog(true);
  };

  // Handle form edit submission
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      const res = await fetch(`http://localhost:5000/api/forms/${selectedForm.id}`, {
        method: "PUT",
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
        }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      toast({
        title: "Success",
        description: "Form updated successfully",
      });

      setShowEditForm(false);
      setSelectedForm(null);
      setFormData({
        title: "",
        description: "",
        file: null,
        category: "administrative",
      });
    } catch (error) {
      console.error("Error updating form:", error);
      toast({
        title: "Error",
        description: "Failed to update form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Handle form deletion confirmation
  const handleDeleteConfirm = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/forms/${selectedForm.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      toast({
        title: "Success",
        description: "Form deleted successfully",
      });

      setShowDeleteDialog(false);
      setSelectedForm(null);
    } catch (error) {
      console.error("Error deleting form:", error);
      toast({
        title: "Error",
        description: "Failed to delete form. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle form download
const handleDownload = (form: any) => {
  const fileUrl = `http://localhost:5000/api/forms/download/${form.id}`; 
  const a = document.createElement("a");
  a.href = fileUrl;
  a.target = "_blank"; 
  a.download = form.title; 
  a.click();

  toast({
    title: "Download Started",
    description: `Downloading ${form.title}...`,
  });
};


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 py-8 flex-grow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">School Forms</h1>
              <p className="text-sm text-gray-500 mt-1">
                Access and download available forms
              </p>
            </div>

            {user?.role === "admin" && (
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => setShowUploadForm(true)}
              >
                Upload New Form
              </Button>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                type="search"
                placeholder="Search forms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full md:w-auto">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter by Category
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Categories</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {categories.map((category) => (
                  <DropdownMenuCheckboxItem
                    key={category}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedCategories([...selectedCategories, category]);
                      } else {
                        setSelectedCategories(
                          selectedCategories.filter((c) => c !== category)
                        );
                      }
                    }}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableForms.map((form) => (
              <motion.div
                key={form.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{form.title}</h3>
                    <p className="text-sm text-gray-500 mb-2">{form.description}</p>
                  </div>

                  {user?.role === "admin" && form.editable && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(form)}
                        className="text-blue-600 hover:text-blue-800 border-blue-600 hover:bg-blue-50"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(form)}
                        className="text-red-600 hover:text-red-800 border-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {form.category.charAt(0).toUpperCase() + form.category.slice(1)}
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(form)}
                    className="text-blue-600 hover:text-blue-800 border-blue-600 hover:bg-blue-50"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {availableForms.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No forms found matching your criteria.</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Upload Form Dialog */}
      {showUploadForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
          >
            <h2 className="mb-4 text-xl font-semibold">Upload New Form</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: e.target.value as Category,
                    }))
                  }
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="file">File</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowUploadForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isUploading}>
                  {isUploading ? "Uploading..." : "Upload"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Edit Form Dialog */}
      {showEditForm && selectedForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
          >
            <h2 className="mb-4 text-xl font-semibold">Edit Form</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="edit-category">Category</Label>
                <select
                  id="edit-category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: e.target.value as Category,
                    }))
                  }
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="edit-file">Replace File (Optional)</Label>
                <Input
                  id="edit-file"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowEditForm(false);
                    setSelectedForm(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isUploading}>
                  {isUploading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Form</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedForm?.title}"? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setSelectedForm(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Forms;
