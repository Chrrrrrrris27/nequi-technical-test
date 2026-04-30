import { Component, inject } from '@angular/core';
import { TodosList } from "../../components/todo-list/todo-list.component";
import { TodosService } from '../../services/todos.service';
import { IonContent, IonFab, IonFabButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { NavController } from '@ionic/angular';
import { LoaderService } from 'src/app/shared';

@Component({
  selector: 'todos-page',
  templateUrl: './todos.page.html',
  styleUrl: './todos.page.scss',
  standalone: true,
  imports: [TodosList, IonContent, IonFab, IonFabButton, IonIcon],
})
export class TodosPage {
  private todosService = inject(TodosService);
  private loaderService = inject(LoaderService);
  todos = this.todosService.todos;
  isLoading = this.loaderService.loading;

  constructor(private nav: NavController) {
    addIcons({ add });
  }

  onCreateTodo() {
    this.nav.navigateForward('/todo');
  }
}
