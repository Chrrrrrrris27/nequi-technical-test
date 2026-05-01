import { Component, inject, Input } from "@angular/core";
import { Category } from "../../../domain/domain";
import { IonicModule, NavController } from '@ionic/angular';
import { CategoriesService } from "../../services/categories.service";
import { CategoryItemComponent } from "../category-item/category-item.component";
import { AlertController } from '@ionic/angular/standalone';
import { TodoFormComponent } from "../category-form/category-form.component";
import { addIcons } from "ionicons";
import { close } from "ionicons/icons";

@Component({
  selector: 'categories-list',
  templateUrl: './categories-list.component.html',
  standalone: true,
  imports: [IonicModule, CategoryItemComponent, TodoFormComponent],
})
export class CategoriesListComponent {
  
  isModalOpen = false;
  selectedCategory?: Category;

  @Input({ required: true })
  categories: Category[] = [];

  categoriesService = inject(CategoriesService);

  constructor(
    private alertController: AlertController,
  ) {
    addIcons({close});
  }

  onEditedCategory(category: Category) {
    this.selectedCategory = category;
    this.setModalOpen(true);
  }

  setModalOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  async onDeleteCategory(id: string) {
    const alert = await this.alertController.create({
      header: '¿Eliminar categoría?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {},
        },
        {
          text: 'Eliminar',
          role: 'confirm',
          handler: () => {
            this.categoriesService.deleteCategory(id);
          },
        },
      ],
    });

    await alert.present();
  }

  onUpdateCategory(name: string) {
    if (this.selectedCategory) {
      const updatedCategory = {
        ...this.selectedCategory,
        name,
      }
      this.categoriesService.updateCategory(updatedCategory)
        .then((_) => this.setModalOpen(false));
    }
  }
}