import { Component, signal } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { Menu } from '../../components/menu/menu';
import { Chart } from 'chart.js/auto';
import { CommonModule } from '@angular/common';




@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Navbar, Menu, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

  protected readonly title = signal('front-streetshop');

  ngOnInit(): void {
    this.carregarGraficos();
  }

  carregarGraficos(): void {
    // Gráfico Compras
    new Chart("comprasChart", {
      type: 'bar',
      data: {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'],
        datasets: [{
          label: 'Compras',
          data: [12, 19, 3, 5, 2],
          backgroundColor: '#209cee'
        }]
      }
    });

    // Gráfico Vendas
    new Chart("vendasChart", {
      type: 'line',
      data: {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'],
        datasets: [{
          label: 'Vendas',
          data: [5, 15, 8, 12, 7],
          borderColor: '#23d160',
          backgroundColor: 'rgba(35,209,96,0.2)',
          fill: true
        }]
      }
    });

    // Gráfico Inventário
    new Chart("inventarioChart", {
      type: 'doughnut',
      data: {
        labels: ['Estoque A', 'Estoque B', 'Estoque C'],
        datasets: [{
          label: 'Inventário',
          data: [30, 50, 20],
          backgroundColor: ['#ffdd57', '#ff3860', '#3273dc']
        }]
      }
    });
  }
}
