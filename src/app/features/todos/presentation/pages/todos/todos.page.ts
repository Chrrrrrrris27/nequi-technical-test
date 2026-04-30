import { Component, inject } from '@angular/core';
import { TodosList } from "../../components/todo-list/todo-list.component";
import { TodosService } from '../../services/todos.service';
import { IonContent } from "@ionic/angular/standalone";

@Component({
  selector: 'todos-page',
  templateUrl: './todos.page.html',
  styleUrl: './todos.page.scss',  
  standalone: true,
  imports: [TodosList, IonContent],
})
export class TodosPage {
  private todosService = inject(TodosService);
  todos = this.todosService.todos;
}
