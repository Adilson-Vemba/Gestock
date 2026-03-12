import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { Menu } from '../../components/menu/menu';
import { OrderService } from '../../services/order';

@Component({
  selector: 'app-venda',
  standalone: true,
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
        this.sales = data.orders || [];
      },
      error: (err) => {
        console.error('Erro ao carregar vendas:', err);
      }
    });
  }

  novaVenda() {
    alert('Funcionalidade de Nova Venda em desenvolvimento (abrirá modal de seleção de produtos)');
  }

  filtrar() {
    alert('Filtro de vendas clicado');
  }

  verDetalhes(sale: any) {
    alert(`Detalhes da venda ${sale.id || sale._id}`);
  }

  verFatura(sale: any) {
    alert(`Gerando fatura para a venda ${sale.id || sale._id}`);
  }

}
