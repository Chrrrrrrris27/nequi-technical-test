import { computed, inject, Inject, Injectable, signal } from "@angular/core";
import { Todo } from "../../domain/models/todo.model";
import { TODOS_REPOSITORY, TodosRepository } from "../../domain/domain";
import { LoaderService } from "src/app/shared";

@Injectable()
export class TodosService {

  private isFirstTodosLoaded = true;
  private todosLimit = 10;
  private todosOffset = 0;
  availableLoadTodos = signal<boolean>(true);
  loader = inject(LoaderService);
  todos = signal<Todo[]>([]);
  total = signal<number>(0);

  constructor(@Inject(TODOS_REPOSITORY) private repository: TodosRepository) {
    this.loadTodos();
    this.isFirstTodosLoaded = false;
  }

  async loadTodos() {
    if (this.todosOffset < this.total() || this.isFirstTodosLoaded) {
      this.loader.show();
      const { todos, total } = await this.repository.getTodos(
        this.todosLimit,
        this.todosOffset,
      );
      this.todos.set([...this.todos(), ...todos]);
      this.total.set(total);
      this.todosOffset = this.todosOffset + this.todosLimit;
      this.loader.hide();
      return;
    }
    this.availableLoadTodos.set(false);
  }

  getTodoByID(id: string) {
    if (id.length === 0) return computed(() => undefined);
    return computed(() => this.todos().find((todo) => todo.id === id));
  }

  async createTodo(title: string, categoryId?: string) {
    try {
      this.loader.show();
      const newTodo = await this.repository.createTodo(
        title,
        false,
        categoryId,
      );
      this.todos.set([newTodo, ...this.todos()]);
    } catch (error) {
    } finally {
      this.loader.hide();
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
    this.loader.show();
    const previousTodos = this.todos();

    const updatedTodos = previousTodos.map((todo) =>
      todo.id === updatedTodo.id ? updatedTodo : todo,
    );

    this.todos.set(updatedTodos);

    try {
      await this.repository.updateTodo(updatedTodo);
    } catch (error) {
      this.todos.set(previousTodos);
    } finally {
      this.loader.hide();
    }
  }

  async deleteTodo(id: string) {
    this.loader.show();
    const previousTodos = this.todos();

    const updatedTodos = previousTodos.filter((todo) => todo.id !== id);

    this.todos.set(updatedTodos);

    try {
      await this.repository.deleteTodo(id);
    } catch (error) {
      this.todos.set(previousTodos);
    } finally {
      this.loader.hide();
    }
  }
}