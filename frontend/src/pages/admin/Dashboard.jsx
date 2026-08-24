import { useEffect, useState } from "react";
import {
  Users,
  Utensils,
  ShoppingBag,
  Banknote,
  TrendingUp,
  Award,
  ArrowUpRight,
  Clock,
} from "lucide-react";

import api from "../../services/api";
import { RevenueTrendChart, OrderStatusDistributionChart } from "../../components/admin/DashboardCharts";
import { SkeletonMetric } from "../../components/ui/Skeleton";
import Badge from "../../components/ui/Badge";

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
        setError(error.response?.data?.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
        <h1 className="text-2xl font-extrabold text-slate-900">Dashboard Overview</h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SkeletonMetric />
          <SkeletonMetric />
          <SkeletonMetric />
          <SkeletonMetric />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center max-w-lg mx-auto my-12 bg-rose-50 border border-rose-200 rounded-2xl">
        <p className="text-sm font-semibold text-rose-700">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

  const status = dashboard?.orderStatus || {};

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Dashboard Overview
          </h1>
          <p className="mt-1 text-sm text-slate-500 font-medium">
            Welcome back! Here is a summary of your food ordering platform.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-2xs">
          <Clock className="h-4 w-4 text-orange-500" />
          <span>Last updated: Just now</span>
        </div>
      </div>

      {/* Main KPI Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Customers"
          value={dashboard.totalCustomers || 0}
          icon={Users}
          gradient="from-blue-500 to-indigo-600"
          trend="+12% this month"
        />
        <StatCard
          title="Active Foods"
          value={dashboard.totalFoods || 0}
          icon={Utensils}
          gradient="from-orange-500 to-amber-600"
          trend="Menu items"
        />
        <StatCard
          title="Total Orders"
          value={dashboard.totalOrders || 0}
          icon={ShoppingBag}
          gradient="from-purple-500 to-violet-600"
          trend="+18% sales growth"
        />
        <StatCard
          title="Total Revenue"
          value={`Rs. ${Number(dashboard.totalRevenue || 0).toLocaleString()}`}
          icon={Banknote}
          gradient="from-emerald-500 to-teal-600"
          trend="Lifetime earnings"
        />
      </div>

      {/* Interactive Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueTrendChart />
        <OrderStatusDistributionChart status={status} />
      </div>

      {/* Bottom Section: Recent Orders & Best Sellers */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders List */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-orange-500" />
                Recent Orders
              </h2>
              <a
                href="/admin/orders"
                className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1"
              >
                View all <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>

            <div className="mt-4 space-y-3">
              {dashboard.recentOrders?.length ? (
                dashboard.recentOrders.map((order) => (
                  <div
                    key={order._id}
                    className="flex items-center justify-between rounded-xl bg-slate-50 p-3.5 border border-slate-100 hover:bg-slate-100/80 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 text-orange-600 font-bold text-xs">
                        #{order._id ? order._id.slice(-4).toUpperCase() : "ORD"}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          {order.user?.name || "Customer"}
                        </p>
                        <div className="mt-0.5">
                          <Badge>{order.orderStatus}</Badge>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm font-extrabold text-slate-900">
                      Rs. {Number(order.totalAmount).toFixed(2)}
                    </p>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-slate-400">
                  No orders recorded yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Best Selling Foods */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-500" />
                Best Selling Dishes
              </h2>
              <span className="text-xs text-slate-500 font-medium">By quantity sold</span>
            </div>

            <div className="mt-4 space-y-3">
              {dashboard.bestSellingFood?.length ? (
                dashboard.bestSellingFood.map((food, rank) => (
                  <div
                    key={food._id}
                    className="flex items-center justify-between rounded-xl bg-slate-50 p-3.5 border border-slate-100 hover:bg-slate-100/80 transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/10 text-xs font-bold text-amber-600">
                        #{rank + 1}
                      </span>
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          {food.foodName}
                        </p>
                        <p className="text-xs text-slate-500 font-medium">
                          {food.totalQuantity} total units ordered
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                      <TrendingUp className="h-3 w-3" /> Popular
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-slate-400">
                  No food sales data yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, gradient, trend }) => {
  return (
    <div className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {title}
          </p>
          <h3 className="mt-2 text-2xl font-extrabold text-slate-900">
            {value}
          </h3>
          <p className="mt-1 text-xs font-medium text-emerald-600 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            {trend}
          </p>
        </div>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr ${gradient} text-white shadow-md group-hover:scale-110 transition-transform`}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
