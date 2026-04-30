import { Route } from '@angular/router';
import { TODOS_PROVIDERS } from './todos.provider';

export const todosRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./presentation/pages/todos/todos.page').then((m) => m.TodosPage),
    providers: TODOS_PROVIDERS,
  },
];
