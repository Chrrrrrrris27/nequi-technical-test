import { Routes } from '@angular/router';;

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'todo',
    loadComponent: () => import('./features/todos/presentation/pages/todo/todo.page').then((m) => m.TodoPage),
  },
  {
    path: 'category',
    loadComponent: () => import('./features/categories/presentation/pages/category/category.page').then((m) => m.CategoryPage),
  },
  {
    path: '',
    redirectTo: 'tabs/todos',
    pathMatch: 'full',
  },
];
