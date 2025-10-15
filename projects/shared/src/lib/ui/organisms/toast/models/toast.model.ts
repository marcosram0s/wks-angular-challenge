export type ToastType = 'success' | 'error' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  icon?: string;
  message: string;
  duration?: number;
}

export interface ToastState {
  toasts: Toast[];
}

export const TOAST_CONSTANTS = {
  DEFAULT_DURATION: 3000,
  ICONS: {
    SUCCESS: 'checkbox-circle',
    ERROR: 'close-circle',
    WARNING: 'error-warning',
    INFO: 'information-line'
  }
} as const;
