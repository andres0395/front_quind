import { Routes } from '@angular/router';

export const routes: Routes = [
  {path: '', loadComponent:() => import('./components/home/home.component')},
  {path: 'medicamentos',loadComponent:() => import('./components/medicamentos/medicamentos.component')},
  {path: 'pedidos',loadComponent:() => import('./components/pedidos/pedidos.component')},
  {path: 'formulas',loadComponent:() => import('./components/formulas/formulas.component')},
  {path: '**',redirectTo:'', pathMatch:'full'}
];
