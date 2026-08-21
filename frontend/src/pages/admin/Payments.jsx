import { useEffect, useMemo, useState } from "react";

import {
  getAllPayments,
  markPaymentAsPaid,
  markPaymentAsFailed,
} from "../../services/paymentService";

import PaymentDetailsModal from "../../components/admin/PaymentDetailsModal";

const Payments = () => {
  const [payments, setPayments] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("");

  const [methodFilter, setMethodFilter] = useState("");

  const [selectedPayment, setSelectedPayment] = useState(null);

  const [updatingId, setUpdatingId] = useState(null);

  // FETCH PAYMENTS

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllPayments();

      setPayments(response.payments || []);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // FILTER

  const filteredPayments = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return payments.filter((payment) => {
      const matchesSearch =
        !searchValue ||
        payment._id.toLowerCase().includes(searchValue) ||
        payment.user?.name?.toLowerCase().includes(searchValue) ||
        payment.user?.email?.toLowerCase().includes(searchValue) ||
        payment.order?._id?.toLowerCase().includes(searchValue);

      const matchesStatus =
        !statusFilter || payment.paymentStatus === statusFilter;

      const matchesMethod =
        !methodFilter || payment.paymentMethod === methodFilter;

      return matchesSearch && matchesStatus && matchesMethod;
    });
  }, [payments, search, statusFilter, methodFilter]);

  // MARK PAID

  const handleMarkPaid = async (payment) => {
    const confirmed = window.confirm("Mark this payment as paid?");

    if (!confirmed) {
      return;
    }

    try {
      setUpdatingId(payment._id);

      setError("");
      setSuccessMessage("");

      await markPaymentAsPaid(payment._id);

      setSuccessMessage("Payment marked as paid successfully");

      await fetchPayments();

      setSelectedPayment((current) => {
        if (!current || current._id !== payment._id) {
          return current;
        }

        return {
          ...current,
          paymentStatus: "Paid",
          paymentDate: new Date().toISOString(),
        };
      });
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update payment");
    } finally {
      setUpdatingId(null);
    }
  };

  // MARK FAILED

  const handleMarkFailed = async (payment) => {
    const confirmed = window.confirm("Mark this payment as failed?");

    if (!confirmed) {
      return;
    }

    try {
      setUpdatingId(payment._id);

      setError("");
      setSuccessMessage("");

      await markPaymentAsFailed(payment._id);

      setSuccessMessage("Payment marked as failed");

      await fetchPayments();

      setSelectedPayment((current) => {
        if (!current || current._id !== payment._id) {
          return current;
        }

        return {
          ...current,
          paymentStatus: "Failed",
        };
      });
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update payment");
    } finally {
      setUpdatingId(null);
    }
  };

  // RESET

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("");
    setMethodFilter("");
  };

  // STATUS STYLE

  const getStatusClass = (status) => {
    if (status === "Paid") {
      return "bg-green-100 text-green-700";
    }

    if (status === "Failed") {
      return "bg-red-100 text-red-700";
    }

    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <>
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}

        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Payments
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            View and manage customer payments
          </p>
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

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Search
              </label>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Payment, order or customer..."
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
              />
            </div>

            {/* Status */}

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Payment Status
              </label>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-slate-900"
              >
                <option value="">All Statuses</option>

                <option value="Pending">Pending</option>

                <option value="Paid">Paid</option>

                <option value="Failed">Failed</option>
              </select>
            </div>

            {/* Method */}

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Method
              </label>

              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-slate-900"
              >
                <option value="">All Methods</option>

                <option value="Cash on Delivery">Cash on Delivery</option>

                <option value="Online">Online</option>
              </select>
            </div>

            {/* Reset */}

            <div className="flex items-end">
              <button
                type="button"
                onClick={resetFilters}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Reset Filters
              </button>
            </div>
          </div>

          <p className="mt-4 text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-900">
              {filteredPayments.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-900">
              {payments.length}
            </span>{" "}
            payments
          </p>
        </div>

        {/* Table */}

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="p-10 text-center text-slate-500">
              Loading payments...
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="p-10 text-center">
              <h2 className="text-lg font-bold text-slate-900">
                No payments found
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
                      Payment
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Customer
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Order
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Amount
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Method
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  {filteredPayments.map((payment) => (
                    <tr key={payment._id} className="hover:bg-slate-50">
                      {/* Payment */}

                      <td className="px-6 py-5">
                        <p className="max-w-[180px] truncate text-sm font-semibold text-slate-900">
                          #{payment._id.slice(-8)}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </p>
                      </td>

                      {/* Customer */}

                      <td className="px-6 py-5">
                        <p className="font-semibold text-slate-900">
                          {payment.user?.name || "Unknown"}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {payment.user?.email || "N/A"}
                        </p>
                      </td>

                      {/* Order */}

                      <td className="px-6 py-5">
                        <p className="max-w-[180px] truncate text-sm font-medium text-slate-900">
                          #{payment.order?._id?.slice(-8) || "N/A"}
                        </p>
                      </td>

                      {/* Amount */}

                      <td className="px-6 py-5">
                        <p className="font-bold text-slate-900">
                          Rs. {Number(payment.amount).toFixed(2)}
                        </p>
                      </td>

                      {/* Method */}

                      <td className="px-6 py-5">
                        <p className="text-sm text-slate-700">
                          {payment.paymentMethod}
                        </p>
                      </td>

                      {/* Status */}

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                            payment.paymentStatus,
                          )}`}
                        >
                          {payment.paymentStatus}
                        </span>
                      </td>

                      {/* Actions */}

                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-2">
                          {payment.paymentStatus === "Pending" && (
                            <>
                              <button
                                type="button"
                                disabled={updatingId === payment._id}
                                onClick={() => handleMarkPaid(payment)}
                                className="rounded-lg bg-green-50 px-3 py-2 text-sm font-semibold text-green-700 hover:bg-green-100 disabled:opacity-50"
                              >
                                Paid
                              </button>

                              <button
                                type="button"
                                disabled={updatingId === payment._id}
                                onClick={() => handleMarkFailed(payment)}
                                className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50"
                              >
                                Failed
                              </button>
                            </>
                          )}

                          <button
                            type="button"
                            onClick={() => setSelectedPayment(payment)}
                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}

      {selectedPayment && (
        <PaymentDetailsModal
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
        />
      )}
    </>
  );
};

export default Payments;
