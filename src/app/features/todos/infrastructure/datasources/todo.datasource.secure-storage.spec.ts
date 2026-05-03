import { TestBed } from '@angular/core/testing';
import { TodosDatasourceSecureStorage } from './todo.datasource.secure-storage';
import { LocalStorageService } from 'src/app/core';
import { STORAGE_KEYS } from 'src/app/core/constants/storage-keys';
import { Todo } from '../../domain/domain';

const MOCK_TODOS: Todo[] = [
  { id: '1', title: 'Todo 1', completed: false, categoryId: 'cat-a' },
  { id: '2', title: 'Todo 2', completed: true,  categoryId: 'cat-b' },
  { id: '3', title: 'Todo 3', completed: false, categoryId: 'cat-a' },
];

describe('TodosDatasourceSecureStorage', () => {
  let datasource: TodosDatasourceSecureStorage;
  let localStorageSpy: jasmine.SpyObj<LocalStorageService>;

  beforeEach(() => {
    localStorageSpy = jasmine.createSpyObj<LocalStorageService>('LocalStorageService', ['get', 'set', 'remove']);

    TestBed.configureTestingModule({
      providers: [
        TodosDatasourceSecureStorage,
        { provide: LocalStorageService, useValue: localStorageSpy },
      ],
    });

    datasource = TestBed.inject(TodosDatasourceSecureStorage);
  });

  describe('getAll', () => {
    it('should return todos from storage', async () => {
      localStorageSpy.get.and.resolveTo(MOCK_TODOS);

      const result = await datasource.getAll();

      expect(localStorageSpy.get).toHaveBeenCalledWith(STORAGE_KEYS.TODOS);
      expect(result).toEqual(MOCK_TODOS);
    });

    it('should return empty array when storage is empty', async () => {
      localStorageSpy.get.and.resolveTo(undefined);

      const result = await datasource.getAll();

      expect(result).toEqual([]);
    });

    it('should return empty array when storage throws', async () => {
      localStorageSpy.get.and.rejectWith(new Error('Storage error'));

      const result = await datasource.getAll();

      expect(result).toEqual([]);
    });
  });

  describe('getTodos', () => {
    beforeEach(() => {
      localStorageSpy.get.and.resolveTo(MOCK_TODOS);
    });

    it('should return all todos with total when no params given', async () => {
      const result = await datasource.getTodos();

      expect(result.todos).toEqual(MOCK_TODOS);
      expect(result.total).toBe(3);
    });

    it('should return todos applying limit and offset correctly', async () => {
      const result = await datasource.getTodos(1, 1);

      expect(result.todos).toEqual([MOCK_TODOS[1]]);
      expect(result.total).toBe(3);
    });

    it('should filter by categories', async () => {
      const result = await datasource.getTodos(undefined, undefined, ['cat-a']);

      expect(result.todos).toEqual([MOCK_TODOS[0], MOCK_TODOS[2]]);
      expect(result.total).toBe(2);
    });

    it('should apply limit and offset after category filter', async () => {
      const result = await datasource.getTodos(1, 0, ['cat-a']);

      expect(result.todos).toEqual([MOCK_TODOS[0]]);
      expect(result.total).toBe(2);
    });

    it('should return empty result when category has no matches', async () => {
      const result = await datasource.getTodos(undefined, undefined, ['cat-z']);

      expect(result.todos).toEqual([]);
      expect(result.total).toBe(0);
    });

    it('should return empty result when storage throws', async () => {
      localStorageSpy.get.and.rejectWith(new Error('Storage error'));

      const result = await datasource.getTodos();

      expect(result).toEqual({ todos: [], total: 0 });
    });
  });

  describe('getById', () => {
    beforeEach(() => {
      localStorageSpy.get.and.resolveTo(MOCK_TODOS);
    });

    it('should return the matching todo', async () => {
      const result = await datasource.getById('2');

      expect(result).toEqual(MOCK_TODOS[1]);
    });

    it('should return undefined when id does not exist', async () => {
      const result = await datasource.getById('999');

      expect(result).toBeUndefined();
    });
  });

  describe('createTodo', () => {
    beforeEach(() => {
      localStorageSpy.get.and.resolveTo(MOCK_TODOS);
      localStorageSpy.set.and.resolveTo();
    });

    it('should create a todo and prepend it to storage', async () => {
      const result = await datasource.createTodo('New todo', false, 'cat-a');

      expect(result.title).toBe('New todo');
      expect(result.completed).toBeFalse();
      expect(result.categoryId).toBe('cat-a');
      expect(result.id).toBeTruthy();

      const savedTodos = localStorageSpy.set.calls.mostRecent().args[1] as Todo[];
      expect(savedTodos[0]).toEqual(result);
      expect(savedTodos.length).toBe(MOCK_TODOS.length + 1);
    });

    it('should default completed to false when not provided', async () => {
      const result = await datasource.createTodo('No completed flag');

      expect(result.completed).toBeFalse();
    });

    it('should create a todo without categoryId', async () => {
      const result = await datasource.createTodo('No category');

      expect(result.categoryId).toBeUndefined();
    });

    it('should throw when set fails', async () => {
      localStorageSpy.set.and.rejectWith(new Error('Storage error'));

      await expectAsync(datasource.createTodo('Fail')).toBeRejectedWithError('Cannot possible create new todo');
    });
  });

  describe('toggleTodo', () => {
    beforeEach(() => {
      localStorageSpy.get.and.resolveTo(MOCK_TODOS);
      localStorageSpy.set.and.resolveTo();
    });

    it('should toggle completed from false to true', async () => {
      await datasource.toggleTodo('1');

      const savedTodos = localStorageSpy.set.calls.mostRecent().args[1] as Todo[];
      const toggled = savedTodos.find(t => t.id === '1')!;
      expect(toggled.completed).toBeTrue();
    });

    it('should toggle completed from true to false', async () => {
      await datasource.toggleTodo('2');

      const savedTodos = localStorageSpy.set.calls.mostRecent().args[1] as Todo[];
      const toggled = savedTodos.find(t => t.id === '2')!;
      expect(toggled.completed).toBeFalse();
    });

    it('should not modify other todos', async () => {
      await datasource.toggleTodo('1');

      const savedTodos = localStorageSpy.set.calls.mostRecent().args[1] as Todo[];
      const untouched = savedTodos.find(t => t.id === '2')!;
      expect(untouched.completed).toBe(MOCK_TODOS[1].completed);
    });

    it('should throw when set fails', async () => {
      localStorageSpy.set.and.rejectWith(new Error('Storage error'));

      await expectAsync(datasource.toggleTodo('1')).toBeRejectedWithError('Cannot possible toggle todo');
    });
  });

  describe('updateTodo', () => {
    beforeEach(() => {
      localStorageSpy.get.and.resolveTo(MOCK_TODOS);
      localStorageSpy.set.and.resolveTo();
    });

    it('should replace the matching todo with the updated one', async () => {
      const updated: Todo = { id: '1', title: 'Updated title', completed: true, categoryId: 'cat-b' };

      await datasource.updateTodo(updated);

      const savedTodos = localStorageSpy.set.calls.mostRecent().args[1] as Todo[];
      expect(savedTodos.find(t => t.id === '1')).toEqual(updated);
    });

    it('should not modify other todos', async () => {
      const updated: Todo = { id: '1', title: 'Updated', completed: true };

      await datasource.updateTodo(updated);

      const savedTodos = localStorageSpy.set.calls.mostRecent().args[1] as Todo[];
      expect(savedTodos.find(t => t.id === '2')).toEqual(MOCK_TODOS[1]);
    });

    it('should throw when set fails', async () => {
      localStorageSpy.set.and.rejectWith(new Error('Storage error'));

      await expectAsync(datasource.updateTodo(MOCK_TODOS[0])).toBeRejectedWithError('Cannot possible update todo');
    });
  });

  describe('deleteTodo', () => {
    beforeEach(() => {
      localStorageSpy.get.and.resolveTo(MOCK_TODOS);
      localStorageSpy.set.and.resolveTo();
    });

    it('should remove the todo with the given id', async () => {
      await datasource.deleteTodo('2');

      const savedTodos = localStorageSpy.set.calls.mostRecent().args[1] as Todo[];
      expect(savedTodos.find(t => t.id === '2')).toBeUndefined();
      expect(savedTodos.length).toBe(MOCK_TODOS.length - 1);
    });

    it('should keep remaining todos intact', async () => {
      await datasource.deleteTodo('2');

      const savedTodos = localStorageSpy.set.calls.mostRecent().args[1] as Todo[];
      expect(savedTodos).toEqual([MOCK_TODOS[0], MOCK_TODOS[2]]);
    });

    it('should throw when set fails', async () => {
      localStorageSpy.set.and.rejectWith(new Error('Storage error'));

      await expectAsync(datasource.deleteTodo('1')).toBeRejectedWithError('Cannot possible delete todo');
    });
  });
});
