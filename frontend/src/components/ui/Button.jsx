import { Loader2 } from "lucide-react";

const variants = {
  primary:
    "bg-gradient-to-r from-orange-500 to-amber-600 text-white hover:from-orange-600 hover:to-amber-700 shadow-md shadow-orange-500/20 focus:ring-orange-200 border border-transparent",

  dark:
    "bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-300 shadow-md shadow-slate-900/10 border border-transparent",

  secondary:
    "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 focus:ring-slate-200 shadow-xs",

  danger:
    "bg-red-600 text-white hover:bg-red-700 focus:ring-red-200 shadow-md shadow-red-500/20 border border-transparent",

  success:
    "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-200 shadow-md shadow-emerald-500/20 border border-transparent",

  ghost:
    "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-200",
};

const sizes = {
  xs: "px-2.5 py-1 text-xs rounded-md",
  sm: "px-3 py-1.5 text-xs rounded-lg",
  md: "px-4 py-2 text-sm rounded-xl font-medium",
  lg: "px-5 py-2.5 text-base rounded-xl font-semibold",
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  disabled = false,
  loading = false,
  icon: Icon = null,
  ...props
}) => {
  const isDisable = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisable}
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        font-medium
        transition-all
        duration-200
        active:scale-[0.98]
        focus:outline-none
        focus:ring-2
        disabled:cursor-not-allowed
        disabled:opacity-60
        disabled:active:scale-100
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin shrink-0" />
      ) : Icon ? (
        <Icon className="h-4 w-4 shrink-0" />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
