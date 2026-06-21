import { CommonModule } from "@angular/common";
import { Component, computed, inject, ViewEncapsulation } from "@angular/core";
import { ToastComponent } from "./ngx-toast";
import { Toast, ToastPosition, ToastService } from "./services/Toast.service";

export * from "./services/Toast.service";
export * from "./services/toast.config";
export * from "./services/toast-icons";

@Component({
  selector: "ngx-toast",
  standalone: true,
  imports: [CommonModule, ToastComponent],
  template: `
    @for (position of positions(); track position) {
      <div class="toast-container" [ngClass]="position">
        @for (toast of toastsByPosition(position); track toast.id) {
          <ngx-toast-item [toast]="toast"></ngx-toast-item>
        }
      </div>
    }
  `,
  styleUrls: ["./ngx-toast.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ToastContainerComponent {
  private readonly toastService = inject(ToastService);
  private readonly allToasts = this.toastService.toasts;

  readonly positions = computed(() => [
    ...new Set(this.allToasts().map((t) => t.position)),
  ]);

  toastsByPosition(position: ToastPosition): Toast[] {
    return this.allToasts().filter((t) => t.position === position);
  }
}
