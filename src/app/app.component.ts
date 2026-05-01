import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { LocalStorageService } from './core';
import { GlobalLoaderComponent, ToastComponent } from "./shared";
import { IonicModule } from "@ionic/angular";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, GlobalLoaderComponent, ToastComponent],
})
export class AppComponent {
  constructor(private appStorage: LocalStorageService) {
    this.appStorage.init();
  }
}
