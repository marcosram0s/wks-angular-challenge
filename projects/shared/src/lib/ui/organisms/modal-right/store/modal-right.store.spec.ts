import { TestBed } from '@angular/core/testing';
import { ModalRightModel } from '../models/modal-right.model';
import { ModalRightStore } from './modal-right.store';

describe('ModalRightService', () => {
  let service: ModalRightStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ModalRightStore]
    });
    service = TestBed.inject(ModalRightStore);
    document.body.style.overflow = 'auto';
  });

  afterEach(() => {
    document.body.style.overflow = 'auto';
  });

  it('should create successfully', () => {
    expect(service).toBeTruthy();
  });

  it('should start in closed state', () => {
    expect(service.isOpen()).toBe(false);
  });

  it('should display side panel with content', () => {
    const modalData: ModalRightModel = {
      title: 'Test Right Modal'
    };

    service.open(modalData);

    expect(service.isOpen()).toBe(true);
    expect(service.data()).toEqual(modalData);
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('should hide side panel and restore scroll', done => {
    const modalData: ModalRightModel = {
      title: 'Test Right Modal'
    };

    service.open(modalData);
    service.close();

    setTimeout(() => {
      expect(service.isOpen()).toBe(false);
      expect(document.body.style.overflow).toBe('');
      done();
    }, 700);
  });

  it('should notify when panel closed', done => {
    const modalData: ModalRightModel = {
      title: 'Test Right Modal'
    };

    service.onAfterClosed(() => {
      expect(true).toBe(true);
      done();
    });

    service.open(modalData);
    service.close();
  });

  it('should ignore close when already closed', () => {
    let emitted = false;
    service.onAfterClosed(() => {
      emitted = true;
    });

    service.close();

    expect(emitted).toBe(false);
    expect(service.isOpen()).toBe(false);
  });

  it('should handle repeated open and close cycles', done => {
    const modalData: ModalRightModel = {
      title: 'Test Right Modal'
    };

    service.open(modalData);
    expect(service.isOpen()).toBe(true);

    service.close();

    setTimeout(() => {
      expect(service.isOpen()).toBe(false);

      service.open(modalData);
      expect(service.isOpen()).toBe(true);

      service.close();

      setTimeout(() => {
        expect(service.isOpen()).toBe(false);
        done();
      }, 700);
    }, 700);
  });

  it('should manage body overflow styling correctly', done => {
    const modalData: ModalRightModel = { title: 'Test Modal' };

    service.open(modalData);
    expect(document.body.style.overflow).toBe('hidden');

    service.close();

    setTimeout(() => {
      expect(document.body.style.overflow).toBe('');
      done();
    }, 700);
  });
});
