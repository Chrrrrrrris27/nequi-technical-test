import { Component, computed, inject } from '@angular/core';
import { TodosList } from "../../components/todo-list/todo-list.component";
import { TodosService } from '../../services/todos.service';
import { addIcons } from 'ionicons';
import { add, close } from 'ionicons/icons';
import { IonicModule } from '@ionic/angular';
import { LoaderService, ChipFilterComponent, SelectFilterComponent } from 'src/app/shared';
import { TodoFormComponent } from "../../components/todo-form/todo-form.component";
import { CategoriesService } from 'src/app/features/categories/presentation/services/categories.service';
import {
  InfiniteScrollCustomEvent,
} from '@ionic/angular/standalone';

@Component({
  selector: 'todos-page',
  templateUrl: './todos.page.html',
  styleUrl: './todos.page.scss',
  standalone: true,
  imports: [TodosList, IonicModule, TodoFormComponent, ChipFilterComponent, SelectFilterComponent],
})
export class TodosPage {
  private todosService = inject(TodosService);
  private categoriesService = inject(CategoriesService);
  private loaderService = inject(LoaderService);
  isModalOpen = false;
  todos = this.todosService.todos;
  total = this.todosService.total;
  isAvailableLoadTodos = this.todosService.availableLoadTodos;
  categories = this.categoriesService.categories;
  categoriesChips = computed(() =>  [{id: 'all', title: 'Todas'}, ...this.categories().map(category => ({id: category.id, title: category.name}))]);
  defaultCategory = 'all';
  isLoading = this.loaderService.loading;

  constructor() {
    addIcons({ add, close });
  }

  setModalOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  onCreateTodo(data: { title: string; categoryId?: string }) {
    this.todosService
      .createTodo(data.title, data.categoryId)
      .then((_) => this.setModalOpen(false));
  }

  onCategoriesFiltered(category: string) {
    const listCategories = category === this.defaultCategory ? [] : [category];
    this.todosService.applyFilter(listCategories);
  }

  async onInfiniteScroll(event: InfiniteScrollCustomEvent) {
    setTimeout(async () => {
      await this.todosService.loadTodos();
      event.target.complete();
    }, 1000);
  }
}
