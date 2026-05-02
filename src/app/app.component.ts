import { Component, inject, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { LocalStorageService, RemoteConfigService } from './core';
import { GlobalLoaderComponent, ToastComponent } from "./shared";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, GlobalLoaderComponent, ToastComponent],
})
export class AppComponent implements OnInit {
  private rc = inject(RemoteConfigService);
  constructor(private appStorage: LocalStorageService) {
    this.appStorage.init();
  }

  async ngOnInit() {
    await this.rc.init();
  }
}
