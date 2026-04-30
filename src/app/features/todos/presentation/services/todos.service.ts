import { Inject, Injectable, signal } from "@angular/core";
import { Todo } from "../../domain/models/todo.model";
import { TODOS_REPOSITORY, TodosRepository } from "../../domain/domain";

@Injectable()
export class TodosService {

  todos = signal<Todo[]>([]);
  
  constructor(
    @Inject(TODOS_REPOSITORY) private repository: TodosRepository
  ) {
    this.getTodos();
  }

  async getTodos(limit: number = 20, offset: number = 0) {
    this.todos.set(await this.repository.getTodos(limit, offset));
  }

  async createTodo(title: string, categoryId: string) {
    try {
      const newTodo = await this.repository.createTodo(title, false, categoryId);
      this.todos.set([newTodo, ...this.todos()]);
    } catch (error) {
      
    }
  }

  async toggleTodo(id: string) {

    const previousTodos = this.todos();

    const updatedTodos = previousTodos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo,
    );

    this.todos.set(updatedTodos);

    try {
      await this.repository.toggleTodo(id);
    } catch (error) {
      this.todos.set(previousTodos);
    }
  }

  async updateTodo(updatedTodo: Todo) {
    const previousTodos = this.todos();

    const updatedTodos = previousTodos.map((todo) =>
      todo.id === updatedTodo.id ? updatedTodo : todo,
    );

    this.todos.set(updatedTodos);

    try {
      await this.repository.updateTodo(updatedTodo);
    } catch (error) {
      this.todos.set(previousTodos);
    }
  }

  async deleteTodo(id: string) {
    const previousTodos = this.todos();

    const updatedTodos = previousTodos.filter((todo) => todo.id !== id);

    this.todos.set(updatedTodos);

    try {
      await this.repository.deleteTodo(id);
    } catch (error) {
      this.todos.set(previousTodos);
    }
  }
}