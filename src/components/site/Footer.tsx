import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { Mail, Phone, MapPin, ShieldCheck } from "lucide-react";
import { armSplash } from "./SplashScreen";

export function Footer() {
  return (
    <footer className="bg-navy-gradient text-brand-cream mt-24">
      <div className="mx-auto max-w-7xl px-6 py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-1">
          <Logo variant="light" />
          <p className="mt-5 text-sm text-brand-cream/65 leading-relaxed">
            Transforming chaos into structure through systems thinking, strategic intervention and
            grassroots intelligence.
          </p>
          <div className="mt-5 flex items-start gap-2 text-xs text-brand-cream/55 leading-relaxed">
            <ShieldCheck size={14} className="text-brand-gold mt-0.5 shrink-0" />
            <span>
              Your information stays with us. We never request confidential details through public
              forms.
            </span>
          </div>
        </div>
        <div>
          <h4 className="font-serif text-base mb-4 text-brand-gold">Explore</h4>
          <ul className="space-y-2 text-sm text-brand-cream/75">
            <li>
              <Link to="/about" className="hover:text-brand-gold">
                About
              </Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-brand-gold">
                Services
              </Link>
            </li>
            <li>
              <Link to="/approach" className="hover:text-brand-gold">
                Approach
              </Link>
            </li>
            <li>
              <Link to="/sectors" className="hover:text-brand-gold">
                Sectors
              </Link>
            </li>
            <li>
              <Link to="/intake" onClick={armSplash} className="hover:text-brand-gold">
                Start Intake
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-brand-gold">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-cream/55">
            Portal
          </h3>
          <ul className="mt-5 space-y-2.5 text-sm">
            <li>
              <Link to="/login" onClick={armSplash} className="hover:text-brand-gold">
                Sign In
              </Link>
            </li>
            <li>
              <Link to="/signup" onClick={armSplash} className="hover:text-brand-gold">
                Create Account
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="hover:text-brand-gold">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/team" className="hover:text-brand-gold">
                Our Team
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-serif text-base mb-4 text-brand-gold">Contact</h4>
          <ul className="space-y-3 text-sm text-brand-cream/75">
            <li className="flex items-start gap-2">
              <MapPin size={15} className="mt-0.5 text-brand-gold" />
              <span>Nairobi, Kenya</span>
            </li>
            <li className="flex items-start gap-2">
              <Mail size={15} className="mt-0.5 text-brand-gold" />
              <span>info@sautiapex.co.ke</span>
            </li>
            <li className="flex items-start gap-2">
              <Phone size={15} className="mt-0.5 text-brand-gold" />
              <span>+254 700 000 000</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-brand-cream/10">
        <div className="mx-auto max-w-7xl px-6 py-5 flex flex-col md:flex-row justify-between gap-3 text-xs text-brand-cream/55">
          <div>
            © {new Date().getFullYear()} Sautiapex Capital Ventures Limited. All rights reserved.
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            <Link to="/privacy" className="hover:text-brand-gold">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-brand-gold">
              Terms of Service
            </Link>
            <Link to="/cookies" className="hover:text-brand-gold">
              Cookies
            </Link>
            <Link to="/contact" className="hover:text-brand-gold">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
