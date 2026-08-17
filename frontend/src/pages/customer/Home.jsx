import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-slate-500">
            Online Food Ordering
          </p>

          <h1 className="text-5xl font-bold leading-tight">
            Delicious food,
            <br />
            delivered to you.
          </h1>

          <p className="mt-6 text-lg text-slate-600">
            Welcome {user?.name || "Guest"}. Browse our menu and order your
            favorite food.
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              to="/foods"
              className="rounded-lg bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-slate-800"
            >
              Browse Food
            </Link>

            {!user && (
              <Link
                to="/register"
                className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold hover:bg-slate-100"
              >
                Create Account
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
