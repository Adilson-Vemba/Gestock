import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService, CartItem } from '../../../services/cart.service';
import { OrderService } from '../../../services/order';
import { NotificationService } from '../../../services/notification.service';
import { Router } from '@angular/router';

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
  private router = inject(Router);
  
  cartItems$ = this.cartService.items$;
  total = 0;
  showPaymentModal = false;
  paymentMethod = 'numerario';
  
  customerInfo = { name: '', phone: '', email: '' };
  isProcessingPayment = false;
  showReceiptModal = false;
  receiptData: any = null;

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

    this.isProcessingPayment = true;

    // Simulação do gateway de pagamento ou processamento local
    setTimeout(() => {
      const isCard = this.paymentMethod === 'cartao';
      const statusText = isCard ? 'Pago via Cartão' : 'Aguarda Pagamento Presencial';
      const refNumber = 'REF-' + Math.floor(100000 + Math.random() * 900000);

      const orderPayload = {
        products: items.map(item => ({
          code: item.code,
          quantity: item.quantity
        })),
        paymentMethod: this.paymentMethod,
        customerName: this.customerInfo.name,
        customerPhone: this.customerInfo.phone,
        customerEmail: this.customerInfo.email,
        paymentStatus: statusText,
        reference: refNumber
      };

      this.orderService.createOrder(orderPayload).subscribe({
        next: (res) => {
          this.isProcessingPayment = false;
          this.showPaymentModal = false;
          
          this.receiptData = {
            reference: refNumber,
            status: statusText,
            date: new Date(),
            total: this.total
          };
          this.showReceiptModal = true;
          this.cartService.clear();
        },
        error: (err) => {
          this.isProcessingPayment = false;
          this.notify.error('Erro ao realizar pedido: ' + (err.error?.error || 'Erro desconhecido'));
        }
      });
    }, 2000); // 2 segundos de simulação
  }

  fecharRecibo() {
    this.showReceiptModal = false;
    this.router.navigate(['/']);
  }

  checkout() {
    if (this.cartService.items.length === 0) {
      this.notify.warning('O carrinho está vazio!');
      return;
    }
    this.showPaymentModal = true;
  }
}
