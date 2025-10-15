import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalComponent } from './modal.component';
import { ModalStore } from './store/modal.store';

describe('ModalComponent', () => {
  let fixture: ComponentFixture<ModalComponent>;
  let modalStore: ModalStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalComponent],
      providers: [ModalStore]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    modalStore = TestBed.inject(ModalStore);
    fixture.detectChanges();
  });

  it('should create successfully', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should remain hidden when closed', () => {
    const modalElement = fixture.nativeElement.querySelector('.modal-overlay');
    expect(modalElement).toBeFalsy();
  });

  it('should close modal with button action', () => {
    jest.spyOn(modalStore, 'close');

    fixture.componentInstance.onButtonClick('confirm');

    expect(modalStore.close).toHaveBeenCalledWith('confirm');
  });

  it('should close modal on escape key press', () => {
    jest.spyOn(modalStore, 'close');

    fixture.componentInstance.onKeydownHandler();

    expect(modalStore.close).toHaveBeenCalledWith(undefined);
  });
});
