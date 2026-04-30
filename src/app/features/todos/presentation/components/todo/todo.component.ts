import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Todo } from "../../../domain/domain";
import { IonLabel, IonIcon } from "@ionic/angular/standalone";
import { checkbox, squareOutline } from 'ionicons/icons';
import { addIcons } from "ionicons";
import { SlidingButtonComponent } from "src/app/shared";

@Component({
  selector: 'todo-item',
  templateUrl: './todo.component.html',
  styleUrl: './todo.styles.scss',
  standalone: true,
  imports: [IonIcon, IonLabel, SlidingButtonComponent],
})
export class TodoComponent {
  
  @Input({required: true})
  todo!: Todo;

  @Output()
  toggleTodoEmitter = new EventEmitter<string>();

  @Output()
  editTodoEmitter = new EventEmitter<Todo>();

  @Output()
  deleteTodoEmitter = new EventEmitter<string>();

  constructor() {
    addIcons({checkbox, squareOutline});
  }

  onToggleTodoEmitter() {
    this.toggleTodoEmitter.emit(this.todo.id);
  }

  onEditTodoEmitter() {
    this.editTodoEmitter.emit(this.todo);
  }
  
  onDeleteTodoEmitter() {
    this.deleteTodoEmitter.emit(this.todo.id);
  }
}