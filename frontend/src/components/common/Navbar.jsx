import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  UtensilsCrossed,
  ShoppingCart,
  User,
  LogOut,
  Menu,
  X,
  ClipboardList,
  Receipt,
  MessageSquare,
  Home,
  Compass,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/");
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 text-sm font-medium transition-all duration-200 ${isActive
      ? "text-orange-600 font-semibold"
      : "text-slate-600 hover:text-slate-900"
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition ${isActive
      ? "bg-orange-50 text-orange-600 font-semibold"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group focus:outline-none"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
            <UtensilsCrossed className="h-5 w-5" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900">
            Food<span className="text-orange-600">Order</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-7 md:flex">
          <NavLink to="/" className={navLinkClass}>
            <Home className="h-4 w-4" />
            Home
          </NavLink>

          <NavLink to="/foods" className={navLinkClass}>
            <Compass className="h-4 w-4" />
            Menu
          </NavLink>

          {user?.role === "customer" && (
            <>
              <NavLink to="/cart" className={navLinkClass}>
                <div className="relative flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  <span>Cart</span>
                  {itemCount > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-amber-600 px-1.5 text-[11px] font-bold text-white shadow-xs animate-scale-up">
                      {itemCount}
                    </span>
                  )}
                </div>
              </NavLink>

              <NavLink to="/orders" className={navLinkClass}>
                <ClipboardList className="h-4 w-4" />
                Orders
              </NavLink>

              <NavLink to="/payments" className={navLinkClass}>
                <Receipt className="h-4 w-4" />
                Payments
              </NavLink>

              <NavLink to="/feedback" className={navLinkClass}>
                <MessageSquare className="h-4 w-4" />
                Feedback
              </NavLink>
            </>
          )}
        </nav>

        {/* Desktop Right Controls */}
        <div className="hidden items-center gap-3 md:flex">
          {!user ? (
            <>
              <Link
                to="/login"
                className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-orange-500/20 hover:from-orange-600 hover:to-amber-700 transition"
              >
                Register
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">


              {user.role === "admin" && (
                <Link
                  to="/admin/dashboard"
                  className="flex items-center gap-1.5 rounded-xl border border-orange-200 bg-orange-50/80 px-3 py-1.5 text-xs font-semibold text-orange-700 hover:bg-orange-100 transition"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Admin Panel
                </Link>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition"
                title="Logout"
              >
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          {user?.role === "customer" && (
            <Link
              to="/cart"
              className="relative p-2 text-slate-700 hover:text-orange-600 transition"
            >
              <ShoppingCart className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white">
                  {itemCount}
                </span>
              )}
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-xl p-2 text-slate-700 hover:bg-slate-100 transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white p-4 shadow-lg md:hidden animate-fade-in space-y-2">
          {user && (
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 mb-3 border border-slate-100">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-sm font-bold text-white">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-500 capitalize">{user.role}</p>
              </div>
            </div>
          )}

          <NavLink
            to="/"
            className={mobileNavLinkClass}
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="flex items-center gap-3">
              <Home className="h-4 w-4" /> Home
            </span>
            <ChevronRight className="h-4 w-4 opacity-50" />
          </NavLink>

          <NavLink
            to="/foods"
            className={mobileNavLinkClass}
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="flex items-center gap-3">
              <Compass className="h-4 w-4" /> Menu
            </span>
            <ChevronRight className="h-4 w-4 opacity-50" />
          </NavLink>

          {user?.role === "customer" && (
            <>
              <NavLink
                to="/cart"
                className={mobileNavLinkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="flex items-center gap-3">
                  <ShoppingCart className="h-4 w-4" /> Cart
                </span>
                {itemCount > 0 && (
                  <span className="rounded-full bg-orange-500 px-2 py-0.5 text-xs font-bold text-white">
                    {itemCount}
                  </span>
                )}
              </NavLink>

              <NavLink
                to="/orders"
                className={mobileNavLinkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="flex items-center gap-3">
                  <ClipboardList className="h-4 w-4" /> Orders
                </span>
                <ChevronRight className="h-4 w-4 opacity-50" />
              </NavLink>

              <NavLink
                to="/payments"
                className={mobileNavLinkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="flex items-center gap-3">
                  <Receipt className="h-4 w-4" /> Payments
                </span>
                <ChevronRight className="h-4 w-4 opacity-50" />
              </NavLink>

              <NavLink
                to="/feedback"
                className={mobileNavLinkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="flex items-center gap-3">
                  <MessageSquare className="h-4 w-4" /> Feedback
                </span>
                <ChevronRight className="h-4 w-4 opacity-50" />
              </NavLink>

              <NavLink
                to="/profile"
                className={mobileNavLinkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="flex items-center gap-3">
                  <User className="h-4 w-4" /> Profile
                </span>
                <ChevronRight className="h-4 w-4 opacity-50" />
              </NavLink>
            </>
          )}

          {user?.role === "admin" && (
            <NavLink
              to="/admin/dashboard"
              className={mobileNavLinkClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="flex items-center gap-3 font-semibold text-orange-600">
                <ShieldCheck className="h-4 w-4" /> Admin Dashboard
              </span>
              <ChevronRight className="h-4 w-4 opacity-50" />
            </NavLink>
          )}

          <div className="pt-2 border-t border-slate-100">
            {!user ? (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl border border-slate-200 py-2.5 text-center text-sm font-semibold text-slate-700"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl bg-orange-500 py-2.5 text-center text-sm font-semibold text-white shadow-sm"
                >
                  Register
                </Link>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
