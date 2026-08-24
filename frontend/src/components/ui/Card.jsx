const Card = ({
  children,
  className = "",
  padding = true,
  hover = false,
  glass = false,
}) => {
  return (
    <div
      className={`
        rounded-2xl
        border
        border-slate-200/80
        ${glass ? "glass-panel" : "bg-white"}
        shadow-sm
        ${
          hover
            ? "transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/50 hover:border-slate-300"
            : ""
        }
        ${padding ? "p-5 sm:p-6" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
