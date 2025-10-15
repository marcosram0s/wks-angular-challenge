import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Product } from '../../models/product.model';
import { ProductListComponent } from './product-list.component';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;

  const mockProducts: Product[] = [
    {
      id: 1,
      title: 'Product 1',
      price: 100,
      description: 'Description 1',
      category: 'electronics',
      image: 'image1.jpg',
      rating: { rate: 4.5, count: 10 }
    },
    {
      id: 2,
      title: 'Product 2',
      price: 200,
      description: 'Description 2',
      category: 'jewelery',
      image: 'image2.jpg',
      rating: { rate: 4.0, count: 5 }
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductListComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('products', mockProducts);
    fixture.componentRef.setInput('loading', false);
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should initialize with default skeleton items', () => {
      expect(component['skeletonItems']).toHaveLength(9);
    });

    it('should configure empty list with correct message and icon', () => {
      expect(component['emptyListConfig'].message).toBe('Nenhum produto encontrado com este nome.');
      expect(component['emptyListConfig'].icon).toBe('ri-search-line');
    });
  });

  describe('Loading State Rendering', () => {
    it('should display skeleton placeholders when loading', () => {
      fixture.componentRef.setInput('loading', true);

      fixture.detectChanges();
      const skeletons = fixture.nativeElement.querySelectorAll('app-product-card-skeleton');

      expect(skeletons.length).toBe(9);
    });

    it('should hide skeletons when not loading', () => {
      fixture.componentRef.setInput('loading', false);

      fixture.detectChanges();
      const skeletons = fixture.nativeElement.querySelectorAll('app-product-card-skeleton');

      expect(skeletons.length).toBe(0);
    });
  });

  describe('Product List Rendering', () => {
    it('should display product cards when data is available', () => {
      fixture.componentRef.setInput('loading', false);

      fixture.detectChanges();
      const productCards = fixture.nativeElement.querySelectorAll('app-product-card');

      expect(productCards.length).toBe(2);
    });

    it('should show empty list message when no products match filter', () => {
      fixture.componentRef.setInput('products', []);
      fixture.componentRef.setInput('loading', false);

      fixture.detectChanges();
      const emptyList = fixture.nativeElement.querySelector('app-empty-list');

      expect(emptyList).toBeTruthy();
    });
  });

  describe('Track By Function', () => {
    it('should generate correct tracking identifier for products', () => {
      const trackByFn = component['trackByProductId']();
      const result = trackByFn(0, mockProducts[0]);

      expect(result).toBe('product-0-1');
    });

    it('should generate unique IDs for different indices', () => {
      const trackByFn = component['trackByProductId']();
      const result1 = trackByFn(0, mockProducts[0]);
      const result2 = trackByFn(1, mockProducts[1]);

      expect(result1).not.toBe(result2);
    });
  });

  describe('User Action Events', () => {
    it('should emit delete event with product ID', () => {
      const deleteSpy = jest.spyOn(component.deleteEvent, 'emit');

      component.onDelete(1);

      expect(deleteSpy).toHaveBeenCalledWith(1);
    });

    it('should emit edit event with product ID', () => {
      const editSpy = jest.spyOn(component.editEvent, 'emit');

      component.onEdit(2);

      expect(editSpy).toHaveBeenCalledWith(2);
    });

    it('should emit clear search event', () => {
      const clearSpy = jest.spyOn(component.clearSearchEvent, 'emit');

      component.onClearSearch();

      expect(clearSpy).toHaveBeenCalled();
    });

    it('should emit retry event', () => {
      const retrySpy = jest.spyOn(component.retryEvent, 'emit');

      component.onRetry();

      expect(retrySpy).toHaveBeenCalled();
    });
  });
});
