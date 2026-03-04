// projects/ngx-toast/src/lib/toast.component.ts

import { CommonModule } from "@angular/common";
import { Component, Input, computed, inject } from "@angular/core";

export * from "./services/Toast.service";

import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { IconName, IconPrefix } from "@fortawesome/fontawesome-svg-core";
import { Toast, ToastService } from "./services/Toast.service";

@Component({
  selector: "app-toast", // Optionnel: changer le préfixe en 'lib' ou 'ngx'
  standalone: true,
  imports: [CommonModule, FaIconComponent],
  templateUrl: "./ngx-toast.html", // C'est mieux de séparer pour une lib
  styleUrls: ["./ngx-toast.scss"],
})
export class ToastComponent {
   @Input({ required: true }) toast!: Toast;
  private readonly toastService: ToastService = inject(ToastService);
  constructor() {}

  toastClasses = computed(() => {
    return `toast-${this.toast.type}`;
  });

  // 5. Mettre à jour le signal "icon"
  // Il renvoie maintenant un tableau [prefix, iconName]
  icon = computed((): [IconPrefix, IconName] => {
    switch (this.toast.type) {
      case "success":
        return ["fas", "check-circle"];
      case "error":
        return ["fas", "times-circle"]; // 'fas' ou 'far' selon votre préférence
      case "warning":
        return ["fas", "exclamation-triangle"];
      case "info":
      default:
        return ["fas", "info-circle"];
    }
  });

  onClose() {
    this.toastService.remove(this.toast.id);
  }
}