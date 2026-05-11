import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  productId: string;
  code: string;
  name: string;
  price: number;
  quantity: number;
  photo?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  items$ = this.itemsSubject.asObservable();

  get items(): CartItem[] {
    return this.itemsSubject.value;
  }

  addItem(item: CartItem) {
    const existing = this.items.find(i => i.productId === item.productId);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      this.itemsSubject.next([...this.items, item]);
    }
    this.itemsSubject.next([...this.items]);
  }

  removeItem(productId: string) {
    this.itemsSubject.next(this.items.filter(i => i.productId !== productId));
  }

  clear() {
    this.itemsSubject.next([]);
  }

  updateQuantity(productId: string, quantity: number) {
    const items = this.items.map(i => {
      if (i.productId === productId) {
        return { ...i, quantity };
      }
      return i;
    });
    this.itemsSubject.next(items);
  }

  get total(): number {
    return this.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  }
}
