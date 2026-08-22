import { useEffect, useState } from "react";

import { getAllFeedback, deleteFeedback } from "../../services/feedbackService";

import RatingStars from "../../components/customer/RatingStars";

const Feedback = () => {
  const [feedback, setFeedback] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllFeedback();

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

  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this feedback?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccessMessage("");

      await deleteFeedback(item._id);

      setSuccessMessage("Feedback deleted successfully");

      await fetchFeedback();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete feedback");
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}

      <div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Feedback
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage customer ratings and reviews
        </p>
      </div>

      {successMessage && (
        <div className="mt-6 rounded-lg bg-green-50 p-4 text-sm font-medium text-green-700">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      {/* Content */}

      <div className="mt-6">
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">
            Loading feedback...
          </div>
        ) : feedback.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <h2 className="text-lg font-bold text-slate-900">
              No feedback found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Customer reviews will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {feedback.map((item) => (
              <div
                key={item._id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                {/* Customer */}

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-bold text-slate-900">
                      {item.user?.name || "Unknown Customer"}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {item.user?.email || "N/A"}
                    </p>
                  </div>

                  <RatingStars value={item.rating} readonly />
                </div>

                {/* Comment */}

                <p className="mt-5 leading-7 text-slate-700">{item.comment}</p>

                {/* Order */}

                <div className="mt-5 rounded-lg bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Order</p>

                  <p className="mt-1 break-all text-sm font-semibold text-slate-900">
                    {item.order?._id || "N/A"}
                  </p>

                  <p className="mt-2 text-xs text-slate-500">
                    {item.order?.orderStatus || ""}
                  </p>
                </div>

                {/* Bottom */}

                <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4">
                  <p className="text-xs text-slate-400">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>

                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
                    className="rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Feedback;
