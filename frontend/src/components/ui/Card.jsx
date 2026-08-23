const Card = ({ children, className = "", padding = true, hover = false }) => {
  return (
    <div
      className={`
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-sm
        ${
          hover
            ? "transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
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
