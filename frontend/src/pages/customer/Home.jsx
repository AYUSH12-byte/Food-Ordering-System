import { Link } from "react-router-dom";
import { Sparkles, Clock, ShieldCheck, ChefHat, ArrowRight, ShoppingBag, UtensilsCrossed } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const Home = () => {
  const { user } = useAuth();
  const { itemCount } = useCart();

  return (
    <div className="bg-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        {/* Background glow effects */}
        <div className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:items-center lg:gap-12 lg:px-8 lg:py-20 relative z-10">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-1.5 text-xs font-bold text-orange-600 border border-orange-200/80 shadow-2xs">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Gourmet Delivery Experience</span>
            </div>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-6xl">
              Delicious meals, <br />
              <span className="bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">
                delivered fresh to you.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-slate-600 font-medium">
              Explore our chef-curated menu, order your favorite dishes in seconds, and enjoy hot meals delivered right to your doorstep.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 items-center">
              <Link
                to="/foods"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 hover:from-orange-600 hover:to-amber-700 hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <UtensilsCrossed className="h-4.5 w-4.5" />
                Explore Our Menu
                <ArrowRight className="h-4 w-4" />
              </Link>

              {user?.role === "customer" && itemCount > 0 && (
                <Link
                  to="/cart"
                  className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-800 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
                >
                  <ShoppingBag className="h-4.5 w-4.5 text-orange-500" />
                  View Cart
                  <span className="rounded-full bg-orange-500 px-2 py-0.5 text-xs font-bold text-white">
                    {itemCount}
                  </span>
                </Link>
              )}

              {!user && (
                <Link
                  to="/register"
                  className="rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-all duration-200"
                >
                  Create Account
                </Link>
              )}
            </div>

            {/* Quick stats */}
            <div className="mt-12 grid grid-cols-3 gap-6 border-t border-slate-100 pt-8">
              <div>
                <p className="text-2xl font-extrabold text-slate-900">30+ Min</p>
                <p className="text-xs text-slate-500 font-medium">Average Delivery</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-900">100%</p>
                <p className="text-xs text-slate-500 font-medium">Fresh Ingredients</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-900">4.9 ★</p>
                <p className="text-xs text-slate-500 font-medium">Customer Rating</p>
              </div>
            </div>
          </div>

          {/* Hero Visual Graphic */}
          <div className="relative hidden lg:block animate-scale-up">
            <div className="overflow-hidden rounded-3xl bg-slate-900 shadow-2xl shadow-slate-900/20 border border-slate-200/80 group">
              <img
                src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80"
                alt="Fresh artisan pizza"
                className="h-[520px] w-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

              {/* Floating card overlay */}
              <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-white/90 backdrop-blur-md p-4 shadow-xl border border-white/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500 text-white font-bold">
                    <ChefHat className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Handcrafted Artisan Dishes</p>
                    <p className="text-xs text-slate-500">Prepared fresh upon order placement</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                  Ready to Order
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="border-t border-slate-200/80 bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
              Why Choose FoodOrder?
            </h2>
            <p className="mt-2 text-sm text-slate-600 font-medium">
              We bring restaurant quality straight to your dining table with speed and convenience.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            <FeatureCard
              icon={ChefHat}
              title="Fresh & Gourmet"
              description="Prepared by passionate chefs using locally sourced organic ingredients."
              iconBg="bg-orange-500"
            />
            <FeatureCard
              icon={Clock}
              title="Lightning Fast"
              description="Real-time order tracking and express delivery right to your door."
              iconBg="bg-blue-500"
            />
            <FeatureCard
              icon={ShieldCheck}
              title="Seamless Checkout"
              description="Multiple secure payment options with instant digital invoice receipts."
              iconBg="bg-emerald-500"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description, iconBg }) => {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200/80 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconBg} text-white shadow-md mb-5`}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      <p className="mt-2 text-xs leading-relaxed text-slate-600 font-medium">{description}</p>
    </div>
  );
};

export default Home;
