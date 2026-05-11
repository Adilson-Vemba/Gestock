import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService, CartItem } from '../../../services/cart.service';
import { OrderService } from '../../../services/order';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class Cart implements OnInit {
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  
  cartItems$ = this.cartService.items$;
  total = 0;

  constructor() {}

  ngOnInit() {
    this.cartItems$.subscribe(() => {
      this.total = this.cartService.total;
    });
  }

  removeItem(productId: string) {
    this.cartService.removeItem(productId);
  }

  updateQuantity(productId: string, quantity: number) {
    if (quantity < 1) return;
    this.cartService.updateQuantity(productId, quantity);
  }

  checkout() {
    const items = this.cartService.items;
    if (items.length === 0) return;

    const orderPayload = {
      products: items.map(item => ({
        code: item.code,
        quantity: item.quantity
      }))
    };

    this.orderService.createOrder(orderPayload).subscribe({
      next: (res) => {
        alert('Pedido realizado com sucesso! Fatura gerada.');
        this.cartService.clear();
      },
      error: (err) => {
        alert('Erro ao realizar pedido: ' + (err.error?.error || 'Erro desconhecido'));
      }
    });
  }
}
