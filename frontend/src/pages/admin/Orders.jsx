import { useEffect, useMemo, useState } from "react";

import { getAllOrders, updateOrderStatus } from "../../services/orderService";

import OrderDetailsModal from "../../components/admin/OrderDetailsModal";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("");

  const [paymentFilter, setPaymentFilter] = useState("");

  const [selectedOrder, setSelectedOrder] = useState(null);

  const [updatingId, setUpdatingId] = useState(null);

  // FETCH ORDERS

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllOrders();

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

  // FILTER

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const searchValue = search.trim().toLowerCase();

      const matchesSearch =
        !searchValue ||
        order._id.toLowerCase().includes(searchValue) ||
        order.user?.name?.toLowerCase().includes(searchValue) ||
        order.user?.email?.toLowerCase().includes(searchValue);

      const matchesStatus = !statusFilter || order.orderStatus === statusFilter;

      const matchesPayment =
        !paymentFilter || order.paymentStatus === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [orders, search, statusFilter, paymentFilter]);

  // STATUS OPTIONS

  const getNextStatuses = (currentStatus) => {
    const transitions = {
      Pending: ["Preparing", "Cancelled"],

      Preparing: ["Ready", "Cancelled"],

      Ready: ["Delivered"],

      Delivered: [],

      Cancelled: [],
    };

    return transitions[currentStatus] || [];
  };

  // UPDATE STATUS

  const handleStatusChange = async (order, newStatus) => {
    try {
      setUpdatingId(order._id);

      setError("");
      setSuccessMessage("");

      await updateOrderStatus(order._id, newStatus);

      setSuccessMessage(`Order status updated to ${newStatus}`);

      await fetchOrders();

      // Update selected modal data
      setSelectedOrder((currentOrder) => {
        if (!currentOrder || currentOrder._id !== order._id) {
          return currentOrder;
        }

        return {
          ...currentOrder,
          orderStatus: newStatus,
        };
      });
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to update order status",
      );
    } finally {
      setUpdatingId(null);
    }
  };

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

  // PAYMENT STYLE

  const getPaymentClass = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-700";

      case "Failed":
        return "bg-red-100 text-red-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  // RESET FILTERS

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("");
    setPaymentFilter("");
  };

  return (
    <>
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Orders
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              View and manage customer orders
            </p>
          </div>
        </div>

        {/* Messages */}

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

        {/* Filters */}

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-4 md:grid-cols-4">
            {/* Search */}

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Search
              </label>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by order ID, customer name or email..."
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
              />
            </div>

            {/* Order Status */}

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Order Status
              </label>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-slate-900"
              >
                <option value="">All Statuses</option>

                <option value="Pending">Pending</option>

                <option value="Preparing">Preparing</option>

                <option value="Ready">Ready</option>

                <option value="Delivered">Delivered</option>

                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Payment Status */}

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Payment
              </label>

              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-slate-900"
              >
                <option value="">All Payments</option>

                <option value="Pending">Pending</option>

                <option value="Paid">Paid</option>

                <option value="Failed">Failed</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-900">
                {filteredOrders.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-900">
                {orders.length}
              </span>{" "}
              orders
            </p>

            <button
              type="button"
              onClick={resetFilters}
              className="text-sm font-semibold text-slate-600 hover:text-slate-900"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Orders Table */}

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="p-10 text-center text-slate-500">
              Loading orders...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-10 text-center">
              <h2 className="text-lg font-bold text-slate-900">
                No orders found
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Try changing your filters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px]">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Order
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Customer
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Total
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Payment
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Change Status
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  {filteredOrders.map((order) => {
                    const nextStatuses = getNextStatuses(order.orderStatus);

                    return (
                      <tr key={order._id} className="hover:bg-slate-50">
                        {/* Order */}

                        <td className="px-6 py-5">
                          <p className="max-w-[180px] truncate text-sm font-semibold text-slate-900">
                            #{order._id.slice(-8)}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </td>

                        {/* Customer */}

                        <td className="px-6 py-5">
                          <p className="font-semibold text-slate-900">
                            {order.user?.name || "Unknown"}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {order.user?.email || "N/A"}
                          </p>
                        </td>

                        {/* Total */}

                        <td className="px-6 py-5">
                          <p className="font-semibold text-slate-900">
                            Rs. {Number(order.totalAmount).toFixed(2)}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {order.items?.length || 0} item(s)
                          </p>
                        </td>

                        {/* Payment */}

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getPaymentClass(
                              order.paymentStatus,
                            )}`}
                          >
                            {order.paymentStatus}
                          </span>

                          <p className="mt-1 text-xs text-slate-500">
                            {order.paymentMethod}
                          </p>
                        </td>

                        {/* Status */}

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                              order.orderStatus,
                            )}`}
                          >
                            {order.orderStatus}
                          </span>
                        </td>

                        {/* Change Status */}

                        <td className="px-6 py-5">
                          {nextStatuses.length > 0 ? (
                            <select
                              value=""
                              disabled={updatingId === order._id}
                              onChange={(event) => {
                                const newStatus = event.target.value;

                                if (newStatus) {
                                  handleStatusChange(order, newStatus);
                                }
                              }}
                              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-900 disabled:opacity-50"
                            >
                              <option value="">
                                {updatingId === order._id
                                  ? "Updating..."
                                  : "Update..."}
                              </option>

                              {nextStatuses.map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span className="text-xs text-slate-400">
                              No changes
                            </span>
                          )}
                        </td>

                        {/* Action */}

                        <td className="px-6 py-5 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </>
  );
};

export default Orders;
