import { CommonModule } from "@angular/common";
import { Component, computed, inject, ViewEncapsulation } from "@angular/core";
import { ToastPosition, ToastService } from "ngx-toast";
import { ToastComponent } from "./ngx-toast";

// --- Remplacer par vos imports locaux dans votre projet ---

export * from "./services/Toast.service";


@Component({
  selector: "ngx-toast",
  standalone: true,
  imports: [CommonModule, ToastComponent],
  template: `
    @for (position of positions(); track position) {
    <div class="toast-container" [ngClass]="position">
      @for (toast of toastsByPosition(position); track toast.id) {
      <app-toast [toast]="toast"></app-toast>
      }
    </div>
    }
  `,
  styleUrls: ["./ngx-toast.scss"],
  encapsulation: ViewEncapsulation.None
})
export class ToastContainerComponent {
  private readonly toastService = inject(ToastService);
  private readonly allToasts = this.toastService.toasts; // Notre Signal

  // 1. Trouve toutes les positions uniques actuellement actives
  positions = computed(() => [
    ...new Set(this.allToasts().map((t) => t.position)),
  ]);

  // 2. Fonction pour filtrer les toasts par position
  toastsByPosition(position: ToastPosition) {
    return this.allToasts().filter((t) => t.position === position);
  }
}