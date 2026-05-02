import { Component, computed, inject, OnInit, ViewChild } from '@angular/core';
import { TodosList } from "../../components/todo-list/todo-list.component";
import { TodosService } from '../../services/todos.service';
import { addIcons } from 'ionicons';
import { add, close } from 'ionicons/icons';
import {
  InfiniteScrollCustomEvent,
  IonContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonModal,
  IonToolbar,
  IonTitle,
  IonButton,
  IonButtons,
} from '@ionic/angular/standalone';
import { LoaderService, SelectFilterComponent, ChipFilterComponent } from 'src/app/shared';
import { TodoFormComponent } from "../../components/todo-form/todo-form.component";
import { CategoriesService } from 'src/app/features/categories/presentation/services/categories.service';
import { TodosInfoComponent } from "../../components/todos-info/todos-info.component";
import { IonHeader } from '@ionic/angular/standalone';

@Component({
  selector: 'todos-page',
  templateUrl: './todos.page.html',
  styleUrl: './todos.page.scss',
  standalone: true,
  imports: [
    IonHeader,
    TodosList,
    TodoFormComponent,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonContent,
    IonFab,
    IonFabButton,
    IonIcon,
    IonModal,
    IonToolbar,
    IonTitle,
    IonButton,
    IonButtons,
    SelectFilterComponent,
    ChipFilterComponent,
    TodosInfoComponent,
  ],
})
export class TodosPage implements OnInit {
  private todosService = inject(TodosService);
  private categoriesService = inject(CategoriesService);
  private loaderService = inject(LoaderService);

  @ViewChild('mainContent') content!: IonContent;

  isModalOpen = false;
  enabledSelectorCategoriesFilter = this.todosService.enabledSelectorCategoriesFilter;
  todos = this.todosService.todos;
  total = this.todosService.total;
  completed = this.todosService.completed;
  pendings = this.todosService.pendings;
  isAvailableLoadTodos = this.todosService.availableLoadTodos;
  categories = this.categoriesService.categories;
  categoriesChips = computed(() => [
    { id: 'all', title: 'Todas' },
    ...this.categories().map((category) => ({
      id: category.id,
      title: category.name,
    })),
  ]);
  defaultCategory = 'all';
  isLoading = this.loaderService.loading;

  constructor() {
    addIcons({ add, close });
  }

  ngOnInit(): void {
    this.todosService.loadTodos();
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.ensureFilledViewport();
    });
  }

  async ensureFilledViewport() {
    if (!this.content) return;

    const scrollEl = await this.content.getScrollElement();

    if (!scrollEl) return;

    const isScrollable = scrollEl.scrollHeight > scrollEl.clientHeight;

    if (!isScrollable && this.todosService.availableLoadTodos()) {
      await this.todosService.loadTodos();
      this.ensureFilledViewport();
    }
  }

  setModalOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  onCreateTodo(data: { title: string; categoryId?: string }) {
    this.todosService
      .createTodo(data.title, data.categoryId)
      .then((_) => this.setModalOpen(false));
  }

  async onCategoriesFiltered(category: string) {
    const listCategories = category === this.defaultCategory ? [] : [category];
    await this.todosService.applyFilter(listCategories);
    this.ensureFilledViewport();
  }

  async onInfiniteScroll(event: InfiniteScrollCustomEvent) {
    setTimeout(async () => {
      await this.todosService.loadTodos();
      event.target.complete();
    }, 1000);
  }
}
