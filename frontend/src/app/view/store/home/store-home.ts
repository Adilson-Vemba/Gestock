import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../services/product';
import { CartService, CartItem } from '../../../services/cart.service';

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

  products: any[] = [];
  featuredProducts: any[] = [];
  loading = true;
  cartItems$ = this.cartService.items$;

  constructor() {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.featuredProducts = data.slice(0, 3);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading products', err);
        this.loading = false;
      }
    });
  }

  addToCart(product: any) {
    const item: CartItem = {
      productId: product._id,
      code: product.code,
      name: product.name,
      price: product.price,
      quantity: 1,
      photo: product.photo
    };
    this.cartService.addItem(item);
    alert('Produto adicionado ao carrinho!');
  }
}
