import { InjectionToken } from "@angular/core";
import { Todo } from "../models/todo.model";

export const TODOS_REPOSITORY = new InjectionToken<TodosRepository>('TodosRepository');

export abstract class TodosRepository {
  abstract getTodos(limit?: number, offset?: number, categories?: string[]): Promise<{
    todos: Todo[];
    total: number;
  }>;
  abstract getById(id: string): Promise<Todo | undefined>;
  abstract createTodo(title: string, completed?: boolean, categoryId?: string): Promise<Todo>;
  abstract toggleTodo(id: string): Promise<void>;
  abstract updateTodo(updatedTodo: Todo): Promise<void>;
  abstract deleteTodo(id: string): Promise<void>;
}