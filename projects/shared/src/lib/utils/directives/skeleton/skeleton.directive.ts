import { computed, Directive, effect, ElementRef, inject, input } from '@angular/core';
import { SkeletonStore } from './store';

@Directive({
  selector: '[appSkeleton]',

  host: {
    '[style]': 'hostStyles()',
    '[class.skeleton-active]': 'isSkeletonActive()',
    '[class.skeleton-circle]': 'isSkeletonActive() && shape() === "circle"',
    '[class.skeleton-rect]': 'isSkeletonActive() && shape() === "rect"'
  }
})
export class SkeletonDirective {
  private readonly elementRef = inject(ElementRef);
  private readonly skeletonStore = inject(SkeletonStore);

  width = input<string>();
  height = input<string>();
  shape = input<'rect' | 'circle'>('rect');

  private readonly isSkeletonActive = computed(() => this.skeletonStore.loading());

  protected hostStyles = computed(() => {
    const isActive = this.isSkeletonActive();
    if (!isActive) return '';

    const styles: string[] = [];
    if (this.width()) styles.push(`width: ${this.width()}`);
    if (this.height()) styles.push(`height: ${this.height()}`);
    styles.push('display: block');

    return styles.join('; ');
  });

  public getHostStyles(): string {
    return this.hostStyles();
  }

  constructor() {
    effect(() => {
      const element = this.elementRef.nativeElement as HTMLElement;
      const isActive = this.isSkeletonActive();

      if (isActive) {
        this.applySkeletonStyles(element);
      } else {
        this.resetSkeletonStyles(element);
      }
    });
  }

  private applySkeletonStyles(element: HTMLElement): void {
    const computedStyle = window.getComputedStyle(element);

    if (!element.dataset['originalDisplay']) {
      element.dataset['originalDisplay'] = computedStyle.display;
    }

    if (computedStyle.display === 'inline') {
      element.style.display = 'inline-block';
    }

    if (!this.height()) {
      const computedHeight = computedStyle.height;
      if (computedHeight === '0px' || computedHeight === 'auto') {
        element.style.minHeight = '1rem';
      }
    }

    if (!this.width() && (computedStyle.display.includes('inline') || element.tagName === 'SPAN')) {
      element.style.minWidth = '4rem';
    }

    this.addElementTypeClass(element);
  }

  private resetSkeletonStyles(element: HTMLElement): void {
    element.style.removeProperty('min-height');
    element.style.removeProperty('min-width');
    element.style.removeProperty('width');
    element.style.removeProperty('height');

    const originalDisplay = element.dataset['originalDisplay'];
    if (originalDisplay && originalDisplay !== 'block') {
      element.style.display = originalDisplay;
    } else {
      element.style.removeProperty('display');
    }

    delete element.dataset['originalDisplay'];

    element.classList.remove('skeleton-text', 'skeleton-avatar', 'skeleton-card', 'skeleton-button', 'skeleton-image');
  }

  private addElementTypeClass(element: HTMLElement): void {
    const tagName = element.tagName.toLowerCase();

    switch (tagName) {
      case 'span':
      case 'p':
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
        element.classList.add('skeleton-text');
        break;
      case 'button':
        element.classList.add('skeleton-button');
        break;
      case 'img':
        element.classList.add('skeleton-image');
        break;
      case 'div':
        if (element.classList.contains('avatar') || this.shape() === 'circle') {
          element.classList.add('skeleton-avatar');
        } else if (element.classList.contains('card')) {
          element.classList.add('skeleton-card');
        }
        break;
    }
  }
}
