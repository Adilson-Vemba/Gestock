import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { Menu } from '../../components/menu/menu';
import { OrderService } from '../../services/order';

@Component({
  selector: 'app-venda',
  imports: [CommonModule, Navbar, Menu],
  templateUrl: './venda.html',
  styleUrl: './venda.scss'
})
export class Venda implements OnInit {

  sales: any[] = [];

  constructor(private orderService: OrderService) { }

  ngOnInit() {
    this.carregarVendas();
  }

  carregarVendas() {
    this.orderService.getOrders().subscribe({
      next: (data) => {
        // Assume API returns { orders: [...] } based on api.js
        this.sales = data.orders || [];
      },
      error: (err) => {
        console.error('Erro ao carregar vendas:', err);
      }
    });
  }

}
