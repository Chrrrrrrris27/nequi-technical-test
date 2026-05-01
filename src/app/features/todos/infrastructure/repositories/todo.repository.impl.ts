import { Inject, Injectable } from '@angular/core';
import { Todo, TODOS_DATASOURCE, TodosDatasource, TodosRepository } from '../../domain/domain';

@Injectable()
export class TodosRepositoryImpl implements TodosRepository {

  constructor(
    @Inject(TODOS_DATASOURCE) private datasource: TodosDatasource
  ) {}
  
  getTodos(limit?: number, offset?: number): Promise<{
    todos: Todo[];
    total: number;
  }> {
    return this.datasource.getTodos(limit, offset);
  }
  getById(id: string): Promise<Todo | undefined> {
    return this.datasource.getById(id);
  }
  createTodo(title: string, completed?: boolean, categoryId?: string): Promise<Todo> {
    return this.datasource.createTodo(title, completed, categoryId);
  }
  toggleTodo(id: string): Promise<void> {
    return this.datasource.toggleTodo(id);
  }
  updateTodo(updatedTodo: Todo): Promise<void> {
    return this.datasource.updateTodo(updatedTodo);
  }
  deleteTodo(id: string): Promise<void> {
    return this.datasource.deleteTodo(id);
  }

}