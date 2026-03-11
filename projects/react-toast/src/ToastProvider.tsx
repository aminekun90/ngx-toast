import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ToastContext } from './ToastContext';
import { version } from './current-version';
import { Toast, ToastConfig } from './types';

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idCounter = useRef(0);
  const ANIMATION_DURATION = 500;

  const destroy = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, closing: true } : t)));
    setTimeout(() => destroy(id), ANIMATION_DURATION);
  }, [destroy]);

  const show = useCallback((config: ToastConfig) => {
    const id = idCounter.current++;
    const duration = config.duration === 0 ? undefined : config.duration || 5000;
    const newToast: Toast = {
      id,
      message: config.message,
      title: config.title,
      type: config.type || "info",
      position: config.position || "bottom-right",
      duration,
      closing: false,
      progressBar: config.progressBar ?? false,
      progressAnimation: config.progressAnimation || "increasing",
      toastClass: config.toastClass || "",
      icon: config.icon
    };
    setToasts((prev) => [...prev, newToast]);
    if (duration) setTimeout(() => remove(id), duration);
  }, [remove]);

  const success = (m: string, t?: string, c = {}) => show({ ...c, message: m, title: t, type: "success" });
  const error = (m: string, t?: string, c = {}) => show({ ...c, message: m, title: t, type: "error" });
  const warning = (m: string, t?: string, c = {}) => show({ ...c, message: m, title: t, type: "warning" });
  const info = (m: string, t?: string, c = {}) => show({ ...c, message: m, title: t, type: "info" });

  return (
  <ToastContext.Provider value={useMemo(() => ({
    show,
    success,
    error,
    warning,
    info,
    toasts,
    remove,
    version
  }), [show, success, error, warning, info, toasts, remove, version])}>
    {children}
  </ToastContext.Provider>
);
};