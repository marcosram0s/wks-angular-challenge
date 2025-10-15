import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastStore } from './store/toast.store';
import { ToastComponent } from './toast.component';

describe('ToastComponent', () => {
  let fixture: ComponentFixture<ToastComponent>;
  let toastStore: ToastStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastComponent],
      providers: [ToastStore]
    }).compileComponents();

    fixture = TestBed.createComponent(ToastComponent);
    toastStore = TestBed.inject(ToastStore);
    fixture.detectChanges();
  });

  it('should create successfully', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should provide toast container', () => {
    const containerElement = fixture.nativeElement.querySelector('.toast-container');
    expect(containerElement).toBeTruthy();
  });

  it('should remove toast when dismissed', () => {
    jest.spyOn(toastStore, 'remove');

    fixture.componentInstance.removeToast('test-id');

    expect(toastStore.remove).toHaveBeenCalledWith('test-id');
  });
});
