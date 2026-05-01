import { Component, inject, OnInit } from '@angular/core';
import { TodosList } from "../../components/todo-list/todo-list.component";
import { TodosService } from '../../services/todos.service';
import { addIcons } from 'ionicons';
import { add, close } from 'ionicons/icons';
import { IonicModule } from '@ionic/angular';
import { LoaderService } from 'src/app/shared';
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
  imports: [TodosList, IonicModule, TodoFormComponent],
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

  async onInfiniteScroll(event: InfiniteScrollCustomEvent) {
    setTimeout(async () => {
      await this.todosService.loadTodos();
      event.target.complete();
    }, 1000);
  }
}
