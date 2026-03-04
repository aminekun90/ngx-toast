import { createContext, useContext } from 'react';
import { Toast, ToastConfig } from './types';

interface ToastContextType {
  show: (config: ToastConfig) => void;
  success: (message: string, title?: string, config?: Partial<ToastConfig>) => void;
  error: (message: string, title?: string, config?: Partial<ToastConfig>) => void;
  warning: (message: string, title?: string, config?: Partial<ToastConfig>) => void;
  info: (message: string, title?: string, config?: Partial<ToastConfig>) => void;
  toasts: Toast[];
  remove: (id: number) => void;
  version: string;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
};