import { Component, inject } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { ToastService } from "../../services/toast.service";
import { addIcons } from "ionicons";
import { alert, checkmark, close } from "ionicons/icons";

@Component({
  selector: 'toast',
  templateUrl: './toast.component.html',
  standalone: true,
  imports: [IonicModule],
})
export class ToastComponent {
  private toastService = inject(ToastService);
  showToast = this.toastService.showToast;
  currentToast = this.toastService.currentToast;

  constructor() {
    addIcons({checkmark, alert, close})
  }
}