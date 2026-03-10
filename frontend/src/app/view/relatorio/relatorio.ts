import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { Navbar } from '../../components/navbar/navbar';
import { Menu } from '../../components/menu/menu';

@Component({
  selector: 'app-relatorio',
  imports: [CommonModule, Navbar, Menu],
  templateUrl: './relatorio.html',
  styleUrl: './relatorio.scss'
})
export class Relatorio implements AfterViewInit {

 mostSold = [
    { name: 'Camisa Social Masculina', quantity: 120 },
    { name: 'T-shirt Básica', quantity: 95 },
    { name: 'Calça Jeans Feminina', quantity: 75 }
  ];

  leastSold = [
    { name: 'Chapéu de Praia', quantity: 5 },
    { name: 'Meias Esportivas', quantity: 8 },
    { name: 'Cinto de Couro', quantity: 10 }
  ];

  ngAfterViewInit(): void {
    this.createSalesChart();
    this.createPurchasesChart();
  }

  createSalesChart() {
    const ctx = document.getElementById('salesChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
        datasets: [{
          label: 'Vendas (Kz)',
          data: [45000, 78000, 32000, 91000, 50000, 67000],
          borderColor: '#3498db;',
          backgroundColor: 'rgba(0,209,178,0.2)',
          fill: true,
          tension: 0.3
        }]
      },
      options: { responsive: true, plugins: { legend: { display: false } } }
    });
  }

  createPurchasesChart() {
    const ctx = document.getElementById('purchasesChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
        datasets: [{
          label: 'Compras (Kz)',
          data: [25000, 40000, 38000, 45000, 30000, 50000],
          backgroundColor: '#f39c12'
        }]
      },
      options: { responsive: true, plugins: { legend: { display: false } } }
    });
  }



}