import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private API_URL = 'http://localhost:8080/orders';

    constructor(private http: HttpClient) { }

    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
    }

    getOrders(): Observable<any> {
        return this.http.get<any>(this.API_URL, { headers: this.getHeaders() });
    }

    getOrder(id: string): Observable<any> {
        return this.http.get<any>(`${this.API_URL}/${id}`);
    }

    createOrder(order: any): Observable<any> {
        return this.http.post<any>(this.API_URL, order);
    }

    getMyOrders(email: string): Observable<any> {
        return this.http.get<any>(`${this.API_URL}/my-orders?email=${email}`);
    }

    approveOrder(id: string): Observable<any> {
        return this.http.patch<any>(`${this.API_URL}/${id}/approve`, {}, { headers: this.getHeaders() });
    }
}
