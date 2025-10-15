import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormManagerComponent } from './form-manager.component';
import { Category, Product } from '@shared/ui';

describe('FormManagerComponent', () => {
  const mockCategories: Category[] = ['electronics', 'jewelery', "men's clothing"];
  let component: FormManagerComponent;

  const mockProduct: Product = {
    id: 1,
    title: 'Test Product',
    price: 99.99,
    category: 'electronics',
    image: 'https://example.com/image.jpg',
    description: 'Test description'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormManagerComponent, ReactiveFormsModule, HttpClientTestingModule]
    });

    const fixture = TestBed.createComponent(FormManagerComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('categories', mockCategories);
  });

  describe('Form Initialization', () => {
    it('should initialize with add mode and empty fields', () => {
      expect(component.formTitle()).toBe('Adicionar Novo Produto');
      expect(component.productForm.get('title')?.value).toBeFalsy();
    });

    it('should populate form in edit mode', () => {
      const editFixture = TestBed.createComponent(FormManagerComponent);
      editFixture.componentRef.setInput('categories', mockCategories);
      editFixture.componentRef.setInput('data', mockProduct);
      const editComponent = editFixture.componentInstance;

      expect(editComponent.formTitle()).toBe('Editar Produto');
    });
  });
  describe('Form Submission', () => {
    it('should prevent invalid form submission', () => {
      const saveSpy = jest.spyOn(component.save, 'emit');
      component.onSubmit();

      expect(saveSpy).not.toHaveBeenCalled();
    });

    it('should emit valid form data', () => {
      const saveSpy = jest.spyOn(component.save, 'emit');
      component.productForm.patchValue({
        title: 'New Product',
        price: 50,
        category: 'electronics',
        image: 'https://example.com/image.jpg',
        description: 'Description'
      });

      component.onSubmit();

      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ title: 'New Product', price: 50 }));
    });
  });

  describe('Error Messages', () => {
    it('should return correct error messages', () => {
      const control = component.productForm.get('title');
      control?.markAsTouched();
      control?.setErrors({ required: true });
      expect(component.getErrorMessage('title')).toBe('Este campo é obrigatório.');

      control?.setErrors({ minlength: true });
      expect(component.getErrorMessage('title')).toBe('Deve ter mais caracteres.');

      control?.setErrors(null);
      expect(component.getErrorMessage('title')).toBeNull();
    });
  });

  describe('User Actions', () => {
    it('should emit cancel event', () => {
      const cancelSpy = jest.spyOn(component.cancelForm, 'emit');
      component.onCancel();
      expect(cancelSpy).toHaveBeenCalled();
    });

    it('should transform categories to options', () => {
      expect(component.categoryOptions()).toEqual([
        { value: 'electronics', label: 'Electronics' },
        { value: 'jewelery', label: 'Jewelery' },
        { value: "men's clothing", label: "Men's clothing" }
      ]);
    });
  });
});
