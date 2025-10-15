import { ChangeDetectionStrategy, Component, computed, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TextAreaModel } from './models/text-area.model';

let idNext = 0;

@Component({
  selector: 'app-text-area',

  templateUrl: './text-area.component.html',
  styleUrls: ['./text-area.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextAreaComponent),
      multi: true
    }
  ]
})
export class TextAreaComponent implements ControlValueAccessor {
  id = input<TextAreaModel['id']>();
  label = input.required<TextAreaModel['label']>();
  placeholder = input<TextAreaModel['placeholder']>();
  error = input<TextAreaModel['error']>();
  rows = input<TextAreaModel['rows']>(3);

  private uniqueId = `textarea-${idNext++}`;
  idInput = computed(() => this.id() ?? this.uniqueId);
  protected errorId = `${this.uniqueId}-error`;

  value = signal<string>('');
  isDisabled = signal<boolean>(false);

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

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  onTextAreaValueChange(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.value.set(target.value);
    this.onChange(target.value);
  }

  onBlur(): void {
    this.onTouched();
  }
}
