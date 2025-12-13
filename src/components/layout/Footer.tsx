import { Link } from "react-router-dom";
import { Sun, Heart, MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & About */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                <Sun className="w-7 h-7 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold">
                  Shining Light Power Ministry
                </h3>
                <p className="text-sm text-secondary-foreground/70">
                  International
                </p>
              </div>
            </div>
            <p className="text-secondary-foreground/80 leading-relaxed max-w-md">
              A community of believers dedicated to spreading the light of God's
              love across the nations. Join us in worship and fellowship.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { href: "/about", label: "About Us" },
                { href: "/events", label: "Events" },
                { href: "/news", label: "News" },
                { href: "/media", label: "Media Gallery" },
                { href: "/join", label: "Join Workers" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-secondary-foreground/70 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <span className="text-secondary-foreground/80">
                  123 Faith Avenue, City
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <span className="text-secondary-foreground/80">
                  +1 (555) 123-4567
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <span className="text-secondary-foreground/80">
                  info@slpmi.org
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/10 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-secondary-foreground/60 text-sm">
            © {new Date().getFullYear()} Shining Light Power Ministry
            International. All rights reserved.
          </p>
          <p className="text-secondary-foreground/60 text-sm flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-primary" /> for the Kingdom
          </p>
        </div>
      </div>
    </footer>
  );
}
