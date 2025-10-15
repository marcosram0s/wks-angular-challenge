import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalRightStore, ModalStore, Product, ToastStore } from '@shared/ui';
import { of, throwError } from 'rxjs';
import { ProductService } from '../../services/products.service';
import { ProductsManagerComponent } from './manager.component';

describe('ProductsManagerComponent', () => {
  let component: ProductsManagerComponent;
  let productService: jest.Mocked<ProductService>;
  let modalStore: jest.Mocked<ModalStore>;
  let modalRightStore: jest.Mocked<ModalRightStore>;
  let toastStore: jest.Mocked<ToastStore>;

  const mockProducts: Product[] = [
    { id: 1, title: 'Product 1', price: 99.99, category: 'electronics', image: 'test1.jpg', description: 'Desc 1' },
    { id: 2, title: 'Product 2', price: 49.99, category: "women's clothing", image: 'test2.jpg', description: 'Desc 2' }
  ];

  beforeEach(() => {
    const productServiceMock = {
      getAllProducts: jest.fn().mockReturnValue(of(mockProducts)),
      getAllCategories: jest.fn().mockReturnValue(of(['electronics', 'clothing'])),
      createProduct: jest.fn().mockReturnValue(of(mockProducts[0])),
      updateProduct: jest.fn().mockReturnValue(of(mockProducts[0])),
      deleteProduct: jest.fn().mockReturnValue(of({}))
    };

    TestBed.configureTestingModule({
      imports: [ProductsManagerComponent, ReactiveFormsModule],
      providers: [
        { provide: ProductService, useValue: productServiceMock },
        {
          provide: ModalStore,
          useValue: {
            open: jest.fn(),
            onAfterClosed: jest.fn()
          }
        },
        {
          provide: ModalRightStore,
          useValue: {
            open: jest.fn(),
            close: jest.fn(),
            isOpen: jest.fn().mockReturnValue(false)
          }
        },
        {
          provide: ToastStore,
          useValue: { show: jest.fn() }
        }
      ]
    });

    const fixture = TestBed.createComponent(ProductsManagerComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService) as jest.Mocked<ProductService>;
    modalStore = TestBed.inject(ModalStore) as jest.Mocked<ModalStore>;
    modalRightStore = TestBed.inject(ModalRightStore) as jest.Mocked<ModalRightStore>;
    toastStore = TestBed.inject(ToastStore) as jest.Mocked<ToastStore>;

    fixture.detectChanges();
  });

  describe('Initialization', () => {
    it('should load products and categories on startup', () => {
      expect(productService.getAllProducts).toHaveBeenCalled();
      expect(productService.getAllCategories).toHaveBeenCalled();
    });
  });

  describe('Product Management', () => {
    it('should open form for adding new product', () => {
      component.handleNewProduct();

      expect(component['productToEdit']()).toBeNull();
      expect(modalRightStore.open).toHaveBeenCalledWith({ title: 'Adicionar produto' });
    });

    it('should open form for editing product', () => {
      component.handleEditProduct(mockProducts[0]);

      expect(component['productToEdit']()).toBe(mockProducts[0]);
      expect(modalRightStore.open).toHaveBeenCalledWith({ title: 'Editar produto #1' });
    });
  });

  describe('CRUD Operations', () => {
    it('should create new product', () => {
      const newProduct = { ...mockProducts[0], id: undefined } as unknown as Product;
      component.onSaveProduct(newProduct);

      expect(productService.createProduct).toHaveBeenCalled();
      expect(toastStore.show).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'success', message: 'Produto criado com sucesso.' })
      );
    });

    it('should update existing product', () => {
      component.onSaveProduct(mockProducts[0]);

      expect(productService.updateProduct).toHaveBeenCalled();
      expect(toastStore.show).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'success', message: 'Produto atualizado com sucesso.' })
      );
    });

    it('should handle save errors', () => {
      productService.createProduct.mockReturnValue(throwError(() => new Error('Save failed')));
      component.onSaveProduct({ ...mockProducts[0], id: undefined } as unknown as Product);

      expect(toastStore.show).toHaveBeenCalledWith(expect.objectContaining({ type: 'error' }));
    });

    it('should request confirmation before deleting', () => {
      component.handleDeleteProduct(1, 'Test Product');

      expect(modalStore.open).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Atenção', content: expect.stringContaining('Test Product') })
      );
    });
  });

  describe('User Actions', () => {
    it('should close form on cancel', () => {
      component.onCancelActionProduct();
      expect(modalRightStore.close).toHaveBeenCalled();
    });

    it('should clear search field', () => {
      component['searchControl'].setValue('test');
      component.clearSearchProducts();
      expect(component['searchControl'].value).toBe('');
    });

    it('should refresh products list', () => {
      expect(() => component.refreshProducts()).not.toThrow();
    });
  });
});
