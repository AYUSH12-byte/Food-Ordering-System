import {
  Link,
  useLocation,
} from "react-router-dom";

const OrderSuccess = () => {
  const location = useLocation();

  const {
    order,
    payment,
    receipt,
  } = location.state || {};

  // ==========================================
  // GET RECEIPT ID
  // ==========================================

  const receiptId =
    receipt?.id ||
    receipt?._id ||
    order?.receipt?._id;

  // ==========================================
  // NO ORDER DATA
  // ==========================================

  if (!order) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-3xl">
            !
          </div>

          <h1 className="mt-6 text-2xl font-bold text-slate-900">
            Order information not found
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Your order may still exist. You can
            check your order history.
          </p>

          <Link
            to="/orders"
            className="mt-5 inline-block rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            View My Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[75vh] max-w-3xl items-center justify-center px-4 py-10">
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        {/* ================================= */}
        {/* SUCCESS ICON */}
        {/* ================================= */}

        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-3xl font-bold text-green-600">
            ✓
          </div>

          <h1 className="mt-6 text-3xl font-bold text-slate-900">
            Order Placed Successfully!
          </h1>

          <p className="mt-3 text-slate-500">
            Thank you for your order. Your
            restaurant will start preparing it
            soon.
          </p>
        </div>

        {/* ================================= */}
        {/* ORDER INFORMATION */}
        {/* ================================= */}

        <div className="mt-8 rounded-xl bg-slate-50 p-6">
          {/* Order ID + Status */}

          <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-4 sm:flex-row">
            <div>
              <p className="text-xs text-slate-500">
                Order ID
              </p>

              <p className="mt-1 break-all text-sm font-semibold text-slate-900">
                {order._id}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-xs text-slate-500">
                Order Status
              </p>

              <span className="mt-1 inline-flex rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                {order.orderStatus}
              </span>
            </div>
          </div>

          {/* Amount + Payment */}

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-slate-500">
                Total Amount
              </p>

              <p className="mt-1 text-lg font-bold text-slate-900">
                Rs.{" "}
                {Number(
                  order.totalAmount || 0
                ).toFixed(2)}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Payment
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-900">
                {payment?.paymentMethod ||
                  order.paymentMethod ||
                  "N/A"}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {payment?.paymentStatus ||
                  order.paymentStatus ||
                  "Pending"}
              </p>
            </div>
          </div>

          {/* ================================= */}
          {/* RECEIPT */}
          {/* ================================= */}

          {receipt && (
            <div className="mt-5 border-t border-slate-200 pt-5">
              <p className="text-xs text-slate-500">
                Receipt Number
              </p>

              <p className="mt-1 font-bold text-slate-900">
                {receipt.receiptNumber}
              </p>

              {receiptId && (
                <Link
                  to={`/receipts/${receiptId}`}
                  className="mt-4 inline-block rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  View Receipt
                </Link>
              )}
            </div>
          )}
        </div>

        {/* ================================= */}
        {/* ACTIONS */}
        {/* ================================= */}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/orders"
            className="rounded-lg bg-slate-900 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-slate-800"
          >
            View My Orders
          </Link>

          <Link
            to="/foods"
            className="rounded-lg border border-slate-300 px-6 py-3 text-center text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;