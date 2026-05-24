import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService, CartItem } from '../../../services/cart.service';
import { OrderService } from '../../../services/order';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class Cart implements OnInit {
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private notify = inject(NotificationService);
  
  cartItems$ = this.cartService.items$;
  total = 0;
  showPaymentModal = false;
  paymentMethod = 'numerario';

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

  processarPagamento() {
    const items = this.cartService.items;
    if (items.length === 0) return;

    const orderPayload = {
      products: items.map(item => ({
        code: item.code,
        quantity: item.quantity
      })),
      paymentMethod: this.paymentMethod
    };

    this.orderService.createOrder(orderPayload).subscribe({
      next: (res) => {
        this.notify.success('Pedido realizado com sucesso! Fatura gerada.');
        this.cartService.clear();
        this.showPaymentModal = false;
      },
      error: (err) => {
        this.notify.error('Erro ao realizar pedido: ' + (err.error?.error || 'Erro desconhecido'));
        this.showPaymentModal = false;
      }
    });
  }

  checkout() {
    if (this.cartService.items.length === 0) {
      this.notify.warning('O carrinho está vazio!');
      return;
    }
    this.showPaymentModal = true;
  }
}
