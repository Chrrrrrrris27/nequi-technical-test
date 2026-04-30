import { Inject, Injectable } from "@angular/core";
import { CATEGORIES_DATASOURCE, CategoriesDatasource, CategoriesRepository, Category } from "../../domain/domain";

@Injectable()
export class CategoriesRepositoryImpl implements CategoriesRepository {

  constructor(
    @Inject(CATEGORIES_DATASOURCE) private datasource: CategoriesDatasource
  ) {}

  getCategories(limit: number, offset: number): Promise<Category[]> {
    return this.datasource.getCategories(limit, offset);
  }
  getById(id: string): Promise<Category | undefined> {
    return this.datasource.getById(id);
  }
  createCategory(name: string): Promise<Category> {
    return this.datasource.createCategory(name);
  }
  updateCategory(updatedCategory: Category): Promise<void> {
    return this.datasource.updateCategory(updatedCategory);
  }
  deleteCategory(id: string): Promise<void> {
    return this.datasource.deleteCategory(id);
  }

}
