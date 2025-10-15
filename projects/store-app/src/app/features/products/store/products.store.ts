import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { ToastStore } from '@shared/ui';
import { SkeletonStore } from '@shared/utils';
import { catchError, debounceTime, delay, of, pipe, switchMap, tap } from 'rxjs';
import { Category, Product, ProductsState, PRODUCTS_CONSTANTS } from '../models/product.model';
import { ProductService } from '../services/products.service';

export const ProductsStore = signalStore(
  { providedIn: 'root' },
  withState<ProductsState>({
    allProducts: null,
    products: [],
    categories: [],
    productToEdit: null,
    searchTerm: ''
  }),
  withComputed(store => ({
    dataLoaded: computed(() => {
      const data = store.allProducts();
      return data !== null;
    }),
    filteredProducts: computed(() => {
      const source = store.allProducts();
      const term = store.searchTerm().toLowerCase();

      if (!source || source === null) {
        return [];
      }

      if (!term) {
        return source;
      }

      return source.filter(product => product.title.toLowerCase().includes(term));
    })
  })),
  withMethods(
    (
      store,
      productService = inject(ProductService),
      skeletonStore = inject(SkeletonStore),
      toastStore = inject(ToastStore)
    ) => ({
      loadProducts: rxMethod<void>(
        pipe(
          tap(() => {
            if (!store.dataLoaded()) {
              skeletonStore.show();
            }
          }),
          switchMap(() =>
            productService.getAllProducts().pipe(
              tap(products => {
                skeletonStore.hide();
                patchState(store, {
                  allProducts: products,
                  products: products
                });
              }),
              catchError(() => {
                skeletonStore.hide();
                toastStore.show({
                  type: PRODUCTS_CONSTANTS.TOAST_TYPES.ERROR,
                  message: PRODUCTS_CONSTANTS.TOAST_MESSAGES.LOAD_ERROR,
                  duration: PRODUCTS_CONSTANTS.TOAST_DURATION
                });
                patchState(store, {
                  allProducts: null,
                  products: []
                });
                return of(null);
              })
            )
          )
        )
      ),

      loadCategories: rxMethod<void>(
        pipe(
          switchMap(() =>
            productService.getAllCategories().pipe(
              tap(categories => {
                patchState(store, { categories });
              }),
              catchError(() => {
                toastStore.show({
                  type: PRODUCTS_CONSTANTS.TOAST_TYPES.ERROR,
                  message: PRODUCTS_CONSTANTS.TOAST_MESSAGES.CATEGORIES_ERROR,
                  duration: PRODUCTS_CONSTANTS.TOAST_DURATION
                });
                return of([] as Category[]);
              })
            )
          )
        )
      ),

      setSearchTerm: rxMethod<string>(
        pipe(
          debounceTime(PRODUCTS_CONSTANTS.SEARCH_DEBOUNCE_TIME),
          tap(term => {
            if (term && term.length > 0) {
              skeletonStore.show();
            }
            patchState(store, { searchTerm: term });
          }),
          // Simula chamada à API com filtros
          switchMap(term =>
            of(null).pipe(
              delay(term && term.length > 0 ? PRODUCTS_CONSTANTS.SEARCH_API_DELAY : 0),
              tap(() => {
                const filtered = store.filteredProducts();
                patchState(store, { products: filtered });
                if (term && term.length > 0) {
                  skeletonStore.hide();
                }
              })
            )
          )
        )
      ),

      clearSearch(): void {
        patchState(store, { searchTerm: '' });
        const source = store.allProducts();
        if (source !== null) {
          patchState(store, { products: source });
        }
      },

      setProductToEdit(product: Product | null): void {
        patchState(store, { productToEdit: product });
      },

      saveProduct: rxMethod<Product>(
        pipe(
          tap(() => skeletonStore.show()),
          switchMap(product => {
            const action$ = product.id ? productService.updateProduct(product) : productService.createProduct(product);

            return action$.pipe(
              switchMap(() => productService.getAllProducts()),
              tap(products => {
                skeletonStore.hide();
                patchState(store, { allProducts: products, products });
                toastStore.show({
                  type: PRODUCTS_CONSTANTS.TOAST_TYPES.SUCCESS,
                  message: product.id
                    ? PRODUCTS_CONSTANTS.TOAST_MESSAGES.UPDATE_SUCCESS
                    : PRODUCTS_CONSTANTS.TOAST_MESSAGES.CREATE_SUCCESS,
                  duration: PRODUCTS_CONSTANTS.TOAST_DURATION
                });
              }),
              catchError(() => {
                skeletonStore.hide();
                toastStore.show({
                  type: PRODUCTS_CONSTANTS.TOAST_TYPES.ERROR,
                  message: product.id
                    ? PRODUCTS_CONSTANTS.TOAST_MESSAGES.UPDATE_ERROR
                    : PRODUCTS_CONSTANTS.TOAST_MESSAGES.CREATE_ERROR,
                  duration: PRODUCTS_CONSTANTS.TOAST_DURATION
                });
                return of(null);
              })
            );
          })
        )
      ),

      deleteProduct: rxMethod<number>(
        pipe(
          switchMap(productId =>
            productService.deleteProduct(productId).pipe(
              tap(() => {
                const currentProducts = store.products();
                patchState(store, {
                  products: currentProducts.filter(p => p.id !== productId)
                });

                toastStore.show({
                  type: PRODUCTS_CONSTANTS.TOAST_TYPES.SUCCESS,
                  message: PRODUCTS_CONSTANTS.TOAST_MESSAGES.DELETE_SUCCESS,
                  duration: PRODUCTS_CONSTANTS.TOAST_DURATION
                });
              }),

              catchError(() => {
                toastStore.show({
                  type: PRODUCTS_CONSTANTS.TOAST_TYPES.ERROR,
                  message: PRODUCTS_CONSTANTS.TOAST_MESSAGES.DELETE_ERROR,
                  duration: PRODUCTS_CONSTANTS.TOAST_DURATION
                });
                return of(null);
              })
            )
          )
        )
      ),

      findProductById(productId: number): Product | undefined {
        return store.products().find(p => p.id === productId);
      }
    })
  ),
  withHooks({
    onInit(store) {
      store.loadProducts();
      store.loadCategories();
    }
  })
);
