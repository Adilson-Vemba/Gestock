import { CommonModule } from '@angular/common';
import { OnInit, Component } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { Navbar } from '../../components/navbar/navbar';
import { Menu } from '../../components/menu/menu';
import { StatsService } from '../../services/stats';

@Component({
  selector: 'app-relatorio',
  standalone: true,
  imports: [CommonModule, Navbar, Menu],
  templateUrl: './relatorio.html',
  styleUrl: './relatorio.scss'
})
export class Relatorio implements OnInit {

  mostSold: any[] = [];
  leastSold: any[] = [];
  statsData: any = null;

  constructor(private statsService: StatsService) { }

  ngOnInit(): void {
    this.carregarEstatisticas();
  }

  carregarEstatisticas(): void {
    this.statsService.getGraphStats().subscribe({
      next: (data) => {
        this.statsData = data;
        this.mostSold = data.topProducts || [];
        this.leastSold = data.leastSold || [];
        this.carregarGraficos();
      },
      error: (err) => console.error('Erro ao carregar estatísticas:', err)
    });
  }

  carregarGraficos() {
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

    this.createSalesChart(meses, vendasPorMes);
    this.createPurchasesChart(meses, comprasPorMes);
  }

  createSalesChart(labels: string[] = [], data: number[] = []) {
    const ctx = document.getElementById('salesChart') as HTMLCanvasElement;
    if (!ctx) return;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Vendas (Kz)',
          data: data,
          borderColor: '#3498db;',
          backgroundColor: 'rgba(0,209,178,0.2)',
          fill: true,
          tension: 0.3
        }]
      },
      options: { responsive: true, plugins: { legend: { display: false } } }
    });
  }

  createPurchasesChart(labels: string[] = [], data: number[] = []) {
    const ctx = document.getElementById('purchasesChart') as HTMLCanvasElement;
    if (!ctx) return;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Compras (Kz)',
          data: data,
          backgroundColor: '#f39c12'
        }]
      },
      options: { responsive: true, plugins: { legend: { display: false } } }
    });
  }



}