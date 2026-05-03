import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TodosService } from './todos.service';
import { TODOS_REPOSITORY, TodosRepository } from '../../domain/domain';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { RemoteConfigService } from 'src/app/core';
import { REMOTE_CONFIG_KEYS } from 'src/app/core/constants/remote-config-keys';
import { Todo } from '../../domain/models/todo.model';

const MOCK_TODOS: Todo[] = [
  { id: '1', title: 'Todo 1', completed: false, categoryId: 'cat-a' },
  { id: '2', title: 'Todo 2', completed: true,  categoryId: 'cat-b' },
  { id: '3', title: 'Todo 3', completed: false, categoryId: 'cat-a' },
];

describe('TodosService', () => {
  let service: TodosService;
  let repositorySpy: jasmine.SpyObj<TodosRepository>;
  let loaderSpy: jasmine.SpyObj<LoaderService>;
  let toastSpy: jasmine.SpyObj<ToastService>;
  let remoteConfigSpy: jasmine.SpyObj<RemoteConfigService>;

  beforeEach(() => {
    repositorySpy = jasmine.createSpyObj<TodosRepository>('TodosRepository', [
      'getTodos', 'getById', 'createTodo', 'toggleTodo', 'updateTodo', 'deleteTodo',
    ]);
    loaderSpy = jasmine.createSpyObj<LoaderService>('LoaderService', ['show', 'hide']);
    toastSpy  = jasmine.createSpyObj<ToastService>('ToastService', ['addToast']);
    remoteConfigSpy = jasmine.createSpyObj<RemoteConfigService>('RemoteConfigService', ['getBooleanType']);

    repositorySpy.getTodos.and.resolveTo({ todos: MOCK_TODOS, total: MOCK_TODOS.length });
    remoteConfigSpy.getBooleanType.and.resolveTo(false);

    TestBed.configureTestingModule({
      providers: [
        TodosService,
        { provide: TODOS_REPOSITORY,   useValue: repositorySpy },
        { provide: LoaderService,      useValue: loaderSpy },
        { provide: ToastService,       useValue: toastSpy },
        { provide: RemoteConfigService, useValue: remoteConfigSpy },
      ],
    });

    service = TestBed.inject(TodosService);
  });

  describe('initial state', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should start with empty todos signal', () => {
      expect(service.todos()).toEqual([]);
    });

    it('should start with total 0', () => {
      expect(service.total()).toBe(0);
    });

    it('should start with availableLoadTodos true', () => {
      expect(service.availableLoadTodos()).toBeTrue();
    });

    it('should start with enabledSelectorCategoriesFilter false', () => {
      expect(service.enabledSelectorCategoriesFilter()).toBeFalse();
    });
  });

  describe('loadRemoteConfig', () => {
    it('should set enabledSelectorCategoriesFilter from remote config', fakeAsync(() => {
      remoteConfigSpy.getBooleanType.and.resolveTo(true);

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          TodosService,
          { provide: TODOS_REPOSITORY,    useValue: repositorySpy },
          { provide: LoaderService,       useValue: loaderSpy },
          { provide: ToastService,        useValue: toastSpy },
          { provide: RemoteConfigService, useValue: remoteConfigSpy },
        ],
      });
      const freshService = TestBed.inject(TodosService);

      tick();

      expect(remoteConfigSpy.getBooleanType).toHaveBeenCalledWith(
        REMOTE_CONFIG_KEYS.ENABLED_SELECTOR_CATEGORIES_FILTER,
      );
      expect(freshService.enabledSelectorCategoriesFilter()).toBeTrue();
    }));

    it('should fall back to default when remote config throws', fakeAsync(() => {
      remoteConfigSpy.getBooleanType.and.rejectWith(new Error('RC error'));

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          TodosService,
          { provide: TODOS_REPOSITORY,    useValue: repositorySpy },
          { provide: LoaderService,       useValue: loaderSpy },
          { provide: ToastService,        useValue: toastSpy },
          { provide: RemoteConfigService, useValue: remoteConfigSpy },
        ],
      });
      const freshService = TestBed.inject(TodosService);

      tick();

      expect(freshService.enabledSelectorCategoriesFilter()).toBeFalse();
    }));
  });

  describe('computed signals', () => {
    beforeEach(() => {
      service.todos.set(MOCK_TODOS);
    });

    it('completed should count completed todos', () => {
      expect(service.completed()).toBe(1);
    });

    it('pendings should count incomplete todos', () => {
      expect(service.pendings()).toBe(2);
    });

    it('completed and pendings should update reactively', () => {
      service.todos.set([
        ...MOCK_TODOS,
        { id: '4', title: 'Todo 4', completed: true },
      ]);
      expect(service.completed()).toBe(2);
      expect(service.pendings()).toBe(2);
    });
  });

  describe('loadTodos', () => {
    it('should load todos and update signals on first call', async () => {
      await service.loadTodos();

      expect(repositorySpy.getTodos).toHaveBeenCalledWith(10, 0, []);
      expect(service.todos()).toEqual(MOCK_TODOS);
      expect(service.total()).toBe(MOCK_TODOS.length);
    });

    it('should show and hide loader', async () => {
      await service.loadTodos();

      expect(loaderSpy.show).toHaveBeenCalled();
      expect(loaderSpy.hide).toHaveBeenCalled();
    });

    it('should accumulate todos on subsequent calls', async () => {
      const page2: Todo[] = [{ id: '4', title: 'Todo 4', completed: false }];
      repositorySpy.getTodos.and.returnValues(
        Promise.resolve({ todos: MOCK_TODOS, total: 11 }),
        Promise.resolve({ todos: page2,      total: 11 }),
      );

      await service.loadTodos();
      await service.loadTodos();

      expect(service.todos().length).toBe(4);
      expect(service.todos()).toContain(page2[0]);
    });

    it('should advance offset by limit after each load', async () => {
      repositorySpy.getTodos.and.resolveTo({ todos: MOCK_TODOS, total: 20 });

      await service.loadTodos();
      await service.loadTodos();

      expect(repositorySpy.getTodos).toHaveBeenCalledWith(10, 0,  []);
      expect(repositorySpy.getTodos).toHaveBeenCalledWith(10, 10, []);
    });

    it('should set availableLoadTodos to false when all todos are loaded', async () => {
      repositorySpy.getTodos.and.resolveTo({ todos: MOCK_TODOS, total: 3 });

      await service.loadTodos();
      await service.loadTodos();

      expect(service.availableLoadTodos()).toBeFalse();
    });

    it('should pass filtered categories to repository', async () => {
      service.filteredCategories = ['cat-a'];

      await service.loadTodos();

      expect(repositorySpy.getTodos).toHaveBeenCalledWith(10, 0, ['cat-a']);
    });
  });

  describe('applyFilter', () => {
    it('should reset todos and reload with new categories', async () => {
      service.todos.set(MOCK_TODOS);
      repositorySpy.getTodos.and.resolveTo({ todos: [MOCK_TODOS[0]], total: 1 });

      await service.applyFilter(['cat-a']);

      expect(service.filteredCategories).toEqual(['cat-a']);
      expect(repositorySpy.getTodos).toHaveBeenCalledWith(10, 0, ['cat-a']);
      expect(service.todos()).toEqual([MOCK_TODOS[0]]);
    });

    it('should reset pagination state before reloading', async () => {
      await service.loadTodos();
      repositorySpy.getTodos.calls.reset();
      repositorySpy.getTodos.and.resolveTo({ todos: [], total: 0 });

      await service.applyFilter([]);

      expect(repositorySpy.getTodos).toHaveBeenCalledWith(10, 0, []);
    });
  });

  describe('getTodoByID', () => {
    beforeEach(() => {
      service.todos.set(MOCK_TODOS);
    });

    it('should return a computed signal with the matching todo', () => {
      const result = service.getTodoByID('2');

      expect(result()).toEqual(MOCK_TODOS[1]);
    });

    it('should return undefined for a non-existent id', () => {
      const result = service.getTodoByID('999');

      expect(result()).toBeUndefined();
    });

    it('should return a computed that always returns undefined for empty id', () => {
      const result = service.getTodoByID('');

      expect(result()).toBeUndefined();
    });
  });

  describe('createTodo', () => {
    const newTodo: Todo = { id: '99', title: 'New', completed: false };

    beforeEach(() => {
      service.todos.set(MOCK_TODOS);
      repositorySpy.createTodo.and.resolveTo(newTodo);
      repositorySpy.getTodos.and.resolveTo({ todos: MOCK_TODOS, total: MOCK_TODOS.length });
    });

    it('should prepend the new todo to the list before filter reload', async () => {
      await service.createTodo('New');

      expect(repositorySpy.createTodo).toHaveBeenCalledWith('New', false, undefined);
      expect(service.todos()).toEqual(MOCK_TODOS);
    });

    it('should call repository with correct arguments', async () => {
      await service.createTodo('New', 'cat-a');

      expect(repositorySpy.createTodo).toHaveBeenCalledWith('New', false, 'cat-a');
    });

    it('should show success toast on success', async () => {
      await service.createTodo('New');

      expect(toastSpy.addToast).toHaveBeenCalledWith(
        jasmine.objectContaining({ color: 'success' }),
      );
    });

    it('should show error toast when repository throws', async () => {
      repositorySpy.createTodo.and.rejectWith(new Error('fail'));

      await service.createTodo('New');

      expect(toastSpy.addToast).toHaveBeenCalledWith(
        jasmine.objectContaining({ color: 'danger' }),
      );
    });

    it('should show and hide loader', async () => {
      await service.createTodo('New');

      expect(loaderSpy.show).toHaveBeenCalled();
      expect(loaderSpy.hide).toHaveBeenCalled();
    });

    it('should hide loader even when repository throws', async () => {
      repositorySpy.createTodo.and.rejectWith(new Error('fail'));

      await service.createTodo('New');

      expect(loaderSpy.hide).toHaveBeenCalled();
    });
  });

  describe('toggleTodo', () => {
    beforeEach(() => {
      service.todos.set(MOCK_TODOS);
      repositorySpy.toggleTodo.and.resolveTo();
    });

    it('should optimistically toggle the todo', async () => {
      await service.toggleTodo('1');

      expect(service.todos().find(t => t.id === '1')?.completed).toBeTrue();
    });

    it('should not modify other todos', async () => {
      await service.toggleTodo('1');

      expect(service.todos().find(t => t.id === '2')?.completed).toBeTrue();
    });

    it('should rollback to previous state when repository throws', async () => {
      repositorySpy.toggleTodo.and.rejectWith(new Error('fail'));

      await service.toggleTodo('1');

      expect(service.todos()).toEqual(MOCK_TODOS);
    });

    it('should show error toast on rollback', async () => {
      repositorySpy.toggleTodo.and.rejectWith(new Error('fail'));

      await service.toggleTodo('1');

      expect(toastSpy.addToast).toHaveBeenCalledWith(
        jasmine.objectContaining({ color: 'danger' }),
      );
    });
  });

  describe('updateTodo', () => {
    const updated: Todo = { id: '1', title: 'Updated', completed: true, categoryId: 'cat-b' };

    beforeEach(() => {
      service.todos.set(MOCK_TODOS);
      repositorySpy.updateTodo.and.resolveTo();
      repositorySpy.getTodos.and.resolveTo({ todos: MOCK_TODOS, total: MOCK_TODOS.length });
    });

    it('should optimistically update the todo in the list', async () => {
      await service.updateTodo(updated);

      expect(repositorySpy.updateTodo).toHaveBeenCalledWith(updated);
    });

    it('should show success toast on success', async () => {
      await service.updateTodo(updated);

      expect(toastSpy.addToast).toHaveBeenCalledWith(
        jasmine.objectContaining({ color: 'success' }),
      );
    });

    it('should rollback to previous state when repository throws', async () => {
      repositorySpy.updateTodo.and.rejectWith(new Error('fail'));

      await service.updateTodo(updated);

      expect(service.todos()).toEqual(MOCK_TODOS);
    });

    it('should show error toast on rollback', async () => {
      repositorySpy.updateTodo.and.rejectWith(new Error('fail'));

      await service.updateTodo(updated);

      expect(toastSpy.addToast).toHaveBeenCalledWith(
        jasmine.objectContaining({ color: 'danger' }),
      );
    });

    it('should show and hide loader', async () => {
      await service.updateTodo(updated);

      expect(loaderSpy.show).toHaveBeenCalled();
      expect(loaderSpy.hide).toHaveBeenCalled();
    });

    it('should hide loader even when repository throws', async () => {
      repositorySpy.updateTodo.and.rejectWith(new Error('fail'));

      await service.updateTodo(updated);

      expect(loaderSpy.hide).toHaveBeenCalled();
    });
  });

  describe('deleteTodo', () => {
    beforeEach(() => {
      service.todos.set(MOCK_TODOS);
      repositorySpy.deleteTodo.and.resolveTo();
    });

    it('should optimistically remove the todo from the list', async () => {
      await service.deleteTodo('2');

      expect(service.todos().find(t => t.id === '2')).toBeUndefined();
      expect(service.todos().length).toBe(MOCK_TODOS.length - 1);
    });

    it('should show success toast on success', async () => {
      await service.deleteTodo('2');

      expect(toastSpy.addToast).toHaveBeenCalledWith(
        jasmine.objectContaining({ color: 'danger', icon: 'alert' }),
      );
    });

    it('should rollback to previous state when repository throws', async () => {
      repositorySpy.deleteTodo.and.rejectWith(new Error('fail'));

      await service.deleteTodo('2');

      expect(service.todos()).toEqual(MOCK_TODOS);
    });

    it('should show error toast on rollback', async () => {
      repositorySpy.deleteTodo.and.rejectWith(new Error('fail'));

      await service.deleteTodo('2');

      expect(toastSpy.addToast).toHaveBeenCalledWith(
        jasmine.objectContaining({ color: 'danger', icon: 'close' }),
      );
    });

    it('should show and hide loader', async () => {
      await service.deleteTodo('2');

      expect(loaderSpy.show).toHaveBeenCalled();
      expect(loaderSpy.hide).toHaveBeenCalled();
    });

    it('should hide loader even when repository throws', async () => {
      repositorySpy.deleteTodo.and.rejectWith(new Error('fail'));

      await service.deleteTodo('2');

      expect(loaderSpy.hide).toHaveBeenCalled();
    });
  });
});
