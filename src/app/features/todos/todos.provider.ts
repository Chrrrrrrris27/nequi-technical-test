import { TODOS_DATASOURCE, TODOS_REPOSITORY } from "./domain/domain";
import { TodosDatasourceSecureStorage, TodosRepositoryImpl } from "./infrastructure/infrastructure";
import { TodosService } from './presentation/services/todos.service';

export const TODOS_PROVIDERS = [
  TodosService,
  {
    provide: TODOS_DATASOURCE,
    useClass: TodosDatasourceSecureStorage,
  },
  {
    provide: TODOS_REPOSITORY,
    useClass: TodosRepositoryImpl,
  },
];
