import { ChangeDetectionStrategy, Component, computed, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputSearchModel } from './models/input-search.model';

let idNext = 0;

@Component({
  selector: 'app-input-search',

  templateUrl: './input-search.component.html',
  styleUrls: ['./input-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputSearchComponent),
      multi: true
    }
  ]
})
export class InputSearchComponent implements ControlValueAccessor {
  id = input<InputSearchModel['id']>();
  label = input<InputSearchModel['label']>();
  placeholder = input<InputSearchModel['placeholder']>('Pesquisar...');
  error = input<InputSearchModel['error']>();
  disabled = input<InputSearchModel['disabled']>();

  private uniqueId = `input-search-${idNext++}`;
  idInput = computed(() => this.id() ?? this.uniqueId);
  protected errorId = `${this.uniqueId}-error`;

  value = signal<string>('');

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange: (value: string) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched: () => void = () => {};

  writeValue(value: string | null): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onInputValueChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value.set(target.value);
    this.onChange(target.value);
  }

  onBlur(): void {
    this.onTouched();
  }

  clearSearch(): void {
    this.value.set('');
    this.onChange('');
  }
}
