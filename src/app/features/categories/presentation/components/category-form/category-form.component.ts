import { Component, effect, EventEmitter, inject, input, Output } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonInput,IonList , IonItem, IonText, IonLabel, IonButton } from '@ionic/angular/standalone';
import { Category } from 'src/app/features';
import {  NavController } from '@ionic/angular';

@Component({
  selector: 'category-form',
  standalone: true,
  imports: [ReactiveFormsModule, IonInput, IonList, IonItem, IonText, IonLabel, IonButton],
  templateUrl: './category-form.component.html',
})
export class TodoFormComponent {

  private fb = inject(FormBuilder);

  defaultCategory = input<Category | undefined>();

  @Output()
  submitEmitter = new EventEmitter<string>();

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
  });

  constructor(
    private nav: NavController
  ) {
    effect(() => {
      const category = this.defaultCategory();
      if (!category) {
        this.form.reset();
        return;
      }

      this.form.patchValue({
        name: category.name,
      });
    });
  }
  

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    this.submitEmitter.emit(value.name);
  }
}