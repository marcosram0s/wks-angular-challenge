import { Pipe, PipeTransform } from '@angular/core';
import { TRUNCATE_CONSTANTS } from './models/truncate.model';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
  transform(
    value: string | null | undefined,
    limit: number = TRUNCATE_CONSTANTS.DEFAULT_LIMIT,
    trail: string = TRUNCATE_CONSTANTS.DEFAULT_TRAIL
  ): string {
    if (!value) {
      return '';
    }

    if (value.length <= limit) {
      return value;
    }
    return value.substring(0, limit) + trail;
  }
}
