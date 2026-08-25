import { Link } from "react-router-dom";
import {
  UtensilsCrossed,
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Heart,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Footer = () => {
  const { user } = useAuth();
  return (
    <footer className="border-t border-slate-200/80 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-8 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20">
                <UtensilsCrossed className="h-5 w-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                Food<span className="text-orange-500">Order</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-400 max-w-sm">
              Delivering fresh, gourmet meals crafted with passion directly to your doorstep. Experience the best dining from the comfort of your home.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-1.5 rounded-full bg-slate-900 border border-slate-800 px-3 py-1 text-slate-300">
                <Clock className="h-3.5 w-3.5 text-orange-400" />
                <span>Open Daily: 9am – 11pm</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-100">
              Quick Links
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-orange-400 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/foods" className="hover:text-orange-400 transition">
                  Browse Menu
                </Link>
              </li>
              {user?.role === "customer" && (
                <>
                  <li>
                    <Link to="/cart" className="hover:text-orange-400 transition">
                      Shopping Cart
                    </Link>
                  </li>
                  <li>
                    <Link to="/orders" className="hover:text-orange-400 transition">
                      My Orders
                    </Link>
                  </li>
                  <li>
                    <Link to="/feedback" className="hover:text-orange-400 transition">
                      Customer Feedback
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-100">
              Contact Us
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                <span>Birtamod, Jhapa, Nepal</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-orange-500 shrink-0" />
                <span>+977 9800000000</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-orange-500 shrink-0" />
                <span>support@foodorder.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-100">
              Stay Updated
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Subscribe to get special discount offers and new menu updates.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-orange-500 transition"
              />
              <button
                type="submit"
                className="rounded-xl bg-orange-500 p-2 text-white hover:bg-orange-600 transition"
                title="Subscribe"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} FoodOrder. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Crafted with <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" /> for delicious food lovers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
