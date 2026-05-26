import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  pageTitle: string = 'Gestock';

  constructor(
    private router: Router,
    private authService: AuthService
  ) { 
    this.router.events.subscribe(() => {
      const segments = this.router.url.split('/').filter(Boolean);
      // Determine page title based on route hierarchy
      let titleKey = '';
      if (segments[0] === 'admin') {
        titleKey = segments[1] || '';
      } else {
        titleKey = segments[0] || '';
      }
      switch (titleKey) {
        case 'admin': this.pageTitle = 'Dashboard'; break;
        case 'inventario': this.pageTitle = 'Gestão de Inventário'; break;
        case 'compra': this.pageTitle = 'Compras / Entradas'; break;
        case 'venda': this.pageTitle = 'Histórico de Vendas'; break;
        case 'relatorio': this.pageTitle = 'Relatórios Financeiros'; break;
        default: this.pageTitle = 'Gestock';
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
