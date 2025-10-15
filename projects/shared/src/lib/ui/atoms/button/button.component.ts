import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FocusDirective } from '../../../utils/directives';
import { ButtonModel, BUTTON_CONSTANTS } from './models/button.model';

@Component({
  selector: 'app-button',
  imports: [FocusDirective],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {
  protected readonly constants = BUTTON_CONSTANTS;

  text = input<ButtonModel['text']>();
  icon = input<ButtonModel['icon']>();
  size = input<ButtonModel['size']>(this.constants.DEFAULT_SIZE);
  color = input<ButtonModel['color']>(this.constants.DEFAULT_COLOR);
  disabled = input<ButtonModel['disabled']>(false);
  autoFocus = input<ButtonModel['autoFocus']>(false);
  ariaLabel = input<ButtonModel['ariaLabel']>();
  clickEvent = output<void>();

  onClick() {
    if (!this.disabled()) {
      this.clickEvent.emit();
    }
  }
}
