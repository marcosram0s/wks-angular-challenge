import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface RequestOptions {
  headers?: HttpHeaders;
  params?: HttpParams;
}

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  private http = inject(HttpClient);

  public get<T>(path: string, options?: RequestOptions): Observable<T> {
    return this.http.get<T>(path, {
      headers: options?.headers,
      params: options?.params
    });
  }

  public post<T, P>(path: string, payload: P, options?: RequestOptions): Observable<T> {
    return this.http.post<T>(path, payload, {
      headers: options?.headers,
      params: options?.params
    });
  }

  public put<T, P>(path: string, payload: P, options?: RequestOptions): Observable<T> {
    return this.http.put<T>(path, payload, {
      headers: options?.headers,
      params: options?.params
    });
  }

  public delete<T>(path: string, options?: RequestOptions): Observable<T> {
    return this.http.delete<T>(path, {
      headers: options?.headers,
      params: options?.params
    });
  }
}
