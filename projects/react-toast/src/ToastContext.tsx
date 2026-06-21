import { createContext, useContext } from 'react';
import { Toast, ToastConfig, ToastPosition } from './types';

interface ToastContextType {
  show: (config: ToastConfig) => number;
  success: (message: string, title?: string, config?: Partial<ToastConfig>) => number;
  error: (message: string, title?: string, config?: Partial<ToastConfig>) => number;
  warning: (message: string, title?: string, config?: Partial<ToastConfig>) => number;
  info: (message: string, title?: string, config?: Partial<ToastConfig>) => number;
  loading: (message: string, title?: string, config?: Partial<ToastConfig>) => number;
  promise: <T>(
    promise: Promise<T> | (() => Promise<T>),
    msgs: { loading: string; success: string | ((data: T) => string); error: string | ((err: unknown) => string) },
    config?: Partial<ToastConfig>
  ) => Promise<T>;
  toasts: Toast[];
  remove: (id: number) => void;
  clear: (position?: ToastPosition) => void;
  pause: (id: number) => void;
  resume: (id: number) => void;
  version: string;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
};
