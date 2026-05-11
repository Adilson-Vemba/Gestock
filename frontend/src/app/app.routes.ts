import { Routes } from '@angular/router';
import { Home } from './view/home/home';
import { Venda } from './view/venda/venda';
import { Inventario } from './view/inventario/inventario';
import { Relatorio } from './view/relatorio/relatorio';
import { Compra } from './view/compra/compra';
import { Login } from './view/login/login';
import { Cadastro } from './view/cadastro/cadastro';
import { ClientDashboard } from './view/client-dashboard/client-dashboard';

// Storefront components
import { StoreHome } from './view/store/home/store-home';
import { Cart } from './view/store/cart/cart';
import { ProductDetail } from './view/store/product-detail/product-detail';

// Guards
import { authGuard, adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Storefront (Public)
  { path: '', component: StoreHome },
  { path: 'carrinho', component: Cart, canActivate: [authGuard] },
  { path: 'produto/:code', component: ProductDetail },
  { path: 'login', component: Login },
  { path: 'cadastro', component: Cadastro },

  // Client Area
  { path: 'dashboard', component: ClientDashboard, canActivate: [authGuard] },

  // Admin Dashboard (Protected)
  { path: 'admin', component: Home, canActivate: [adminGuard] },
  { path: 'admin/venda', component: Venda, canActivate: [adminGuard] },
  { path: 'admin/inventario', component: Inventario, canActivate: [adminGuard] },
  { path: 'admin/relatorio', component: Relatorio, canActivate: [adminGuard] },
  { path: 'admin/compra', component: Compra, canActivate: [adminGuard] },

  { path: '**', redirectTo: '' }
];