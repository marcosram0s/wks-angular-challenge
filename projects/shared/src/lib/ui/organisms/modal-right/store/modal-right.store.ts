import { inject, RendererFactory2 } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { delay, pipe, tap } from 'rxjs';
import {
  MODAL_RIGHT_CONSTANTS,
  ModalRightCloseCallback,
  ModalRightModel,
  ModalRightState
} from '../models/modal-right.model';

export const ModalRightStore = signalStore(
  { providedIn: 'root' },
  withState<ModalRightState>({
    isOpen: false,
    isClosing: false,
    data: { title: '' }
  }),
  withMethods(store => {
    const rendererFactory = inject(RendererFactory2);
    const renderer = rendererFactory.createRenderer(null, null);
    let onClosedCallback: ModalRightCloseCallback | null = null;

    return {
      onAfterClosed(callback: ModalRightCloseCallback): void {
        onClosedCallback = callback;
      },

      open(data: ModalRightModel): void {
        renderer.setStyle(document.body, 'overflow', 'hidden');
        patchState(store, { isOpen: true, isClosing: false, data });
      },

      startClosing: rxMethod<void>(
        pipe(
          tap(() => {
            patchState(store, { isClosing: true });
          }),
          delay(MODAL_RIGHT_CONSTANTS.ANIMATION_DURATION),
          tap(() => {
            renderer.removeStyle(document.body, 'overflow');
            patchState(store, { isOpen: false, isClosing: false });

            if (onClosedCallback) {
              onClosedCallback();
              onClosedCallback = null;
            }
          })
        )
      ),

      close(): void {
        if (store.isOpen()) {
          this.startClosing();
        }
      }
    };
  })
);
