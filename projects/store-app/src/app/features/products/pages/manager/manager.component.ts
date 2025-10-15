import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  ButtonComponent,
  InputSearchComponent,
  ModalRightComponent,
  ModalRightStore,
  ModalStore,
  Product
} from '@shared/ui';
import { SkeletonStore } from '@shared/utils';
import { FormManagerComponent } from '../../components/form-manager/form-manager.component';
import { ProductListComponent } from '../../components/product-list/product-list.component';
import { ProductsStore } from '../../store/products.store';

@Component({
  selector: 'app-products-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss'],
  imports: [
    ProductListComponent,
    ModalRightComponent,
    FormManagerComponent,
    ButtonComponent,
    InputSearchComponent,
    ReactiveFormsModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsManagerComponent {
  private readonly modalStore = inject(ModalStore);
  protected readonly modalRightStore = inject(ModalRightStore);
  protected readonly productsStore = inject(ProductsStore);
  protected readonly skeletonStore = inject(SkeletonStore);

  protected readonly loading = computed(() => this.skeletonStore.loading());
  protected readonly products = computed(() => this.productsStore.products());
  protected readonly productToEdit = computed(() => this.productsStore.productToEdit());
  protected readonly categories = computed(() => this.productsStore.categories());

  protected searchControl = new FormControl('');

  private readonly searchValue = toSignal(this.searchControl.valueChanges.pipe(takeUntilDestroyed()), {
    initialValue: ''
  });

  constructor() {
    effect(() => {
      this.productsStore.setSearchTerm(this.searchValue() ?? '');
    });
  }

  handleNewProduct(): void {
    this.productsStore.setProductToEdit(null);
    this.modalRightStore.open({ title: 'Adicionar produto' });
  }

  handleEditProductById(productId: number): void {
    const product = this.productsStore.findProductById(productId);
    if (product) {
      this.handleEditProduct(product);
    }
  }

  handleEditProduct(product: Product): void {
    this.modalRightStore.open({ title: `Editar produto #${product.id}` });
    this.productsStore.setProductToEdit(product);
  }

  onSaveProduct(product: Product): void {
    this.productsStore.saveProduct(product);
    this.modalRightStore.close();
  }

  handleDeleteProductById(productId: number): void {
    const product = this.productsStore.findProductById(productId);
    if (product) {
      this.handleDeleteProduct(productId, product.title);
    }
  }

  handleDeleteProduct(productId: number, productTitle: string): void {
    this.modalStore.open({
      title: 'Atenção',
      content: `Tem certeza de que deseja excluir o produto "${productTitle}"?`,
      buttons: [
        { label: 'Cancelar', action: 'cancel' },
        { label: 'Deletar', action: 'confirm' }
      ]
    });

    this.modalStore.onAfterClosed(result => {
      if (result === 'confirm') {
        this.productsStore.deleteProduct(productId);
      }
    });
  }

  onCancelActionProduct(): void {
    this.modalRightStore.close();
  }

  clearSearchProducts(): void {
    this.searchControl.setValue('');
    this.productsStore.clearSearch();
  }

  onRetryLoadProducts(): void {
    this.searchControl.setValue('');
    this.refreshProducts();
  }

  refreshProducts(): void {
    this.productsStore.loadProducts();
  }
}
