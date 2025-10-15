import { CurrencyPipe, UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TruncatePipe } from '../../../utils/pipes/truncate/truncate.pipe';
import { ImageComponent } from '../../atoms';
import { ButtonComponent } from '../../atoms/button';
import { CardComponent } from '../../molecules/card';
import { Product, PRODUCT_CARD_CONSTANTS } from './models/product-card.model';

@Component({
  selector: 'app-product-card',

  imports: [CurrencyPipe, CardComponent, ImageComponent, ButtonComponent, TruncatePipe, UpperCasePipe],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCardComponent {
  protected readonly constants = PRODUCT_CARD_CONSTANTS;

  product = input.required<Product>();

  deleteEvent = output<number>();
  editEvent = output<number>();

  onDelete() {
    this.deleteEvent.emit(this.product().id);
  }

  onEdit() {
    this.editEvent.emit(this.product().id);
  }
}
