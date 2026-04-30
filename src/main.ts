import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { IonicStorageModule } from '@ionic/storage-angular';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { TODOS_PROVIDERS } from './app/features/todos/todos.provider';
import { CATEGORIES_PROVIDERS } from './app/features/categories/categories.provider';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    importProvidersFrom(
      IonicStorageModule.forRoot({
        name: '__todosdb',
      }),
    ),
    ...TODOS_PROVIDERS,
    ...CATEGORIES_PROVIDERS,
  ],
});
