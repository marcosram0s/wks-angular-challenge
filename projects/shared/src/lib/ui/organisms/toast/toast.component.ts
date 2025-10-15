import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastStore } from './store/toast.store';

@Component({
  selector: 'app-toast',
  imports: [],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToastComponent {
  readonly toastStore = inject(ToastStore);

  removeToast(id: string): void {
    this.toastStore.remove(id);
  }
}
