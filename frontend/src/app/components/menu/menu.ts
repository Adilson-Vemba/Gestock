import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { OrderService } from '../../services/order';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './menu.html',
  styleUrl: './menu.scss'
})
export class Menu {
  hasNewSales = false;
  private lastOrderCount = 0;

  constructor(private orderService: OrderService) {
    this.checkNewSales();
    setInterval(() => this.checkNewSales(), 10000);
  }

  checkNewSales() {
    this.orderService.getOrders().subscribe({
      next: (res: any) => {
        const count = res.orders?.length || 0;
        if (this.lastOrderCount > 0 && count > this.lastOrderCount) {
          this.hasNewSales = true;
        }
        this.lastOrderCount = count;
      }
    });
  }

  clearBadge() {
    this.hasNewSales = false;
  }
}
