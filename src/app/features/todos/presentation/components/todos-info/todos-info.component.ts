import { Component, Input } from "@angular/core";
import { IonCol, IonGrid, IonRow, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from "ionicons";
import { checkbox, squareOutline } from "ionicons/icons";

@Component({
  selector: 'todos-info',
  templateUrl: './todos-info.component.html',
  styleUrl: './todos-info.component.scss',
  standalone: true,
  imports: [IonCol, IonGrid, IonRow, IonIcon, IonLabel],
})
export class TodosInfoComponent {
  @Input({ required: true })
  pendings = 0;
  @Input({ required: true })
  completed = 0;

  constructor() {
    addIcons({ checkbox, squareOutline });
  }
}