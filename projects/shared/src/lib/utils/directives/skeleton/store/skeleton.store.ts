import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { SkeletonState } from '../models';

export const SkeletonStore = signalStore(
  { providedIn: 'root' },
  withState<SkeletonState>({ loading: false }),
  withMethods(store => ({
    show(): void {
      patchState(store, { loading: true });
    },

    hide(): void {
      patchState(store, { loading: false });
    },

    toggle(): void {
      patchState(store, { loading: !store.loading() });
    },

    setLoading(isLoading: boolean): void {
      patchState(store, { loading: isLoading });
    }
  }))
);
