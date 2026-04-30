import { Component, inject } from '@angular/core';
import { LoaderService } from '../../services/loader.service';
import { IonicModule } from "@ionic/angular";

@Component({
  selector: 'global-loader',
  templateUrl: './global-loader.component.html',
  styleUrl: './global-loader.component.scss',
  imports: [IonicModule],
})
export class GlobalLoaderComponent {
  loading = inject(LoaderService).loading;
}
