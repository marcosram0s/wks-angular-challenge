import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkeletonDirective } from '@shared/utils';
import { CardComponent } from '../../../molecules/card';
import { PRODUCT_CARD_SKELETON_CONSTANTS } from '../models/product-card.model';

@Component({
  selector: 'app-product-card-skeleton',

  imports: [SkeletonDirective, CardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['../product-card.component.scss'],
  template: `
    <div class="product-card">
      <section class="product-image">
        <div
          appSkeleton
          [width]="constants.SIZES.IMAGE_FULL"
          [height]="constants.SIZES.IMAGE_FULL"
          aria-hidden="true"></div>
      </section>

      <app-card>
        <section class="product-details">
          <span
            class="product-category"
            appSkeleton
            [width]="constants.SIZES.CATEGORY_WIDTH"
            [height]="constants.SIZES.CATEGORY_HEIGHT"
            aria-hidden="true"></span>

          <h2
            class="product-title"
            appSkeleton
            [width]="constants.SIZES.TITLE_WIDTH"
            [height]="constants.SIZES.TITLE_HEIGHT"
            aria-hidden="true"></h2>

          <p
            class="product-price"
            appSkeleton
            [width]="constants.SIZES.PRICE_WIDTH"
            [height]="constants.SIZES.PRICE_HEIGHT"
            aria-hidden="true"></p>
        </section>

        <section class="product-actions">
          <button
            disabled
            appSkeleton
            [width]="constants.SIZES.BUTTON_SIZE"
            [height]="constants.SIZES.BUTTON_SIZE"
            [shape]="constants.SKELETON_SHAPE"
            aria-hidden="true"></button>
          <button
            disabled
            appSkeleton
            [width]="constants.SIZES.BUTTON_SIZE"
            [height]="constants.SIZES.BUTTON_SIZE"
            [shape]="constants.SKELETON_SHAPE"
            aria-hidden="true"></button>
        </section>
      </app-card>
    </div>
  `
})
export class ProductCardSkeletonComponent {
  protected readonly constants = PRODUCT_CARD_SKELETON_CONSTANTS;
}
