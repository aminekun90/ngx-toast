import { IconName, IconPrefix } from "@fortawesome/fontawesome-svg-core";
import { DEFAULT_ICON_NAMES, ToastType } from "../core";

/** Default FontAwesome icon for each toast type (Angular tuple form). */
export const DEFAULT_TOAST_ICONS = Object.fromEntries(
  Object.entries(DEFAULT_ICON_NAMES).map(([type, [prefix, name]]) => [
    type,
    [prefix as IconPrefix, name as IconName],
  ]),
) as Record<ToastType, [IconPrefix, IconName]>;

export function defaultIconFor(type: ToastType): [IconPrefix, IconName] {
  return DEFAULT_TOAST_ICONS[type];
}
