import { CommonModule } from "@angular/common";
import { Component, computed, inject, input } from "@angular/core"; // 1. Utilise 'input'
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { IconName, IconPrefix } from "@fortawesome/fontawesome-svg-core";
import { Toast, ToastService } from "./services/Toast.service";

@Component({
  selector: "app-toast",
  standalone: true,
  imports: [CommonModule, FaIconComponent],
  templateUrl: "./ngx-toast.html",
  styleUrls: ["./ngx-toast.scss"],
})
export class ToastComponent {
  // 2. Déclare l'input comme un signal. 
  // Cela permet aux 'computed' de réagir aux changements de l'objet toast.
  toast = input.required<Toast>();
  
  private readonly toastService: ToastService = inject(ToastService);

  // 3. Accède à la valeur du signal avec des parenthèses : this.toast()
  toastClasses = computed(() => {
    return `toast-${this.toast().type}`;
  });

  icon = computed((): [IconPrefix, IconName] => {
    const currentToast = this.toast();

    if (currentToast.icon) {
      return currentToast.icon;
    }
    
    switch (currentToast.type) {
      case "loading":
        return ["fas", "spinner"];
      case "success":
        return ["fas", "check-circle"];
      case "error":
        return ["fas", "times-circle"];
      case "warning":
        return ["fas", "exclamation-triangle"];
      case "info":
      default:
        return ["fas", "info-circle"];
    }
  });

  onClose() {
    this.toastService.remove(this.toast().id);
  }

  onKeyPressHandler(_event: Event) { this.onClose(); }
  onKeyDownHandler(_event: Event) { this.onClose(); }
  onKeyUpHandler(_event: Event) { this.onClose(); }
}