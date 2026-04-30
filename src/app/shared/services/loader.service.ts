import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private _loadingCount = signal(0);

  loading = computed(() => this._loadingCount() > 0);

  show() {
    this._loadingCount.update((c) => c + 1);
  }

  hide() {
    this._loadingCount.update((c) => Math.max(0, c - 1));
  }
}
