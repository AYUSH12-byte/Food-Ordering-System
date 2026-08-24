import { useState } from "react";
import { TrendingUp, ShoppingBag, Award, BarChart3 } from "lucide-react";

export const RevenueTrendChart = () => {
  const data = [
    { label: "Mon", revenue: 1200 },
    { label: "Tue", revenue: 1900 },
    { label: "Wed", revenue: 1500 },
    { label: "Thu", revenue: 2800 },
    { label: "Fri", revenue: 3400 },
    { label: "Sat", revenue: 4200 },
    { label: "Sun", revenue: 3800 },
  ];

  const maxRevenue = Math.max(...data.map((d) => d.revenue));
  const points = data
    .map((d, index) => {
      const x = (index / (data.length - 1)) * 340 + 30;
      const y = 140 - (d.revenue / maxRevenue) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  const areaPoints = `30,140 ${points} 370,140`;

  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-orange-500" />
            Revenue Overview (Weekly)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Total sales performance over the past 7 days
          </p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
          +24.5% vs last week
        </span>
      </div>

      <div className="mt-6 relative">
        <svg viewBox="0 0 400 160" className="w-full h-44 overflow-visible">
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[30, 65, 100, 140].map((y, i) => (
            <line
              key={i}
              x1="30"
              y1={y}
              x2="370"
              y2={y}
              stroke="#f1f5f9"
              strokeDasharray="4 4"
            />
          ))}

          {/* Gradient area */}
          <polygon points={areaPoints} fill="url(#revenueGradient)" />

          {/* Trend Line */}
          <polyline
            fill="none"
            stroke="#f97316"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />

          {/* Interactive dots */}
          {data.map((d, index) => {
            const x = (index / (data.length - 1)) * 340 + 30;
            const y = 140 - (d.revenue / maxRevenue) * 100;
            const isHovered = hoveredIndex === index;

            return (
              <g key={index} className="cursor-pointer" onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)}>
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? "6" : "4"}
                  fill={isHovered ? "#ea580c" : "#f97316"}
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="transition-all duration-200"
                />
                <text
                  x={x}
                  y="156"
                  textAnchor="middle"
                  className="text-[10px] fill-slate-400 font-semibold"
                >
                  {d.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip */}
        {hoveredIndex !== null && (
          <div
            className="absolute top-2 left-1/2 -translate-x-1/2 rounded-xl bg-slate-900 px-3 py-1.5 text-xs text-white shadow-lg animate-scale-up pointer-events-none"
          >
            <span className="font-semibold">{data[hoveredIndex].label}:</span>{" "}
            <span className="text-orange-400 font-bold">Rs. {data[hoveredIndex].revenue}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export const OrderStatusDistributionChart = ({ status = {} }) => {
  const items = [
    { label: "Pending", count: status.pending || 0, color: "bg-amber-500", text: "text-amber-700" },
    { label: "Preparing", count: status.preparing || 0, color: "bg-blue-500", text: "text-blue-700" },
    { label: "Ready", count: status.ready || 0, color: "bg-purple-500", text: "text-purple-700" },
    { label: "Delivered", count: status.delivered || 0, color: "bg-emerald-500", text: "text-emerald-700" },
    { label: "Cancelled", count: status.cancelled || 0, color: "bg-rose-500", text: "text-rose-700" },
  ];

  const total = items.reduce((acc, item) => acc + item.count, 0) || 1;

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
      <div className="pb-4 border-b border-slate-100">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-500" />
          Order Status Distribution
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Real-time order pipeline breakdown ({total} total orders)
        </p>
      </div>

      {/* Progress Bar Stack */}
      <div className="mt-5 h-4 w-full overflow-hidden rounded-full bg-slate-100 flex shadow-inner">
        {items.map((item) => {
          const percentage = (item.count / total) * 100;
          if (percentage === 0) return null;
          return (
            <div
              key={item.label}
              style={{ width: `${percentage}%` }}
              className={`${item.color} h-full transition-all duration-500 hover:opacity-80`}
              title={`${item.label}: ${item.count} (${percentage.toFixed(1)}%)`}
            />
          );
        })}
      </div>

      {/* Legend List */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50/50 p-2.5"
          >
            <span className={`h-3 w-3 rounded-full ${item.color} shrink-0`} />
            <div className="leading-none">
              <p className="text-xs font-semibold text-slate-700">{item.label}</p>
              <p className="mt-1 text-sm font-extrabold text-slate-900">{item.count}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
