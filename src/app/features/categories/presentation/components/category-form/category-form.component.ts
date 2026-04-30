import { Component, effect, inject, input } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Category } from 'src/app/features';
import { IonicModule, NavController } from '@ionic/angular';
import { CategoriesService } from '../../services/categories.service';

@Component({
  selector: 'category-form',
  standalone: true,
  imports: [ReactiveFormsModule, IonicModule],
  templateUrl: './category-form.component.html',
})
export class TodoFormComponent {

  private fb = inject(FormBuilder);

  private categoriesService = inject(CategoriesService);

  defaultCategory = input<Category | undefined>();

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

    const category = this.defaultCategory();

    if (!!category) {
      const updatedCategory: Category = {
        ...category,
        name: value.name,
      };
      this.categoriesService.updateCategory(updatedCategory)
        .then((_) => {
          this.nav.navigateForward('/tabs/categories');
        })
      return;
    }
      
    this.categoriesService.createCategory(value.name)
      .then((_) => {
        this.nav.navigateForward('/tabs/categories');
      });
    
  }
}