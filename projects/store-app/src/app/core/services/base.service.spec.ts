import { HttpHeaders, HttpParams } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BaseService } from './base.service';

describe('BaseService', () => {
  let service: BaseService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BaseService]
    });
    service = TestBed.inject(BaseService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('get', () => {
    it('should make GET request', () => {
      const mockData = { id: 1, name: 'Test' };

      service.get<typeof mockData>('/api/test').subscribe(data => {
        expect(data).toEqual(mockData);
      });

      const req = httpMock.expectOne('/api/test');
      expect(req.request.method).toBe('GET');
      req.flush(mockData);
    });

    it('should include headers and params', () => {
      const headers = new HttpHeaders({ Authorization: 'Bearer token' });
      const params = new HttpParams().set('page', '1');

      service.get('/api/test', { headers, params }).subscribe();

      const req = httpMock.expectOne('/api/test?page=1');
      expect(req.request.headers.get('Authorization')).toBe('Bearer token');
      req.flush({});
    });
  });

  describe('post', () => {
    it('should make POST request with payload', () => {
      const payload = { name: 'New Item' };
      const mockResponse = { id: 1, name: 'New Item' };

      service.post('/api/test', payload).subscribe(data => {
        expect(data).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('/api/test');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(payload);
      req.flush(mockResponse);
    });

    it('should include headers and params', () => {
      const payload = { name: 'Test' };
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      const params = new HttpParams().set('category', 'electronics');

      service.post('/api/test', payload, { headers, params }).subscribe();

      const req = httpMock.expectOne('/api/test?category=electronics');
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      req.flush({});
    });
  });

  describe('put', () => {
    it('should make PUT request with payload', () => {
      const payload = { id: 1, name: 'Updated Item' };
      const mockResponse = { id: 1, name: 'Updated Item' };

      service.put('/api/test/1', payload).subscribe(data => {
        expect(data).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('/api/test/1');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(payload);
      req.flush(mockResponse);
    });

    it('should include headers and params', () => {
      const payload = { name: 'Test' };
      const headers = new HttpHeaders({ 'If-Match': 'etag123' });
      const params = new HttpParams().set('upsert', 'true');

      service.put('/api/test/1', payload, { headers, params }).subscribe();

      const req = httpMock.expectOne('/api/test/1?upsert=true');
      expect(req.request.headers.get('If-Match')).toBe('etag123');
      req.flush({});
    });
  });

  describe('delete', () => {
    it('should make DELETE request', () => {
      const mockResponse = { success: true };

      service.delete('/api/test/1').subscribe(data => {
        expect(data).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('/api/test/1');
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });

    it('should include headers and params', () => {
      const headers = new HttpHeaders({ Authorization: 'Bearer token' });
      const params = new HttpParams().set('force', 'true');

      service.delete('/api/test/1', { headers, params }).subscribe();

      const req = httpMock.expectOne('/api/test/1?force=true');
      expect(req.request.headers.get('Authorization')).toBe('Bearer token');
      req.flush({});
    });
  });
});
