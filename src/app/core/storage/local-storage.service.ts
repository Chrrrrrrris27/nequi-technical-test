import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  
  private _storage?: Storage | null = null;

  constructor(private storage: Storage) {}

  async init() {
    this._storage = await this.storage.create();
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
