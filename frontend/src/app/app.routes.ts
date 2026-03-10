import { Routes } from '@angular/router';
import { Home } from './view/home/home';
import { Venda } from './view/venda/venda';
import { Inventario } from './view/inventario/inventario';
import { Relatorio } from './view/relatorio/relatorio';
import { Compra } from './view/compra/compra';
import { Login } from './view/login/login';
import { Cadastro } from './view/cadastro/cadastro';



export const routes: Routes = [
  
 
{ path: '', component: Home},        // rota principal
{ path: 'venda', component: Venda },
{ path: 'inventario', component: Inventario },
{ path: 'relatorio', component: Relatorio },
{ path: 'compra', component: Compra},
{ path: 'login', component: Login},
{ path: 'cadastro', component: Cadastro},
  { path: '**', redirectTo: '' }      // redireciona rotas não encontradas para Home
];