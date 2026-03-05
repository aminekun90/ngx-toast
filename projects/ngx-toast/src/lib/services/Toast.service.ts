import { inject, Injectable, signal } from "@angular/core";
import { NGX_TOAST_VERSION } from "../version";

// 1. Définir les types (extensibles selon vos besoins)
export type ToastPosition =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left"
  | "top-center"
  | "bottom-center";
  
export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastConfig {
  message: string;
  title?: string;
  type?: ToastType;
  duration?: number; // en ms
  position?: ToastPosition;
  progressBar?: boolean; 
  progressAnimation?: "increasing" | "decreasing"; 
  toastClass?: string;
}


export interface Toast {
  id: number;
  message: string;
  title?: string;
  type: ToastType;
  position: ToastPosition;
  duration?: number;
  closing: boolean; 
  progressBar: boolean; 
  progressAnimation: "increasing" | "decreasing"; 
  toastClass: string;
}

@Injectable({
  providedIn: "root",
})
export class ToastService {
  // Le "state" de tous les toasts, géré par un Signal
  toasts = signal<Toast[]>([]);
  public readonly version = inject(NGX_TOAST_VERSION);
  // Durée de l'animation CSS (doit correspondre à votre CSS)
  private readonly ANIMATION_DURATION = 500;
  private currentId = 0;

  /**
   * Affiche un nouveau toast.
   */
  show(config: ToastConfig) {
    const newToast: Toast = {
      id: this.currentId++,
      message: config.message,
      title: config.title,
      type: config.type || "info",
      position: config.position || "bottom-right",
      duration: config.duration === 0 ? undefined : config.duration || 5000,
      closing: false,
      progressBar: config.progressBar ?? false,
      progressAnimation: config.progressAnimation || "increasing",
      toastClass: config.toastClass || "",
    };

    // Ajoute le toast au signal
    this.toasts.update((currentToasts) => [...currentToasts, newToast]);

    // Déclenche la fermeture automatique (si une durée est définie)
    if (newToast.duration) {
      setTimeout(() => {
        this.remove(newToast.id);
      }, newToast.duration);
    }
  }

  /**
   * Étape 1 de la fermeture : lance l'animation de sortie
   */
  remove(id: number) {
    // Trouve le toast et le marque comme "closing"
    this.toasts.update((currentToasts) =>
      currentToasts.map((toast) =>
        toast.id === id ? { ...toast, closing: true } : toast
      )
    );

    // Étape 2 : Après l'animation, le supprime VRAIMENT
    setTimeout(() => {
      this.destroy(id);
    }, this.ANIMATION_DURATION);
  }

  /**
   * Étape 2 de la fermeture : supprime le toast du DOM
   */
  private destroy(id: number) {
    this.toasts.update((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id)
    );
  }

  // Raccourcis pratiques (comme ngx-toastr)
  success(message: string, title?: string, config: Partial<ToastConfig> = {}) {
    this.show({ ...config, message, title, type: "success" });
  }

  error(message: string, title?: string, config: Partial<ToastConfig> = {}) {
    this.show({ ...config, message, title, type: "error" });
  }

  warning(message: string, title?: string, config: Partial<ToastConfig> = {}) {
    this.show({ ...config, message, title, type: "warning" });
  }

  info(message: string, title?: string, config: Partial<ToastConfig> = {}) {
    this.show({ ...config, message, title, type: "info" });
  }
}
