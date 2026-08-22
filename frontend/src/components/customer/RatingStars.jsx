const RatingStars = ({ value = 0, onChange, readonly = false }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={`text-2xl transition ${
            readonly ? "cursor-default" : "cursor-pointer hover:scale-110"
          } ${star <= value ? "text-yellow-400" : "text-slate-300"}`}
          aria-label={`${star} star`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

export default RatingStars;
