import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { EmptyListComponent, Product, ProductCardComponent, ProductCardSkeletonComponent } from '@shared/ui';
import { ProductListModel } from '../../models/product.model';

@Component({
  selector: 'app-product-list',

  imports: [ProductCardComponent, ProductCardSkeletonComponent, EmptyListComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent {
  loading = input.required<ProductListModel['loading']>();
  products = input.required<ProductListModel['products']>();
  deleteEvent = output<number>();
  editEvent = output<number>();
  clearSearchEvent = output<void>();
  retryEvent = output<void>();

  protected readonly trackByProductId = computed(() => {
    return (index: number, product: Product) => `product-${index}-${product.id}`;
  });

  protected readonly skeletonItems = Array(9).fill(null);

  protected readonly emptyListConfig = {
    message: 'Nenhum produto encontrado com este nome.',
    icon: 'ri-search-line'
  };

  onDelete(productId: number) {
    this.deleteEvent.emit(productId);
  }

  onEdit(productId: number) {
    this.editEvent.emit(productId);
  }

  onClearSearch() {
    this.clearSearchEvent.emit();
  }

  onRetry() {
    this.retryEvent.emit();
  }
}
