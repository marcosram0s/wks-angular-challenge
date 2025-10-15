import { inject, RendererFactory2 } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { ModalCloseCallback, ModalModel, ModalState } from '../models/modal.model';

export const ModalStore = signalStore(
  { providedIn: 'root' },

  withState<ModalState>({
    isOpen: false,
    data: undefined
  }),

  withMethods(store => {
    const rendererFactory = inject(RendererFactory2);
    const renderer = rendererFactory.createRenderer(null, null);
    let onClosedCallback: ModalCloseCallback | null = null;

    return {
      onAfterClosed(callback: ModalCloseCallback): void {
        onClosedCallback = callback;
      },

      open(data: ModalModel): void {
        renderer.setStyle(document.body, 'overflow', 'hidden');
        patchState(store, {
          isOpen: true,
          data: data
        });
      },

      close(action?: string): void {
        renderer.removeStyle(document.body, 'overflow');
        if (store.isOpen()) {
          patchState(store, { isOpen: false, data: undefined });

          if (onClosedCallback) {
            onClosedCallback(action);
            onClosedCallback = null;
          }
        }
      }
    };
  })
);
