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

  const show = useCallback((config: ToastConfig ) => {
    const id = config.id ?? idCounter.current++;
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

    setToasts((prev) => {
      const exists = prev.find(t => t.id === id);
      if (exists) return prev.map(t => t.id === id ? newToast : t);
      return [...prev, newToast];
    });

    if (duration) setTimeout(() => remove(id), duration);
    return id;
  }, [remove]);

  const loading = (m: string, t?: string, c = {}) => show({ ...c, message: m, title: t, type: "loading", duration: 0 });
  const success = (m: string, t?: string, c = {}) => show({ ...c, message: m, title: t, type: "success" });
  const error = (m: string, t?: string, c = {}) => show({ ...c, message: m, title: t, type: "error" });
  const warning = (m: string, t?: string, c = {}) => show({ ...c, message: m, title: t, type: "warning" });
  const info = (m: string, t?: string, c = {}) => show({ ...c, message: m, title: t, type: "info" });

  const promise = useCallback(<T,>(
    promise: Promise<T> | (() => Promise<T>),
    msgs: { loading: string; success: string | ((data: T) => string); error: string | ((err: any) => string) },
    config = {}
  ) => {
    const id = loading(msgs.loading, undefined, config);
    const p = typeof promise === 'function' ? promise() : promise;

    p.then((data) => {
      const msg = typeof msgs.success === 'function' ? msgs.success(data) : msgs.success;
      success(msg, undefined, { ...config, id });
    }).catch((err) => {
      const msg = typeof msgs.error === 'function' ? msgs.error(err) : msgs.error;
      error(msg, undefined, { ...config, id });
    });

    return p;
  }, [show]);

  return (
  <ToastContext.Provider value={useMemo(() => ({
    show,
    success,
    error,
    warning,
    info,
    loading,
    toasts,
    remove,
    version,
    promise
  }), [show, success, error, warning, info, toasts, remove, version, promise, loading])}>
    {children}
  </ToastContext.Provider>
);
};