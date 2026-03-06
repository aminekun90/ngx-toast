import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


import { ToastPosition, ToastService } from 'ngx-toast';



// --- Imports PrismJS pour la coloration syntaxique ---
import Prism from 'prismjs';
import 'prismjs/components/prism-markup'; // Support du HTML (markup)
import 'prismjs/components/prism-typescript'; // Support du TypeScript

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

  // --- PLAYGROUND STATE (Signals) ---
  toastTitle = signal('Custom Message');
  toastMessage = signal('This is a custom Toast using Angular Signals !');
  toastType = signal<'success' | 'error' | 'warning' | 'info'>('success');
  toastPosition = signal<ToastPosition>('top-right');
  toastDuration = signal(3000);
  toastProgressBar = signal(true);

  // --- COPIE STATE ---
  copiedTs = signal(false);
  copiedHtml = signal(false);

  // --- CODE GÉNÉRÉ DYNAMIQUEMENT (Texte brut pour la copie) ---
  tsCode = computed(() => {
    const type = this.toastType();
    const title = this.toastTitle() ? `\n      title: '${this.toastTitle()}',` : '';
    const message = this.toastMessage() ? `\n      message: '${this.toastMessage()}',` : '';
    const position = `\n      position: '${this.toastPosition()}',`;
    const duration = this.toastDuration() === 5000 ? '' : `\n      duration: ${this.toastDuration()},`;
    const progressBar = this.toastProgressBar() ? `\n      progressBar: true` : `\n      progressBar: false`;

    return `import { Component, inject } from '@angular/core';
import { ToastService } from '@aminekun90/ngx-toast';

@Component({
  // your Config ...
})
export class MyComponent {
  private readonly toastService = inject(ToastService);

  showCustomToast() {
    this.toastService.show({
      type: '${type}',${title}${message}${position}${duration}${progressBar}
    });
  }
}`;
  });

  htmlCode = computed(() => {
    return `<button (click)="showCustomToast()">
  Show Toast
</button>`;
  });

  // --- 🎨 CODE COLORISÉ DYNAMIQUEMENT POUR L'AFFICHAGE ---
  highlightedTsCode = computed<SafeHtml>(() => {
    const raw = this.tsCode();
    const highlighted = Prism.highlight(raw, Prism.languages['typescript'], 'typescript');
    // On bypass la sécurité pour garder les classes CSS de Prism (<span class="token keyword">...)
    return this.sanitizer.bypassSecurityTrustHtml(highlighted); 
  });

  highlightedHtmlCode = computed<SafeHtml>(() => {
    const raw = this.htmlCode();
    const highlighted = Prism.highlight(raw, Prism.languages['markup'], 'html');
    return this.sanitizer.bypassSecurityTrustHtml(highlighted);
  });

  // --- ACTIONS ---
  showCustomToast() {
    this.toastService.show({
      type: this.toastType(),
      title: this.toastTitle(),
      message: this.toastMessage(),
      position: this.toastPosition(),
      duration: this.toastDuration(),
      progressBar: this.toastProgressBar()
    });
  }

  copyCode(code: string, type: 'ts' | 'html') {
    navigator.clipboard.writeText(code).then(() => {
      if (type === 'ts') {
        this.copiedTs.set(true);
        setTimeout(() => this.copiedTs.set(false), 2000);
      } else {
        this.copiedHtml.set(true);
        setTimeout(() => this.copiedHtml.set(false), 2000);
      }
    });
  }
}