import { InjectionToken } from "@angular/core";
import { Category } from "../domain";

export const CATEGORIES_REPOSITORY = new InjectionToken<CategoriesRepository>('CategoriesRepository');

export abstract class CategoriesRepository {
  abstract getCategories(limit: number, offset: number): Promise<Category[]>;
    abstract getById(id: string): Promise<Category | undefined>;
    abstract createCategory(name: string): Promise<Category>;
    abstract updateCategory(updatedCategory: Category): Promise<void>;
    abstract deleteCategory(id: string): Promise<void>;
}