import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'products',
    title: 'Gerenciar Produtos',
    loadComponent: () =>
      import('./features/products/pages/manager/manager.component').then(m => m.ProductsManagerComponent),
    data: { preload: true }
  },
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full'
  },
  {
    path: '**',
    title: 'Página não encontrada',
    redirectTo: 'products'
  }
];
