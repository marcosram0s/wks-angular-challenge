import { ChangeDetectionStrategy, Component, computed, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputModel } from './models/input.model';
let idNext = 0;
@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent implements ControlValueAccessor {
  id = input.required<InputModel['id']>();
  label = input.required<InputModel['label']>();
  type = input.required<InputModel['type']>();
  placeholder = input.required<InputModel['placeholder']>();
  error = input.required<InputModel['error']>();
  disabled = input<InputModel['disabled']>();

  private uniqueId = `input-${idNext++}`;
  idInput = computed(() => this.id ?? this.uniqueId);
  protected errorId = `${this.uniqueId}-error`;

  value = signal<string | number>('');

  // eslint-disable-next-line
  onChange: (value: string | number) => void = () => {};
  // eslint-disable-next-line
  onTouched: () => void = () => {};

  writeValue(value: string | null): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string | number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onInputValueChange(event: Event): void {
    const target = event.target as HTMLInputElement;

    if (this.type() === 'currency') {
      const numericValue = target.value.replace(/\D/g, '');

      const numberValue = Number(numericValue) / 100;

      const formattedValue = numberValue.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });

      target.value = formattedValue;
      this.value.set(numberValue.toString());
      this.onChange(numberValue);

      return;
    }

    this.value.set(target.value);
    this.onChange(target.value);
  }

  onBlur(): void {
    this.onTouched();
  }
}
