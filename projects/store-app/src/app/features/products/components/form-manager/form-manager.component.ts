import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  ButtonComponent,
  Category,
  ImageComponent,
  InputComponent,
  Product,
  SelectComponent,
  SelectOption,
  TextAreaComponent
} from '@shared/ui';
import { UrlImageValidator } from '@shared/utils';
import { FORM_MANAGER_CONSTANTS } from './models/form-manager.model';

@Component({
  selector: 'app-form-manager',
  imports: [ReactiveFormsModule, InputComponent, TextAreaComponent, SelectComponent, ButtonComponent, ImageComponent],
  templateUrl: './form-manager.component.html',
  styleUrl: './form-manager.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormManagerComponent {
  protected readonly constants = FORM_MANAGER_CONSTANTS;
  protected readonly height = 150;
  protected readonly width = Math.round(150 * 0.79);
  protected readonly fb = inject(FormBuilder);

  data = input<Product | null>(null);
  categories = input.required<Category[]>();

  save = output<Product>();
  cancelForm = output<void>();

  productForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    price: [0, [Validators.required, Validators.min(0.01)]],
    category: ['', Validators.required],
    image: new FormControl('', {
      validators: [Validators.required],
      asyncValidators: [UrlImageValidator()],
      updateOn: 'blur'
    }),
    description: ['', [Validators.required, Validators.minLength(10)]]
  });

  categoryOptions = computed<SelectOption[]>(() => {
    const categories = this.categories();
    if (!categories || categories.length === 0) {
      return [
        {
          value: '',
          label: 'Sem categorias disponíveis'
        }
      ];
    }
    return categories.map(category => ({
      value: category,
      label: category.charAt(0).toUpperCase() + category.slice(1)
    }));
  });

  formTitle = computed(() => (this.data() ? 'Editar Produto' : 'Adicionar Novo Produto'));

  dataAction = computed(() => (this.data() ? 'Salvar alterações' : 'Adicionar produto'));

  constructor() {
    effect(() => {
      const data = this.data();
      if (data) {
        this.productForm.patchValue(data);
      } else {
        this.productForm.reset();
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }
    const formValue = this.productForm.getRawValue();
    const productToSave: Product = {
      ...(this.data() || ({} as Product)),
      ...formValue
    } as Product;
    this.save.emit(productToSave);
  }

  onCancel(): void {
    this.cancelForm.emit();
  }

  getErrorMessage(controlName: keyof typeof this.productForm.controls): string | null {
    const control = this.productForm.get(controlName);
    if (control?.invalid && (control.dirty || control.touched)) {
      if (control.errors?.['required']) return 'Este campo é obrigatório.';
      if (control.errors?.['minlength']) return 'Deve ter mais caracteres.';
      if (control.errors?.['min']) return 'O valor deve ser positivo.';
      if (control.errors?.['invalidUrl']) return 'URL inválida.';
      if (control.errors?.['isZero']) return 'O valor não pode ser zero.';
    }
    return null;
  }
}
