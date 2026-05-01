import { Routes } from '@angular/router';
import { TODOS_PROVIDERS } from '../features/todos/todos.provider';
import { CATEGORIES_PROVIDERS } from '../features/categories/categories.provider';

export const routes: Routes = [
  {
    path: 'tabs',
    loadComponent: () => import('./tabs.page').then((m) => m.TabsPage),
    providers: [...TODOS_PROVIDERS, ...CATEGORIES_PROVIDERS],
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
