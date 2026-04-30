import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Todo } from "../../../domain/domain";
import { IonItemSliding, IonItem, IonLabel, IonItemOptions, IonItemOption, IonIcon } from "@ionic/angular/standalone";
import { pencil, trash, checkbox, squareOutline } from 'ionicons/icons';
import { addIcons } from "ionicons";

@Component({
  selector: 'todo-item',
  templateUrl: './todo.component.html',
  styleUrl: './todo.styles.scss',
  standalone: true,
  imports: [IonIcon, IonItemOption, IonItemOptions, IonLabel, IonItem, IonItemSliding],
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
    addIcons({trash, pencil, checkbox, squareOutline});
  }

  onToggleTodoEmitter() {
    this.toggleTodoEmitter.emit(this.todo.id);
  }

  onEditTodoEmitter() {
    this.editTodoEmitter.emit(this.todo);
  }
  
  onDeleteTodoEmitter(sliding: IonItemSliding) {
    sliding.close();
    this.deleteTodoEmitter.emit(this.todo.id);
  }
}