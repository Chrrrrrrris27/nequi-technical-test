import { Route } from '@angular/router';

export const todosRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./presentation/pages/todos/todos.page').then((m) => m.TodosPage),
  },
];
