import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
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
];
