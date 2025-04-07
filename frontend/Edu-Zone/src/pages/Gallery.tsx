import { motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { useToast } from "../hooks/use-toast";
import { ImageWithFallback } from "../lib/image-utils";
import { useAuth } from "../lib/use-auth";

// Define the GalleryItem interface
interface GalleryItem {
  id: number;
  title: string;
  description: string;
  imageSrc: string;
  category: string;
}

// Mock data for gallery items
const mockGalleryItems: GalleryItem[] = [
  {
    id: 1,
    title: "School Building",
    description: "Our modern school building",
    imageSrc: "/images/school-building.jpg",
    category: "Campus",
  },
  {
    id: 2,
    title: "Classroom",
    description: "Students in class",
    imageSrc: "/images/classroom.jpg",
    category: "Academic",
  },
  {
    id: 3,
    title: "Sports Day",
    description: "Annual sports competition",
    imageSrc: "/images/sports-day.jpg",
    category: "Events",
  },
  {
    id: 4,
    title: "Science Lab",
    description: "State-of-the-art laboratory",
    imageSrc: "/images/science-lab.jpg",
    category: "Facilities",
  },
  {
    id: 5,
    title: "Library",
    description: "School library",
    imageSrc: "/images/library.jpg",
    category: "Facilities",
  },
  {
    id: 6,
    title: "Art Exhibition",
    description: "Student artwork display",
    imageSrc: "/images/art-exhibition.jpg",
    category: "Events",
  },
];

const Gallery = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [galleryItems, setGalleryItems] =
    useState<GalleryItem[]>(mockGalleryItems);
  const [isLoading, setIsLoading] = useState(false); // Set to false since we're using mock data

  const [activeCategory, setActiveCategory] = useState("All");
  const categories = [
    "All",
    "Events",
    "Learning",
    "Resources",
    "Campus",
    "Academic",
    "Facilities",
  ];

  // State for the add item modal
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [newItem, setNewItem] = useState<Omit<GalleryItem, "id">>({
    title: "",
    description: "",
    imageSrc: "",
    category: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const filteredItems =
    activeCategory === "All"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);

      // Create a preview URL for the image
      const imageUrl = URL.createObjectURL(file);
      setNewItem((prev) => ({ ...prev, imageSrc: imageUrl }));
    }
  };

  // Handle adding a new gallery item
  const handleAddItem = async () => {
    if (!newItem.title || !newItem.category || !imageFile) {
      toast({
        title: "Error",
        description: "Please fill in all required fields and upload an image",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      // Instead of calling the API, we'll simulate a delay and add the item locally
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Create a new gallery item with a unique ID
      const newGalleryItem: GalleryItem = {
        id: Math.max(...galleryItems.map((item) => item.id)) + 1,
        title: newItem.title,
        description: newItem.description,
        imageSrc: newItem.imageSrc, // This is the preview URL
        category: newItem.category,
      };

      setGalleryItems([...galleryItems, newGalleryItem]);

      // Reset form and close modal
      setNewItem({
        title: "",
        description: "",
        imageSrc: "",
        category: "",
      });
      setImageFile(null);
      setShowAddItemModal(false);

      toast({
        title: "Success",
        description: "Gallery item added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add gallery item",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Handle deleting a gallery item
  const handleDeleteItem = async (id: number) => {
    try {
      // Instead of calling the API, we'll simulate a delay and delete the item locally
      await new Promise((resolve) => setTimeout(resolve, 500));

      setGalleryItems(galleryItems.filter((item) => item.id !== id));
      toast({
        title: "Success",
        description: "Gallery item deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete gallery item",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-grow flex items-center justify-center">
          <p className="text-gray-500">Loading gallery items...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 py-8 flex-grow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-blue-800">
                Frankfield Primary & Infant School - Photo Gallery
              </h1>
              {user && user.role !== "admin" && (
                <p className="text-gray-600 mt-1">
                  Welcome, <span className="font-semibold">{user.name}</span>!
                  Browse through our gallery.
                </p>
              )}
            </div>

            {user?.role === "admin" && (
              <Button
                onClick={() => setShowAddItemModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add New Item
              </Button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow group"
              >
                <div className="relative h-56 overflow-hidden">
                  <ImageWithFallback
                    src={item.imageSrc}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-2 right-2 bg-white bg-opacity-80 px-2 py-1 rounded text-xs font-medium">
                    {item.category}
                  </div>
                  {user?.role === "admin" && (
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="absolute top-2 left-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                      aria-label="Delete item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="text-xl font-semibold text-blue-700 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <p className="text-center text-gray-500 mt-8">
              No gallery items found for this category.
            </p>
          )}
        </motion.div>
      </div>

      {/* Add Item Modal */}
      <Dialog open={showAddItemModal} onOpenChange={setShowAddItemModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Gallery Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newItem.title}
                onChange={(e) =>
                  setNewItem((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Enter item title"
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newItem.description}
                onChange={(e) =>
                  setNewItem((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Enter item description"
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={newItem.category}
                onChange={(e) =>
                  setNewItem((prev) => ({ ...prev, category: e.target.value }))
                }
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="">Select a category</option>
                {categories
                  .filter((category) => category !== "All")
                  .map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <Label htmlFor="image">Image</Label>
              <Input
                id="image"
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                required
              />
              {newItem.imageSrc && (
                <div className="mt-2">
                  <img
                    src={newItem.imageSrc}
                    alt="Preview"
                    className="max-h-40 rounded-md"
                  />
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddItemModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleAddItem}
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Add Item"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Gallery;
