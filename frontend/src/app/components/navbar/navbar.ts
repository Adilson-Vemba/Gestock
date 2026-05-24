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
      const path = this.router.url.split('/')[1] || '';
      switch(path) {
        case 'admin': this.pageTitle = 'Dashboard'; break;
        case 'inventario': this.pageTitle = 'Gestão de Inventário'; break;
        case 'compras': this.pageTitle = 'Compras / Entradas'; break;
        case 'vendas': this.pageTitle = 'Histórico de Vendas'; break;
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
