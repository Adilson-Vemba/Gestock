import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../services/product';
import { CartService, CartItem } from '../../../services/cart.service';
import { AuthService } from '../../../services/auth';
import { Router } from '@angular/router';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-store-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './store-home.html',
  styleUrl: './store-home.scss'
})
export class StoreHome implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private notify = inject(NotificationService);

  products: any[] = [];
  topSellers: any[] = [];
  loading = true;
  cartItems$ = this.cartService.items$;

  get isAdmin() {
    return this.authService.isAdmin();
  }

  get isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  get isClient() {
    return this.authService.isLoggedIn() && !this.authService.isAdmin();
  }

  constructor() {}

  ngOnInit() {
    // Se o usuário já estiver logado, redireciona para o painel correto
    if (this.isLoggedIn) {
      if (this.isAdmin) {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/dashboard']);
      }
      return;
    }
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getTopSellers().subscribe({
      next: (data) => {
        this.topSellers = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading top sellers', err);
        this.loading = false;
      }
    });
  }

  addToCart(product: any) {
    if (!this.isLoggedIn) {
      this.notify.warning('Por favor, faça login para realizar compras.');
      this.router.navigate(['/login']);
      return;
    }

    const item: CartItem = {
      productId: product._id,
      code: product.code,
      name: product.name,
      price: product.price,
      quantity: 1,
      photo: product.photo
    };
    this.cartService.addItem(item);
    this.notify.success('Produto adicionado ao carrinho!');
  }
}
