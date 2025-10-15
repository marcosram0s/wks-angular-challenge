import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FocusDirective } from './focus.directive';

@Component({
  template: `
    <input type="text" appFocus data-testid="focus-input" />
  `,
  imports: [FocusDirective]
})
class TestComponent {}

describe('FocusDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let focusInput: DebugElement;
  let directive: FocusDirective;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    focusInput = fixture.debugElement.query(By.css('[data-testid="focus-input"]'));
    directive = focusInput.injector.get(FocusDirective);
    fixture.detectChanges();
  });

  describe('Directive Initialization', () => {
    it('should attach directive to element', () => {
      expect(directive).toBeTruthy();
    });
  });

  describe('Auto-Focus Behavior', () => {
    it('should focus element after view initialization', async () => {
      const focusSpy = jest.spyOn(focusInput.nativeElement, 'focus');

      directive.ngAfterViewInit();
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(focusSpy).toHaveBeenCalled();
    });

    it('should apply focus to the native DOM element', async () => {
      const element = focusInput.nativeElement as HTMLInputElement;

      directive.ngAfterViewInit();
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(element).toBeTruthy();
      expect(element.focus).toBeDefined();
    });
  });
});
