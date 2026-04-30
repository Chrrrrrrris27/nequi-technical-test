import { Component, EventEmitter, Input, Output } from "@angular/core";
import { addIcons } from "ionicons";
import { pencil, trash } from "ionicons/icons";
import { IonItemSliding, IonItem, IonItemOptions, IonItemOption, IonIcon } from "@ionic/angular/standalone";

type Color = "danger" | "dark" | "light" | "medium" | "primary" | "secondary" | "success" | "tertiary" | "warning" | string | undefined;

@Component({
  selector: 'sliding-button',
  templateUrl: './sliding-button.component.html',
  styleUrl: './sliding-button.component.scss',
  standalone: true,
  imports: [IonItemOption, IonItemOptions, IonIcon, IonItem, IonItemSliding],
})
export class SlidingButtonComponent {

  @Input()
  backgroundColor?: Color = 'light';

  @Output()
  clickEmitter = new EventEmitter<void>();

  @Output()
  editOptionEmitter = new EventEmitter<void>();

  @Output()
  deleteOptionEmitter = new EventEmitter<string>();

  constructor() {
    addIcons({ trash, pencil });
  }

  onClickEmitter() {
    this.clickEmitter.emit();
  }

  onEditEmitter(sliding: IonItemSliding) {
    sliding.close();
    this.editOptionEmitter.emit();
  }

  onDeleteEmitter(sliding: IonItemSliding) {
    sliding.close();
    this.deleteOptionEmitter.emit();
  }
}