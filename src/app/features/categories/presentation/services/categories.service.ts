import { computed, inject, Inject, Injectable, signal } from "@angular/core";
import { CATEGORIES_REPOSITORY, CategoriesRepository, Category } from "../../domain/domain";
import { LoaderService } from "src/app/shared";

@Injectable()
export class CategoriesService {
  loader = inject(LoaderService);
  categories = signal<Category[]>([]);

  constructor(@Inject(CATEGORIES_REPOSITORY) private repository: CategoriesRepository) {
    this.getCategories();
  }

  async getCategories(limit: number = 20, offset: number = 0) {
    this.loader.show();
    this.categories.set(await this.repository.getCategories(limit, offset));
    this.loader.hide();
  }

  getCategoryByID(id: string) {
    if (id.length === 0) return computed(() => undefined);
    return computed(() =>
      this.categories().find((category) => category.id === id)
    );
  }

  async createCategory(name: string) {
    try {
      this.loader.show();
      const newCategory = await this.repository.createCategory(name);
      this.categories.set([newCategory, ...this.categories()]);
    } catch (error) {
      
    } finally {
      this.loader.hide();
    }
  }

  async updateCategory(updatedCategory: Category) {
    this.loader.show();
    const previousCategories = this.categories();
    
    const updatedCategories = previousCategories.map((category) =>
      category.id === updatedCategory.id ? updatedCategory : category,
    );
    
    this.categories.set(updatedCategories);
    
    try {
      await this.repository.updateCategory(updatedCategory);
    } catch (error) {
      this.categories.set(previousCategories);
    } finally {
      this.loader.hide();
    }
  }

  async deleteCategory(id: string) {
    this.loader.show();
    const previousCategories = this.categories();

    const updatedCategories = previousCategories.filter((category) => category.id !== id);

    this.categories.set(updatedCategories);

    try {
      await this.repository.deleteCategory(id);
    } catch (error) {
      this.categories.set(previousCategories);
    } finally {
      this.loader.hide();
    }
  }
}