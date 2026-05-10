import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
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
import { ArrowLeft, MapPin, Search } from "lucide-react";

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
  image?: string;
};

export default function MenuDisplay() {
  const { cafeId } = useParams<{ cafeId: string }>();
  const [cafeData, setCafeData] = useState<Cafe | null>(null);
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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
      <div className="min-h-screen flex flex-col items-center justify-center text-muted-foreground bg-background">
        <svg
          className="animate-spin h-10 w-10 mb-4 text-primary"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
        <p className="text-sm font-medium tracking-wide">Crafting the menu...</p>
      </div>
    );

  const filteredCategories = menuCategories
    .map((category) => ({
      ...category,
      items: category.items.filter((item) =>
        item.dishName.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    }))
    .filter((category) => category.items.length > 0);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Header */}
      <header className="relative w-full h-72 md:h-80 bg-muted overflow-hidden rounded-b-3xl shadow-sm">
        {cafeData.image ? (
          <img
            src={cafeData.image}
            alt={cafeData.cafename}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary to-primary/60" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

        <div className="absolute top-4 left-4 z-10">
          <Button
            asChild
            variant="secondary"
            size="sm"
            className="rounded-full shadow-md hover:scale-105 transition-transform bg-background/80 backdrop-blur-md border-none hover:bg-background"
          >
            <Link to="/search">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Search
            </Link>
          </Button>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6 container mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground drop-shadow-sm mb-3 tracking-tight">
            {cafeData.cafename}
          </h1>
          <div className="flex items-center gap-2 text-muted-foreground font-medium mb-3">
            <MapPin className="w-4 h-4 text-primary" />
            <span>{cafeData.address}</span>
          </div>
          {cafeData.description && (
            <p className="text-sm md:text-base text-foreground/80 max-w-2xl leading-relaxed">
              {cafeData.description}
            </p>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 pt-8">
        {/* Search Bar */}
        <div className="sticky top-4 z-20 mb-10 max-w-md mx-auto sm:mx-0">
          <div className="relative group shadow-sm rounded-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search our menu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 border border-border/50 rounded-2xl bg-card/80 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-foreground text-sm font-medium"
            />
          </div>
        </div>

        {/* Menu Display */}
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category, categoryIndex) => (
            <section key={categoryIndex} className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold text-foreground tracking-tight">
                  {category.category}
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent"></div>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                {category.items.map((item) => (
                  <Card
                    key={item._id}
                    className="border border-border/40 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden bg-card/40 backdrop-blur-sm"
                  >
                    <CardContent className="p-0">
                      <div className="flex gap-4 p-5">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2 gap-4">
                            <CardTitle className="text-lg font-bold truncate">
                              {item.dishName}
                            </CardTitle>
                            <div className="text-right whitespace-nowrap">
                              {item.halfPrice != null && (
                                <p className="text-sm font-bold text-primary">
                                  Half: ₹{item.halfPrice}
                                </p>
                              )}
                              {item.fullPrice != null && (
                                <p className="text-sm font-bold text-primary">
                                  Full: ₹{item.fullPrice}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <CardDescription className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                            {item.description}
                          </CardDescription>

                          <div className="flex flex-wrap gap-2 mt-4">
                            <span className="text-[10px] uppercase font-bold tracking-wider inline-flex items-center text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 py-1 px-2.5 rounded-full">
                              Available
                            </span>
                            {item.isChefSpecial && (
                              <span className="text-[10px] uppercase font-bold tracking-wider inline-flex items-center text-amber-600 bg-amber-500/10 border border-amber-500/20 py-1 px-2.5 rounded-full">
                                Chef's Special
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Image with Dialog Gallery */}
                        <div className="w-28 h-28 sm:w-32 sm:h-32 bg-muted/50 rounded-xl flex-shrink-0 overflow-hidden flex items-center justify-center relative border border-border/50 shadow-inner">
                          {item.images && item.images.length > 0 ? (
                            <Dialog>
                              <DialogTrigger asChild>
                                <div className="w-full h-full relative cursor-pointer group">
                                  <img
                                    src={item.images[0].url}
                                    alt={item.dishName}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                  />
                                  {item.images.length > 1 && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-colors duration-300 group-hover:bg-black/60">
                                      <span className="text-white font-bold text-lg drop-shadow-md">+{item.images.length - 1}</span>
                                    </div>
                                  )}
                                </div>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto p-6 rounded-3xl">
                                <DialogTitle className="text-2xl font-extrabold mb-6 tracking-tight">{item.dishName} Photos</DialogTitle>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                  {item.images.map((img, idx) => (
                                    <div key={img.fileId || idx} className="rounded-2xl overflow-hidden border border-border shadow-sm group relative aspect-square bg-muted/20">
                                      <img
                                        src={img.url}
                                        alt={`${item.dishName} - ${idx + 1}`}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                      />
                                    </div>
                                  ))}
                                </div>
                              </DialogContent>
                            </Dialog>
                          ) : (
                            <span className="text-xs font-medium text-muted-foreground text-center px-2">No Image</span>
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
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mb-6">
              <Search className="w-10 h-10 text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No items found</h3>
            <p className="text-muted-foreground max-w-sm">
              We couldn't find any menu items matching your search. Try adjusting your keywords.
            </p>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-xl border-t border-border p-4 z-50">
        <div className="container mx-auto flex gap-4 max-w-2xl">
          <Button asChild variant="outline" className="flex-1 rounded-xl h-12 font-semibold">
            <Link to="/search">Browse More</Link>
          </Button>
          <Button
            asChild
            className="flex-1 rounded-xl h-12 font-semibold shadow-md hover:shadow-lg transition-shadow"
          >
            <Link to="/dashboard">Own a Café?</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
