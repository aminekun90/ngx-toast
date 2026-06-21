import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { EngineConfig, EngineToast } from "./core";

export type {
  ToastPosition,
  ToastType,
  ProgressAnimation,
  ToastGlobalConfig,
} from "./core";
export { DEFAULT_TOAST_CONFIG, TOAST_POSITIONS } from "./core";

/** Per-call options (React icon form). */
export type ToastConfig = EngineConfig<IconDefinition>;

/** Resolved toast state (React icon form). */
export type Toast = EngineToast<IconDefinition>;
