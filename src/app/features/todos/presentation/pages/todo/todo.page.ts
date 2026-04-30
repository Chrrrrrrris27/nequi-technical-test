import { Component, computed, inject } from '@angular/core';
import { TodosService } from '../../services/todos.service';
import { IonContent, IonTitle, IonHeader, IonToolbar, IonButtons, IonBackButton } from '@ionic/angular/standalone';
import { TodoFormComponent } from "../../components/todo-form/todo-form.component";
import { ActivatedRoute } from '@angular/router';
import { CategoriesService } from 'src/app/features/categories/presentation/services/categories.service';

@Component({
  selector: 'todo-page',
  templateUrl: './todo.page.html',
  standalone: true,
  imports: [IonBackButton, IonButtons, IonToolbar, IonHeader, IonTitle, IonContent, TodoFormComponent],
})
export class TodoPage {

  private route = inject(ActivatedRoute);
  private todosService = inject(TodosService);
  private categoriesService = inject(CategoriesService);
  
  todoId = this.route.snapshot.queryParamMap.get('id');
  defaultTodo = this.todosService.getTodoByID(this.todoId ?? '');
  categories = this.categoriesService.categories;
}
