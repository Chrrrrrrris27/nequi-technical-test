import { Injectable } from '@angular/core';
import { LocalStorageService } from 'src/app/core';
import { STORAGE_KEYS } from 'src/app/core/constants/storage-keys';
import { CategoriesDatasource, Category } from '../../domain/domain';
import { Todo } from 'src/app/features/todos/domain/domain';

@Injectable()
export class CateogriesDatasourceLocalStorage implements CategoriesDatasource {
  
  constructor(private localStorageService: LocalStorageService) {}

  async getAll(): Promise<Category[]> {
    try {
      return (
        (await this.localStorageService.get<Category[]>(STORAGE_KEYS.CATEGORIES)) ?? []
      );
    } catch (error) {
      return [];
    }
  }

  async getCategories(): Promise<Category[]> {
    try {
      return await this.getAll();
    } catch (error) {
      return [];
    }
  }

  async getById(id: string): Promise<Category | undefined> {
    const storageTodos = await this.getAll();
    return storageTodos.find((todo) => todo.id === id);
  }

  async createCategory(
    name: string,
  ): Promise<Category> {
    try {
      const storageCategories = await this.getAll();
      const newCategory: Category = {
        id: crypto.randomUUID(),
        name,
      };
      this.localStorageService.set(STORAGE_KEYS.CATEGORIES, [
        newCategory,
        ...storageCategories,
      ]);
      return newCategory;
    } catch (error) {
      throw new Error('Cannot possible create new category');
    }
  }

  async updateCategory(updatedCategory: Category): Promise<void> {
    try {
      const storageCategories = await this.getAll();
      const updatedCategories = storageCategories.map((todo) =>
        todo.id === updatedCategory.id ? updatedCategory : todo,
      );
      this.localStorageService.set(STORAGE_KEYS.CATEGORIES, updatedCategories);
    } catch (error) {
      throw new Error('Cannot possible update todo');
    }
  }

  async deleteCategory(id: string): Promise<void> {
    try {
      const newCategories = (await this.getAll()).filter((todo) => todo.id !== id);
      const todosDB = await this.localStorageService.get<Todo[]>(STORAGE_KEYS.TODOS);
      if (todosDB) {
        const updatedTodos = todosDB.map(todo => todo.categoryId === id ? {
          ...todo,
          categoryId: undefined,
        } : todo);
        await this.localStorageService.set(STORAGE_KEYS.TODOS, updatedTodos);
      }
      await this.localStorageService.set(STORAGE_KEYS.CATEGORIES, newCategories);
    } catch (error) {
      throw new Error('Cannot possible delete todo');
    }
  }
}
