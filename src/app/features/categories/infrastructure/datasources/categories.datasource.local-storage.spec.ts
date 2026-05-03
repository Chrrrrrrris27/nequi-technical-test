import { TestBed } from '@angular/core/testing';
import { CateogriesDatasourceLocalStorage } from './categories.datasource.local-storage';
import { LocalStorageService } from 'src/app/core';
import { STORAGE_KEYS } from 'src/app/core/constants/storage-keys';
import { Category } from '../../domain/domain';
import { Todo } from 'src/app/features/todos/domain/domain';

const MOCK_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Work' },
  { id: 'cat-2', name: 'Personal' },
  { id: 'cat-3', name: 'Shopping' },
];

const MOCK_TODOS: Todo[] = [
  { id: 'todo-1', title: 'Task A', completed: false, categoryId: 'cat-1' },
  { id: 'todo-2', title: 'Task B', completed: true, categoryId: 'cat-2' },
  { id: 'todo-3', title: 'Task C', completed: false, categoryId: 'cat-1' },
  { id: 'todo-4', title: 'Task D', completed: false },
];

describe('CateogriesDatasourceLocalStorage', () => {
  let datasource: CateogriesDatasourceLocalStorage;
  let localStorageSpy: jasmine.SpyObj<LocalStorageService>;

  beforeEach(() => {
    localStorageSpy = jasmine.createSpyObj<LocalStorageService>(
      'LocalStorageService',
      ['get', 'set', 'remove'],
    );

    TestBed.configureTestingModule({
      providers: [
        CateogriesDatasourceLocalStorage,
        { provide: LocalStorageService, useValue: localStorageSpy },
      ],
    });

    datasource = TestBed.inject(CateogriesDatasourceLocalStorage);
  });

  describe('getAll', () => {
    it('should return categories from storage', async () => {
      localStorageSpy.get.and.resolveTo(MOCK_CATEGORIES);

      const result = await datasource.getAll();

      expect(localStorageSpy.get).toHaveBeenCalledWith(STORAGE_KEYS.CATEGORIES);
      expect(result).toEqual(MOCK_CATEGORIES);
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

  describe('getCategories', () => {
    it('should return all categories', async () => {
      localStorageSpy.get.and.resolveTo(MOCK_CATEGORIES);

      const result = await datasource.getCategories();

      expect(result).toEqual(MOCK_CATEGORIES);
    });

    it('should return empty array when storage is empty', async () => {
      localStorageSpy.get.and.resolveTo(undefined);

      const result = await datasource.getCategories();

      expect(result).toEqual([]);
    });
  });

  describe('getById', () => {
    beforeEach(() => {
      localStorageSpy.get.and.resolveTo(MOCK_CATEGORIES);
    });

    it('should return the matching category', async () => {
      const result = await datasource.getById('cat-2');

      expect(result).toEqual(MOCK_CATEGORIES[1]);
    });

    it('should return undefined when id does not exist', async () => {
      const result = await datasource.getById('cat-999');

      expect(result).toBeUndefined();
    });
  });

  describe('createCategory', () => {
    beforeEach(() => {
      localStorageSpy.get.and.resolveTo(MOCK_CATEGORIES);
      localStorageSpy.set.and.resolveTo();
    });

    it('should create a category and prepend it to storage', async () => {
      const result = await datasource.createCategory('Health');

      expect(result.name).toBe('Health');
      expect(result.id).toBeTruthy();

      const savedCategories = localStorageSpy.set.calls.mostRecent()
        .args[1] as Category[];
      expect(savedCategories[0]).toEqual(result);
      expect(savedCategories.length).toBe(MOCK_CATEGORIES.length + 1);
    });

    it('should generate a unique id for the new category', async () => {
      const first = await datasource.createCategory('A');
      const second = await datasource.createCategory('B');

      expect(first.id).not.toBe(second.id);
    });

    it('should save to the CATEGORIES storage key', async () => {
      await datasource.createCategory('Health');

      expect(localStorageSpy.set).toHaveBeenCalledWith(
        STORAGE_KEYS.CATEGORIES,
        jasmine.any(Array),
      );
    });

    it('should throw when set fails', async () => {
      localStorageSpy.set.and.rejectWith(new Error('Storage error'));

      await expectAsync(
        datasource.createCategory('Fail'),
      ).toBeRejectedWithError('Cannot possible create new category');
    });
  });

  describe('updateCategory', () => {
    beforeEach(() => {
      localStorageSpy.get.and.resolveTo(MOCK_CATEGORIES);
      localStorageSpy.set.and.resolveTo();
    });

    it('should replace the matching category with the updated one', async () => {
      const updated: Category = { id: 'cat-1', name: 'Updated Work' };

      await datasource.updateCategory(updated);

      const savedCategories = localStorageSpy.set.calls.mostRecent()
        .args[1] as Category[];
      expect(savedCategories.find((c) => c.id === 'cat-1')).toEqual(updated);
    });

    it('should not modify other categories', async () => {
      const updated: Category = { id: 'cat-1', name: 'Updated Work' };

      await datasource.updateCategory(updated);

      const savedCategories = localStorageSpy.set.calls.mostRecent()
        .args[1] as Category[];
      expect(savedCategories.find((c) => c.id === 'cat-2')).toEqual(
        MOCK_CATEGORIES[1],
      );
      expect(savedCategories.find((c) => c.id === 'cat-3')).toEqual(
        MOCK_CATEGORIES[2],
      );
    });

    it('should save to the CATEGORIES storage key', async () => {
      await datasource.updateCategory({ id: 'cat-1', name: 'X' });

      expect(localStorageSpy.set).toHaveBeenCalledWith(
        STORAGE_KEYS.CATEGORIES,
        jasmine.any(Array),
      );
    });

    it('should throw when set fails', async () => {
      localStorageSpy.set.and.rejectWith(new Error('Storage error'));

      await expectAsync(
        datasource.updateCategory(MOCK_CATEGORIES[0]),
      ).toBeRejectedWithError('Cannot possible update todo');
    });
  });

  describe('deleteCategory', () => {
    beforeEach(() => {
      localStorageSpy.get.and.callFake(((key: string) => {
        if (key === STORAGE_KEYS.CATEGORIES)
          return Promise.resolve(MOCK_CATEGORIES);
        if (key === STORAGE_KEYS.TODOS) return Promise.resolve(MOCK_TODOS);
        return Promise.resolve(undefined);
      }) as any);
      localStorageSpy.set.and.resolveTo();
    });

    it('should remove the category with the given id', async () => {
      await datasource.deleteCategory('cat-2');

      const categoriesCall = localStorageSpy.set.calls
        .all()
        .find((c) => c.args[0] === STORAGE_KEYS.CATEGORIES);
      const savedCategories = categoriesCall!.args[1] as Category[];

      expect(savedCategories.find((c) => c.id === 'cat-2')).toBeUndefined();
      expect(savedCategories.length).toBe(MOCK_CATEGORIES.length - 1);
    });

    it('should keep remaining categories intact', async () => {
      await datasource.deleteCategory('cat-2');

      const categoriesCall = localStorageSpy.set.calls
        .all()
        .find((c) => c.args[0] === STORAGE_KEYS.CATEGORIES);
      const savedCategories = categoriesCall!.args[1] as Category[];

      expect(savedCategories).toEqual([MOCK_CATEGORIES[0], MOCK_CATEGORIES[2]]);
    });

    it('should set categoryId to undefined on todos that belonged to the deleted category', async () => {
      await datasource.deleteCategory('cat-1');

      const todosCall = localStorageSpy.set.calls
        .all()
        .find((c) => c.args[0] === STORAGE_KEYS.TODOS);
      const savedTodos = todosCall!.args[1] as Todo[];

      const affected = savedTodos.filter(
        (t) => t.id === 'todo-1' || t.id === 'todo-3',
      );
      affected.forEach((t) => expect(t.categoryId).toBeUndefined());
    });

    it('should not modify todos that belong to other categories', async () => {
      await datasource.deleteCategory('cat-1');

      const todosCall = localStorageSpy.set.calls
        .all()
        .find((c) => c.args[0] === STORAGE_KEYS.TODOS);
      const savedTodos = todosCall!.args[1] as Todo[];

      expect(savedTodos.find((t) => t.id === 'todo-2')?.categoryId).toBe(
        'cat-2',
      );
    });

    it('should not update todos when there are no todos in storage', async () => {
      localStorageSpy.get.and.callFake(((key: string) => {
        if (key === STORAGE_KEYS.CATEGORIES)
          return Promise.resolve(MOCK_CATEGORIES);
        return Promise.resolve(undefined);
      }) as any);

      await datasource.deleteCategory('cat-1');

      const todosCall = localStorageSpy.set.calls
        .all()
        .find((c) => c.args[0] === STORAGE_KEYS.TODOS);
      expect(todosCall).toBeUndefined();
    });

    it('should throw when storage fails', async () => {
      localStorageSpy.get.and.rejectWith(new Error('Storage error'));

      await expectAsync(
        datasource.deleteCategory('cat-1'),
      ).toBeRejectedWithError('Cannot possible delete todo');
    });
  });
});
