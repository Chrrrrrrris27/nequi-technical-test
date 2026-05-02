import { Component, EventEmitter, Input, Output, effect, inject, input } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonInput,IonList , IonItem, IonText, IonLabel, IonSelectOption, IonButton } from '@ionic/angular/standalone';
import { Category, Todo } from 'src/app/features';

@Component({
  selector: 'todo-form',
  standalone: true,
  imports: [ReactiveFormsModule, IonInput, IonList, IonItem, IonText, IonLabel, IonSelectOption, IonButton],
  templateUrl: './todo-form.component.html',
})
export class TodoFormComponent {

  private fb = inject(FormBuilder);

  defaultTodo = input<Todo | undefined>();

  @Input() categories: Category[] = [];

  @Output()
  submitEmitter = new EventEmitter<{
    title: string;
    categoryId?: string;
  }>();

  form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    categoryId: [''],
  });

  constructor() {
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
    this.submitEmitter.emit({
      ...value
    });
  }
}