import { Routes } from '@angular/router';
import { Home } from './view/home/home';
import { Venda } from './view/venda/venda';
import { Inventario } from './view/inventario/inventario';
import { Relatorio } from './view/relatorio/relatorio';
import { Compra } from './view/compra/compra';
import { Login } from './view/login/login';
import { Cadastro } from './view/cadastro/cadastro';

// Storefront components
import { StoreHome } from './view/store/home/store-home';
import { Cart } from './view/store/cart/cart';
import { ProductDetail } from './view/store/product-detail/product-detail';

export const routes: Routes = [
  // Storefront (B2C)
  { path: '', component: StoreHome },
  { path: 'carrinho', component: Cart },
  { path: 'produto/:code', component: ProductDetail },
  { path: 'login', component: Login },
  { path: 'cadastro', component: Cadastro },

  // Admin Dashboard (B2B)
  { path: 'admin', component: Home },
  { path: 'admin/venda', component: Venda },
  { path: 'admin/inventario', component: Inventario },
  { path: 'admin/relatorio', component: Relatorio },
  { path: 'admin/compra', component: Compra },

  { path: '**', redirectTo: '' }
];