import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { LocalStorageService } from './core/storage/local-storage.service';
import { RemoteConfigService } from './core/firebase/remote-config.service';

describe('AppComponent', () => {
  it('should create the app', async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]),
        {
          provide: LocalStorageService,
          useValue: { init: () => Promise.resolve() },
        },
        {
          provide: RemoteConfigService,
          useValue: { init: () => Promise.resolve() },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
