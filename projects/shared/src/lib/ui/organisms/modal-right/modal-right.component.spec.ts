import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalRightComponent } from './modal-right.component';
import { ModalRightStore } from './store/modal-right.store';

describe('ModalRightComponent', () => {
  let fixture: ComponentFixture<ModalRightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalRightComponent],
      providers: [ModalRightStore]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalRightComponent);
    fixture.detectChanges();
  });

  it('should create successfully', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should initiate closing animation', () => {
    const store = TestBed.inject(ModalRightStore);

    store.open({ title: 'Test' });
    expect(store.isClosing()).toBe(false);

    fixture.componentInstance.close();

    expect(store.isClosing()).toBe(true);
  });

  it('should close on escape key press', () => {
    jest.spyOn(fixture.componentInstance, 'close');

    fixture.componentInstance.onKeydownHandler();

    expect(fixture.componentInstance.close).toHaveBeenCalled();
  });
});
