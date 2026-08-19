import { Link, useLocation } from "react-router-dom";

const OrderSuccess = () => {
  const location = useLocation();

  const { order, payment, receipt } = location.state || {};

  // NO STATE

  if (!order) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            Order information not found
          </h1>

          <Link
            to="/orders"
            className="mt-5 inline-block rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
          >
            View My Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[75vh] max-w-3xl items-center justify-center px-4 py-10">
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-10">
        {/* Success */}

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-3xl">
          ✓
        </div>

        <h1 className="mt-6 text-3xl font-bold text-slate-900">
          Order Placed Successfully!
        </h1>

        <p className="mt-3 text-slate-500">
          Thank you for your order. Your restaurant will start preparing it
          soon.
        </p>

        {/* Order Information */}

        <div className="mt-8 rounded-xl bg-slate-50 p-6 text-left">
          <div className="flex justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <p className="text-xs text-slate-500">Order ID</p>

              <p className="mt-1 break-all text-sm font-semibold text-slate-900">
                {order._id}
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs text-slate-500">Status</p>

              <span className="mt-1 inline-flex rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                {order.orderStatus}
              </span>
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-slate-500">Total Amount</p>

              <p className="mt-1 text-lg font-bold text-slate-900">
                Rs. {Number(order.totalAmount).toFixed(2)}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">Payment</p>

              <p className="mt-1 text-sm font-semibold text-slate-900">
                {payment?.paymentMethod || order.paymentMethod}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {payment?.paymentStatus || order.paymentStatus}
              </p>
            </div>
          </div>

          {receipt && (
            <div className="mt-4 border-t border-slate-200 pt-4">
              <p className="text-xs text-slate-500">Receipt Number</p>

              <p className="mt-1 text-sm font-bold text-slate-900">
                {receipt.receiptNumber}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/orders"
            className="rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            View My Orders
          </Link>

          <Link
            to="/foods"
            className="rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;