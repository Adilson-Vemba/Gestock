import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../../services/product';
import { CartService, CartItem } from '../../../services/cart.service';
import { AuthService } from '../../../services/auth';
import { Router } from '@angular/router';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss'
})
export class ProductDetail implements OnInit {
  product: any;
  loading = true;
  quantity = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private notify: NotificationService
  ) {}

  ngOnInit() {
    const code = this.route.snapshot.paramMap.get('code');
    if (code) {
      this.loadProduct(code);
    }
  }

  loadProduct(code: string) {
    this.productService.getProduct(code).subscribe({
      next: (data) => {
        this.product = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading product', err);
        this.loading = false;
      }
    });
  }

  updateQuantity(val: number) {
    if (this.quantity + val < 1) return;
    this.quantity += val;
  }

  addToCart() {
    if (!this.authService.isLoggedIn()) {
      this.notify.warning('Por favor, faça login para realizar compras.');
      this.router.navigate(['/login']);
      return;
    }
    
    if (!this.product) return;
    const item: CartItem = {
      productId: this.product._id,
      code: this.product.code,
      name: this.product.name,
      price: this.product.price,
      quantity: this.quantity,
      photo: this.product.photo
    };
    this.cartService.addItem(item);
    this.notify.success('Produto adicionado ao carrinho!');
  }
}
