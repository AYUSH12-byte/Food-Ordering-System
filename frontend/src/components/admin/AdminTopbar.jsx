import { Link } from "react-router-dom";
import { Menu, ExternalLink, ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const AdminTopbar = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <button
          onClick={onMenuClick}
          className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden transition"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        <div className="hidden lg:flex items-center gap-2 text-sm text-slate-500">
          <ShieldCheck className="h-4 w-4 text-orange-500" />
          <span className="font-semibold text-slate-700">Admin Control Panel</span>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <Link
            to="/"
            target="_blank"
            className="hidden items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-slate-900 sm:flex transition"
          >
            <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
            View Store
          </Link>

          <div className="flex items-center gap-2.5 rounded-xl bg-slate-100/80 px-3 py-1.5 border border-slate-200/60">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white">
              {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="text-right leading-tight">
              <p className="text-xs font-bold text-slate-900">{user?.name || "Admin"}</p>
              <p className="text-[10px] capitalize font-medium text-orange-600">
                {user?.role || "Administrator"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;
