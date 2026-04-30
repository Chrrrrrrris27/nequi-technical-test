import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { LocalStorageService } from './core';
import { GlobalLoaderComponent } from "./shared";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, GlobalLoaderComponent],
})
export class AppComponent {
  constructor(private appStorage: LocalStorageService) {
    this.appStorage.init();
  }
}
