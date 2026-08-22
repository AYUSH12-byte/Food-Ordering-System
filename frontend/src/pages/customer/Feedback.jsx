import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { getMyFeedback } from "../../services/feedbackService";

import RatingStars from "../../components/customer/RatingStars";

const Feedback = () => {
  const [feedback, setFeedback] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMyFeedback();

      setFeedback(response.feedback || []);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load feedback");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-slate-200" />

          <div className="h-32 rounded-2xl bg-slate-200" />

          <div className="h-32 rounded-2xl bg-slate-200" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
          Account
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">My Feedback</h1>

        <p className="mt-2 text-sm text-slate-500">
          View the ratings and reviews you have submitted.
        </p>
      </div>

      {error && (
        <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      {!error && feedback.length === 0 && (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <h2 className="text-xl font-bold text-slate-900">No feedback yet</h2>

          <p className="mt-2 text-sm text-slate-500">
            You can review your delivered orders here.
          </p>

          <Link
            to="/orders"
            className="mt-5 inline-block rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
          >
            View Orders
          </Link>
        </div>
      )}

      {feedback.length > 0 && (
        <div className="mt-8 space-y-5">
          {feedback.map((item) => (
            <div
              key={item._id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <p className="text-xs text-slate-500">Order</p>

                  {item.order?._id ? (
                    <Link
                      to={`/orders/${item.order._id}`}
                      className="mt-1 inline-block break-all text-sm font-semibold text-slate-900 hover:underline"
                    >
                      {item.order._id}
                    </Link>
                  ) : (
                    <p className="mt-1 text-sm text-slate-500">
                      Order unavailable
                    </p>
                  )}
                </div>

                <RatingStars value={item.rating} readonly />
              </div>

              <p className="mt-5 leading-7 text-slate-700">{item.comment}</p>

              <p className="mt-4 text-xs text-slate-400">
                {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Feedback;
