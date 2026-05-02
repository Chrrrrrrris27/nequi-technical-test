import { Component, inject } from "@angular/core";
import { IonToast } from '@ionic/angular/standalone';
import { addIcons } from "ionicons";
import { alert, checkmark, close } from "ionicons/icons";
import { ToastService } from "../../services/toast.service";

@Component({
  selector: 'toast',
  templateUrl: './toast.component.html',
  standalone: true,
  imports: [IonToast],
})
export class ToastComponent {
  private toastService = inject(ToastService);
  showToast = this.toastService.showToast;
  currentToast = this.toastService.currentToast;

  constructor() {
    addIcons({checkmark, alert, close})
  }
}