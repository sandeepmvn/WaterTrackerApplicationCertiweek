export default function ToastStack({ toasts }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex flex-col items-center gap-2 px-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="w-full max-w-sm rounded-2xl bg-gray-900 px-4 py-3 text-sm font-medium text-white shadow-xl transition-all duration-300"
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
