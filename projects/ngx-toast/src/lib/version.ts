// projects/ngx-toast/src/lib/version.ts
import { InjectionToken } from '@angular/core';

export const NGX_TOAST_VERSION = new InjectionToken<string>('NGX_TOAST_VERSION', {
  providedIn: 'root',
  factory: () => '1.0.0' // Vous changez la version ici manuellement ou via un script de build
});