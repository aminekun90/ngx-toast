import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

export type ToastPosition = "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center";
export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastConfig {
  message: string;
  title?: string;
  type?: ToastType;
  duration?: number;
  position?: ToastPosition;
  progressBar?: boolean; 
  progressAnimation?: "increasing" | "decreasing";
  icon?: IconDefinition;
  toastClass?: string;
}

export interface Toast extends Required<Omit<ToastConfig, 'title' | 'duration' | 'toastClass' | 'icon'>> {
  id: number;
  duration?: number;
  closing: boolean;
  toastClass: string;
  title?: string;
  icon?: IconDefinition;
}