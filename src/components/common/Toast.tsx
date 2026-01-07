import React from 'react';
import { X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastItemProps {
  id: string;
  type: ToastType;
  message: string;
  onClose: (id: string) => void;
}

export default function ToastItem({ id, type, message, onClose }: ToastItemProps) {
  const bg =
    type === 'success' ? 'bg-emerald-600' : type === 'error' ? 'bg-red-600' : 'bg-slate-700';

  return (
    <div
      role="status"
      className={`${bg} text-white rounded-lg shadow-lg overflow-hidden max-w-sm w-full flex items-start gap-3 p-3`}
    >
      <div className="flex-1">
        <div className="text-sm font-medium">{message}</div>
      </div>
      <button
        aria-label="Close"
        onClick={() => onClose(id)}
        className="opacity-90 hover:opacity-100 text-white"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
