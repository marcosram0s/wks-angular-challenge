import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BaseService } from '../../../core/services/base.service';
import { Category, Product, PRODUCTS_CONSTANTS } from '../models/product.model';
import { ProductService } from './products.service';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService, BaseService]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Categories Management', () => {
    it('should fetch all product categories from API', () => {
      const mockCategories: Category[] = ['electronics', 'jewelery', "men's clothing"];

      service.getAllCategories().subscribe(categories => {
        expect(categories).toEqual(mockCategories);
        expect(categories.length).toBe(3);
      });

      const req = httpMock.expectOne('https://fakestoreapi.com/products/categories');
      expect(req.request.method).toBe('GET');
      req.flush(mockCategories);
    });
  });

  describe('Products Retrieval', () => {
    it('should fetch all products and apply default image for missing ones', () => {
      const mockProducts: Product[] = [
        {
          id: 1,
          title: 'Product without image',
          price: 100,
          description: 'Description',
          category: 'electronics',
          image: '',
          rating: { rate: 4.5, count: 10 }
        },
        {
          id: 2,
          title: 'Product with image',
          price: 200,
          description: 'Description 2',
          category: 'jewelery',
          image: 'https://example.com/image.jpg',
          rating: { rate: 4.0, count: 5 }
        }
      ];

      service.getAllProducts().subscribe(products => {
        expect(products[0].image).toBe(PRODUCTS_CONSTANTS.DEFAULT_IMAGE);
        expect(products[1].image).toBe('https://example.com/image.jpg');
      });

      const req = httpMock.expectOne('https://fakestoreapi.com/products');
      expect(req.request.method).toBe('GET');
      req.flush(mockProducts);
    });

    it('should handle empty product list', () => {
      const emptyProducts: Product[] = [];

      service.getAllProducts().subscribe(products => {
        expect(products).toEqual([]);
        expect(products.length).toBe(0);
      });

      const req = httpMock.expectOne('https://fakestoreapi.com/products');
      req.flush(emptyProducts);
    });
  });

  describe('Product Creation', () => {
    it('should create new product with correct payload', () => {
      const newProduct: Omit<Product, 'id'> = {
        title: 'New Product',
        price: 50,
        description: 'New Description',
        category: 'electronics',
        image: 'image.jpg',
        rating: { rate: 0, count: 0 }
      };
      const createdProduct: Product = { ...newProduct, id: 21 };

      service.createProduct(newProduct).subscribe(product => {
        expect(product).toEqual(createdProduct);
        expect(product.id).toBeDefined();
      });

      const req = httpMock.expectOne('https://fakestoreapi.com/products');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newProduct);
      req.flush(createdProduct);
    });
  });

  describe('Product Updates', () => {
    it('should update existing product correctly', () => {
      const productToUpdate: Product = {
        id: 1,
        title: 'Updated Product',
        price: 75,
        description: 'Updated Description',
        category: 'electronics',
        image: 'updated-image.jpg',
        rating: { rate: 4.0, count: 20 }
      };

      service.updateProduct(productToUpdate).subscribe(product => {
        expect(product).toEqual(productToUpdate);
      });

      const req = httpMock.expectOne('https://fakestoreapi.com/products/1');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(productToUpdate);
      req.flush(productToUpdate);
    });
  });

  describe('Product Deletion', () => {
    it('should delete product by ID', () => {
      const productId = 1;

      service.deleteProduct(productId).subscribe(result => {
        expect(result).toBeDefined();
      });

      const req = httpMock.expectOne('https://fakestoreapi.com/products/1');
      expect(req.request.method).toBe('DELETE');
      req.flush(productId);
    });
  });
});
