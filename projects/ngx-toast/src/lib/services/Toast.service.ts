import { inject, Injectable, signal } from "@angular/core";
import { IconName, IconPrefix } from "@fortawesome/fontawesome-svg-core";
import { NGX_TOAST_VERSION } from "../version";

// 1. Définir les types (extensibles selon vos besoins)
export type ToastPosition =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left"
  | "top-center"
  | "bottom-center";

export type ToastType = "success" | "error" | "warning" | "info" | "loading";

export interface ToastConfig {
  id?: number;
  message: string;
  title?: string;
  type?: ToastType;
  duration?: number; // en ms
  position?: ToastPosition;
  progressBar?: boolean;
  progressAnimation?: "increasing" | "decreasing";
  toastClass?: string;
  icon?: [IconPrefix, IconName];
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
  icon?: [IconPrefix, IconName];
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
    if(this.toasts().length ===0) {
      this.currentId = 0;
    }
    const id = config.id ?? this.currentId++;
    const duration = config.duration === 0 ? undefined : config.duration || 5000;
    //debugger;
    // Logique d'icône par défaut si config.icon n'est pas défini
    let finalIcon = config.icon;
    if (!finalIcon) {
      switch (config.type) {
        case 'success': finalIcon = ['fas', 'check-circle']; break;
        case 'error': finalIcon = ['fas', 'times-circle']; break;
        case 'warning': finalIcon = ['fas', 'exclamation-triangle']; break;
        case 'info': finalIcon = ['fas', 'info-circle']; break;
        case 'loading': finalIcon = ['fas', 'spinner']; break;
      }
    }

    const newToast: Toast = {
      id,
      message: config.message,
      title: config.title,
      type: config.type || "info",
      position: config.position || "bottom-right",
      duration,
      closing: false,
      progressBar: config.progressBar ?? false,
      progressAnimation: config.progressAnimation || "increasing",
      toastClass: config.toastClass || "",
      icon: finalIcon // On utilise l'icône calculée
    };
    this.toasts.update((current) => {
      const index = current.findIndex(t => t.id === id);
      if (index !== -1) {
        const updatedToasts = [...current];
        // Création d'un NOUVEL objet Toast pour forcer la détection
        updatedToasts[index] = { ...newToast, closing: false };
        return updatedToasts;
      }
      return [...current, newToast];
    });

    if (duration) {
      setTimeout(() => this.remove(id), duration);
    }
    return id;
  }

  loading(message: string, title?: string, config: Partial<ToastConfig> = {}) {
    const id = this.currentId; // On ne fait pas ++ ici car show() le fera
    this.show({ ...config, message, title, type: "loading", duration: 0, icon: ["fas", "spinner"] });
    return id;
  }

  promise<T>(
    promise: Promise<T> | (() => Promise<T>),
    msgs: { loading: string; success: string | ((data: T) => string); error: string | ((err: any) => string) },
    config: Partial<ToastConfig> = {}
  ) {
    const id = this.loading(msgs.loading, config.title, config);
    const p = typeof promise === 'function' ? promise() : promise;

    p.then((data) => {
      const message = typeof msgs.success === 'function' ? msgs.success(data) : msgs.success;
      this.success(message, config.title, { ...config, id });
    }).catch((err) => {
      const message = typeof msgs.error === 'function' ? msgs.error(err) : msgs.error;
      this.error(message, undefined, { ...config, id });
    });

    return p;
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
