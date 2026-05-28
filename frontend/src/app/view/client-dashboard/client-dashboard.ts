import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
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
  
  // Filtros
  searchTerm: string = '';
  maxPrice: number = 200000;

  get filteredProducts() {
    return this.products.filter(p => {
      const matchName = p.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchPrice = p.price <= this.maxPrice;
      return matchName && matchPrice;
    });
  }

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
