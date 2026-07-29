import { useCallback, useEffect, useRef, useState } from 'react';

const TOAST_DURATION_MS = 3000;

export function useToasts() {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef(new Map());

  const removeToast = useCallback((toastId) => {
    const timer = timersRef.current.get(toastId);
    if (timer) {
      window.clearTimeout(timer);
      timersRef.current.delete(toastId);
    }

    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== toastId));
  }, []);

  const pushToast = useCallback(
    (message) => {
      const trimmedMessage = message.trim();
      if (!trimmedMessage) return;

      const toastId = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      setToasts((currentToasts) => [...currentToasts, { id: toastId, message: trimmedMessage }]);

      const timer = window.setTimeout(() => {
        removeToast(toastId);
      }, TOAST_DURATION_MS);

      timersRef.current.set(toastId, timer);
    },
    [removeToast],
  );

  useEffect(
    () => () => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer));
      timersRef.current.clear();
    },
    [],
  );

  return {
    toasts,
    pushToast,
  };
}
