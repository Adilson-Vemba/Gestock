import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private API_URL = 'http://localhost:8080/products';

    constructor(private http: HttpClient) { }

    getProducts(): Observable<any[]> {
        return this.http.get<any[]>(this.API_URL);
    }

    getProduct(code: string): Observable<any> {
        return this.http.get<any>(`${this.API_URL}/${code}`);
    }

    createProduct(product: any): Observable<any> {
        return this.http.post<any>(this.API_URL, product);
    }

    updateProduct(code: string, product: any): Observable<any> {
        return this.http.patch<any>(`${this.API_URL}/${code}`, product);
    }
}
