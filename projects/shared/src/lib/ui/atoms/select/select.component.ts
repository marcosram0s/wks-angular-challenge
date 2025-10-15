import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  forwardRef,
  inject,
  input,
  QueryList,
  signal,
  ViewChildren
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectModel, SelectOption } from './models/select.model';

let idNext = 0;

@Component({
  selector: 'app-select',

  templateUrl: `./select.component.html`,
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ],
  host: {
    '(document:click)': 'onDocumentClick($event)'
  }
})
export class SelectComponent<T = string | number> implements ControlValueAccessor, AfterViewInit {
  id = input<SelectModel<T>['id']>();
  label = input.required<SelectModel<T>['label']>();
  placeholder = input.required<SelectModel<T>['placeholder']>();
  options = input.required<SelectModel<T>['options']>();
  error = input<SelectModel<T>['error']>();

  @ViewChildren('optionItem')
  private optionElements!: QueryList<ElementRef<HTMLLIElement>>;

  private uniqueId = `select-${idNext++}`;
  protected idInput = computed(() => this.id() ?? this.uniqueId);
  protected errorId = `${this.uniqueId}-error`;

  readonly isOpen = signal(false);
  protected readonly activeIndex = signal(-1);
  protected readonly selectedOption = signal<SelectOption<T> | undefined>(undefined);
  protected readonly displayLabel = computed(() => this.selectedOption()?.label ?? this.placeholder());

  private readonly elementRef = inject(ElementRef);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange: (value: T | null) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched: () => void = () => {};

  ngAfterViewInit(): void {
    this.optionElements.changes.subscribe(() => {
      if (this.isOpen() && this.activeIndex() >= 0) {
        this.focusOption(this.activeIndex());
      }
    });
  }

  writeValue(value: T | null): void {
    const option = this.options().find(opt => opt.value === value);
    this.selectedOption.set(option);
  }

  registerOnChange(fn: (value: T | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  toggleDropdown(): void {
    this.isOpen.update(v => !v);
    if (this.isOpen()) {
      const selectedIdx = this.options().findIndex(o => o.value === this.selectedOption()?.value);
      this.activeIndex.set(selectedIdx > -1 ? selectedIdx : 0);
    } else {
      this.onTouched();
    }
  }

  selectOption(option: SelectOption<T>): void {
    this.selectedOption.set(option);
    this.onChange(option.value);
    this.isOpen.set(false);
    this.onTouched();
  }

  onKeydown(event: KeyboardEvent): void {
    event.preventDefault();
    switch (event.key) {
      case 'ArrowDown':
        this.activeIndex.update(i => (i + 1) % this.options().length);
        this.focusOption(this.activeIndex());
        break;
      case 'ArrowUp':
        this.activeIndex.update(i => (i - 1 + this.options().length) % this.options().length);
        this.focusOption(this.activeIndex());
        break;
      case 'Enter':
      case ' ':
        if (this.activeIndex() >= 0) {
          this.selectOption(this.options()[this.activeIndex()]);
        }
        break;
      case 'Escape':
        this.isOpen.set(false);
        break;
    }
  }

  private focusOption(index: number): void {
    this.optionElements.get(index)?.nativeElement.focus();
  }

  protected onDocumentClick(event: MouseEvent): void {
    if (this.isOpen() && !this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
      this.onTouched();
    }
  }
}
