import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoFormComponent } from './todo-form.component';
import { Category, Todo } from 'src/app/features';
import { By } from '@angular/platform-browser';

const MOCK_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Work' },
  { id: 'cat-2', name: 'Personal' },
];

const MOCK_TODO: Todo = {
  id: 'todo-1',
  title: 'Buy groceries',
  completed: false,
  categoryId: 'cat-1',
};

describe('TodoFormComponent', () => {
  let component: TodoFormComponent;
  let fixture: ComponentFixture<TodoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('creation', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should start with an empty title control', () => {
      expect(component.form.controls.title.value).toBe('');
    });

    it('should start with an empty categoryId control', () => {
      expect(component.form.controls.categoryId.value).toBe('');
    });

    it('should start with an invalid form (empty title)', () => {
      expect(component.form.invalid).toBeTrue();
    });
  });

  describe('defaultTodo input', () => {
    it('should patch the form when a todo is provided', () => {
      fixture.componentRef.setInput('defaultTodo', MOCK_TODO);
      fixture.detectChanges();

      expect(component.form.controls.title.value).toBe(MOCK_TODO.title);
      expect(component.form.controls.categoryId.value).toBe(MOCK_TODO.categoryId!);
    });

    it('should reset the form when defaultTodo is set to undefined', () => {
      fixture.componentRef.setInput('defaultTodo', MOCK_TODO);
      fixture.detectChanges();

      fixture.componentRef.setInput('defaultTodo', undefined);
      fixture.detectChanges();

      expect(component.form.controls.title.value).toBe('');
      expect(component.form.controls.categoryId.value).toBe('');
    });

    it('should show "Actualizar" button text when a todo is provided', () => {
      fixture.componentRef.setInput('defaultTodo', MOCK_TODO);
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('ion-button');
      expect(button.textContent.trim()).toBe('Actualizar');
    });

    it('should show "Crear" button text when no todo is provided', () => {
      const button = fixture.nativeElement.querySelector('ion-button');
      expect(button.textContent.trim()).toBe('Crear');
    });
  });

  describe('categories input', () => {
    it('should render one ion-select-option per category', () => {
      component.categories = MOCK_CATEGORIES;
      fixture.detectChanges();

      const options = fixture.debugElement.queryAll(By.css('ion-select-option'));
      expect(options.length).toBe(MOCK_CATEGORIES.length);
    });

    it('should render no options when categories is empty', () => {
      component.categories = [];
      fixture.detectChanges();

      const options = fixture.debugElement.queryAll(By.css('ion-select-option'));
      expect(options.length).toBe(0);
    });
  });

  describe('form validation', () => {
    it('should be invalid when title is empty', () => {
      component.form.controls.title.setValue('');

      expect(component.form.controls.title.hasError('required')).toBeTrue();
    });

    it('should be invalid when title is shorter than 3 characters', () => {
      component.form.controls.title.setValue('ab');

      expect(component.form.controls.title.hasError('minlength')).toBeTrue();
    });

    it('should be valid when title has 3 or more characters', () => {
      component.form.controls.title.setValue('abc');

      expect(component.form.controls.title.valid).toBeTrue();
    });

    it('should be valid without a categoryId', () => {
      component.form.controls.title.setValue('Valid title');
      component.form.controls.categoryId.setValue('');

      expect(component.form.valid).toBeTrue();
    });

    it('should be valid with both title and categoryId', () => {
      component.form.controls.title.setValue('Valid title');
      component.form.controls.categoryId.setValue('cat-1');

      expect(component.form.valid).toBeTrue();
    });
  });

  describe('submit', () => {
    it('should emit submitEmitter with form values when form is valid', () => {
      const emitted = jasmine.createSpy('submitEmitter');
      component.submitEmitter.subscribe(emitted);

      component.form.controls.title.setValue('Buy groceries');
      component.form.controls.categoryId.setValue('cat-1');
      component.submit();

      expect(emitted).toHaveBeenCalledOnceWith({
        title: 'Buy groceries',
        categoryId: 'cat-1',
      });
    });

    it('should emit with empty categoryId when none is selected', () => {
      const emitted = jasmine.createSpy('submitEmitter');
      component.submitEmitter.subscribe(emitted);

      component.form.controls.title.setValue('Buy groceries');
      component.submit();

      expect(emitted).toHaveBeenCalledOnceWith({
        title: 'Buy groceries',
        categoryId: '',
      });
    });

    it('should not emit when form is invalid', () => {
      const emitted = jasmine.createSpy('submitEmitter');
      component.submitEmitter.subscribe(emitted);

      component.form.controls.title.setValue('');
      component.submit();

      expect(emitted).not.toHaveBeenCalled();
    });

    it('should mark all controls as touched when submitting an invalid form', () => {
      component.form.controls.title.setValue('');
      component.submit();

      expect(component.form.controls.title.touched).toBeTrue();
    });

    it('should emit when form is submitted via ngSubmit', () => {
      const emitted = jasmine.createSpy('submitEmitter');
      component.submitEmitter.subscribe(emitted);

      component.form.controls.title.setValue('Buy groceries');
      fixture.detectChanges();

      const form = fixture.debugElement.query(By.css('form'));
      form.triggerEventHandler('ngSubmit', null);

      expect(emitted).toHaveBeenCalled();
    });
  });
});
