import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Category } from "../../../domain/domain";
import { SlidingButtonComponent } from "src/app/shared";
import { IonLabel } from "@ionic/angular/standalone";

@Component({
  selector: 'category-item',
  templateUrl: './category-item.component.html',
  standalone: true,
  imports: [IonLabel, SlidingButtonComponent],
})
export class CategoryItemComponent {
  @Input({required: true})
  category!: Category;

  @Output()
  editCategoryEmitter = new EventEmitter<Category>();

  @Output()
  deleteCategoryEmitter = new EventEmitter<string>();

  onEditCategoryEmitter() {
    this.editCategoryEmitter.emit(this.category);
  }
  
  onDeleteCategoryEmitter() {
    this.deleteCategoryEmitter.emit(this.category.id);
  }
}