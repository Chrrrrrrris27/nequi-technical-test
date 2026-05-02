import { Component, inject } from '@angular/core';
import { IonContent, IonFab, IonIcon, IonFabButton, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonText } from '@ionic/angular/standalone';
import { CategoriesService } from '../../services/categories.service';
import { CategoriesListComponent } from "../../components/categories-list/categories-list.component";
import { addIcons } from 'ionicons';
import { add, close } from 'ionicons/icons';
import { LoaderService } from 'src/app/shared';
import { TodoFormComponent } from "../../components/category-form/category-form.component";

@Component({
  selector: 'categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
  standalone: true,
  imports: [IonButton, IonButtons, IonTitle, IonToolbar, IonHeader, IonModal, IonFabButton, IonIcon, IonFab, IonContent, CategoriesListComponent, TodoFormComponent],
})
export class CategoriesPage {
  private categoriesService = inject(CategoriesService);

  private loaderService = inject(LoaderService);
  isModalOpen = false;
  isLoading = this.loaderService.loading;
  categories = this.categoriesService.categories;

  constructor() {
    addIcons({ add, close });
  }

  setModalOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  onCreateCategory(name: string) {
    this.categoriesService.createCategory(name)
      .then((_) => this.setModalOpen(false));
  }
}
