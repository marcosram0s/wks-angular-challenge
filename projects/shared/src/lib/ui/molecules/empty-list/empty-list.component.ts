import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ButtonComponent } from '../../atoms';
import { EmptyListModel, EMPTY_LIST_CONSTANTS } from './model/empty-list.model';

@Component({
  selector: 'app-empty-list',

  imports: [ButtonComponent],
  templateUrl: './empty-list.component.html',
  styleUrls: ['./empty-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmptyListComponent {
  protected readonly constants = EMPTY_LIST_CONSTANTS;

  message = input<EmptyListModel['message']>(this.constants.DEFAULT_MESSAGE);
  icon = input<EmptyListModel['icon']>(this.constants.DEFAULT_ICON);
  retryEvent = output<void>();

  buttonEvent = output<void>();

  protected onButtonClick(): void {
    this.buttonEvent.emit();
  }
  protected onRetryClick(): void {
    this.retryEvent.emit();
  }
}
