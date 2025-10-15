import { TestBed } from '@angular/core/testing';
import { ToastStore } from './toast.store';

describe('ToastStore', () => {
  let store: InstanceType<typeof ToastStore>;

  beforeEach(() => {
    jest.useFakeTimers();
    TestBed.configureTestingModule({});
    store = TestBed.inject(ToastStore);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should create successfully', () => {
    expect(store).toBeTruthy();
  });

  it('should start with no notifications', () => {
    expect(store.toasts()).toEqual([]);
  });

  it('should display new notification', () => {
    const toastData = {
      type: 'success' as const,
      message: 'Test message',
      duration: 1000
    };

    store.show(toastData);

    const toasts = store.toasts();
    expect(toasts.length).toBe(1);
    expect(toasts[0].type).toBe('success');
    expect(toasts[0].message).toBe('Test message');
    expect(toasts[0].duration).toBe(1000);
    expect(toasts[0].id).toBeDefined();
  });

  it('should dismiss specific notification', () => {
    const toastData = {
      type: 'error' as const,
      message: 'Error message'
    };

    store.show(toastData);
    const toastId = store.toasts()[0].id;

    store.remove(toastId);

    expect(store.toasts().length).toBe(0);
  });

  it('should clear all notifications', () => {
    store.show({ type: 'success', message: 'Message 1' });
    store.show({ type: 'warning', message: 'Message 2' });

    expect(store.toasts().length).toBe(2);

    store.clearAll();

    expect(store.toasts().length).toBe(0);
  });

  it('should auto-dismiss after specified duration', () => {
    const toastData = {
      type: 'success' as const,
      message: 'Auto remove test',
      duration: 100
    };

    store.show(toastData);
    expect(store.toasts().length).toBe(1);

    jest.advanceTimersByTime(100);

    expect(store.toasts().length).toBe(0);
  });

  it('should use default duration when not specified', () => {
    const toastData = {
      type: 'success' as const,
      message: 'Default duration test'
    };

    store.show(toastData);
    expect(store.toasts().length).toBe(1);

    jest.advanceTimersByTime(3000);

    expect(store.toasts().length).toBe(0);
  });

  it('should assign unique identifiers to notifications', () => {
    store.show({ type: 'success', message: 'Message 1' });
    store.show({ type: 'warning', message: 'Message 2' });

    const toasts = store.toasts();
    expect(toasts[0].id).not.toBe(toasts[1].id);
  });
});
