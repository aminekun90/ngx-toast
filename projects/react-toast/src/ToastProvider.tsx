import React, { useMemo, useRef, useState } from 'react';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { DEFAULT_TOAST_CONFIG, ToastEngine, ToastGlobalConfig } from './core';
import { ToastContext } from './ToastContext';
import { version } from './current-version';
import { Toast, ToastConfig } from './types';

export const ToastProvider: React.FC<{
  children: React.ReactNode;
  config?: Partial<ToastGlobalConfig>;
}> = ({ children, config: userConfig }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Resolved config kept in a ref so the engine always reads the latest value.
  const configRef = useRef<ToastGlobalConfig>({ ...DEFAULT_TOAST_CONFIG, ...userConfig });
  configRef.current = useMemo(
    () => ({ ...DEFAULT_TOAST_CONFIG, ...userConfig }),
    [userConfig]
  );

  // One engine instance for the lifetime of the provider.
  const engineRef = useRef<ToastEngine<IconDefinition> | null>(null);
  if (!engineRef.current) {
    engineRef.current = new ToastEngine<IconDefinition>(
      () => configRef.current,
      (next) => setToasts(next as Toast[])
    );
  }
  const engine = engineRef.current;

  const value = useMemo(() => {
    const show = (cfg: ToastConfig) => engine.show(cfg);
    const shortcut =
      (type: ToastConfig['type']) =>
      (message: string, title?: string, cfg: Partial<ToastConfig> = {}) =>
        engine.show({ ...cfg, message, title, type });

    const loading = (message: string, title?: string, cfg: Partial<ToastConfig> = {}) =>
      engine.show({ ...cfg, message, title, type: 'loading', duration: 0 });

    const success = shortcut('success');
    const error = shortcut('error');

    const promise = <T,>(
      promise: Promise<T> | (() => Promise<T>),
      msgs: { loading: string; success: string | ((data: T) => string); error: string | ((err: unknown) => string) },
      cfg: Partial<ToastConfig> = {}
    ): Promise<T> => {
      const id = loading(msgs.loading, cfg.title, cfg);
      const p = typeof promise === 'function' ? promise() : promise;
      p.then((data) => {
        success(typeof msgs.success === 'function' ? msgs.success(data) : msgs.success, cfg.title, { ...cfg, id });
      }).catch((err: unknown) => {
        error(typeof msgs.error === 'function' ? msgs.error(err) : msgs.error, cfg.title, { ...cfg, id });
      });
      return p;
    };

    return {
      show,
      success,
      error,
      warning: shortcut('warning'),
      info: shortcut('info'),
      loading,
      promise,
      remove: (id: number) => engine.remove(id),
      clear: (position?: Toast['position']) => engine.clear(position),
      pause: (id: number) => engine.pause(id),
      resume: (id: number) => engine.resume(id),
      version,
      toasts,
    };
  }, [engine, toasts]);

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
};
