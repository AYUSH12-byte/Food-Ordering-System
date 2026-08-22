import { useEffect, useMemo, useState } from "react";

import { getCustomers, deleteCustomer } from "../../services/customerService";

const Customers = () => {
  const [customers, setCustomers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");

  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getCustomers(search);

      setCustomers(response.customers || []);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return customers;
    }

    return customers.filter(
      (customer) =>
        customer.name?.toLowerCase().includes(value) ||
        customer.email?.toLowerCase().includes(value) ||
        customer.phone?.toLowerCase().includes(value),
    );
  }, [customers, search]);

  const handleDelete = async (customer) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${customer.name}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await deleteCustomer(customer._id);

      setSuccess("Customer deleted successfully");

      setSelectedCustomer(null);

      await fetchCustomers();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete customer");
    }
  };

  return (
    <>
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}

        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Customers
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage registered customers
          </p>
        </div>

        {/* Messages */}

        {success && (
          <div className="mt-6 rounded-lg bg-green-50 p-4 text-sm font-medium text-green-700">
            {success}
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        {/* Search */}

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search customers..."
              className="flex-1 rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
            />

            <button
              type="button"
              onClick={fetchCustomers}
              className="rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Search
            </button>
          </div>
        </div>

        {/* Table */}

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="p-10 text-center text-slate-500">
              Loading customers...
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="p-10 text-center">
              <h2 className="text-lg font-bold text-slate-900">
                No customers found
              </h2>

              <p className="mt-2 text-sm text-slate-500">Try another search.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Customer
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Phone
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Address
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Joined
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  {filteredCustomers.map((customer) => (
                    <tr key={customer._id} className="hover:bg-slate-50">
                      <td className="px-6 py-5">
                        <p className="font-semibold text-slate-900">
                          {customer.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {customer.email}
                        </p>
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-700">
                        {customer.phone}
                      </td>

                      <td className="max-w-xs px-6 py-5 text-sm text-slate-700">
                        <p className="line-clamp-2">{customer.address}</p>
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-500">
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedCustomer(customer)}
                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                          >
                            View
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(customer)}
                            className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                          >
                            Delete
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

      {/* Customer Modal */}

      {selectedCustomer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelectedCustomer(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Customer Details
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <p className="text-xs text-slate-400">Name</p>

                <p className="mt-1 font-semibold text-slate-900">
                  {selectedCustomer.name}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">Email</p>

                <p className="mt-1 break-all font-semibold text-slate-900">
                  {selectedCustomer.email}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">Phone</p>

                <p className="mt-1 font-semibold text-slate-900">
                  {selectedCustomer.phone}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">Address</p>

                <p className="mt-1 font-semibold text-slate-900">
                  {selectedCustomer.address}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">Joined</p>

                <p className="mt-1 font-semibold text-slate-900">
                  {new Date(selectedCustomer.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-6 border-t border-slate-200 pt-5">
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="w-full rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Customers;
