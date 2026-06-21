import {
  DEFAULT_ICON_NAMES,
  ToastBase,
  ToastBaseConfig,
  ToastGlobalConfig,
  ToastPosition,
  ToastType,
} from "./types";

/**
 * Out-animation duration in ms — must stay in sync with `$animation-out-duration`
 * in `styles/toast.styles.scss` (0.4s exit).
 */
export const EXIT_ANIMATION_DURATION = 400;

/** A resolved toast carrying a framework-specific icon representation. */
export type EngineToast<TIcon> = ToastBase & { icon?: TIcon; theme?: string };

/** Per-call config carrying a framework-specific icon representation. */
export type EngineConfig<TIcon> = ToastBaseConfig & { icon?: TIcon; theme?: string };

interface ToastTimer {
  handle: ReturnType<typeof setTimeout>;
  remaining: number;
  startedAt: number;
}

/**
 * Framework-agnostic toast state machine: id generation, auto-dismiss timers,
 * pause/resume, deduplication, max-stack enforcement and exit animations.
 *
 * Bindings (Angular service, React provider) own *rendering* only — they pass a
 * `getConfig` accessor and an `emit` callback, and forward UI events. This keeps
 * all the non-trivial logic in one tested place instead of duplicated per framework.
 *
 * @typeParam TIcon - the framework's icon representation (a tuple for Angular,
 *   an `IconDefinition` for React).
 */
export class ToastEngine<TIcon> {
  private toasts: EngineToast<TIcon>[] = [];
  private readonly timers = new Map<number, ToastTimer>();
  private currentId = 0;

  /**
   * @param getConfig - returns the current global config (read lazily so config
   *   changes are always honored).
   * @param emit - called with a fresh snapshot whenever state changes.
   * @param resolveIcon - optional: maps `(type, icon)` to the stored icon. When
   *   omitted the raw config icon is stored (React resolves defaults at render).
   */
  constructor(
    private readonly getConfig: () => ToastGlobalConfig,
    private readonly emit: (toasts: EngineToast<TIcon>[]) => void,
    private readonly resolveIcon?: (type: ToastType, icon?: TIcon) => TIcon | undefined,
  ) {}

  /** Current toasts (defensive copy). */
  get snapshot(): EngineToast<TIcon>[] {
    return [...this.toasts];
  }

  /** Displays a new toast, or refreshes an existing one when its `id` is reused. */
  show(config: EngineConfig<TIcon>): number {
    const cfg = this.getConfig();

    if (cfg.preventDuplicates && config.id === undefined) {
      const duplicate = this.toasts.find(
        (t) =>
          !t.closing &&
          t.message === config.message &&
          (config.type ?? "info") === t.type,
      );
      if (duplicate) {
        return this.show({ ...config, id: duplicate.id });
      }
    }

    const id = config.id ?? this.currentId++;
    const type = config.type ?? "info";
    const duration =
      config.duration === 0 ? undefined : config.duration ?? cfg.duration;

    const toast: EngineToast<TIcon> = {
      id,
      message: config.message,
      title: config.title,
      type,
      position: config.position ?? cfg.position,
      duration,
      closing: false,
      progressBar: config.progressBar ?? cfg.progressBar,
      progressAnimation: config.progressAnimation ?? cfg.progressAnimation,
      toastClass: config.toastClass ?? "",
      pauseOnHover: config.pauseOnHover ?? cfg.pauseOnHover,
      icon: this.resolveIcon ? this.resolveIcon(type, config.icon) : config.icon,
      theme: config.theme,
    };

    const index = this.toasts.findIndex((t) => t.id === id);
    if (index !== -1) {
      this.toasts = this.toasts.map((t, i) => (i === index ? toast : t));
    } else {
      this.toasts = cfg.newestOnTop
        ? [toast, ...this.toasts]
        : [...this.toasts, toast];
      this.enforceMax(id);
    }

    this.clearTimer(id);
    if (duration) {
      this.startTimer(id, duration);
    }
    this.emit(this.snapshot);
    return id;
  }

  /** Starts the exit animation, then removes the toast. */
  remove(id: number): void {
    this.clearTimer(id);
    let exists = false;
    this.toasts = this.toasts.map((t) => {
      if (t.id !== id) {
        return t;
      }
      exists = true;
      return { ...t, closing: true };
    });
    if (exists) {
      this.emit(this.snapshot);
      setTimeout(() => this.destroy(id), EXIT_ANIMATION_DURATION);
    }
  }

  /** Dismisses every toast (optionally only those at a given position). */
  clear(position?: ToastPosition): void {
    this.toasts
      .filter((t) => !position || t.position === position)
      .forEach((t) => this.remove(t.id));
  }

  /** Pauses the auto-dismiss timer (used on hover/focus). */
  pause(id: number): void {
    const timer = this.timers.get(id);
    if (!timer) {
      return;
    }
    clearTimeout(timer.handle);
    timer.remaining -= Date.now() - timer.startedAt;
  }

  /** Resumes a paused auto-dismiss timer (used on mouse leave/blur). */
  resume(id: number): void {
    const timer = this.timers.get(id);
    if (!timer) {
      return;
    }
    this.startTimer(id, Math.max(timer.remaining, 0));
  }

  private startTimer(id: number, duration: number): void {
    const handle = setTimeout(() => this.remove(id), duration);
    this.timers.set(id, { handle, remaining: duration, startedAt: Date.now() });
  }

  private clearTimer(id: number): void {
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer.handle);
      this.timers.delete(id);
    }
  }

  private enforceMax(keepId: number): void {
    const max = this.getConfig().maxToasts;
    if (!max || this.toasts.length <= max) {
      return;
    }
    this.toasts
      .filter((t) => t.id !== keepId)
      .slice(0, this.toasts.length - max)
      .forEach((t) => this.remove(t.id));
  }

  private destroy(id: number): void {
    this.clearTimer(id);
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.emit(this.snapshot);
  }
}

/** Resolves the default icon `[prefix, name]` tuple for a toast type. */
export function defaultIconNames(type: ToastType): readonly [string, string] {
  return DEFAULT_ICON_NAMES[type];
}
