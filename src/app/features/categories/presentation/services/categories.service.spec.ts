import { TestBed } from '@angular/core/testing';
import { CategoriesService } from './categories.service';
import { CATEGORIES_REPOSITORY, CategoriesRepository } from '../../domain/domain';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { Category } from '../../domain/domain';

const MOCK_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Work' },
  { id: 'cat-2', name: 'Personal' },
  { id: 'cat-3', name: 'Shopping' },
];

describe('CategoriesService', () => {
  let service: CategoriesService;
  let repositorySpy: jasmine.SpyObj<CategoriesRepository>;
  let loaderSpy: jasmine.SpyObj<LoaderService>;
  let toastSpy: jasmine.SpyObj<ToastService>;

  beforeEach(() => {
    repositorySpy = jasmine.createSpyObj<CategoriesRepository>('CategoriesRepository', [
      'getCategories', 'getById', 'createCategory', 'updateCategory', 'deleteCategory',
    ]);
    loaderSpy = jasmine.createSpyObj<LoaderService>('LoaderService', ['show', 'hide']);
    toastSpy  = jasmine.createSpyObj<ToastService>('ToastService', ['addToast']);

    repositorySpy.getCategories.and.resolveTo(MOCK_CATEGORIES);

    TestBed.configureTestingModule({
      providers: [
        CategoriesService,
        { provide: CATEGORIES_REPOSITORY, useValue: repositorySpy },
        { provide: LoaderService,         useValue: loaderSpy },
        { provide: ToastService,          useValue: toastSpy },
      ],
    });

    service = TestBed.inject(CategoriesService);
  });

  describe('initial state', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should start with empty categories signal', () => {
      expect(service.categories()).toEqual([]);
    });

    it('should call getCategories on construction', () => {
      expect(repositorySpy.getCategories).toHaveBeenCalledTimes(1);
    });
  });

  describe('getCategories', () => {
    it('should load categories into the signal', async () => {
      await service.getCategories();

      expect(service.categories()).toEqual(MOCK_CATEGORIES);
    });

    it('should show and hide loader', async () => {
      await service.getCategories();

      expect(loaderSpy.show).toHaveBeenCalled();
      expect(loaderSpy.hide).toHaveBeenCalled();
    });

    it('should replace existing categories on each call', async () => {
      service.categories.set([{ id: 'old', name: 'Old' }]);
      repositorySpy.getCategories.and.resolveTo(MOCK_CATEGORIES);

      await service.getCategories();

      expect(service.categories()).toEqual(MOCK_CATEGORIES);
    });
  });

  describe('getCategoryByID', () => {
    beforeEach(() => {
      service.categories.set(MOCK_CATEGORIES);
    });

    it('should return a computed signal with the matching category', () => {
      const result = service.getCategoryByID('cat-2');

      expect(result()).toEqual(MOCK_CATEGORIES[1]);
    });

    it('should return undefined for a non-existent id', () => {
      const result = service.getCategoryByID('cat-999');

      expect(result()).toBeUndefined();
    });

    it('should return a computed that always returns undefined for empty id', () => {
      const result = service.getCategoryByID('');

      expect(result()).toBeUndefined();
    });

    it('should update reactively when categories signal changes', () => {
      const result = service.getCategoryByID('cat-1');
      const updated: Category = { id: 'cat-1', name: 'Updated Work' };

      service.categories.set([updated, MOCK_CATEGORIES[1], MOCK_CATEGORIES[2]]);

      expect(result()).toEqual(updated);
    });
  });

  describe('createCategory', () => {
    const newCategory: Category = { id: 'cat-99', name: 'Health' };

    beforeEach(() => {
      service.categories.set(MOCK_CATEGORIES);
      repositorySpy.createCategory.and.resolveTo(newCategory);
    });

    it('should prepend the new category to the list', async () => {
      await service.createCategory('Health');

      expect(service.categories()[0]).toEqual(newCategory);
      expect(service.categories().length).toBe(MOCK_CATEGORIES.length + 1);
    });

    it('should call repository with the correct name', async () => {
      await service.createCategory('Health');

      expect(repositorySpy.createCategory).toHaveBeenCalledWith('Health');
    });

    it('should show success toast on success', async () => {
      await service.createCategory('Health');

      expect(toastSpy.addToast).toHaveBeenCalledWith(
        jasmine.objectContaining({ color: 'success' }),
      );
    });

    it('should show error toast when repository throws', async () => {
      repositorySpy.createCategory.and.rejectWith(new Error('fail'));

      await service.createCategory('Health');

      expect(toastSpy.addToast).toHaveBeenCalledWith(
        jasmine.objectContaining({ color: 'danger' }),
      );
    });

    it('should not modify the list when repository throws', async () => {
      repositorySpy.createCategory.and.rejectWith(new Error('fail'));

      await service.createCategory('Health');

      expect(service.categories()).toEqual(MOCK_CATEGORIES);
    });

    it('should show and hide loader', async () => {
      await service.createCategory('Health');

      expect(loaderSpy.show).toHaveBeenCalled();
      expect(loaderSpy.hide).toHaveBeenCalled();
    });

    it('should hide loader even when repository throws', async () => {
      repositorySpy.createCategory.and.rejectWith(new Error('fail'));

      await service.createCategory('Health');

      expect(loaderSpy.hide).toHaveBeenCalled();
    });
  });

  describe('updateCategory', () => {
    const updated: Category = { id: 'cat-1', name: 'Updated Work' };

    beforeEach(async () => {
      await service.getCategories();
      repositorySpy.updateCategory.and.resolveTo();
    });

    it('should optimistically update the category in the list', async () => {
      await service.updateCategory(updated);

      expect(service.categories().find(c => c.id === 'cat-1')).toEqual(updated);
    });

    it('should not modify other categories', async () => {
      await service.updateCategory(updated);

      expect(service.categories().find(c => c.id === 'cat-2')).toEqual(MOCK_CATEGORIES[1]);
      expect(service.categories().find(c => c.id === 'cat-3')).toEqual(MOCK_CATEGORIES[2]);
    });

    it('should show success toast on success', async () => {
      await service.updateCategory(updated);

      expect(toastSpy.addToast).toHaveBeenCalledWith(
        jasmine.objectContaining({ color: 'success' }),
      );
    });

    it('should rollback to previous state when repository throws', async () => {
      repositorySpy.updateCategory.and.rejectWith(new Error('fail'));

      await service.updateCategory(updated);

      expect(service.categories()).toEqual(MOCK_CATEGORIES);
    });

    it('should show error toast on rollback', async () => {
      repositorySpy.updateCategory.and.rejectWith(new Error('fail'));

      await service.updateCategory(updated);

      expect(toastSpy.addToast).toHaveBeenCalledWith(
        jasmine.objectContaining({ color: 'danger' }),
      );
    });

    it('should show and hide loader', async () => {
      await service.updateCategory(updated);

      expect(loaderSpy.show).toHaveBeenCalled();
      expect(loaderSpy.hide).toHaveBeenCalled();
    });

    it('should hide loader even when repository throws', async () => {
      repositorySpy.updateCategory.and.rejectWith(new Error('fail'));

      await service.updateCategory(updated);

      expect(loaderSpy.hide).toHaveBeenCalled();
    });
  });

  describe('deleteCategory', () => {
    beforeEach(async () => {
      await service.getCategories();
      repositorySpy.deleteCategory.and.resolveTo();
    });

    it('should optimistically remove the category from the list', async () => {
      await service.deleteCategory('cat-2');

      expect(service.categories().find(c => c.id === 'cat-2')).toBeUndefined();
      expect(service.categories().length).toBe(MOCK_CATEGORIES.length - 1);
    });

    it('should keep remaining categories intact', async () => {
      await service.deleteCategory('cat-2');

      expect(service.categories()).toEqual([MOCK_CATEGORIES[0], MOCK_CATEGORIES[2]]);
    });

    it('should show success toast on success', async () => {
      await service.deleteCategory('cat-2');

      expect(toastSpy.addToast).toHaveBeenCalledWith(
        jasmine.objectContaining({ color: 'danger', icon: 'alert' }),
      );
    });

    it('should rollback to previous state when repository throws', async () => {
      repositorySpy.deleteCategory.and.rejectWith(new Error('fail'));

      await service.deleteCategory('cat-2');

      expect(service.categories()).toEqual(MOCK_CATEGORIES);
    });

    it('should show error toast on rollback', async () => {
      repositorySpy.deleteCategory.and.rejectWith(new Error('fail'));

      await service.deleteCategory('cat-2');

      expect(toastSpy.addToast).toHaveBeenCalledWith(
        jasmine.objectContaining({ color: 'danger', icon: 'close' }),
      );
    });

    it('should show and hide loader', async () => {
      await service.deleteCategory('cat-2');

      expect(loaderSpy.show).toHaveBeenCalled();
      expect(loaderSpy.hide).toHaveBeenCalled();
    });

    it('should hide loader even when repository throws', async () => {
      repositorySpy.deleteCategory.and.rejectWith(new Error('fail'));

      await service.deleteCategory('cat-2');

      expect(loaderSpy.hide).toHaveBeenCalled();
    });
  });
});
