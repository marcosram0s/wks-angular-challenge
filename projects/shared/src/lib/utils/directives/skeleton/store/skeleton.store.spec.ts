import { TestBed } from '@angular/core/testing';
import { SkeletonStore } from './skeleton.store';

describe('SkeletonStore', () => {
  let store: InstanceType<typeof SkeletonStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(SkeletonStore);
  });

  it('should create', () => {
    expect(store).toBeTruthy();
  });

  it('should start with loading false', () => {
    expect(store.loading()).toBe(false);
  });

  it('should show loading', () => {
    store.show();
    expect(store.loading()).toBe(true);
  });

  it('should hide loading', () => {
    store.show();
    store.hide();
    expect(store.loading()).toBe(false);
  });

  it('should toggle loading state', () => {
    expect(store.loading()).toBe(false);

    store.toggle();
    expect(store.loading()).toBe(true);

    store.toggle();
    expect(store.loading()).toBe(false);
  });

  it('should set loading state directly', () => {
    store.setLoading(true);
    expect(store.loading()).toBe(true);

    store.setLoading(false);
    expect(store.loading()).toBe(false);
  });
});
