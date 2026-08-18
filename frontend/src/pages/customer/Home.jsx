import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const Home = () => {
  const { user } = useAuth();
  const { cartCount } = useCart();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-white">
        <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Online Food Ordering
            </p>

            <h1 className="mt-4 text-5xl font-bold leading-tight tracking-tight text-slate-900 sm:text-6xl">
              Your favorite food,
              <br />
              delivered.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Discover delicious food from our menu, add your favorites to the
              cart, and place your order in just a few clicks.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/foods"
                className="rounded-lg bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Browse Menu
              </Link>

              {user?.role === "customer" && cartCount > 0 && (
                <Link
                  to="/cart"
                  className="rounded-lg border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  View Cart ({cartCount})
                </Link>
              )}

              {!user && (
                <Link
                  to="/register"
                  className="rounded-lg border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Create Account
                </Link>
              )}
            </div>
          </div>

          {/* Visual */}
          <div className="hidden lg:block">
            <div className="overflow-hidden rounded-3xl bg-slate-200">
              <img
                src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80"
                alt="Fresh pizza"
                className="h-[560px] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:grid-cols-3 sm:px-6 lg:px-8">
          <Feature
            title="Fresh Food"
            description="Quality food prepared fresh for every order."
          />

          <Feature
            title="Easy Ordering"
            description="Browse, add to cart, checkout, and track your order."
          />

          <Feature
            title="Fast Delivery"
            description="Get your order delivered directly to your doorstep."
          />
        </div>
      </section>
    </div>
  );
};

const Feature = ({ title, description }) => {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>

      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
};

export default Home;
