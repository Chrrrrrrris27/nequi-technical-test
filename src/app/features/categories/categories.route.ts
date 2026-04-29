import { Route } from "@angular/router";

export const categoriesRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./presentation/pages/categories/categories.page').then((m) => m.CategoriesPage),
  }
];