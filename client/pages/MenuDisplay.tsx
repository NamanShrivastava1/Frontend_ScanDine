import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowLeft, Coffee, MapPin, Search } from "lucide-react";

type MenuItem = {
  _id: string;
  dishName: string;
  description: string;
  images?: { url: string; fileId: string; fileName: string }[];
  isChefSpecial?: boolean;
  isAvailable?: boolean;
  halfPrice?: number;
  fullPrice?: number;
};

type MenuCategory = {
  category: string;
  items: MenuItem[];
};

type Cafe = {
  _id: string;
  cafename: string;
  address: string;
  description?: string;
};

export default function MenuDisplay() {
  const { cafeId } = useParams<{ cafeId: string }>();
  const [cafeData, setCafeData] = useState<Cafe | null>(null);
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // NEW state for search

  useEffect(() => {
    const fetchCafeAndMenu = async () => {
      try {
        const [cafesRes, menuRes] = await Promise.all([
          api.get("/cafe/public-cafes"),
          api.get(`/menu/public/${cafeId}`),
        ]);

        const allCafes = cafesRes.data.cafes;
        const selectedCafe = allCafes.find((cafe: Cafe) => cafe._id === cafeId);

        setCafeData(selectedCafe || null);
        setMenuCategories(menuRes.data.categories || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setMenuCategories([]);
      } finally {
        setLoading(false);
      }
    };

    if (cafeId) fetchCafeAndMenu();
  }, [cafeId]);

  if (loading || !cafeData)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-muted-foreground">
        <svg
          className="animate-spin h-8 w-8 mb-4 text-primary"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
        <p className="text-sm">Loading menu...</p>
      </div>
    );

  // Filtered menu based on search input
  const filteredCategories = menuCategories
    .map((category) => ({
      ...category,
      items: category.items.filter((item) =>
        item.dishName.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    }))
    .filter((category) => category.items.length > 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              <Link to="/search">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <Coffee className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">
                  {cafeData.cafename}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {cafeData.address}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="container mx-auto px-4 py-6">
        <Card className="border-none shadow-sm bg-card/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-1 text-muted-foreground mb-2">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{cafeData.address}</span>
            </div>
            <p className="text-muted-foreground">{cafeData.description}</p>
          </CardContent>
        </Card>
      </section>

      {/* 🔍 Search Bar */}
      <div className="container mx-auto px-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-xl bg-card focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Menu Display */}
      <div className="container mx-auto px-4 pb-8">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category, categoryIndex) => (
            <section key={categoryIndex} className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                {category.category}
              </h2>
              <div className="grid gap-4">
                {category.items.map((item) => (
                  <Card
                    key={item._id}
                    className={`border-none shadow-sm transition-shadow cursor-pointer ${
                      item.isAvailable
                        ? "bg-card hover:shadow-md"
                        : "bg-muted opacity-60"
                    }`}
                  >
                    <CardContent className="p-0">
                      <div className="flex gap-4 p-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <CardTitle className="text-lg">
                              {item.dishName}
                            </CardTitle>
                            <div className="text-right">
                              {item.halfPrice != null && (
                                <p className="text-sm font-medium text-primary">
                                  Half: ₹{item.halfPrice}
                                </p>
                              )}
                              {item.fullPrice != null && (
                                <p className="text-sm font-medium text-primary">
                                  Full: ₹{item.fullPrice}
                                </p>
                              )}
                            </div>
                          </div>
                          <CardDescription className="text-muted-foreground">
                            {item.description}
                          </CardDescription>

                          {/* Availability badge */}
                          <span className="text-[10px] mt-2 inline-flex items-center gap-1 text-white bg-green-500 py-1 px-2 rounded-md">
                            Available
                          </span>

                          {item.isChefSpecial && (
                            <span className="text-[10px] mt-2 ml-3 inline-flex items-center gap-1 text-white bg-yellow-500 py-1 px-2 rounded-md">
                              Chef's Special
                            </span>
                          )}
                        </div>

                        {/* Image with Dialog Gallery */}
                        <div className="w-24 h-24 sm:w-32 sm:h-32 bg-muted rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center relative border border-border">
                          {item.images && item.images.length > 0 ? (
                            <Dialog>
                              <DialogTrigger asChild>
                                <div className="w-full h-full relative cursor-pointer group">
                                  <img
                                    src={item.images[0].url}
                                    alt={item.dishName}
                                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                  />
                                  {item.images.length > 1 && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center transition-colors group-hover:bg-black/60">
                                      <span className="text-white font-bold text-lg">+{item.images.length - 1}</span>
                                    </div>
                                  )}
                                </div>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
                                <DialogTitle className="text-2xl font-bold mb-4">{item.dishName} Photos</DialogTitle>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  {item.images.map((img, idx) => (
                                    <div key={img.fileId || idx} className="rounded-xl overflow-hidden border border-border shadow-sm">
                                      <img
                                        src={img.url}
                                        alt={`${item.dishName} - ${idx + 1}`}
                                        className="w-full h-auto object-contain bg-muted/30"
                                      />
                                    </div>
                                  ))}
                                </div>
                              </DialogContent>
                            </Dialog>
                          ) : (
                            <span className="text-xs text-muted-foreground text-center px-1">No image</span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ))
        ) : (
          <p className="text-center text-muted-foreground">No items found.</p>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4">
        <div className="container mx-auto flex gap-3">
          <Button asChild variant="outline" className="flex-1">
            <Link to="/search">Browse More Cafés</Link>
          </Button>
          <Button
            asChild
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Link to="/dashboard">Own a Café?</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
