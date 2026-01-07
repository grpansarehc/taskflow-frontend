import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import ToastItem from './Toast';
import type { ToastType } from './Toast';

type ToastInput = { type?: ToastType; message: string; duration?: number };

interface ToastContextValue {
  addToast: (toast: ToastInput) => string;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [toasts, setToasts] = useState<Array<{ id: string; type: ToastType; message: string; duration: number }>>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((s) => s.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((toast: ToastInput) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const t = { id, type: toast.type ?? 'info' as ToastType, message: toast.message, duration: toast.duration ?? 4000 };
    setToasts((s) => [t, ...s]);

    // Auto dismiss
    setTimeout(() => removeToast(id), t.duration);

    return id;
  }, [removeToast]);

  const value = useMemo(() => ({ addToast, removeToast }), [addToast, removeToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* Toast container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 items-end">
        {toasts.map((t) => (
          <ToastItem key={t.id} id={t.id} type={t.type} message={t.message} onClose={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
}
