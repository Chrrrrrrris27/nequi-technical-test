import { Component, inject, Input } from "@angular/core";
import { Category } from "../../../domain/domain";
import { IonicModule, NavController } from '@ionic/angular';
import { CategoriesService } from "../../services/categories.service";
import { CategoryItemComponent } from "../category-item/category-item.component";

@Component({
  selector: 'categories-list',
  templateUrl: './categories-list.component.html',
  standalone: true,
  imports: [IonicModule, CategoryItemComponent],
})
export class CategoriesListComponent {
  @Input({required: true})
  categories: Category[] = [];

  categoriesService = inject(CategoriesService);

  constructor(
    private nav: NavController
  ) {}

  onEditedCategory(todo: Category) {
    this.nav.navigateForward(`/category?id=${todo.id}`);
  }

  onDeleteCategory(id: string) {
    this.categoriesService.deleteCategory(id);
  }
}