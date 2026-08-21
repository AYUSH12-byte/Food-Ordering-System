import { useEffect } from "react";

const PaymentDetailsModal = ({ payment, onClose }) => {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  if (!payment) {
    return null;
  }

  const order = payment.order;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}

        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Payment Details
            </h2>

            <p className="mt-1 break-all text-xs text-slate-500">
              Payment ID: {payment._id}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6 p-6">
          {/* Customer */}

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-400">
              Customer
            </h3>

            <div className="mt-3 rounded-xl bg-slate-50 p-4">
              <p className="font-semibold text-slate-900">
                {payment.user?.name || "Unknown"}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {payment.user?.email || "N/A"}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {payment.user?.phone || "N/A"}
              </p>
            </div>
          </div>

          {/* Payment */}

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-400">
              Payment Information
            </h3>

            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-xs text-slate-500">Amount</p>

                <p className="mt-1 text-xl font-bold text-slate-900">
                  Rs. {Number(payment.amount).toFixed(2)}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-xs text-slate-500">Method</p>

                <p className="mt-1 font-semibold text-slate-900">
                  {payment.paymentMethod}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-xs text-slate-500">Status</p>

                <p
                  className={`mt-1 font-semibold ${
                    payment.paymentStatus === "Paid"
                      ? "text-green-600"
                      : payment.paymentStatus === "Failed"
                        ? "text-red-600"
                        : "text-yellow-600"
                  }`}
                >
                  {payment.paymentStatus}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-xs text-slate-500">Transaction ID</p>

                <p className="mt-1 break-all font-semibold text-slate-900">
                  {payment.transactionId || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Order */}

          {order && (
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wide text-slate-400">
                Order
              </h3>

              <div className="mt-3 rounded-xl bg-slate-50 p-4">
                <div className="flex justify-between gap-4">
                  <div>
                    <p className="text-xs text-slate-500">Order ID</p>

                    <p className="mt-1 break-all text-sm font-semibold text-slate-900">
                      {order._id}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-slate-500">Order Status</p>

                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {order.orderStatus}
                    </p>
                  </div>
                </div>

                <div className="mt-5 border-t border-slate-200 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Subtotal</span>

                    <span className="font-medium text-slate-900">
                      Rs. {Number(order.subtotal).toFixed(2)}
                    </span>
                  </div>

                  <div className="mt-2 flex justify-between text-sm">
                    <span className="text-slate-500">Delivery</span>

                    <span className="font-medium text-slate-900">
                      Rs. {Number(order.deliveryCharge).toFixed(2)}
                    </span>
                  </div>

                  <div className="mt-4 flex justify-between border-t border-slate-200 pt-4">
                    <span className="font-bold text-slate-900">Total</span>

                    <span className="text-lg font-bold text-slate-900">
                      Rs. {Number(order.totalAmount).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Date */}

          <div className="border-t border-slate-200 pt-5">
            <p className="text-xs text-slate-500">Created At</p>

            <p className="mt-1 text-sm font-medium text-slate-900">
              {new Date(payment.createdAt).toLocaleString()}
            </p>

            {payment.paymentDate && (
              <>
                <p className="mt-4 text-xs text-slate-500">Payment Date</p>

                <p className="mt-1 text-sm font-medium text-slate-900">
                  {new Date(payment.paymentDate).toLocaleString()}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailsModal;
