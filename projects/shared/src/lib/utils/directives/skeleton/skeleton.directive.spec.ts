import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SkeletonDirective } from './skeleton.directive';
import { SkeletonStore } from './store';

@Component({
  template: `
    <div appSkeleton data-testid="skeleton-div"></div>
    <p appSkeleton shape="rect" data-testid="skeleton-text"></p>
    <img appSkeleton shape="circle" data-testid="skeleton-img" alt="skeleton image" />
    <button appSkeleton width="100px" height="40px" data-testid="skeleton-button">Test Button</button>
  `,
  imports: [SkeletonDirective]
})
class TestComponent {}

describe('SkeletonDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let skeletonStore: InstanceType<typeof SkeletonStore>;
  let divElement: DebugElement;
  let textElement: DebugElement;
  let imgElement: DebugElement;
  let buttonElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [SkeletonStore]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    skeletonStore = TestBed.inject(SkeletonStore);

    divElement = fixture.debugElement.query(By.css('[data-testid="skeleton-div"]'));
    textElement = fixture.debugElement.query(By.css('[data-testid="skeleton-text"]'));
    imgElement = fixture.debugElement.query(By.css('[data-testid="skeleton-img"]'));
    buttonElement = fixture.debugElement.query(By.css('[data-testid="skeleton-button"]'));

    fixture.detectChanges();
  });

  describe('Skeleton State Management', () => {
    it('should not apply skeleton classes when loading state is false', () => {
      skeletonStore.hide();

      fixture.detectChanges();

      expect(divElement.nativeElement.classList.contains('skeleton-active')).toBe(false);
    });

    it('should apply skeleton classes when loading state is true', () => {
      skeletonStore.show();

      fixture.detectChanges();

      expect(divElement.nativeElement.classList.contains('skeleton-active')).toBe(true);
    });

    it('should reset styles when skeleton is hidden', () => {
      skeletonStore.show();
      fixture.detectChanges();
      expect(buttonElement.nativeElement.classList.contains('skeleton-active')).toBe(true);

      skeletonStore.hide();
      fixture.detectChanges();

      expect(buttonElement.nativeElement.classList.contains('skeleton-active')).toBe(false);
    });
  });

  describe('Shape Rendering', () => {
    it('should apply circle class for circle shape', () => {
      skeletonStore.show();

      fixture.detectChanges();

      expect(imgElement.nativeElement.classList.contains('skeleton-circle')).toBe(true);
      expect(imgElement.nativeElement.classList.contains('skeleton-rect')).toBe(false);
    });

    it('should apply rect class for rect shape', () => {
      skeletonStore.show();

      fixture.detectChanges();

      expect(textElement.nativeElement.classList.contains('skeleton-rect')).toBe(true);
      expect(textElement.nativeElement.classList.contains('skeleton-circle')).toBe(false);
    });
  });

  describe('Custom Dimensions', () => {
    it('should apply custom width and height styles', () => {
      const directive = buttonElement.injector.get(SkeletonDirective);
      skeletonStore.show();

      fixture.detectChanges();
      const styles = directive.getHostStyles();

      expect(styles).toContain('width: 100px');
      expect(styles).toContain('height: 40px');
    });
  });

  describe('Element Type Classes', () => {
    it('should add appropriate element type classes based on tag', () => {
      skeletonStore.show();

      fixture.detectChanges();

      expect(textElement.nativeElement.classList.contains('skeleton-text')).toBe(true);
      expect(imgElement.nativeElement.classList.contains('skeleton-image')).toBe(true);
      expect(buttonElement.nativeElement.classList.contains('skeleton-button')).toBe(true);
    });
  });
});
