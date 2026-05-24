import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private API_URL = 'http://localhost:8080/products';

    constructor(private http: HttpClient) { }

    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
    }

    getProducts(): Observable<any[]> {
        return this.http.get<any[]>(this.API_URL);
    }

    getTopSellers(): Observable<any[]> {
        return this.http.get<any[]>(`${this.API_URL}/top-sellers`);
    }

    getProduct(code: string): Observable<any> {
        return this.http.get<any>(`${this.API_URL}/${code}`);
    }

    createProduct(product: any): Observable<any> {
        return this.http.post<any>(this.API_URL, product, { headers: this.getHeaders() });
    }

    updateProduct(code: string, product: any): Observable<any> {
        return this.http.patch<any>(`${this.API_URL}/${code}`, product, { headers: this.getHeaders() });
    }

    deleteProduct(code: string): Observable<any> {
        return this.http.delete<any>(`${this.API_URL}/${code}`, { headers: this.getHeaders() });
    }
}
