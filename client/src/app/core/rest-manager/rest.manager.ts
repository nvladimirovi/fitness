import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface HttpRestManagerOptions {
  headers?: HttpHeaders | {
      [header: string]: string | string[];
  };
  observe?: 'body';
  params?: HttpParams | {
      [param: string]: string | string[];
  };
  reportProgress?: boolean;
  responseType: 'arraybuffer';
  withCredentials?: boolean;
}

@Injectable()
export class RestManager {
  constructor(private http: HttpClient) {}

  get(url: string, options: HttpRestManagerOptions): Observable<ArrayBuffer> {
    return this.http.get(url, options);
  }

  post(url: string, body: any, options: HttpRestManagerOptions): Observable<ArrayBuffer> {
    return this.http.post(url, body, options);
  }

  put(url: string, body: any, options: HttpRestManagerOptions): Observable<ArrayBuffer> {
    return this.http.put(url, body, options);
  }

  delete(url: string, options: HttpRestManagerOptions): Observable<ArrayBuffer> {
    return this.http.delete(url, options);
  }
}
