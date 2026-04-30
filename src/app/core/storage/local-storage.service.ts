import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { STORAGE_KEYS } from '../constants/storage-keys';
import { CATEGORIES_SEED, TODOS_SEED } from 'src/seed/seed';
import { Category, Todo } from 'src/app/features';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {

  private _storage?: Storage | null = null;

  constructor(private storage: Storage) {}

  async init() {
    this._storage = await this.storage.create();  
    await this.seed();
  }

  private async seed() {
    const isDefaultDataLoaded = await this.get(STORAGE_KEYS.DEFAULT_DATA_LOADED_KEY);
    if (!isDefaultDataLoaded) {
      try {
        const newCategories: Category[] = CATEGORIES_SEED.map(category => ({
          id: crypto.randomUUID(),
          title: category
        }));
        await this.set(STORAGE_KEYS.CATEGORIES, newCategories);
        const newTodos: Todo[] = TODOS_SEED.map(todo => ({
          ...todo,
          id: crypto.randomUUID(),
          categoryId: newCategories.find(category => category.title === todo.category)?.id
        }))
        await this.set(STORAGE_KEYS.TODOS, newTodos);
        await this.set(STORAGE_KEYS.DEFAULT_DATA_LOADED_KEY, true);
      } catch (error) {
        await this.remove(STORAGE_KEYS.CATEGORIES);
        await this.remove(STORAGE_KEYS.TODOS);
        await this.set(STORAGE_KEYS.DEFAULT_DATA_LOADED_KEY, false);
      }
    }
  }

  async set<T>(key: string, value: any): Promise<void> {
    await this._storage?.set(key, value);
  }

  async get<T>(key: string): Promise<T | undefined> {
    try {
      const value = await this._storage?.get(key);
      return value ? value as T : undefined;
    } catch (error) {
      return undefined;
    }
  }

  async remove(key: string): Promise<void> {
    await this._storage?.remove(key);
  }
}
