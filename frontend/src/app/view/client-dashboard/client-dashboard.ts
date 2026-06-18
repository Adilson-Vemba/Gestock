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
  maxPrice: number = 2000000;
  categoryFilter: string = '';
  sortBy: string = 'menor_preco';

  setCategory(cat: string) {
    this.categoryFilter = cat;
  }

  get filteredProducts() {
    let filtered = this.products.filter(p => {
      const matchName = p.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchPrice = p.price <= this.maxPrice;
      const matchCategory = this.categoryFilter === '' || p.category === this.categoryFilter;
      return matchName && matchPrice && matchCategory;
    });

    if (this.sortBy === 'menor_preco') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (this.sortBy === 'maior_preco') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (this.sortBy === 'recentes') {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return filtered;
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
    this.cartService.addItem({
      productId: product.code || product._id,
      code: product.code || product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      photo: product.photo
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
