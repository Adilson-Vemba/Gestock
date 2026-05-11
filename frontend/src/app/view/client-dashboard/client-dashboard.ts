import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './client-dashboard.html',
  styleUrl: './client-dashboard.scss'
})
export class ClientDashboard implements OnInit {
  private auth = inject(AuthService);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private router = inject(Router);

  userName = this.auth.getUserName();
  cartItems$ = this.cartService.items$;
  products: any[] = [];
  loading = true;
  mobileMenuOpen = false;

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  addToCart(product: any) {
    this.cartService.addItem(product);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
