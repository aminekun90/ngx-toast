import { InjectionToken } from '@angular/core';
import { version } from './current-version';

export const NGX_TOAST_VERSION = new InjectionToken<string>('NGX_TOAST_VERSION', {
  providedIn: 'root',
  factory: () => version
});