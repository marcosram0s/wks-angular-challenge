import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-card',

  imports: [],
  template: `
    <article class="card">
      <ng-content></ng-content>
    </article>
  `,
  styles: `
    @use '../../styles' as *;
    .card {
      padding: $spacing-md;
      border: 1px solid $color-neutral-50;
      border-radius: $spacing-sm;
      box-shadow: 0 $spacing-xxs $spacing-xs $color-neutral-300;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent {}
