import { InjectionToken, Provider } from "@angular/core";
import { DEFAULT_TOAST_CONFIG, ToastGlobalConfig } from "../core";

export type { ToastGlobalConfig } from "../core";
export { DEFAULT_TOAST_CONFIG } from "../core";

export const NGX_TOAST_CONFIG = new InjectionToken<ToastGlobalConfig>(
  "NGX_TOAST_CONFIG",
  { providedIn: "root", factory: () => DEFAULT_TOAST_CONFIG },
);

/**
 * Registers global toast defaults.
 *
 * @example
 * bootstrapApplication(App, {
 *   providers: [provideToast({ position: "top-right", pauseOnHover: true })],
 * });
 */
export function provideToast(config: Partial<ToastGlobalConfig> = {}): Provider {
  return {
    provide: NGX_TOAST_CONFIG,
    useValue: { ...DEFAULT_TOAST_CONFIG, ...config },
  };
}
