import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SupplierService {
    private API_URL = 'http://localhost:8080/suppliers';

    constructor(private http: HttpClient) { }

    getSuppliers(): Observable<any> {
        return this.http.get<any>(this.API_URL);
    }

    createSupplier(supplier: any): Observable<any> {
        return this.http.post<any>(this.API_URL, supplier);
    }

    deleteSupplier(id: string): Observable<any> {
        return this.http.delete<any>(`${this.API_URL}/${id}`);
    }

    createRequest(supplierId: string, products: any[]): Observable<any> {
        return this.http.post<any>(`${this.API_URL}/${supplierId}/request`, { products });
    }

    getHistory(): Observable<any> {
        return this.http.get<any>(`${this.API_URL}/history`);
    }
}
