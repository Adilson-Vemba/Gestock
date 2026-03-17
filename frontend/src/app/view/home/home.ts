import { Component, signal } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { Menu } from '../../components/menu/menu';
import { Chart } from 'chart.js/auto';
import { CommonModule } from '@angular/common';
import { StatsService } from '../../services/stats';




@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Navbar, Menu, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

  protected readonly title = signal('front-streetshop');

  statsData: any = null;

  constructor(private statsService: StatsService) { }

  ngOnInit(): void {
    this.carregarEstatisticas();
  }

  carregarEstatisticas(): void {
    this.statsService.getGraphStats().subscribe({
      next: (data) => {
        this.statsData = data;
        this.carregarGraficos();
      },
      error: (err) => console.error('Erro ao carregar estatísticas:', err)
    });
  }

  carregarGraficos(): void {
    if (!this.statsData) return;

    // Processar vendas por mês
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

    // Preparar dados de vendas
    const vendasPorMes = new Array(12).fill(0);
    if (this.statsData.salesByMonth) {
      this.statsData.salesByMonth.forEach((item: any) => {
        if (item._id >= 1 && item._id <= 12) {
          vendasPorMes[item._id - 1] = item.revenue;
        }
      });
    }

    // Preparar dados de compras
    const comprasPorMes = new Array(12).fill(0);
    if (this.statsData.purchasesByMonth) {
      this.statsData.purchasesByMonth.forEach((item: any) => {
        if (item._id >= 1 && item._id <= 12) {
          comprasPorMes[item._id - 1] = item.spent;
        }
      });
    }

    // Preparar dados de inventário
    const labelsInventario: string[] = [];
    const dadosInventario: number[] = [];
    if (this.statsData.inventoryDistribution) {
      this.statsData.inventoryDistribution.forEach((item: any) => {
        labelsInventario.push(item.name);
        dadosInventario.push(item.quantity);
      });
    }

    // Gráfico Compras
    new Chart("comprasChart", {
      type: 'bar',
      data: {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'],
        datasets: [{
          label: 'Compras',
          data: comprasPorMes,
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
          data: vendasPorMes,
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
        labels: labelsInventario,
        datasets: [{
          label: 'Inventário (Qtd)',
          data: dadosInventario,
          backgroundColor: ['#ffdd57', '#ff3860', '#3273dc']
        }]
      }
    });
  }
}
