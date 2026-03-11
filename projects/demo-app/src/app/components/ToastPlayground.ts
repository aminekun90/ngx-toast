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

  // --- COPY STATE --'
  copiedSetup = signal(false);
  copiedTs = signal(false);
  copiedHtml = signal(false);

  // --- 1. SETUP CODE (app.config.ts) ---
  setupCode = computed(() => {
    return `import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(), // Required for toast animations
  ]
};`;
  });

  // --- 2. USAGE CODE (component.ts) ---
  tsCode = computed(() => {
  const title = this.toastTitle() ? `\n      title: '${this.toastTitle()}',` : '';
  const message = this.toastMessage() ? `\n      message: '${this.toastMessage()}',` : '';
  
  // Prepare the icon line as a string for the code preview
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
    <button (click)="show()">Show Toast</button>
  \`
})
export class MyComponent {
  private readonly toastService = inject(ToastService);

  show() {
    this.toastService.show({
      type: '${this.toastType()}',${title}${message}${iconLine}
      position: '${this.toastPosition()}',
      duration: ${this.toastDuration()},
      progressBar: ${this.toastProgressBar()}
    });
  }
}`;
});

  htmlCode = computed(() => {
    return `<ngx-toast></ngx-toast>\n<button (click)="show()">Show Toast</button>`;
  });

  // --- 🎨 HIGHLIGHTED CODE FOR DISPLAY ---
  highlightedSetupCode = computed<SafeHtml>(() => {
    return this.highlight(this.setupCode(), 'typescript');
  });

  highlightedTsCode = computed<SafeHtml>(() => {
    return this.highlight(this.tsCode(), 'typescript');
  });

  highlightedHtmlCode = computed<SafeHtml>(() => {
    return this.highlight(this.htmlCode(), 'markup');
  });

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
      icon: this.selectedIcon() === 'none' ? undefined: ['fas', this.selectedIcon() as IconName]
    });
  }

  copyCode(code: string, type: 'setup' | 'ts' | 'html') {
    navigator.clipboard.writeText(code).then(() => {
      if (type === 'setup') {
        this.copiedSetup.set(true);
        setTimeout(() => this.copiedSetup.set(false), 2000);
      } else if (type === 'ts') {
        this.copiedTs.set(true);
        setTimeout(() => this.copiedTs.set(false), 2000);
      } else {
        this.copiedHtml.set(true);
        setTimeout(() => this.copiedHtml.set(false), 2000);
      }
    });
  }
}