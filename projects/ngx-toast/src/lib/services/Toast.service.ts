import { inject, Injectable, signal } from "@angular/core";
import { IconName, IconPrefix } from "@fortawesome/fontawesome-svg-core";
import {
  EngineToast,
  ProgressAnimation,
  ToastBaseConfig,
  ToastEngine,
  ToastPosition,
  ToastType,
} from "../core";
import { NGX_TOAST_VERSION } from "../version";
import { NGX_TOAST_CONFIG } from "./toast.config";
import { defaultIconFor } from "./toast-icons";

export type { ToastPosition, ToastType, ProgressAnimation } from "../core";

type Icon = [IconPrefix, IconName];

export interface ToastConfig extends ToastBaseConfig {
  icon?: Icon;
  /** Built-in theme name (material | glass | minimal | neon | solid) or custom. */
  theme?: string;
}

export type Toast = EngineToast<Icon>;

@Injectable({ providedIn: "root" })
export class ToastService {
  readonly toasts = signal<Toast[]>([]);
  readonly version = inject(NGX_TOAST_VERSION);

  private readonly config = inject(NGX_TOAST_CONFIG);
  private readonly engine = new ToastEngine<Icon>(
    () => this.config,
    (toasts) => this.toasts.set(toasts),
    (type, icon) => icon ?? defaultIconFor(type),
  );

  /** Displays a new toast (or refreshes an existing one when `id` is reused). */
  show(config: ToastConfig): number {
    return this.engine.show(config);
  }

  loading(message: string, title?: string, config: Partial<ToastConfig> = {}): number {
    return this.show({ ...config, message, title, type: "loading", duration: 0 });
  }

  promise<T>(
    promise: Promise<T> | (() => Promise<T>),
    msgs: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((err: unknown) => string);
    },
    config: Partial<ToastConfig> = {},
  ): Promise<T> {
    const id = this.loading(msgs.loading, config.title, config);
    const p = typeof promise === "function" ? promise() : promise;

    p.then((data) => {
      const message =
        typeof msgs.success === "function" ? msgs.success(data) : msgs.success;
      this.success(message, config.title, { ...config, id });
    }).catch((err: unknown) => {
      const message = typeof msgs.error === "function" ? msgs.error(err) : msgs.error;
      this.error(message, config.title, { ...config, id });
    });

    return p;
  }

  remove(id: number): void {
    this.engine.remove(id);
  }

  /** Dismisses every toast (optionally only those at a given position). */
  clear(position?: ToastPosition): void {
    this.engine.clear(position);
  }

  /** Pauses the auto-dismiss timer (used on hover/focus). */
  pause(id: number): void {
    this.engine.pause(id);
  }

  /** Resumes a paused auto-dismiss timer (used on mouse leave/blur). */
  resume(id: number): void {
    this.engine.resume(id);
  }

  success(message: string, title?: string, config: Partial<ToastConfig> = {}): number {
    return this.show({ ...config, message, title, type: "success" });
  }

  error(message: string, title?: string, config: Partial<ToastConfig> = {}): number {
    return this.show({ ...config, message, title, type: "error" });
  }

  warning(message: string, title?: string, config: Partial<ToastConfig> = {}): number {
    return this.show({ ...config, message, title, type: "warning" });
  }

  info(message: string, title?: string, config: Partial<ToastConfig> = {}): number {
    return this.show({ ...config, message, title, type: "info" });
  }
}
