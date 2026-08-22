import { useState } from "react";

import RatingStars from "./RatingStars";

import { createFeedback } from "../../services/feedbackService";

const FeedbackForm = ({ orderId, onSuccess }) => {
  const [rating, setRating] = useState(0);

  const [comment, setComment] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  // SUBMIT

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (rating < 1) {
      setError("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      setError("Please write a comment");
      return;
    }

    if (comment.trim().length > 500) {
      setError("Comment cannot exceed 500 characters");
      return;
    }

    try {
      setLoading(true);

      await createFeedback({
        orderId,
        rating,
        comment: comment.trim(),
      });

      setRating(0);
      setComment("");

      setSuccess("Feedback submitted successfully");

      onSuccess?.();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900">Rate Your Order</h2>

      <p className="mt-2 text-sm text-slate-500">
        Tell us about your experience.
      </p>

      {error && (
        <div className="mt-5 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-5 rounded-lg bg-green-50 p-3 text-sm font-medium text-green-700">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        {/* Rating */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Rating
          </label>

          <RatingStars value={rating} onChange={setRating} />

          {rating > 0 && (
            <p className="mt-2 text-xs text-slate-500">
              You selected {rating} star
              {rating !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {/* Comment */}

        <div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700">
              Comment
            </label>

            <span className="text-xs text-slate-400">{comment.length}/500</span>
          </div>

          <textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            rows={5}
            maxLength={500}
            placeholder="How was your food and delivery?"
            disabled={loading}
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
