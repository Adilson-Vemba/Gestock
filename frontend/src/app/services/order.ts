import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private API_URL = 'http://localhost:8080/orders';

    constructor(private http: HttpClient) { }

    getOrders(): Observable<any> {
        return this.http.get<any>(this.API_URL);
    }

    getOrder(id: string): Observable<any> {
        return this.http.get<any>(`${this.API_URL}/${id}`);
    }

    createOrder(order: any): Observable<any> {
        return this.http.post<any>(this.API_URL, order);
    }
}
