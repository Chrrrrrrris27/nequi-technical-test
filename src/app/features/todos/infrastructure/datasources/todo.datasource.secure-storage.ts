import { Injectable } from '@angular/core';
import { Todo, TodosDatasource } from '../../domain/domain';
import { LocalStorageService } from 'src/app/core';
import { STORAGE_KEYS } from 'src/app/core/constants/storage-keys';

@Injectable()
export class TodosDatasourceSecureStorage implements TodosDatasource {

  constructor(private localStorageService: LocalStorageService) {}

  async getAll() : Promise<Todo[]> {
    try {
      return await this.localStorageService.get<Todo[]>(STORAGE_KEYS.TODOS) ?? [];
    } catch (error) {
      return [];
    }
  }
  
  async getTodos(limit?: number, offset?: number, categories?: string[]): Promise<{
    todos: Todo[];
    total: number;
  }> {
    try {
      const todos = await this.getAll();
      const end = (offset ?? 0) + (limit ?? todos.length);
      if (categories && categories.length > 0) {
        const filterTodos = todos.filter(todo => todo.categoryId && categories.includes(todo.categoryId));
        return {
          todos: filterTodos.slice(offset, end),
          total: filterTodos.length,
        };
      }
      return {
        todos: todos.slice(offset, end),
        total: todos.length,
      };
    } catch (error) {
      return {
        todos: [],
        total: 0,
      };
    }
  }

  async getById(id: string): Promise<Todo | undefined> {
    const storageTodos = await this.getAll();
    return storageTodos.find(todo => todo.id === id);
  }

  async createTodo(title: string, completed?: boolean, categoryId?: string): Promise<Todo> {
    try {
      const storageTodos = await this.getAll();
      const newTodo: Todo = {
        id: crypto.randomUUID(),
        title,
        completed: completed ?? false,
        categoryId
      }
      await this.localStorageService.set(STORAGE_KEYS.TODOS, [newTodo, ...storageTodos]);
      return newTodo;
    } catch (error) {
      throw new Error('Cannot possible create new todo');
    }
  }
  
  async toggleTodo(id: string): Promise<void> {
    try {
      const storageTodos = await this.getAll();
      const updatedTodos = storageTodos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      )
      await this.localStorageService.set(STORAGE_KEYS.TODOS, updatedTodos);
    } catch (error) {
      throw new Error('Cannot possible toggle todo');
    }
  }
  
  async updateTodo(updatedTodo: Todo): Promise<void> {
    try {
      const storageTodos = await this.getAll();
      const updatedTodos = storageTodos.map((todo) => 
        todo.id === updatedTodo.id ? updatedTodo : todo
      );
      await this.localStorageService.set(STORAGE_KEYS.TODOS, updatedTodos);
    } catch (error) {
      throw new Error('Cannot possible update todo');
    }
  }
  
  async deleteTodo(id: string): Promise<void> {
    try {
      const newTodos = (await this.getAll()).filter(todo => todo.id !== id);
      await this.localStorageService.set(STORAGE_KEYS.TODOS, newTodos);
    } catch (error) {
      throw new Error('Cannot possible delete todo');
    }
  }

}