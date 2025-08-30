import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  QrCode,
  Coffee,
  Upload,
  Download,
  Users,
  Moon,
  Sun,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDarkMode } from "@/hooks/use-dark-mode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Index() {
  // Dark mode functionality
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(
          "https://backend-7hhj.onrender.com/api/users/me",
          {
            withCredentials: true,
          },
        );
        setIsLoggedIn(true);
      } catch (err) {
        setIsLoggedIn(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  const signOutHandler = async () => {
    const response = await axios.get(
      "https://backend-7hhj.onrender.com/api/users/logout",
      {
        withCredentials: true,
      },
    );

    setIsLoggedIn(false);
    navigate("/signin");

    toast.success("You have been signed out successfully!");
    console.log(response);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-background to-accent">
      {/* Header Navigation */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <QrCode className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground">
              ScanDine
            </span>
          </div>

          {/* Right side buttons for all screen sizes */}
          <div className="flex items-center gap-3">
            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                to="/search"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Find Cafés
              </Link>
              <Link
                to="/dashboard"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                For Owners
              </Link>
            </div>

            {/* Dark Mode Toggle */}
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

            {/* Auth Buttons */}
            {!isCheckingAuth &&
              (isLoggedIn ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={signOutHandler}
                  className="h-9 w-auto"
                >
                  Sign Out
                </Button>
              ) : (
                <Button asChild variant="outline" size="sm">
                  <Link to="/signin">Sign In</Link>
                </Button>
              ))}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Smart QR Menus for <span className="text-primary">Small Cafés</span>{" "}
            & <span className="text-primary">Restaurants</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            We help local cafés go digital with custom QR code menus. Simple
            setup, beautiful design, and seamless customer experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg"
            >
              <Link to="/search">View Menus</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="px-8 py-3 text-lg"
            >
              <Link to="/dashboard">For Café Owners</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-coral rounded-xl flex items-center justify-center mx-auto mb-4">
                <Coffee className="w-6 h-6 text-coral-foreground" />
              </div>
              <CardTitle className="text-xl">For Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Scan QR codes to instantly view menus. No app downloads
                required.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-sage rounded-xl flex items-center justify-center mx-auto mb-4">
                <QrCode className="w-6 h-6 text-sage-foreground" />
              </div>
              <CardTitle className="text-xl">Easy Setup</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Create your digital menu in minutes. Generate QR codes
                instantly.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-fresh-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl">Grow Business</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Attract more customers and streamline your service with digital
                menus.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-card/30 backdrop-blur-sm py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get your café online in just four simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-foreground">
                  1
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Sign Up</h3>
              <p className="text-muted-foreground">
                Create your café account in under 2 minutes
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-coral rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-coral-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Upload Menu</h3>
              <p className="text-muted-foreground">
                Add your menu items with photos and descriptions
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-sage rounded-2xl flex items-center justify-center mx-auto mb-4">
                <QrCode className="w-8 h-8 text-sage-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Generate QR</h3>
              <p className="text-muted-foreground">
                Get your custom QR code ready to print
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-food-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Download className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Go Live</h3>
              <p className="text-muted-foreground">
                Place QR codes on tables and start serving customers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to Go Digital?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join hundreds of cafés already using ScanDine to serve their
            customers better.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg"
          >
            <Link to="/dashboard">Start Free Trial</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
                <QrCode className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">ScanDine</span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link
                to="/about"
                className="hover:text-foreground transition-colors"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="hover:text-foreground transition-colors"
              >
                Contact
              </Link>
              <Link
                to="/privacy"
                className="hover:text-foreground transition-colors"
              >
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
