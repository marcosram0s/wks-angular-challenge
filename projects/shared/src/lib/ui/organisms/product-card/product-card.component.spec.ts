import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCardComponent } from './product-card.component';
import { Product } from './models/product-card.model';

describe('ProductCardComponent', () => {
  let fixture: ComponentFixture<ProductCardComponent>;
  let component: ProductCardComponent;

  const mockProduct: Product = {
    id: 1,
    title: 'Test Product',
    category: 'electronics',
    price: 99.99,
    description: 'Test Description',
    image: 'test-image.jpg'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('product', mockProduct);
    fixture.detectChanges();
  });

  describe('Product Display', () => {
    it('should render product card structure', () => {
      const cardElement = fixture.nativeElement.querySelector('.product-card');
      expect(cardElement).toBeTruthy();
    });

    it('should display product category in uppercase', () => {
      const categoryElement = fixture.nativeElement.querySelector('.product-category');

      expect(categoryElement.textContent.trim()).toBe('ELECTRONICS');
    });

    it('should display product title', () => {
      const titleElement = fixture.nativeElement.querySelector('.product-title');

      expect(titleElement.textContent.trim()).toBe('Test Product');
    });

    it('should display formatted price with currency', () => {
      const priceElement = fixture.nativeElement.querySelector('.product-price');

      expect(priceElement.textContent.trim()).toContain('R$');
    });

    it('should render product image', () => {
      const imageElement = fixture.nativeElement.querySelector('app-image');

      expect(imageElement).toBeTruthy();
    });
  });

  describe('Card Structure', () => {
    it('should have all required sections', () => {
      const detailsElement = fixture.nativeElement.querySelector('.product-details');
      const actionsElement = fixture.nativeElement.querySelector('.product-actions');
      const imageSection = fixture.nativeElement.querySelector('.product-image');

      expect(detailsElement).toBeTruthy();
      expect(actionsElement).toBeTruthy();
      expect(imageSection).toBeTruthy();
    });

    it('should render edit and delete action buttons', () => {
      const buttonElements = fixture.nativeElement.querySelectorAll('app-button');

      expect(buttonElements.length).toBe(2);
    });
  });

  describe('User Interactions', () => {
    it('should emit edit event with product ID when edit button is clicked', () => {
      const editSpy = jest.spyOn(component.editEvent, 'emit');

      component.onEdit();
      expect(editSpy).toHaveBeenCalledWith(1);
    });

    it('should emit delete event with product ID when delete button is clicked', () => {
      const deleteSpy = jest.spyOn(component.deleteEvent, 'emit');

      component.onDelete();
      expect(deleteSpy).toHaveBeenCalledWith(1);
    });
  });

  describe('Different Product Data', () => {
    it('should handle different categories correctly', () => {
      const clothingProduct: Product = {
        ...mockProduct,
        category: "men's clothing"
      };

      fixture.componentRef.setInput('product', clothingProduct);
      fixture.detectChanges();

      const categoryElement = fixture.nativeElement.querySelector('.product-category');
      expect(categoryElement.textContent.trim()).toBe("MEN'S CLOTHING");
    });

    it('should handle different price values', () => {
      const expensiveProduct: Product = {
        ...mockProduct,
        price: 1299.99
      };

      fixture.componentRef.setInput('product', expensiveProduct);
      fixture.detectChanges();

      const priceElement = fixture.nativeElement.querySelector('.product-price');
      expect(priceElement.textContent).toContain('1,299.99');
    });
  });
});
