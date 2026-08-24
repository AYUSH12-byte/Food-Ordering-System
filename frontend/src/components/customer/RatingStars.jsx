import { Star } from "lucide-react";

const RatingStars = ({ value = 0, onChange, readonly = false, size = "md" }) => {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= value;

        return (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => onChange?.(star)}
            className={`transition ${
              readonly ? "cursor-default" : "cursor-pointer hover:scale-110 active:scale-95"
            }`}
            aria-label={`${star} star`}
          >
            <Star
              className={`${sizes[size] || sizes.md} ${
                isFilled
                  ? "fill-amber-400 text-amber-400"
                  : "fill-slate-100 text-slate-300"
              } transition-colors duration-200`}
            />
          </button>
        );
      })}
    </div>
  );
};

export default RatingStars;
