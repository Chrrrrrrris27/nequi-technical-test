import { Component, inject, Input } from '@angular/core';
import { Todo } from '../../../domain/domain';
import { TodoComponent } from "../todo/todo.component";
import { IonList, IonNote } from "@ionic/angular/standalone";
import { TodosService } from '../../services/todos.service';

@Component({
  selector: 'todo-list',
  templateUrl: './todo-list.component.html',
  standalone: true,
  imports: [IonList, TodoComponent, IonNote, ],
})
export class TodosList {
  
  todosService = inject(TodosService);

  @Input({ required: true })
  todos: Todo[] = [];

  onToggleTodo(id: string) {
    this.todosService.toggleTodo(id);
  }

  onEditedTodo(todo: Todo) {
    this.todosService.updateTodo(todo);
  }

  onDeleteTodo(id: string) {
    this.todosService.deleteTodo(id);
  }
}
