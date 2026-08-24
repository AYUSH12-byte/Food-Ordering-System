import { useEffect } from "react";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

const ToastItem = ({ id, message, type = "info", duration = 4000, onDismiss }) => {
  useEffect(() => {
    if (duration <= 0) return;
    const timer = setTimeout(() => {
      onDismiss(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onDismiss]);

  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />,
    info: <Info className="h-5 w-5 text-blue-500 shrink-0" />,
  };

  const borders = {
    success: "border-emerald-200 bg-white/95 text-slate-800 shadow-emerald-500/10",
    error: "border-red-200 bg-white/95 text-slate-800 shadow-red-500/10",
    warning: "border-amber-200 bg-white/95 text-slate-800 shadow-amber-500/10",
    info: "border-blue-200 bg-white/95 text-slate-800 shadow-blue-500/10",
  };

  return (
    <div
      className={`animate-slide-in-right flex w-full max-w-sm items-center gap-3 rounded-xl border p-4 shadow-lg backdrop-blur-md transition-all duration-200 ${
        borders[type] || borders.info
      }`}
      role="alert"
    >
      {icons[type] || icons.info}
      <div className="flex-1 text-sm font-medium text-slate-800 leading-snug">
        {message}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(id)}
        className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
        aria-label="Close notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

const ToastContainer = ({ toasts, onDismiss }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4 sm:px-0">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem {...toast} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
