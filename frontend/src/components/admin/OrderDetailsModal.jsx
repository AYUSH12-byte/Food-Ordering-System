import { useEffect } from "react";

const OrderDetailsModal = ({ order, onClose }) => {
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

  if (!order) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Order Details</h2>

            <p className="mt-1 break-all text-xs text-slate-500">{order._id}</p>
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

            <div className="mt-3 grid gap-4 rounded-xl bg-slate-50 p-4 sm:grid-cols-3">
              <div>
                <p className="text-xs text-slate-500">Name</p>

                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {order.user?.name || "Unknown"}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Email</p>

                <p className="mt-1 break-all text-sm font-semibold text-slate-900">
                  {order.user?.email || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Phone</p>

                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {order.user?.phone || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Delivery */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-400">
              Delivery
            </h3>

            <div className="mt-3 rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-500">Address</p>

              <p className="mt-1 text-sm font-semibold text-slate-900">
                {order.deliveryAddress}
              </p>

              <p className="mt-4 text-xs text-slate-500">Delivery Phone</p>

              <p className="mt-1 text-sm font-semibold text-slate-900">
                {order.deliveryPhone}
              </p>

              {order.deliveryNote && (
                <>
                  <p className="mt-4 text-xs text-slate-500">Delivery Note</p>

                  <p className="mt-1 text-sm text-slate-700">
                    {order.deliveryNote}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Items */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-400">
              Ordered Items
            </h3>

            <div className="mt-3 divide-y divide-slate-200 rounded-xl border border-slate-200">
              {order.items?.map((item, index) => (
                <div key={`${item.name}-${index}`} className="flex gap-4 p-4">
                  {item.food?.image ? (
                    <img
                      src={item.food.image}
                      alt={item.name}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400">
                      No Image
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between gap-4">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {item.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {item.quantity} × Rs. {Number(item.price).toFixed(2)}
                        </p>
                      </div>

                      <p className="font-semibold text-slate-900">
                        Rs. {Number(item.subtotal).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-400">
              Order Summary
            </h3>

            <div className="mt-3 rounded-xl bg-slate-50 p-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>

                <span className="font-medium text-slate-900">
                  Rs. {Number(order.subtotal).toFixed(2)}
                </span>
              </div>

              <div className="mt-3 flex justify-between text-sm">
                <span className="text-slate-500">Delivery Charge</span>

                <span className="font-medium text-slate-900">
                  Rs. {Number(order.deliveryCharge).toFixed(2)}
                </span>
              </div>

              <div className="mt-4 flex justify-between border-t border-slate-200 pt-4">
                <span className="font-bold text-slate-900">Total</span>

                <span className="text-xl font-bold text-slate-900">
                  Rs. {Number(order.totalAmount).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment + Status */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-xs text-slate-500">Payment Method</p>

              <p className="mt-1 font-semibold text-slate-900">
                {order.paymentMethod}
              </p>

              <p className="mt-4 text-xs text-slate-500">Payment Status</p>

              <p
                className={`mt-1 font-semibold ${
                  order.paymentStatus === "Paid"
                    ? "text-green-600"
                    : order.paymentStatus === "Failed"
                      ? "text-red-600"
                      : "text-yellow-600"
                }`}
              >
                {order.paymentStatus}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-xs text-slate-500">Order Status</p>

              <p className="mt-1 font-semibold text-slate-900">
                {order.orderStatus}
              </p>

              <p className="mt-4 text-xs text-slate-500">Ordered On</p>

              <p className="mt-1 font-semibold text-slate-900">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
