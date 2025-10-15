import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ButtonComponent } from '../../atoms/button';
import { ModalStore } from './store/modal.store';

@Component({
  selector: 'app-modal',
  imports: [CommonModule, ButtonComponent],
  templateUrl: `./modal.component.html`,
  styleUrls: ['./modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.escape)': 'onKeydownHandler()'
  }
})
export class ModalComponent {
  readonly modalStore = inject(ModalStore);

  onButtonClick(action: string): void {
    this.modalStore.close(action);
  }

  onKeydownHandler(): void {
    this.modalStore.close(undefined);
  }
}
