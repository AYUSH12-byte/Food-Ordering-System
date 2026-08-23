const badgeStyles = {
  Pending: "bg-yellow-50 text-yellow-700 ring-yellow-200",

  Preparing: "bg-blue-50 text-blue-700 ring-blue-200",

  Ready: "bg-purple-50 text-purple-700 ring-purple-200",

  Delivered: "bg-green-50 text-green-700 ring-green-200",

  Cancelled: "bg-red-50 text-red-700 ring-red-200",

  Paid: "bg-green-50 text-green-700 ring-green-200",

  Failed: "bg-red-50 text-red-700 ring-red-200",

  Partial: "bg-orange-50 text-orange-700 ring-orange-200",
};

const Badge = ({ children, className = "" }) => {
  const style =
    badgeStyles[children] || "bg-slate-100 text-slate-700 ring-slate-200";

  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        px-3
        py-1
        text-xs
        font-semibold
        ring-1
        ring-inset
        ${style}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

export default Badge;
