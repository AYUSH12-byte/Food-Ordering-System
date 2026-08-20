import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { getMyOrders } from "../../services/orderService";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // FETCH ORDERS

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMyOrders();

      setOrders(response.orders || []);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // STATUS STYLE

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      case "Preparing":
        return "bg-blue-100 text-blue-700";

      case "Ready":
        return "bg-purple-100 text-purple-700";

      case "Delivered":
        return "bg-green-100 text-green-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  // LOADING

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-slate-200" />
          <div className="h-32 rounded-2xl bg-slate-200" />
          <div className="h-32 rounded-2xl bg-slate-200" />
          <div className="h-32 rounded-2xl bg-slate-200" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* HEADER */}

      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
          Account
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">My Orders</h1>

        <p className="mt-2 text-sm text-slate-500">
          View your previous orders and track their status.
        </p>
      </div>

      {/* ERROR */}

      {error && (
        <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      {/* EMPTY */}

      {!error && orders.length === 0 && (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-2xl">
            📦
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-900">
            No orders yet
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Once you place an order, it will appear here.
          </p>

          <Link
            to="/foods"
            className="mt-5 inline-block rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Browse Food
          </Link>
        </div>
      )}

      {/* ORDERS */}

      {orders.length > 0 && (
        <div className="mt-8 space-y-5">
          {orders.map((order) => {
            const firstItems = order.items?.slice(0, 2) || [];

            const extraItems = Math.max((order.items?.length || 0) - 2, 0);

            return (
              <div
                key={order._id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
              >
                {/* Top */}

                <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-start">
                  <div>
                    <p className="text-xs text-slate-500">Order ID</p>

                    <p className="mt-1 break-all text-sm font-bold text-slate-900">
                      {order._id}
                    </p>

                    <p className="mt-2 text-xs text-slate-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                        order.orderStatus,
                      )}`}
                    >
                      {order.orderStatus}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        order.paymentStatus === "Paid"
                          ? "bg-green-100 text-green-700"
                          : order.paymentStatus === "Failed"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      Payment: {order.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Items */}

                <div className="mt-5 space-y-3">
                  {firstItems.map((item, index) => (
                    <div
                      key={`${order._id}-${index}`}
                      className="flex items-center justify-between gap-4"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        {item.food?.image ? (
                          <img
                            src={item.food.image}
                            alt={item.name}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400">
                            No Image
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {item.name}
                          </p>

                          <p className="text-xs text-slate-500">
                            {item.quantity} × Rs.{" "}
                            {Number(item.price).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <p className="shrink-0 text-sm font-semibold text-slate-900">
                        Rs. {Number(item.subtotal).toFixed(2)}
                      </p>
                    </div>
                  ))}

                  {extraItems > 0 && (
                    <p className="text-xs text-slate-500">
                      + {extraItems} more item
                      {extraItems !== 1 ? "s" : ""}
                    </p>
                  )}
                </div>

                {/* Bottom */}

                <div className="mt-5 flex flex-col justify-between gap-4 border-t border-slate-200 pt-5 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-xs text-slate-500">Total Amount</p>

                    <p className="mt-1 text-xl font-bold text-slate-900">
                      Rs. {Number(order.totalAmount).toFixed(2)}
                    </p>
                  </div>

                  <Link
                    to={`/orders/${order._id}`}
                    className="rounded-lg bg-slate-900 px-5 py-2.5 text-center text-sm font-semibold text-white hover:bg-slate-800"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
