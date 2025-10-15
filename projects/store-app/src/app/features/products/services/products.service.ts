import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { BaseService } from '../../../core/services/base.service';
import { Category, Product, PRODUCTS_CONSTANTS } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly apiUrl = `${environment.apiUrl}${environment.endpoints.products}`;
  private readonly categoriesUrl = `${environment.apiUrl}${environment.endpoints.categories}`;
  private readonly baseService = inject(BaseService);

  private readonly apiUrlToError = 'https://invalid-api-url.com/products';

  getAllCategories(): Observable<Category[]> {
    return this.baseService.get<Category[]>(this.categoriesUrl);
  }

  getAllProducts(): Observable<Product[]> {
    return this.baseService.get<Product[]>(this.apiUrl).pipe(
      map(products =>
        products.map(p => ({
          ...p,
          image: p.image || PRODUCTS_CONSTANTS.DEFAULT_IMAGE
        }))
      )
    );
  }

  createProduct(product: Omit<Product, 'id'>): Observable<Product> {
    return this.baseService.post<Product, Omit<Product, 'id'>>(this.apiUrl, product);
  }

  updateProduct(product: Product): Observable<Product> {
    return this.baseService.put<Product, Product>(`${this.apiUrl}/${product.id}`, product);
  }

  deleteProduct(id: number): Observable<Product['id']> {
    return this.baseService.delete<number>(`${this.apiUrl}/${id}`);
  }
}
