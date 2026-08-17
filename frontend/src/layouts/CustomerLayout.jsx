import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";

const CustomerLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main>
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 text-center text-sm text-slate-500 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} FoodOrder. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default CustomerLayout;