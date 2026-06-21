/**
 * Framework-agnostic toast types and constants shared by `@aminekun90/ngx-toast`
 * (Angular) and `@aminekun90/react-toast` (React). Nothing here depends on a UI
 * framework or on a specific icon implementation.
 */

export type ToastPosition =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left"
  | "top-center"
  | "bottom-center";

export type ToastType = "success" | "error" | "warning" | "info" | "loading";

export type ProgressAnimation = "increasing" | "decreasing";

/** Every supported position, in stack order — handy for rendering containers. */
export const TOAST_POSITIONS: readonly ToastPosition[] = [
  "top-right",
  "top-left",
  "bottom-right",
  "bottom-left",
  "top-center",
  "bottom-center",
];

/**
 * Default FontAwesome icon `[prefix, name]` per type, expressed as plain strings
 * so the core stays icon-library agnostic. Each framework maps these to its own
 * icon representation (a tuple for Angular, an `IconDefinition` for React).
 */
export const DEFAULT_ICON_NAMES: Record<ToastType, readonly [string, string]> = {
  success: ["fas", "check-circle"],
  error: ["fas", "times-circle"],
  warning: ["fas", "exclamation-triangle"],
  info: ["fas", "info-circle"],
  loading: ["fas", "spinner"],
};

/** Per-call options shared across frameworks (icon is added by each binding). */
export interface ToastBaseConfig {
  id?: number;
  message: string;
  title?: string;
  type?: ToastType;
  /** Auto-dismiss delay in ms. `0` keeps the toast until dismissed. */
  duration?: number;
  position?: ToastPosition;
  progressBar?: boolean;
  progressAnimation?: ProgressAnimation;
  toastClass?: string;
  /** Pause auto-dismiss while hovered/focused. Falls back to global config. */
  pauseOnHover?: boolean;
}

/** Resolved toast state shared across frameworks (icon is added by each binding). */
export interface ToastBase {
  id: number;
  message: string;
  title?: string;
  type: ToastType;
  position: ToastPosition;
  duration?: number;
  closing: boolean;
  progressBar: boolean;
  progressAnimation: ProgressAnimation;
  toastClass: string;
  pauseOnHover: boolean;
}

/** Application-wide defaults applied to every toast unless overridden per call. */
export interface ToastGlobalConfig {
  position: ToastPosition;
  duration: number;
  progressBar: boolean;
  progressAnimation: ProgressAnimation;
  pauseOnHover: boolean;
  /** Maximum simultaneous toasts. Oldest are removed beyond this. `0` = unlimited. */
  maxToasts: number;
  /** Refresh an existing toast instead of stacking an identical one. */
  preventDuplicates: boolean;
  /** Insert new toasts at the top of their position stack. */
  newestOnTop: boolean;
}

export const DEFAULT_TOAST_CONFIG: ToastGlobalConfig = {
  position: "bottom-right",
  duration: 5000,
  progressBar: false,
  progressAnimation: "increasing",
  pauseOnHover: true,
  maxToasts: 0,
  preventDuplicates: false,
  newestOnTop: false,
};
