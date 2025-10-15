import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FocusDirective } from '../../../utils/directives';
import { ModalRightStore } from './store/modal-right.store';

@Component({
  selector: 'app-modal-right',
  templateUrl: './modal-right.component.html',
  styleUrls: ['./modal-right.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.escape)': 'onKeydownHandler()'
  },
  imports: [FocusDirective]
})
export class ModalRightComponent {
  readonly modalStore = inject(ModalRightStore);

  onKeydownHandler(): void {
    this.close();
  }

  close(): void {
    this.modalStore.close();
  }
}
