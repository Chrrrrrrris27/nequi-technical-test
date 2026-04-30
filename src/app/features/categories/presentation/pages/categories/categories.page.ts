import { Component, inject, OnInit } from '@angular/core';
import { IonContent, IonFab, IonIcon, IonFabButton } from "@ionic/angular/standalone";
import { CategoriesService } from '../../services/categories.service';
import { CategoriesListComponent } from "../../components/categories-list/categories-list.component";
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { NavController } from '@ionic/angular';
import { LoaderService } from 'src/app/shared';

@Component({
  selector: 'categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
  standalone: true,
  imports: [IonFabButton, IonIcon, IonFab, IonContent, CategoriesListComponent],
})
export class CategoriesPage {

  private categoriesService = inject(CategoriesService);
  private loaderService = inject(LoaderService);
  isLoading = this.loaderService.loading;
  categories = this.categoriesService.categories;

  constructor(private nav: NavController) {
    addIcons({ add });
  }

  onCreateCategory() {
    this.nav.navigateForward('/category');
  }
}
