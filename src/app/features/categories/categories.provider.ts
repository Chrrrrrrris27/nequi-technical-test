import { CATEGORIES_DATASOURCE, CATEGORIES_REPOSITORY } from './domain/domain';
import { CategoriesRepositoryImpl, CateogriesDatasourceLocalStorage } from "./infrastructure/infrastructure";
import { CategoriesService } from './presentation/services/categories.service';

export const CATEGORIES_PROVIDERS = [
  CategoriesService,
  {
    provide: CATEGORIES_DATASOURCE,
    useClass: CateogriesDatasourceLocalStorage,
  },
  {
    provide: CATEGORIES_REPOSITORY,
    useClass: CategoriesRepositoryImpl,
  },
];
