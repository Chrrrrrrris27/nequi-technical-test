import { computed, inject, Inject, Injectable, signal } from "@angular/core";
import { Todo } from "../../domain/models/todo.model";
import { TODOS_REPOSITORY, TodosRepository } from "../../domain/domain";
import { LoaderService, ToastService } from "src/app/shared";
import { REMOTE_CONFIG_KEYS, RemoteConfigService } from "src/app/core";
import { REMOTE_CONFIG_DEFAULTS } from "src/app/core/constants/remote-config-keys";

@Injectable()
export class TodosService {
  private loaderService = inject(LoaderService);
  private toastService = inject(ToastService);
  private remoteConfigService = inject(RemoteConfigService);
  private isFirstTodosLoaded = true;
  private todosLimit = 10;
  private todosOffset = 0;
  enabledSelectorCategoriesFilter = signal<boolean>(false);
  filteredCategories: string[] = [];
  availableLoadTodos = signal<boolean>(true);
  todos = signal<Todo[]>([]);
  total = signal<number>(0);
  completed = computed(
    () => this.todos().filter((todo) => todo.completed).length,
  );
  pendings = computed(
    () => this.todos().filter((todo) => !todo.completed).length,
  );

  avaialbleLoadTodos = computed(() => this.todosOffset < this.total());

  constructor(@Inject(TODOS_REPOSITORY) private repository: TodosRepository) {
    this.loadRemoteConfig();
  }

  private async loadRemoteConfig() {
    try {
      const value = await this.remoteConfigService.getBooleanType(
        REMOTE_CONFIG_KEYS.ENABLED_SELECTOR_CATEGORIES_FILTER,
      );
      this.enabledSelectorCategoriesFilter.set(value);
    } catch (error) {
      this.enabledSelectorCategoriesFilter.set(REMOTE_CONFIG_DEFAULTS[REMOTE_CONFIG_KEYS.ENABLED_SELECTOR_CATEGORIES_FILTER]);
    }
  }

  async loadTodos() {
    if (this.todosOffset < this.total() || this.isFirstTodosLoaded) {
      this.loaderService.show();
      const { todos, total } = await this.repository.getTodos(
        this.todosLimit,
        this.todosOffset,
        this.filteredCategories,
      );
      this.todos.set([...this.todos(), ...todos]);
      this.total.set(total);
      this.todosOffset = this.todosOffset + this.todosLimit;
      this.isFirstTodosLoaded = false;
      this.loaderService.hide();
      return;
    }
    this.availableLoadTodos.set(false);
  }

  async applyFilter(categories: string[]) {
    this.filteredCategories = categories;
    this._resetTodos();
    await this.loadTodos();
  }

  getTodoByID(id: string) {
    if (id.length === 0) return computed(() => undefined);
    return computed(() => this.todos().find((todo) => todo.id === id));
  }

  async createTodo(title: string, categoryId?: string) {
    try {
      this.loaderService.show();
      const newTodo = await this.repository.createTodo(
        title,
        false,
        categoryId,
      );
      this.todos.set([newTodo, ...this.todos()]);
      this.applyFilter(this.filteredCategories);
      this.toastService.addToast({
        message: 'Tarea creada!',
        color: 'success',
        icon: 'checkmark',
      });
    } catch (error) {
      this.toastService.addToast({
        message: 'Ups! Algo salió mal.',
        color: 'danger',
        icon: 'close',
      });
    } finally {
      this.loaderService.hide();
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
      this.toastService.addToast({
        message: 'Ups! Algo salió mal.',
        color: 'danger',
        icon: 'close',
      });
    }
  }

  async updateTodo(updatedTodo: Todo) {
    this.loaderService.show();
    const previousTodos = this.todos();

    const updatedTodos = previousTodos.map((todo) =>
      todo.id === updatedTodo.id ? updatedTodo : todo,
    );

    this.todos.set(updatedTodos);
    this.applyFilter(this.filteredCategories);

    this.toastService.addToast({
      message: 'Tarea actualizada!',
      color: 'success',
      icon: 'checkmark',
    });
    try {
      await this.repository.updateTodo(updatedTodo);
    } catch (error) {
      this.todos.set(previousTodos);
      this.toastService.addToast({
        message: 'Ups! Algo salió mal.',
        color: 'danger',
        icon: 'close',
      });
    } finally {
      this.loaderService.hide();
    }
  }

  async deleteTodo(id: string) {
    this.loaderService.show();
    const previousTodos = this.todos();

    const updatedTodos = previousTodos.filter((todo) => todo.id !== id);

    this.todos.set(updatedTodos);

    try {
      await this.repository.deleteTodo(id);
      this.toastService.addToast({
        message: 'Tarea eliminada!',
        color: 'danger',
        icon: 'alert',
      });
    } catch (error) {
      this.todos.set(previousTodos);
      this.toastService.addToast({
        message: 'Ups! Algo salió mal.',
        color: 'danger',
        icon: 'close',
      });
    } finally {
      this.loaderService.hide();
    }
  }

  private _resetTodos() {
    this.todos.set([]);
    this.todosLimit = 10;
    this.todosOffset = 0;
    this.total.set(0);
    this.isFirstTodosLoaded = true;
    this.availableLoadTodos.set(true);
  }
}