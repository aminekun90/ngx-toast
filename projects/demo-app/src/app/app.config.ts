import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),

    {
      provide: 'INITIALIZE_FA',
      useFactory: (library: FaIconLibrary) => library.addIconPacks(fas),
      deps: [FaIconLibrary]
    },
    provideBrowserGlobalErrorListeners()],
};
