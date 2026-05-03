import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from './local-storage.service';
import { Storage } from '@ionic/storage-angular';
import { STORAGE_KEYS } from '../constants/storage-keys';
import { CATEGORIES_SEED, TODOS_SEED } from 'src/seed/seed';

describe('LocalStorageService', () => {
  let service: LocalStorageService;
  let storageSpy: jasmine.SpyObj<Storage>;
  let store: Record<string, any>;

  beforeEach(() => {
    store = {};

    storageSpy = jasmine.createSpyObj<Storage>('Storage', [
      'create', 'set', 'get', 'remove',
    ]);
    
    storageSpy.create.and.resolveTo(storageSpy as any);

    storageSpy.set.and.callFake((key: string, value: any) => {
      store[key] = value;
      return Promise.resolve();
    });

    storageSpy.get.and.callFake((key: string) => {
      return Promise.resolve(store[key] ?? null);
    });

    storageSpy.remove.and.callFake((key: string) => {
      delete store[key];
      return Promise.resolve();
    });

    TestBed.configureTestingModule({
      providers: [
        LocalStorageService,
        { provide: Storage, useValue: storageSpy },
      ],
    });

    service = TestBed.inject(LocalStorageService);
  });

  describe('init', () => {
    it('should call storage.create()', async () => {
      await service.init();

      expect(storageSpy.create).toHaveBeenCalledTimes(1);
    });

    it('should seed data on first init (DEFAULT_DATA_LOADED_KEY not set)', async () => {
      await service.init();

      expect(storageSpy.set).toHaveBeenCalledWith(
        STORAGE_KEYS.DEFAULT_DATA_LOADED_KEY,
        true,
      );
    });

    it('should not seed data when DEFAULT_DATA_LOADED_KEY is already true', async () => {
      store[STORAGE_KEYS.DEFAULT_DATA_LOADED_KEY] = true;

      await service.init();

      expect(storageSpy.set).not.toHaveBeenCalled();
    });

    it('should seed the correct number of categories', async () => {
      await service.init();

      const categories = store[STORAGE_KEYS.CATEGORIES];
      expect(categories.length).toBe(CATEGORIES_SEED.length);
    });

    it('should seed categories with the correct names', async () => {
      await service.init();

      const categories = store[STORAGE_KEYS.CATEGORIES];
      const names = categories.map((c: any) => c.name);
      expect(names).toEqual(CATEGORIES_SEED);
    });

    it('should seed categories each with a unique id', async () => {
      await service.init();

      const categories = store[STORAGE_KEYS.CATEGORIES];
      const ids = categories.map((c: any) => c.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(CATEGORIES_SEED.length);
    });

    it('should seed the correct number of todos', async () => {
      await service.init();

      const todos = store[STORAGE_KEYS.TODOS];
      expect(todos.length).toBe(TODOS_SEED.length);
    });

    it('should seed todos with correct titles and completed flags', async () => {
      await service.init();

      const todos = store[STORAGE_KEYS.TODOS];
      TODOS_SEED.forEach((seed, i) => {
        expect(todos[i].title).toBe(seed.title);
        expect(todos[i].completed).toBe(seed.completed);
      });
    });

    it('should link each todo to the correct category id', async () => {
      await service.init();

      const categories = store[STORAGE_KEYS.CATEGORIES];
      const todos = store[STORAGE_KEYS.TODOS];

      TODOS_SEED.forEach((seed, i) => {
        const expectedCategory = categories.find((c: any) => c.name === seed.category);
        expect(todos[i].categoryId).toBe(expectedCategory?.id);
      });
    });

    it('should clean up and mark seed as failed when set throws', async () => {
      let callCount = 0;
      storageSpy.set.and.callFake((key: string, value: any) => {
        callCount++;
        if (callCount === 1) return Promise.reject(new Error('Storage error'));
        store[key] = value;
        return Promise.resolve();
      });

      await service.init();

      expect(storageSpy.remove).toHaveBeenCalledWith(STORAGE_KEYS.CATEGORIES);
      expect(storageSpy.remove).toHaveBeenCalledWith(STORAGE_KEYS.TODOS);
      expect(storageSpy.set).toHaveBeenCalledWith(
        STORAGE_KEYS.DEFAULT_DATA_LOADED_KEY,
        false,
      );
    });
  });

  describe('set', () => {
    beforeEach(async () => {
      await service.init();
      storageSpy.set.calls.reset();
    });

    it('should delegate to the underlying storage', async () => {
      await service.set('my-key', 'my-value');

      expect(storageSpy.set).toHaveBeenCalledWith('my-key', 'my-value');
    });

    it('should persist the value so get can retrieve it', async () => {
      await service.set('my-key', { foo: 'bar' });

      const result = await service.get('my-key');
      expect(result).toEqual({ foo: 'bar' });
    });
  });

  describe('get', () => {
    beforeEach(async () => {
      await service.init();
    });

    it('should return the stored value', async () => {
      store['my-key'] = 'hello';

      const result = await service.get('my-key');

      expect(result).toBe('hello');
    });

    it('should return undefined when key does not exist', async () => {
      const result = await service.get('non-existent');

      expect(result).toBeUndefined();
    });

    it('should return undefined when storage.get throws', async () => {
      storageSpy.get.and.rejectWith(new Error('Storage error'));

      const result = await service.get('any-key');

      expect(result).toBeUndefined();
    });

    it('should return undefined when storage.get returns null', async () => {
      storageSpy.get.and.resolveTo(null);

      const result = await service.get('any-key');

      expect(result).toBeUndefined();
    });
  });

  describe('remove', () => {
    beforeEach(async () => {
      await service.init();
    });

    it('should delegate to the underlying storage', async () => {
      await service.remove('my-key');

      expect(storageSpy.remove).toHaveBeenCalledWith('my-key');
    });

    it('should make the key unavailable after removal', async () => {
      store['my-key'] = 'value';

      await service.remove('my-key');

      const result = await service.get('my-key');
      expect(result).toBeUndefined();
    });
  });
});
