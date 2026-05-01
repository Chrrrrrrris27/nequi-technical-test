import { Component, inject, Input } from '@angular/core';
import { Todo } from '../../../domain/domain';
import { TodoComponent } from "../todo/todo.component";
import { IonList, IonNote, AlertController, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonIcon } from "@ionic/angular/standalone";
import { TodosService } from '../../services/todos.service';
import { NavController } from '@ionic/angular';
import { TodoFormComponent } from "../todo-form/todo-form.component";
import { Category } from 'src/app/features/categories/domain/domain';
import { addIcons } from 'ionicons';
import { close } from 'ionicons/icons';

@Component({
  selector: 'todo-list',
  templateUrl: './todo-list.component.html',
  standalone: true,
  imports: [IonIcon, IonContent, IonButton, IonButtons, IonTitle, IonToolbar, IonHeader, IonModal, IonList, TodoComponent, IonNote, TodoFormComponent],
})
export class TodosList {
  
  todosService = inject(TodosService);
  isModalOpen = false;
  selectedTodo?: Todo;

  @Input({ required: true })
  todos: Todo[] = [];

  @Input()
  categories: Category[] = [];

  constructor(
    private alertController: AlertController
  ) {
    addIcons({close})
  }

  onToggleTodo(id: string) {
    this.todosService.toggleTodo(id);
  }

  onEditedTodo(todo: Todo) {
    this.selectedTodo = todo;
    this.setModalOpen(true);
  }

  setModalOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  async onDeleteTodo(id: string) {
    const alert = await this.alertController.create({
      header: '¿Eliminar tarea?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {},
        },
        {
          text: 'Eliminar',
          role: 'confirm',
          handler: () => {
            this.todosService.deleteTodo(id);
          },
        },
      ],
    });

    await alert.present();
  }

  onUpdateTodo(data: {
    title: string;
    categoryId?: string;
  }) {
    if (this.selectedTodo) {
      const updatedTodo = {
        ...this.selectedTodo,
        ...data,
      }
      this.todosService.updateTodo(updatedTodo)
        .then((_) => this.setModalOpen(false));
    }
  }
}
