import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
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
  private charts: Chart[] = [];

  constructor(private statsService: StatsService) { }

  ngOnInit(): void {
    this.carregarEstatisticas();
  }

  carregarEstatisticas(): void {
    this.statsService.getGraphStats().subscribe({
      next: (data) => {
        this.statsData = data;
        setTimeout(() => this.carregarGraficos(), 0);
      },
      error: (err) => console.error('Erro ao carregar estatísticas:', err)
    });
  }

  carregarGraficos(): void {
    if (!this.statsData) return;

    // Destruir gráficos anteriores para evitar erros de reutilização de canvas
    this.charts.forEach(chart => chart.destroy());
    this.charts = [];

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

    // Chart Global Defaults
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.color = '#64748b';

    // Gráfico Compras
    const comprasChart = new Chart("comprasChart", {
      type: 'bar',
      data: {
        labels: meses,
        datasets: [{
          label: 'Investimento (KZ)',
          data: comprasPorMes,
          backgroundColor: '#6366f1',
          borderRadius: 8,
          barThickness: 20
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: true, grid: { color: '#f1f5f9' } },
          x: { grid: { display: false } }
        }
      }
    });
    this.charts.push(comprasChart);

    // Gráfico Vendas
    const vendasChart = new Chart("vendasChart", {
      type: 'line',
      data: {
        labels: meses,
        datasets: [{
          label: 'Receita (KZ)',
          data: vendasPorMes,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#10b981'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: true, grid: { color: '#f1f5f9' } },
          x: { grid: { display: false } }
        }
      }
    });
    this.charts.push(vendasChart);

    // Gráfico Inventário
    const inventarioChart = new Chart("inventarioChart", {
      type: 'doughnut',
      data: {
        labels: labelsInventario.length ? labelsInventario : ['Sem Dados'],
        datasets: [{
          data: dadosInventario.length ? dadosInventario : [1],
          backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#a855f7'],
          borderWidth: 0,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { usePointStyle: true, padding: 20 }
          }
        }
      }
    });
    this.charts.push(inventarioChart);
  }
}
