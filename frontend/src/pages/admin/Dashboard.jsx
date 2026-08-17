import { useEffect, useState } from "react";

import api from "../../services/api";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get("/dashboard");

        setDashboard(response.data.dashboard);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="p-8">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-600">{error}</div>;
  }

  const status = dashboard.orderStatus;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Customers" value={dashboard.totalCustomers} />

        <StatCard title="Foods" value={dashboard.totalFoods} />

        <StatCard title="Orders" value={dashboard.totalOrders} />

        <StatCard title="Revenue" value={`Rs. ${dashboard.totalRevenue}`} />
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-5">
        <StatusCard title="Pending" value={status.pending} />

        <StatusCard title="Preparing" value={status.preparing} />

        <StatusCard title="Ready" value={status.ready} />

        <StatusCard title="Delivered" value={status.delivered} />

        <StatusCard title="Cancelled" value={status.cancelled} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">Recent Orders</h2>

          <div className="mt-4 space-y-3">
            {dashboard.recentOrders?.length ? (
              dashboard.recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between rounded-lg bg-slate-50 p-4"
                >
                  <div>
                    <p className="font-medium">
                      {order.user?.name || "Unknown"}
                    </p>

                    <p className="text-sm text-slate-500">
                      {order.orderStatus}
                    </p>
                  </div>

                  <p className="font-semibold">Rs. {order.totalAmount}</p>
                </div>
              ))
            ) : (
              <p className="text-slate-500">No orders yet.</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">Best Selling Food</h2>

          <div className="mt-4 space-y-3">
            {dashboard.bestSellingFood?.length ? (
              dashboard.bestSellingFood.map((food) => (
                <div
                  key={food._id}
                  className="flex items-center justify-between rounded-lg bg-slate-50 p-4"
                >
                  <p className="font-medium">{food.foodName}</p>

                  <p className="text-sm text-slate-500">
                    {food.totalQuantity} sold
                  </p>
                </div>
              ))
            ) : (
              <p className="text-slate-500">No sales yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>

      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
};

const StatusCard = ({ title, value }) => {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>

      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
};

export default Dashboard;
