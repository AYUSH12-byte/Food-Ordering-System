import Modal from "../ui/Modal";
import Badge from "../ui/Badge";
import { User, CreditCard, ShoppingBag, Calendar, CheckCircle2 } from "lucide-react";

const PaymentDetailsModal = ({ payment, onClose }) => {
  if (!payment) return null;

  const order = payment.order;

  return (
    <Modal
      isOpen={Boolean(payment)}
      onClose={onClose}
      title="Payment Record"
      subtitle={`ID: #${payment._id}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Customer Info */}
        <div>
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-3">
            <User className="h-4 w-4 text-orange-500" /> Customer Information
          </h3>
          <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 text-xs">
            <p className="font-bold text-slate-900 text-sm">{payment.user?.name || "Unknown Customer"}</p>
            <p className="mt-1 text-slate-500 font-medium">{payment.user?.email || "N/A"}</p>
            <p className="mt-0.5 text-slate-500 font-medium">{payment.user?.phone || "N/A"}</p>
          </div>
        </div>

        {/* Payment Stats Grid */}
        <div>
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-3">
            <CreditCard className="h-4 w-4 text-orange-500" /> Transaction Summary
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 text-xs">
            <div className="rounded-xl border border-slate-200/80 bg-white p-4">
              <p className="text-slate-400 font-medium">Payment Amount</p>
              <p className="mt-1 text-xl font-extrabold text-orange-600">
                Rs. {Number(payment.amount).toFixed(2)}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200/80 bg-white p-4">
              <p className="text-slate-400 font-medium">Payment Method</p>
              <p className="mt-1 font-bold text-slate-900 text-sm">{payment.paymentMethod}</p>
            </div>

            <div className="rounded-xl border border-slate-200/80 bg-white p-4">
              <p className="text-slate-400 font-medium">Payment Status</p>
              <div className="mt-1.5">
                <Badge>{payment.paymentStatus}</Badge>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200/80 bg-white p-4">
              <p className="text-slate-400 font-medium">Transaction ID</p>
              <p className="mt-1 font-mono font-bold text-slate-800 break-all">
                {payment.transactionId || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Order Details Reference */}
        {order && (
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-3">
              <ShoppingBag className="h-4 w-4 text-orange-500" /> Linked Order
            </h3>
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 text-xs space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-slate-400 font-medium">Order ID</p>
                  <p className="font-mono font-bold text-slate-900">#{order._id}</p>
                </div>
                <div>
                  <Badge>{order.orderStatus}</Badge>
                </div>
              </div>
              <div className="border-t border-slate-200/80 pt-3 flex justify-between font-bold text-slate-900 text-sm">
                <span>Order Total</span>
                <span className="text-orange-600">Rs. {Number(order.totalAmount).toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Timestamps */}
        <div className="border-t border-slate-100 pt-4 flex flex-wrap justify-between gap-4 text-xs text-slate-500">
          <div>
            <span className="font-medium">Created: </span>
            <span className="font-bold text-slate-700">{new Date(payment.createdAt).toLocaleString()}</span>
          </div>
          {payment.paymentDate && (
            <div>
              <span className="font-medium">Paid On: </span>
              <span className="font-bold text-slate-700">{new Date(payment.paymentDate).toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default PaymentDetailsModal;
