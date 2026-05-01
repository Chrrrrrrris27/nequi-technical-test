import { computed, inject, Inject, Injectable, signal } from "@angular/core";
import { CATEGORIES_REPOSITORY, CategoriesRepository, Category } from "../../domain/domain";
import { LoaderService, ToastService } from "src/app/shared";

@Injectable()
export class CategoriesService {
  private loader = inject(LoaderService);
  private toastService = inject(ToastService);
  categories = signal<Category[]>([]);

  constructor(@Inject(CATEGORIES_REPOSITORY) private repository: CategoriesRepository) {
    this.getCategories();
  }

  async getCategories() {
    this.loader.show();
    this.categories.set(await this.repository.getCategories());
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
      this.toastService.addToast({
        message: 'Categoría creada!',
        color: 'success',
        icon: 'checkmark',
      });
    } catch (error) {
      this.toastService.addToast({
        message: 'Ups! Algo salió mal.',
        color: 'danger',
        icon: 'close',
      });
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
    
    this.toastService.addToast({
      message: 'Categoría actualizada!',
      color: 'success',
      icon: 'checkmark',
    });
    try {
      await this.repository.updateCategory(updatedCategory);
    } catch (error) {
      this.categories.set(previousCategories);
      this.toastService.addToast({
        message: 'Ups! Algo salió mal.',
        color: 'danger',
        icon: 'close',
      });
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
      this.toastService.addToast({
        message: 'Categoría eliminada!',
        color: 'danger',
        icon: 'alert',
      });
    } catch (error) {
      this.categories.set(previousCategories);
      this.toastService.addToast({
        message: 'Ups! Algo salió mal.',
        color: 'danger',
        icon: 'close',
      });
    } finally {
      this.loader.hide();
    }
  }
}