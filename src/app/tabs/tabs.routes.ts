import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'tabs',
    loadComponent: () => import('./tabs.page').then((m) => m.TabsPage),
    children: [
      {
        path: 'todos',
        loadChildren: () =>
          import('../features/index').then((m) => m.todosRoutes),
      },
      {
        path: 'categories',
        loadChildren: () =>
          import('../features/index').then((m) => m.categoriesRoutes),
      },
    ],
  },
  {
    path: '',
    redirectTo: 'tabs/todos',
    pathMatch: 'full',
  },
];
