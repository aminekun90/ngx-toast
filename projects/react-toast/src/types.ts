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
  toastClass?: string;
}

export interface Toast extends Required<Omit<ToastConfig, 'title' | 'duration' | 'toastClass'>> {
  id: number;
  title?: string;
  duration?: number;
  closing: boolean;
  toastClass: string;
}