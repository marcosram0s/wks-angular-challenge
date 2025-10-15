import { TestBed } from '@angular/core/testing';
import { ModalModel } from '../models/modal.model';
import { ModalStore } from './modal.store';

describe('ModalStore', () => {
  let store: ModalStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ModalStore]
    });
    store = TestBed.inject(ModalStore);
    document.body.style.overflow = 'auto';
  });

  afterEach(() => {
    document.body.style.overflow = 'auto';
  });

  it('should create successfully', () => {
    expect(store).toBeTruthy();
  });

  it('should start in closed state', () => {
    expect(store.isOpen()).toBe(false);
    expect(store.data()).toBeUndefined();
  });

  it('should display modal with content', () => {
    const modalData: ModalModel = {
      title: 'Test Modal',
      content: 'Test content',
      buttons: [
        { label: 'Cancel', action: 'cancel' },
        { label: 'Confirm', action: 'confirm' }
      ]
    };

    store.open(modalData);

    expect(store.isOpen()).toBe(true);
    expect(store.data()).toEqual(modalData);
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('should hide modal and restore scroll', () => {
    const modalData: ModalModel = {
      title: 'Test Modal',
      content: 'Test content',
      buttons: []
    };

    store.open(modalData);
    store.close('confirm');

    expect(store.isOpen()).toBe(false);
    expect(store.data()).toBeUndefined();
    expect(document.body.style.overflow).toBe('');
  });

  it('should notify when action performed', done => {
    const modalData: ModalModel = {
      title: 'Test Modal',
      content: 'Test content',
      buttons: []
    };

    store.onAfterClosed(action => {
      expect(action).toBe('confirm');
      done();
    });

    store.open(modalData);
    store.close('confirm');
  });

  it('should not notify when dismissed without action', () => {
    const modalData: ModalModel = {
      title: 'Test Modal',
      content: 'Test content',
      buttons: []
    };

    let emitted = false;
    store.onAfterClosed(() => {
      emitted = true;
    });

    store.open(modalData);
    store.close(undefined);

    expect(emitted).toBe(true);
  });

  it('should ignore close when already closed', () => {
    let emitted = false;
    store.onAfterClosed(() => {
      emitted = true;
    });

    store.close('action');

    expect(emitted).toBe(false);
    expect(store.isOpen()).toBe(false);
  });

  it('should manage body overflow correctly', () => {
    const modalData: ModalModel = { title: 'Test', content: 'Content', buttons: [] };

    store.open(modalData);
    expect(document.body.style.overflow).toBe('hidden');

    store.close('action');
    expect(document.body.style.overflow).toBe('');
  });
});
