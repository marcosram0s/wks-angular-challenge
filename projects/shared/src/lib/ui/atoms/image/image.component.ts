import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ImageModel } from './models/image.model';

@Component({
  selector: 'app-image',
  imports: [NgOptimizedImage],
  template: `
    @if (fill()) {
      <img [ngSrc]="src()" [alt]="alt()" [fill]="true" [priority]="priority()" [sizes]="sizes()" />
    } @else {
      <img
        [ngSrc]="src()"
        [alt]="alt()"
        [width]="width()!"
        [height]="height()!"
        [priority]="priority()"
        [sizes]="sizes()" />
    }
  `,
  styles: [
    `
      @use '../../styles/tokens' as *;
      img {
        display: block;
        height: 100%;
        object-fit: contain;
        padding: $spacing-md;

        &:focus-visible {
          outline: 2px solid #0a3d6b;
          outline-offset: 2px;
          border-radius: 4px;
        }

        &:hover {
          cursor: pointer;
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageComponent {
  src = input.required<ImageModel['src']>();
  alt = input.required<ImageModel['alt']>();
  width = input<ImageModel['width']>();
  height = input<ImageModel['height']>();
  fill = input<ImageModel['fill']>(false);
  priority = input<ImageModel['priority']>(false);
  sizes = input<ImageModel['sizes']>('(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw');
}
