import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, timer } from 'rxjs';
import { Toast, ToastState, TOAST_CONSTANTS } from '../models/toast.model';

export const ToastStore = signalStore(
  { providedIn: 'root' },
  withState<ToastState>({ toasts: [] }),
  withMethods(store => ({
    show(toast: Omit<Toast, 'id'>): void {
      const id = this.generateId();
      const newToast: Toast = { ...toast, id, icon: this.getIcon(toast.type) };

      patchState(store, { toasts: [...store.toasts(), newToast] });

      const duration = toast.duration ?? TOAST_CONSTANTS.DEFAULT_DURATION;
      this.scheduleRemoval({ id, duration });
    },

    scheduleRemoval: rxMethod<{ id: string; duration: number }>(
      pipe(
        switchMap(({ id, duration }) =>
          timer(duration).pipe(
            tap(() => {
              patchState(store, { toasts: store.toasts().filter(t => t.id !== id) });
            })
          )
        )
      )
    ),

    remove(id: string): void {
      patchState(store, { toasts: store.toasts().filter(t => t.id !== id) });
    },

    clearAll(): void {
      patchState(store, { toasts: [] });
    },

    generateId(): string {
      return Math.random().toString(36).substring(2, 9);
    },

    getIcon(type: Toast['type']): string {
      switch (type) {
        case 'success':
          return TOAST_CONSTANTS.ICONS.SUCCESS;
        case 'error':
          return TOAST_CONSTANTS.ICONS.ERROR;
        case 'warning':
          return TOAST_CONSTANTS.ICONS.WARNING;
        default:
          return TOAST_CONSTANTS.ICONS.INFO;
      }
    }
  }))
);
