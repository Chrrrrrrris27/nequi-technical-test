import { Component, inject } from "@angular/core";
import { IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent } from "@ionic/angular/standalone";
import { CategoriesService } from "../../services/categories.service";
import { ActivatedRoute } from "@angular/router";
import { TodoFormComponent } from "../../components/category-form/category-form.component";

@Component({
  selector: 'category',
  templateUrl: './category.page.html',
  standalone: true,
  imports: [IonContent, IonTitle, IonBackButton, IonButtons, IonToolbar, IonHeader, TodoFormComponent],
})
export class CategoryPage {
  private route = inject(ActivatedRoute);
  private categoriesService = inject(CategoriesService);
  
  categoryId = this.route.snapshot.queryParamMap.get('id');
  defaultCategory = this.categoriesService.getCategoryByID(this.categoryId ?? '');
}