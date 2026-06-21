import { CommonModule } from "@angular/common";
import { Component, computed, inject, input } from "@angular/core";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { IconName, IconPrefix } from "@fortawesome/fontawesome-svg-core";
import { Toast, ToastService } from "./services/Toast.service";
import { defaultIconFor } from "./services/toast-icons";

@Component({
  selector: "ngx-toast-item",
  standalone: true,
  imports: [CommonModule, FaIconComponent],
  templateUrl: "./ngx-toast.html",
  styleUrls: ["./ngx-toast.scss"],
})
export class ToastComponent {
  readonly toast = input.required<Toast>();

  private readonly toastService: ToastService = inject(ToastService);

  readonly toastClasses = computed(() => `toast-${this.toast().type}`);

  readonly themeClass = computed(() =>
    this.toast().theme ? `ngx-toast-theme-${this.toast().theme}` : "",
  );

  readonly icon = computed(
    (): [IconPrefix, IconName] => this.toast().icon ?? defaultIconFor(this.toast().type),
  );

  readonly ariaLive = computed(() =>
    this.toast().type === "error" ? "assertive" : "polite",
  );

  onClose(): void {
    this.toastService.remove(this.toast().id);
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === "Enter" || event.key === " " || event.key === "Escape") {
      event.preventDefault();
      this.onClose();
    }
  }

  onMouseEnter(): void {
    if (this.toast().pauseOnHover) {
      this.toastService.pause(this.toast().id);
    }
  }

  onMouseLeave(): void {
    if (this.toast().pauseOnHover) {
      this.toastService.resume(this.toast().id);
    }
  }
}
