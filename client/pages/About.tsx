import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  QrCode,
  ArrowLeft,
  Linkedin,
  Github,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-background to-accent">
      {/* Header Navigation */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
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
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <QrCode className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold text-foreground">
                ScanDine
              </span>
            </Link>
          </div>
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
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            🚀About Us
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-8">
            Turning Local Cafés Digital—One QR at a Time.
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We're a team of passionate developers on a mission to help small
            restaurants and cafés go digital without the headache. Our platform
            makes it super simple to upload, update, and share your menu through
            a single QR code—no more reprinting or confusion.
          </p>
        </div>
      </section>

      {/* Founders Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            👨‍💻 Meet the Founders
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Two passionate developers bringing their vision to life with
            cutting-edge technology
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Arif Mansoori Card */}
          <Card className="group border-none shadow-lg bg-card/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:scale-105 rounded-xl overflow-hidden animate-fade-in">
            <CardHeader className="text-center pb-8 pt-8">
              <div className="w-36 h-36 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110">
                <span className="text-5xl font-bold text-white tracking-wide">
                  AM
                </span>
              </div>
              <CardTitle className="text-3xl font-bold text-foreground mb-2">
                Arif Mansoori
              </CardTitle>
              <CardDescription className="text-lg font-semibold text-orange-600 mb-3">
                Frontend Developer & UI/UX Designer
              </CardDescription>
              <div className="space-y-2">
                <p className="font-semibold text-muted-foreground text-base">
                  B.Tech CSE | TIT Bhopal
                </p>
                <p className="text-muted-foreground leading-relaxed text-base px-4">
                  Loves clean UI and building useful tech for real people.
                </p>
              </div>
            </CardHeader>
            <CardContent className="text-center pb-8">
              <div className="flex justify-center gap-4 pt-6">
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="flex items-center gap-3 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-700 transition-all duration-300 hover:scale-105 px-6 py-3 rounded-xl shadow-md hover:shadow-lg"
                >
                  <a
                    href="https://www.linkedin.com/in/mohammad-arif-mansoori"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Linkedin className="w-5 h-5" />
                    LinkedIn
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="flex items-center gap-3 hover:bg-gray-50 hover:border-gray-400 hover:text-gray-700 transition-all duration-300 hover:scale-105 px-6 py-3 rounded-xl shadow-md hover:shadow-lg"
                >
                  <a
                    href="https://github.com/epex786"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="w-5 h-5" />
                    GitHub
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Naman Shrivastava Card */}
          <Card className="group border-none shadow-lg bg-card/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:scale-105 rounded-xl overflow-hidden animate-fade-in-delayed">
            <CardHeader className="text-center pb-8 pt-8">
              <div className="w-36 h-36 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110">
                <span className="text-5xl font-bold text-white tracking-wide">
                  NS
                </span>
              </div>
              <CardTitle className="text-3xl font-bold text-foreground mb-2">
                Naman Shrivastava
              </CardTitle>
              <CardDescription className="text-lg font-semibold text-green-600 mb-3">
                Backend Developer & System Architect
              </CardDescription>
              <div className="space-y-2">
                <p className="font-semibold text-muted-foreground text-base">
                  B.Tech CSE | TIT Bhopal
                </p>
                <p className="text-muted-foreground leading-relaxed text-base px-4">
                  Handles the logic, routes, and chaos behind the scenes.
                </p>
              </div>
            </CardHeader>
            <CardContent className="text-center pb-8">
              <div className="flex justify-center gap-4 pt-6">
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="flex items-center gap-3 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-700 transition-all duration-300 hover:scale-105 px-6 py-3 rounded-xl shadow-md hover:shadow-lg"
                >
                  <a
                    href="https://www.linkedin.com/in/naman-shrivastava1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Linkedin className="w-5 h-5" />
                    LinkedIn
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="flex items-center gap-3 hover:bg-gray-50 hover:border-gray-400 hover:text-gray-700 transition-all duration-300 hover:scale-105 px-6 py-3 rounded-xl shadow-md hover:shadow-lg"
                >
                  <a
                    href="https://www.github.com/NamanShrivastava1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="w-5 h-5" />
                    GitHub
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-card/30 backdrop-blur-sm py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
              Our Mission
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              We believe technology should make life easier, not more
              complicated. That's why we built MenuQR—to help small businesses
              thrive in the digital age without losing their personal touch.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-none shadow-sm bg-card/50">
                <CardHeader>
                  <CardTitle className="text-lg">🎯 Simple</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    No complex setup. Upload your menu and get your QR code in
                    minutes.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm bg-card/50">
                <CardHeader>
                  <CardTitle className="text-lg">💡 Smart</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Update your menu anytime without reprinting QR codes.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm bg-card/50">
                <CardHeader>
                  <CardTitle className="text-lg">❤️ Personal</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Built by developers who care about small businesses.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to Join Us?
          </h3>
          <p className="text-xl text-muted-foreground mb-8">
            Let's help your café go digital today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg"
            >
              <Link to="/dashboard">Start Your Journey</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="px-8 py-3 text-lg"
            >
              <Link to="/search">Explore Cafés</Link>
            </Button>
          </div>
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
              <Link to="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
              <Link
                to="/search"
                className="hover:text-foreground transition-colors"
              >
                Find Cafés
              </Link>
              <Link
                to="/dashboard"
                className="hover:text-foreground transition-colors"
              >
                For Owners
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
