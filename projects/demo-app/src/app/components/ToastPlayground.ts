import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { ToastPosition, ToastService } from 'ngx-toast';

// --- PrismJS Imports ---
import Prism from 'prismjs';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-typescript';

@Component({
  selector: 'app-toast-playground',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './ToastPlayground.html',
  styleUrls: ['./ToastPlayground.scss']
})
export class ToastPlayground {
  private readonly toastService = inject(ToastService);
  private readonly sanitizer = inject(DomSanitizer);

  // --- PLAYGROUND STATE ---
  toastTitle = signal('Custom Message');
  toastMessage = signal('This is a custom Toast using Angular Signals!');
  toastType = signal<'success' | 'error' | 'warning' | 'info'>('success');
  toastPosition = signal<ToastPosition>('top-right');
  toastDuration = signal(3000);
  toastProgressBar = signal(true);
  selectedIcon = signal<IconName | 'none'>('rocket');

  // --- COPY STATE ---
  copiedSetup = signal(false);
  copiedTs = signal(false);
  copiedHtml = signal(false);

  // --- 1. SETUP CODE (app.config.ts) ---
  setupCode = computed(() => {
    return `import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToast } from '@aminekun90/ngx-toast';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(), // Required for animations
    provideToast()       // Initialize the service
  ]
};`;
  });

  // --- 2. USAGE CODE (component.ts) ---
  tsCode = computed(() => {
    const title = this.toastTitle() ? `\n      title: '${this.toastTitle()}',` : '';
    const iconLine = this.selectedIcon() === 'none' 
      ? '' 
      : `\n      icon: ['fas', '${this.selectedIcon()}'],`;

    return `import { Component, inject } from '@angular/core';
import { ToastService, ToastContainerComponent } from '@aminekun90/ngx-toast';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [ToastContainerComponent],
  template: \`
    <ngx-toast></ngx-toast>
    <button (click)="load()">Load Data</button>
  \`
})
export class MyComponent {
  private readonly toastService = inject(ToastService);

  // Example using Promise
  load() {
    const myPromise = new Promise((resolve) => setTimeout(() => resolve('Done!'), 2000));

    this.toastService.promise(myPromise, {
      loading: 'Fetching data...',
      success: (data) => \`Successfully \${data}\`,
      error: 'Failed to load'
    }, { position: '${this.toastPosition()}' });
  }
}`;
  });

  htmlCode = computed(() => {
    return `<ngx-toast></ngx-toast>\n<button (click)="show()">Show Toast</button>`;
  });

  // --- 🎨 HIGHLIGHTED CODE ---
  highlightedSetupCode = computed<SafeHtml>(() => this.highlight(this.setupCode(), 'typescript'));
  highlightedTsCode = computed<SafeHtml>(() => this.highlight(this.tsCode(), 'typescript'));
  highlightedHtmlCode = computed<SafeHtml>(() => this.highlight(this.htmlCode(), 'markup'));

  private highlight(code: string, lang: string): SafeHtml {
    const highlighted = Prism.highlight(code, Prism.languages[lang], lang);
    return this.sanitizer.bypassSecurityTrustHtml(highlighted);
  }

  // --- ACTIONS ---
  showCustomToast() {
    this.toastService.show({
      type: this.toastType(),
      title: this.toastTitle(),
      message: this.toastMessage(),
      position: this.toastPosition(),
      duration: this.toastDuration(),
      progressBar: this.toastProgressBar(),
      icon: this.selectedIcon() === 'none' ? undefined : ['fas', this.selectedIcon() as IconName]
    });
  }

  testPromise() {
    const myPromise = new Promise<string>((resolve, reject) => {
      setTimeout(() => {
        Math.random() > 34 ? resolve("API Success") : reject(new Error("Network Error"));
      }, 2000);
    });

    this.toastService.promise(myPromise, {
      loading: 'Loading from server...',
      success: (data:string) => `Loaded: ${data}`,
      error: (err:Error) => `Error: ${err.message}`
    }, { 
      duration: this.toastDuration(),
      icon: this.selectedIcon() === 'none' ? undefined : ['fas', this.selectedIcon() as IconName],
      position: this.toastPosition(),
      progressBar: this.toastProgressBar(),
      title: this.toastTitle(),
      message: this.toastMessage(),
      type: this.toastType(),
    });
  }

  copyCode(code: string, type: 'setup' | 'ts' | 'html') {
    navigator.clipboard.writeText(code).then(() => {
      const isTs = type === 'ts'?this.copiedTs:this.copiedHtml;
      const state = type === 'setup' ? this.copiedSetup : isTs;
      state.set(true);
      setTimeout(() => state.set(false), 2000);
    });
  }
}