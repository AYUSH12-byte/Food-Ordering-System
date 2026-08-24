const badgeStyles = {
  Pending: {
    bg: "bg-amber-50 text-amber-700 border-amber-200/80",
    dot: "bg-amber-500",
  },
  Preparing: {
    bg: "bg-blue-50 text-blue-700 border-blue-200/80",
    dot: "bg-blue-500 animate-pulse",
  },
  Ready: {
    bg: "bg-purple-50 text-purple-700 border-purple-200/80",
    dot: "bg-purple-500",
  },
  Delivered: {
    bg: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    dot: "bg-emerald-500",
  },
  Cancelled: {
    bg: "bg-rose-50 text-rose-700 border-rose-200/80",
    dot: "bg-rose-500",
  },
  Paid: {
    bg: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    dot: "bg-emerald-500",
  },
  Failed: {
    bg: "bg-rose-50 text-rose-700 border-rose-200/80",
    dot: "bg-rose-500",
  },
  Partial: {
    bg: "bg-amber-50 text-amber-700 border-amber-200/80",
    dot: "bg-amber-500",
  },
  Customer: {
    bg: "bg-slate-100 text-slate-700 border-slate-200",
    dot: "bg-slate-500",
  },
  Admin: {
    bg: "bg-orange-50 text-orange-700 border-orange-200",
    dot: "bg-orange-500",
  },
};

const Badge = ({ children, className = "", dot = true }) => {
  const status = badgeStyles[children] || {
    bg: "bg-slate-100 text-slate-700 border-slate-200",
    dot: "bg-slate-400",
  };

  return (
    <span
      className={`
        inline-flex
        items-center
        gap-1.5
        rounded-full
        px-2.5
        py-1
        text-xs
        font-medium
        border
        shadow-2xs
        ${status.bg}
        ${className}
      `}
    >
      {dot && (
        <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
      )}
      {children}
    </span>
  );
};

export default Badge;
