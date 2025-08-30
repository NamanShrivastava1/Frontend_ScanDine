import { Button } from "@/components/ui/button";
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
import {
  QrCode,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Instagram,
  Send,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_key: "4209746b-7f06-43ce-bd33-143a6f44d7da",
          subject: "New Contact Message from ScanDine",
          name: formData.name,
          email: formData.email,
          message: formData.message,
          botcheck: "", // Honeypot
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Thank you for your message! We'll get back to you soon.");
        setFormData({ name: "", email: "", message: "" });
      } else {
        toast.error("Something went wrong. Please try again later.");
      }
    } catch (error) {
      console.error("Web3Forms error:", error);
      toast.error("There was an error sending the form.");
    }

    setIsSubmitting(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            📬 Contact Us
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-8">
            Have questions, feedback, or just want to say hi? We'd love to hear
            from you.
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We're just getting started, and we'd love your feedback. Whether
            you're a café owner or just someone curious—say hi!
          </p>
        </div>
      </section>

      {/* Contact Form and Info Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <Card className="border-none shadow-lg bg-card/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-foreground">
                Send us a message
              </CardTitle>
              <CardDescription className="text-lg">
                Fill out the form below and we'll get back to you as soon as
                possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Name *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-sm font-medium">
                    Message *
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us what's on your mind..."
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    className="min-h-[120px] resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </Button>
                <input
                  type="text"
                  name="botcheck"
                  style={{ display: "none" }}
                  onChange={handleInputChange}
                />
              </form>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-8">
            <Card className="border-none shadow-lg bg-card/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-foreground">
                  Get in touch
                </CardTitle>
                <CardDescription className="text-lg">
                  Prefer to reach out directly? Here's how you can contact us.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Email</p>
                    <a
                      href="mailto:contact@menumate.in"
                      className="text-primary hover:text-primary/80 transition-colors"
                    >
                      scandine.inquiry@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-fresh-500/10 rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6 text-fresh-600" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Phone</p>
                    <a
                      href="tel:+91XXXXXXXXXX"
                      className="text-fresh-600 hover:text-fresh-700 transition-colors"
                    >
                      +91-6262685831 / 8839040536
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-coral/10 rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-coral" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Location</p>
                    <p className="text-muted-foreground">Bhopal, India</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card className="border-none shadow-lg bg-card/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-foreground">
                  Follow us
                </CardTitle>
                <CardDescription>
                  Connect with us on social media for updates and news.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    size="lg"
                    className="flex-1 flex items-center justify-center gap-2 h-12 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                  >
                    <Linkedin className="w-5 h-5 text-blue-600" />
                    <span className="hidden sm:inline">LinkedIn</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    className="flex-1 flex items-center justify-center gap-2 h-12 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                  >
                    <Github className="w-5 h-5 text-gray-700" />
                    <span className="hidden sm:inline">GitHub</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    className="flex-1 flex items-center justify-center gap-2 h-12 hover:bg-pink-50 hover:border-pink-300 transition-colors"
                  >
                    <Instagram className="w-5 h-5 text-pink-600" />
                    <span className="hidden sm:inline">Instagram</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
