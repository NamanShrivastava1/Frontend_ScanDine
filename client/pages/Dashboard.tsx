import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  QrCode,
  Coffee,
  Upload,
  Plus,
  Edit,
  Trash2,
  Download,
  ArrowLeft,
  Moon,
  Sun,
  AlertTriangle,
  Wrench,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDarkMode } from "@/hooks/use-dark-mode";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    dishName: "",
    category: "",
    description: "",
    isChefSpecial: false,
    halfPrice: "",
    fullPrice: "",
  });
  const [editFormData, setEditFormData] = useState({
    dishName: "",
    category: "",
    description: "",
    isChefSpecial: false,
    halfPrice: "",
    fullPrice: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const navigate = useNavigate();

  // User profile data
  const [profileData, setProfileData] = useState({
    fullname: "",
    email: "",
    mobile: "",
  });

  // Delete account state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  // Dark mode functionality
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  // Selected item for editing
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Delete menu item confirmation state
  const [isDeleteItemModalOpen, setIsDeleteItemModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [isDeletingItem, setIsDeletingItem] = useState(false);

  const categories = [
    "Starters",
    "Main Course",
    "Desserts",
    "Drinks",
    "Snacks",
    "Breakfast",
    "Coffee & Tea",
    "Beverages",
  ];

  interface CafeInfo {
    cafename: string;
    phoneNo: string;
    address: string;
    description: string;
    logo: string;
  }

  const [cafeinfo, setCafeinfo] = useState<CafeInfo>({
    cafename: "Café Central",
    phoneNo: "5551234567",
    address: "123 Main Street, Anytown",
    description: "Artisanal coffee and fresh pastries in the heart of downtown",
    logo: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
    if (errors.category) {
      setErrors((prev) => ({ ...prev, category: "" }));
    }
  };

  const handleEditCategoryChange = (value: string) => {
    setEditFormData((prev) => ({ ...prev, category: value }));
    if (errors.category) {
      setErrors((prev) => ({ ...prev, category: "" }));
    }
  };

  const handleChefSpecialToggle = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isChefSpecial: checked }));
  };

  const handleEditChefSpecialToggle = (checked: boolean) => {
    setEditFormData((prev) => ({ ...prev, isChefSpecial: checked }));
  };

  const openEditModal = (item: any) => {
    setSelectedItem({ ...item, id: item._id });
    setEditFormData({
      dishName: item.dishName,
      category: item.category,
      description: item.description,
      halfPrice: item.halfPrice || "",
      fullPrice: item.fullPrice || "",
      isChefSpecial: item.isChefSpecial || false,
    });
    setErrors({});
    setIsEditModalOpen(true);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic frontend validation
    if (!formData.dishName || !formData.category) {
      toast.error("Please fill all required fields.");
      return;
    }

    // ✅ Validate half/full prices
    if (!formData.halfPrice && !formData.fullPrice) {
      toast.error("At least one price (Half or Full) is required.");
      return;
    }

    if (formData.halfPrice) {
      const numHalf = Number(formData.halfPrice);
      if (isNaN(numHalf) || numHalf <= 0) {
        toast.error("Half price must be a valid number.");
        return;
      }
    }

    if (formData.fullPrice) {
      const numFull = Number(formData.fullPrice);
      if (isNaN(numFull) || numFull <= 0) {
        toast.error("Full price must be a valid number.");
        return;
      }
    }

    try {
      const payload: any = {
        dishName: formData.dishName,
        category: formData.category,
        description: formData.description,
        isChefSpecial: formData.isChefSpecial,
        price: formData.fullPrice || formData.halfPrice, // send at least one as price
        halfPrice: formData.halfPrice ? Number(formData.halfPrice) : undefined,
        fullPrice: formData.fullPrice ? Number(formData.fullPrice) : undefined,
      };

      const response = await axios.post(
        "https://backend-7hhj.onrender.com/api/dashboard/menu",
        payload,
        { withCredentials: true },
      );

      fetchMenuItems();
      toast.success("Menu item added successfully!");
      setIsAddModalOpen(false);
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.data?.errors) {
        const messages = error.response.data.errors
          .map((e: any) => e.msg)
          .join("\n");
        toast.error("Validation failed:\n" + messages);
      } else if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error("Error: " + error.response.data.message);
      } else {
        toast.error("Something went wrong!");
      }
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const newErrors: Record<string, string> = {};

    // Validate form inputs
    if (!editFormData.dishName?.trim()) {
      newErrors.dishName = "Dish name is required";
    }

    if (!editFormData.category) {
      newErrors.category = "Category is required";
    }

    // ✅ Half/Full price validation
    if (
      (!editFormData.halfPrice && !editFormData.fullPrice) ||
      (editFormData.halfPrice?.toString().trim() === "" &&
        editFormData.fullPrice?.toString().trim() === "")
    ) {
      newErrors.price = "At least one price (Half or Full) is required";
    } else {
      if (editFormData.halfPrice) {
        if (
          isNaN(Number(editFormData.halfPrice)) ||
          Number(editFormData.halfPrice) <= 0
        ) {
          newErrors.halfPrice = "Please enter a valid half price";
        }
      }
      if (editFormData.fullPrice) {
        if (
          isNaN(Number(editFormData.fullPrice)) ||
          Number(editFormData.fullPrice) <= 0
        ) {
          newErrors.fullPrice = "Please enter a valid full price";
        }
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const menuId = selectedItem._id || selectedItem.id;
    if (!menuId) {
      toast.error("Menu item ID is missing. Cannot update.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: any = {
        dishName: editFormData.dishName,
        category: editFormData.category,
        description: editFormData.description,
      };

      // ✅ Add halfPrice/fullPrice if provided
      if (editFormData.halfPrice !== undefined)
        payload.halfPrice = Number(editFormData.halfPrice);
      if (editFormData.fullPrice !== undefined)
        payload.fullPrice = Number(editFormData.fullPrice);

      if (editFormData.isChefSpecial !== undefined) {
        payload.isChefSpecial = editFormData.isChefSpecial === true;
      }

      const response = await axios.put(
        `https://backend-7hhj.onrender.com/api/dashboard/menu/${menuId}`,
        payload,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        },
      );

      fetchMenuItems();

      if (response.status === 200) {
        const updatedItem = response.data.menu;
        setMenuItems((prevItems) =>
          prevItems.map((item) =>
            item._id === updatedItem._id ? updatedItem : item,
          ),
        );

        toast.success("Menu item updated successfully!");
        setIsEditModalOpen(false);
      } else {
        toast.error("Failed to update menu item. Please try again.");
      }
    } catch (error: any) {
      console.error("❌ Error updating menu item:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        toast.error(`Update failed: ${errorMessage}`);
      } else {
        toast.error("An unexpected error occurred while updating the menu item");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      dishName: "",
      category: "",
      description: "",
      halfPrice: "",
      fullPrice: "",
      isChefSpecial: false,
    });
    setErrors({});
  };

  // Delete menu item handlers
  const openDeleteModal = (item: any) => {
    setItemToDelete(item);
    setIsDeleteItemModalOpen(true);
  };

  const handleDeleteItem = async () => {
    if (!itemToDelete) return;

    setIsDeletingItem(true);

    try {
      const response = await api.delete(`/menu/${itemToDelete._id}`);

      if (response.status === 200) {
        setMenuItems((prevItems) =>
          prevItems.filter((item) => item._id !== itemToDelete._id),
        );
        setIsDeleteItemModalOpen(false);
        setItemToDelete(null);
        toast.success(`"${itemToDelete.dishName}" has been deleted successfully!`);
      }
    } catch (error) {
      console.error("Error deleting menu item:", error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to delete menu item");
      } else {
        toast.error("An unexpected error occurred while deleting the menu item");
      }
    } finally {
      setIsDeletingItem(false);
    }
  };

  // Delete account handler
  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);

    try {
      const response = await axios.delete(
        "https://backend-7hhj.onrender.com/api/users/delete",
        {
          withCredentials: true,
        },
      );

      if (response.status === 200) {
        toast.success("Your account has been deleted successfully!");
        navigate("/");
      } else {
        toast.error("Failed to delete account. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("An error occurred while deleting your account. Please try again.");
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setCafeinfo((prev) => ({ ...prev, [name]: value }));
  };

  const signOutHandler = async () => {
    const response = await axios.get(
      "https://backend-7hhj.onrender.com/api/users/logout",
      {
        withCredentials: true,
      },
    );

    navigate("/signin");

    toast.success("You have been signed out successfully!");
    console.log(response);
  };

  useEffect(() => {
    const getUserProfile = async () => {
      const response = await axios.get(
        "https://backend-7hhj.onrender.com/api/users/dashboard/profile",
        {
          withCredentials: true,
        },
      );
      setProfileData({
        fullname: response.data.user.fullname,
        email: response.data.user.email,
        mobile: response.data.user.mobile,
      });
      console.log(response);
    };

    getUserProfile();
  }, []);

  const cafeInfoHandler = async () => {
    console.log("Sending cafe info:", cafeinfo);
    try {
      const response = await axios.post(
        "https://backend-7hhj.onrender.com/api/dashboard/cafeinfo",
        cafeinfo,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // ✅ REQUIRED for sending cookies
        },
      );

      toast.success("Café information updated successfully!");

      // Optional: show success message or update UI
      console.log("Cafe added:", response.data);
    } catch (error) {
      console.error(
        "Error adding cafe:",
        error.response?.data || error.message,
      );
    }
  };

  const api = axios.create({
    baseURL: "https://backend-7hhj.onrender.com/api/dashboard",
    withCredentials: true, // This sends cookies automatically
    headers: {
      "Content-Type": "application/json",
    },
  });

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);

      // Only fetch menu items, no cafe data needed
      const menuResponse = await api.get("/my-menu");
      setMenuItems(menuResponse.data.menuItems || []);
      console.log(menuResponse.data.menuItems);
    } catch (error) {
      console.error("Error fetching menu:", error);

      if (error.response?.status === 401) {
        setError("Authentication failed. Please log in again.");
      } else if (error.response?.status === 404) {
        setError("No cafe found. Please create a cafe first.");
      } else {
        setError(error.response?.data?.message || "Dashboard only for Owners.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCafe = async () => {
      try {
        const res = await axios.get(
          "https://backend-7hhj.onrender.com/api/dashboard/showCafe",
          {
            withCredentials: true,
          },
        );

        const { cafename, phoneNo, address, description, logo } = res.data.cafe;

        setCafeinfo({
          cafename: cafename || "Cafe Placeholder",
          phoneNo: phoneNo || "9876543210",
          address: address || "123 Main Street, Ujjain",
          description:
            description || "A cozy spot for great coffee and snacks.",
          logo: logo || "",
        });
      } catch (err) {
        console.error("Error fetching cafe data:", err.message);
        // Do not clear state so dummy values remain visible
      }
    };

    fetchCafe();
  }, []);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        await axios.get("https://backend-7hhj.onrender.com/api/users/me", {
          withCredentials: true,
        });
        setIsAuthenticated(true);
      } catch (error: any) {
        if (error.response?.status === 401) {
          setError("Your session has expired. Please log in again.");
          setTimeout(() => navigate("/signin"), 4000);
        } else if (error.response?.status === 403) {
          // 🔑 User not verified
          setError("Please verify your email before accessing the dashboard.");
          setTimeout(() => navigate("/verify-otp"), 4000);
        } else {
          setError(
            error.response?.data?.message ||
              "You are not logged in. Please log in to access the Dashboard.",
          );
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, [navigate]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-cream via-background to-accent dark:from-background dark:via-muted dark:to-background px-6 text-center transition-colors">
        {/* Wobbling Icon */}
        <motion.div
          animate={{ rotate: [0, -20, 20, -10, 10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="mb-4"
        >
          <Wrench className="text-orange-500 w-16 h-16" />
        </motion.div>

        {/* Main Title */}
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Oops, something broke!
        </h1>

        {/* Optional error message */}
        <p className="text-muted-foreground mb-6">
          {error || "An unexpected error occurred. Please try again later."}
        </p>

        {/* Action Buttons */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex flex-wrap justify-center gap-3"
        >
          <Link
            to="/"
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg shadow hover:bg-primary/90 transition"
          >
            Take Me Home
          </Link>
          <Link
            to="/signin"
            className="px-6 py-2 bg-muted text-foreground rounded-lg border hover:bg-muted/80 transition"
          >
            Login
          </Link>
        </motion.div>
      </div>
    );
  }

  if (loading)
    return (
      <div className="animate-pulse min-h-screen bg-gradient-to-b from-[#fff7e8] to-[#fdf6e3] p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div className="h-10 w-32 bg-gray-300 rounded" /> {/* Logo */}
          <div className="flex gap-4">
            <div className="h-6 w-20 bg-gray-300 rounded" />
            <div className="h-6 w-20 bg-gray-300 rounded" />
            <div className="h-6 w-10 bg-gray-300 rounded" />
            <div className="h-8 w-16 bg-gray-300 rounded" />
          </div>
        </div>

        {/* Main Title */}
        <div className="text-center space-y-4 mb-10">
          <div className="h-8 w-2/3 mx-auto bg-gray-300 rounded" />
          <div className="h-8 w-1/2 mx-auto bg-gray-300 rounded" />
          <div className="h-4 w-3/4 mx-auto bg-gray-200 rounded mt-4" />
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mb-14">
          <div className="h-10 w-32 bg-gray-300 rounded" />
          <div className="h-10 w-36 bg-gray-300 rounded" />
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[1, 2, 3].map((_, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow-md space-y-4"
            >
              <div className="h-12 w-12 bg-gray-300 rounded-full mx-auto" />
              <div className="h-4 w-1/2 mx-auto bg-gray-300 rounded" />
              <div className="h-4 w-3/4 mx-auto bg-gray-200 rounded" />
              <div className="h-4 w-2/3 mx-auto bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                <Link to="/">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <QrCode className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-semibold text-foreground">
                  {cafeinfo.cafename || "Café Name"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Dark Mode Toggle */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleDarkMode}
                  className="h-9 w-9 p-0 hover:bg-accent hover:text-accent-foreground"
                  aria-label={
                    isDarkMode ? "Switch to light mode" : "Switch to dark mode"
                  }
                >
                  {isDarkMode ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                </Button>
                <span className="hidden sm:inline text-sm text-muted-foreground">
                  {isDarkMode ? "Light" : "Dark"}
                </span>
              </div>

              <Button onClick={signOutHandler} variant="outline" size="sm">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="cafe-info" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-lg">
            <TabsTrigger value="cafe-info">Café Info</TabsTrigger>
            <TabsTrigger value="menu">Menu</TabsTrigger>
            <TabsTrigger value="qr-code">QR Code</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Café Information Tab */}
          <TabsContent value="cafe-info" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Café Information</CardTitle>
                <CardDescription>
                  Update your café details and business information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cafe-name">Café Name</Label>
                    <Input
                      id="cafename"
                      name="cafename"
                      value={cafeinfo.cafename}
                      onChange={handleChange}
                      placeholder="Your café name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cafe-phone">Phone Number</Label>
                    <Input
                      id="phoneNo"
                      name="phoneNo"
                      value={cafeinfo.phoneNo}
                      onChange={handleChange}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="cafe-address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={cafeinfo.address}
                    onChange={handleChange}
                    placeholder="123 Main Street, Anytown"
                  />
                </div>
                <div>
                  <Label htmlFor="cafe-description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={cafeinfo.description}
                    onChange={handleChange}
                    placeholder="Describe your café..."
                  />
                </div>
                <div>
                  <Label htmlFor="cafe-logo">Logo Upload</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center">
                      <Coffee className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Change Logo
                    </Button>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={cafeInfoHandler}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Save Changes
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="border-sage text-sage hover:bg-sage/10"
                  >
                    <Link to="/dashboard/qrcode">Generate QR Code</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Menu Management Tab */}
          <TabsContent value="menu" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Menu Management
                </h2>
                <p className="text-muted-foreground">
                  Add and manage your menu items
                </p>
              </div>
              {/* Add Item Modal */}
              <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={() => setIsAddModalOpen(true)}
                  >
                    <Plus className="w-4 h-4" />
                    Add Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                      Add New Menu Item
                    </DialogTitle>
                    <DialogDescription>
                      Fill in the details below to add a new item to your menu.
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    {/* Dish Name */}
                    <div className="space-y-2">
                      <Label htmlFor="dishName" className="text-sm font-medium">
                        Dish Name *
                      </Label>
                      <Input
                        id="dishName"
                        name="dishName"
                        type="text"
                        placeholder="e.g., Cappuccino, Caesar Salad"
                        value={formData.dishName}
                        onChange={handleInputChange}
                        className={`h-10 ${errors.dishName ? "border-destructive" : ""}`}
                      />
                      {errors.dishName && (
                        <p className="text-xs text-destructive">
                          {errors.dishName}
                        </p>
                      )}
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-sm font-medium">
                        Category *
                      </Label>
                      <Select
                        value={formData.category}
                        onValueChange={handleCategoryChange}
                      >
                        <SelectTrigger
                          className={`h-10 ${errors.category ? "border-destructive" : ""}`}
                        >
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.category && (
                        <p className="text-xs text-destructive">
                          {errors.category}
                        </p>
                      )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="description"
                        className="text-sm font-medium"
                      >
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Describe your dish..."
                        value={formData.description}
                        onChange={handleInputChange}
                        className="min-h-[80px] resize-none"
                      />
                    </div>

                    {/* Chef Special Toggle */}
                    <div className="flex items-center justify-between space-x-2 p-3 bg-accent/30 rounded-lg">
                      <div className="space-y-1">
                        <Label className="text-sm font-medium">
                          🌟 Chef Special
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Mark this item as chef's special recommendation
                        </p>
                      </div>
                      <Switch
                        checked={formData.isChefSpecial}
                        onCheckedChange={handleChefSpecialToggle}
                        className="data-[state=checked]:bg-coral"
                      />
                    </div>

                    {/* Half & Full Price */}
                    <div className="space-y-2">
                      <Label htmlFor="price" className="text-sm font-medium">
                        Price *
                      </Label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                            ₹
                          </span>
                          <Input
                            name="halfPrice"
                            value={formData.halfPrice || ""}
                            onChange={handleInputChange}
                            placeholder="Half price"
                            className={`h-10 pl-8 ${errors.halfPrice ? "border-destructive" : ""}`}
                          />
                        </div>
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                            ₹
                          </span>
                          <Input
                            name="fullPrice"
                            value={formData.fullPrice || ""}
                            onChange={handleInputChange}
                            placeholder="Full price"
                            className={`h-10 pl-8 ${errors.fullPrice ? "border-destructive" : ""}`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsAddModalOpen(false);
                          resetForm();
                        }}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />{" "}
                            Adding...
                          </>
                        ) : (
                          "Add to Menu"
                        )}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Menu Items List */}
            <div className="space-y-4">
              {menuItems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No menu items found. Add your first menu item!
                </div>
              ) : (
                menuItems.map((item) => (
                  <Card key={item._id}>
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        {/* Item Info */}
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-20 h-20 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
                            <img
                              src={`https://backend-7hhj.onrender.com/uploads/menu/${item.category}.jpg`}
                              alt={item.dishName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-semibold">{item.dishName}</h3>
                            {item.isChefSpecial && (
                              <span className="text-[10px] mt-2 mb-2 text-white bg-yellow-500 py-1 px-2 rounded-md">
                                Chef's Special
                              </span>
                            )}
                            <p className="text-sm text-muted-foreground">
                              {item.description || "No description available"}
                            </p>

                            {/* Display Prices */}
                            <p className="font-semibold text-primary">
                              {item.halfPrice && `Half: ₹${item.halfPrice}`}
                              {item.halfPrice && item.fullPrice && " | "}
                              {item.fullPrice && `Full: ₹${item.fullPrice}`}
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                          {/* Toggle Availability */}
                          <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-card">
                            <Switch
                              checked={item.isAvailable}
                              onCheckedChange={async () => {
                                try {
                                  const { data } = await axios.put(
                                    `https://backend-7hhj.onrender.com/api/dashboard/menu/${item._id}/toggle-availability`,
                                  );
                                  setMenuItems((prev) =>
                                    prev.map((m) =>
                                      m._id === item._id
                                        ? {
                                            ...m,
                                            isAvailable: data.isAvailable,
                                          }
                                        : m,
                                    ),
                                  );
                                } catch (err) {
                                  console.error(
                                    "Failed to toggle availability:",
                                    err,
                                  );
                                }
                              }}
                            />
                            <span className="text-sm">
                              {item.isAvailable ? "Available" : "Unavailable"}
                            </span>
                          </div>

                          {/* Edit Button */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditModal(item)}
                          >
                            <Edit className="w-4 h-4 mr-1" /> Edit
                          </Button>

                          {/* Delete Button */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDeleteModal(item)}
                          >
                            <Trash2 className="w-4 h-4 mr-1" /> Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Edit Item Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
              <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto bg-card border-border shadow-lg transition-colors duration-300">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-foreground">
                    Edit Menu Item
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Update the details of your menu item below.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleEditSubmit} className="space-y-4 mt-4">
                  {/* Dish Name */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">
                      Dish Name *
                    </Label>
                    <Input
                      name="dishName"
                      value={editFormData.dishName || ""}
                      onChange={handleEditInputChange}
                      className={`h-10 bg-background border-border text-foreground ${errors.dishName ? "border-destructive" : ""}`}
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">
                      Category *
                    </Label>
                    <Select
                      value={editFormData.category || ""}
                      onValueChange={handleEditCategoryChange}
                    >
                      <SelectTrigger
                        className={`h-10 bg-background border-border text-foreground ${errors.category ? "border-destructive" : ""}`}
                      >
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">
                      Description
                    </Label>
                    <Textarea
                      name="description"
                      value={editFormData.description || ""}
                      onChange={handleEditInputChange}
                      className="min-h-[80px] resize-none bg-background border-border text-foreground"
                    />
                  </div>

                  {/* Chef Special Toggle */}
                  <div className="flex items-center justify-between space-x-2 p-3 bg-accent/30 rounded-lg border border-border">
                    <div className="space-y-1">
                      <Label className="text-sm font-medium text-foreground">
                        🌟 Chef Special
                      </Label>
                    </div>
                    <Switch
                      checked={editFormData.isChefSpecial}
                      onCheckedChange={handleEditChefSpecialToggle}
                      className="data-[state=checked]:bg-coral"
                    />
                  </div>

                  {/* Half & Full Price */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">
                      Price *
                    </Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                          ₹
                        </span>
                        <Input
                          name="halfPrice"
                          value={editFormData.halfPrice || ""}
                          onChange={handleEditInputChange}
                          placeholder="Half price"
                          className="h-10 pl-8"
                        />
                      </div>
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                          ₹
                        </span>
                        <Input
                          name="fullPrice"
                          value={editFormData.fullPrice || ""}
                          onChange={handleEditInputChange}
                          placeholder="Full price"
                          className="h-10 pl-8"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditModalOpen(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <AlertDialog
              open={isDeleteItemModalOpen}
              onOpenChange={setIsDeleteItemModalOpen}
            >
              <AlertDialogContent className="sm:max-w-md bg-card border-border shadow-xl">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-xl font-bold text-destructive">
                    Are you sure you want to delete this item?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-base leading-relaxed text-muted-foreground">
                    This action cannot be undone. The dish "
                    {itemToDelete?.dishName}" will be permanently removed from
                    your menu.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-3">
                  <AlertDialogCancel
                    onClick={() => setIsDeleteItemModalOpen(false)}
                    className="flex-1 border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteItem}
                    disabled={isDeletingItem}
                    className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeletingItem ? "Deleting..." : "Yes, Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </TabsContent>

          {/* QR Code Tab */}
          <TabsContent value="qr-code" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your QR Code</CardTitle>
                <CardDescription>
                  Download and print your QR code for customers to scan
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div className="inline-block p-8 bg-sage rounded-2xl">
                  <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center">
                    <div className="w-40 h-40 bg-black rounded-lg flex items-center justify-center">
                      <QrCode className="w-32 h-32 text-white" />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-center gap-4">
                    {/*                     <Button
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      PNG
                    </Button>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      SVG
                    </Button> */}
                  </div>
                  <div className="flex gap-3">
                    <Button className="flex-1 bg-coral hover:bg-coral/90 text-coral-foreground">
                      Print QR Code
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="flex-1 border-primary text-primary hover:bg-primary/10"
                    >
                      <Link to="/dashboard/qrcode">Generate QR Code</Link>
                    </Button>
                  </div>
                </div>
                <div className="bg-cream rounded-lg p-4 text-left">
                  <h4 className="font-semibold mb-2">How to use:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>
                      • Print this QR code and place it on tables, at the
                      entrance, or any visible spot in your café
                    </li>
                    <li>
                      • Customers can scan with their smartphones to access your
                      digital menu
                    </li>
                    <li>• No app downloads required for customers</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="flex justify-center">
              <Card className="w-full max-w-md border-none shadow-lg bg-card/70 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
                    👤 Your Profile
                  </CardTitle>
                  <CardDescription>Your account information</CardDescription>
                </CardHeader>

                <CardContent className="flex flex-col gap-4">
                  {/* Profile Avatar */}
                  <div className="flex justify-center mb-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-food-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-2xl font-bold text-white">AM</span>
                    </div>
                  </div>

                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">
                      Full Name
                    </Label>
                    <div className="h-11 px-3 py-2 bg-muted/30 border border-border rounded-md flex items-center">
                      <span className="text-foreground">
                        {profileData.fullname}
                      </span>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">
                      Email
                    </Label>
                    <div className="h-11 px-3 py-2 bg-muted/30 border border-border rounded-md flex items-center">
                      <span className="text-foreground">
                        {profileData.email}
                      </span>
                    </div>
                  </div>

                  {/* Mobile Number */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">
                      Mobile Number
                    </Label>
                    <div className="h-11 px-3 py-2 bg-muted/30 border border-border rounded-md flex items-center">
                      <span className="text-foreground">
                        {profileData.mobile}
                      </span>
                    </div>
                  </div>

                  {/* Account Status */}
                  <div className="flex items-center justify-between p-4 bg-fresh-50 rounded-lg border border-fresh-200 mt-4">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-fresh-500 rounded-full"></div>
                      <span className="text-sm font-medium text-fresh-700">
                        Account Active
                      </span>
                    </div>
                    <span className="text-xs text-fresh-600">Verified ✓</span>
                  </div>

                  {/* Delete Account Section */}
                  <div className="mt-6 pt-6 border-t border-border">
                    <AlertDialog
                      open={isDeleteModalOpen}
                      onOpenChange={setIsDeleteModalOpen}
                    >
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-center text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20 hover:border-destructive/30"
                          onClick={() => setIsDeleteModalOpen(true)}
                        >
                          🗑️ Delete Account
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="sm:max-w-md">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-xl font-bold text-destructive">
                            Are you sure you want to delete your account?
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-base leading-relaxed">
                            This action cannot be undone. All your data will be
                            permanently removed, including:
                            <ul className="list-disc list-inside mt-3 space-y-1">
                              <li>Your café information and menu items</li>
                              <li>QR codes and customer data</li>
                              <li>Account settings and preferences</li>
                            </ul>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="gap-3">
                          <AlertDialogCancel
                            className="flex-1"
                            disabled={isDeletingAccount}
                          >
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteAccount}
                            disabled={isDeletingAccount}
                            className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {isDeletingAccount ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                Deleting...
                              </>
                            ) : (
                              "Yes, Delete"
                            )}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      This action cannot be undone. All your data will be
                      permanently deleted.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
