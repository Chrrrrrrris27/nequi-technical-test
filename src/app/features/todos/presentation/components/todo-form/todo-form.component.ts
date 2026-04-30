import { Component, Input, effect, inject, input } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { Category, Todo } from 'src/app/features';
import { TodosService } from '../../services/todos.service';

@Component({
  selector: 'todo-form',
  standalone: true,
  imports: [ReactiveFormsModule, IonicModule],
  templateUrl: './todo-form.component.html',
})
export class TodoFormComponent {

  private fb = inject(FormBuilder);
  private todosService = inject(TodosService);

  defaultTodo = input<Todo | undefined>();

  @Input() categories: Category[] = [];

  form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    categoryId: [''],
  });

  constructor(
    private nav: NavController
  ) {
    effect(() => {
      const todo = this.defaultTodo();
      if (!todo) {
        this.form.reset();
        return;
      }

      this.form.patchValue({
        title: todo.title,
        categoryId: todo.categoryId,
      });
    });
  }
  

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const todo = this.defaultTodo();
    if (!!todo) {
      const updatedTodo = {
        ...todo,
        ...value,
      }
      this.todosService.updateTodo(updatedTodo)
        .then((_) => {
          this.nav.navigateForward('/tabs/todos');
        });
      return;
    }
      
    this.todosService.createTodo(value.title, value.categoryId)
      .then((_) => {
        this.nav.navigateForward('/tabs/todos');
      });
  }
}