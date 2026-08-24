import { useEffect, useMemo, useState } from "react";
import { Search, RotateCcw, ShoppingBag, Eye } from "lucide-react";

import { getAllOrders, updateOrderStatus } from "../../services/orderService";
import OrderDetailsModal from "../../components/admin/OrderDetailsModal";
import Badge from "../../components/ui/Badge";
import { SkeletonTable } from "../../components/ui/Skeleton";
import { useToast } from "../../context/ToastContext";

const Orders = () => {
  const toast = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getAllOrders();
      setOrders(response.orders || []);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to load orders";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

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

  const handleStatusChange = async (order, newStatus) => {
    try {
      setUpdatingId(order._id);
      setError("");
      await updateOrderStatus(order._id, newStatus);
      toast.success(`Order status changed to ${newStatus}`);
      await fetchOrders();

      setSelectedOrder((currentOrder) => {
        if (!currentOrder || currentOrder._id !== order._id) {
          return currentOrder;
        }
        return {
          ...currentOrder,
          orderStatus: newStatus,
        };
      });
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update status";
      setError(msg);
      toast.error(msg);
    } finally {
      setUpdatingId(null);
    }
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("");
    setPaymentFilter("");
  };

  return (
    <>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 animate-fade-in max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center border-b border-slate-200/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-600 border border-orange-200/80 mb-2">
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>Order Management</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Customer Orders
            </h1>
            <p className="mt-1 text-xs text-slate-500 font-medium">
              Track live order statuses, payment verification, and delivery dispatch.
            </p>
          </div>
        </div>

        {error && (
          <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-xs font-bold text-rose-700">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="md:col-span-2 relative">
              <label className="mb-1 block text-xs font-bold text-slate-700 uppercase tracking-wider">Search</label>
              <div className="relative">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by Order ID, customer name, email..."
                  className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700 uppercase tracking-wider">Order Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
              >
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Preparing">Preparing</option>
                <option value="Ready">Ready</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700 uppercase tracking-wider">Payment</label>
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
              >
                <option value="">All Payment Types</option>
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Failed">Failed</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-medium text-slate-500">
            <span>
              Showing <strong className="text-slate-900 font-bold">{filteredOrders.length}</strong> of {orders.length} orders
            </span>
            <button onClick={resetFilters} className="flex items-center gap-1 font-bold text-slate-600 hover:text-orange-600 transition">
              <RotateCcw className="h-3.5 w-3.5" /> Reset Filters
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          {loading ? (
            <SkeletonTable rows={6} cols={6} />
          ) : filteredOrders.length === 0 ? (
            <div className="p-12 text-center max-w-md mx-auto">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 mx-auto mb-3">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No orders found</h3>
              <p className="mt-1 text-xs text-slate-500">Try adjusting search filters or check back later.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead className="border-b border-slate-100 bg-slate-50/70 text-slate-500">
                  <tr>
                    <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider">Payment</th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider">Order Status</th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider">Update Pipeline</th>
                    <th className="px-6 py-3.5 text-right text-xs font-bold uppercase tracking-wider">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredOrders.map((order) => {
                    const nextStatuses = getNextStatuses(order.orderStatus);

                    return (
                      <tr key={order._id} className="hover:bg-slate-50/80 transition">
                        <td className="px-6 py-4 font-mono">
                          <p className="font-bold text-slate-900">#{order._id.slice(-6).toUpperCase()}</p>
                          <p className="text-[11px] text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </td>

                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-900 text-sm">{order.user?.name || "Customer"}</p>
                          <p className="text-[11px] text-slate-500">{order.user?.email || "N/A"}</p>
                        </td>

                        <td className="px-6 py-4">
                          <p className="font-extrabold text-slate-900">
                            Rs. {Number(order.totalAmount).toFixed(2)}
                          </p>
                          <p className="text-[11px] text-slate-400">{order.items?.length || 0} items</p>
                        </td>

                        <td className="px-6 py-4">
                          <Badge>{order.paymentStatus}</Badge>
                          <p className="text-[11px] text-slate-500 mt-1 font-medium">{order.paymentMethod}</p>
                        </td>

                        <td className="px-6 py-4">
                          <Badge>{order.orderStatus}</Badge>
                        </td>

                        <td className="px-6 py-4">
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
                              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:opacity-40 transition"
                            >
                              <option value="">
                                {updatingId === order._id ? "Updating..." : "Set Status →"}
                              </option>
                              {nextStatuses.map((st) => (
                                <option key={st} value={st}>
                                  {st}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span className="text-[11px] font-semibold text-slate-400">Finalized</span>
                          )}
                        </td>

                        <td className="px-6 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition shadow-2xs"
                          >
                            <Eye className="h-3.5 w-3.5" /> Details
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
