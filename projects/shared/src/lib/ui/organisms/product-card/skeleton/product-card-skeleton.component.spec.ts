import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkeletonStore } from '@shared/utils';
import { ProductCardSkeletonComponent } from './product-card-skeleton.component';

describe('ProductCardSkeletonComponent', () => {
  let fixture: ComponentFixture<ProductCardSkeletonComponent>;
  let skeletonStore: InstanceType<typeof SkeletonStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCardSkeletonComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCardSkeletonComponent);
    skeletonStore = TestBed.inject(SkeletonStore);
    fixture.detectChanges();
  });

  describe('Skeleton Structure', () => {
    it('should render complete product card skeleton structure', () => {
      const cardElement = fixture.nativeElement.querySelector('.product-card');
      const imageSection = fixture.nativeElement.querySelector('.product-image');
      const detailsSection = fixture.nativeElement.querySelector('.product-details');
      const actionsSection = fixture.nativeElement.querySelector('.product-actions');

      expect(cardElement).toBeTruthy();
      expect(imageSection).toBeTruthy();
      expect(detailsSection).toBeTruthy();
      expect(actionsSection).toBeTruthy();
    });

    it('should have skeleton directive on placeholder elements', () => {
      const skeletonElements = fixture.nativeElement.querySelectorAll('[appSkeleton]');

      expect(skeletonElements.length).toBeGreaterThan(0);
    });

    it('should use semantic HTML for accessibility', () => {
      const categoryElement = fixture.nativeElement.querySelector('.product-category[appSkeleton]');
      const titleElement = fixture.nativeElement.querySelector('.product-title[appSkeleton]');
      const priceElement = fixture.nativeElement.querySelector('.product-price[appSkeleton]');

      expect(categoryElement.tagName.toLowerCase()).toBe('span');
      expect(titleElement.tagName.toLowerCase()).toBe('h2');
      expect(priceElement.tagName.toLowerCase()).toBe('p');
    });
  });

  describe('Skeleton Animation State', () => {
    it('should activate skeleton animation when service shows loading', () => {
      skeletonStore.show();

      fixture.detectChanges();
      const activeElements = fixture.nativeElement.querySelectorAll('.skeleton-active');

      expect(activeElements.length).toBeGreaterThan(0);

      skeletonStore.hide();
    });

    it('should deactivate skeleton animation when service hides loading', () => {
      skeletonStore.show();
      fixture.detectChanges();

      skeletonStore.hide();
      fixture.detectChanges();
      const activeElements = fixture.nativeElement.querySelectorAll('.skeleton-active');

      expect(activeElements.length).toBe(0);
    });
  });

  describe('Skeleton Dimensions', () => {
    it('should apply correct widths to skeleton elements', () => {
      const categoryElement = fixture.nativeElement.querySelector('.product-category[appSkeleton]');
      const titleElement = fixture.nativeElement.querySelector('.product-title[appSkeleton]');
      const priceElement = fixture.nativeElement.querySelector('.product-price[appSkeleton]');

      expect(categoryElement.getAttribute('ng-reflect-width')).toBe('40%');
      expect(titleElement.getAttribute('ng-reflect-width')).toBe('80%');
      expect(priceElement.getAttribute('ng-reflect-width')).toBe('50%');
    });
  });
});
