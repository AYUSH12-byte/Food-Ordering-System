import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminTopbar = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Open menu"
        >
          <span className="text-xl">☰</span>
        </button>

        <div className="ml-auto flex items-center gap-4">
          <Link
            to="/"
            target="_blank"
            className="hidden rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-100 sm:block"
          >
            View Website
          </Link>

          <div className="text-right">
            <p className="text-sm font-semibold text-slate-900">{user?.name}</p>

            <p className="text-xs capitalize text-slate-500">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;
