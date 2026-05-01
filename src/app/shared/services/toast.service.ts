import { computed, effect, Injectable, signal } from '@angular/core';
import { ToastModel } from '../models/toast.model';

@Injectable({providedIn: 'root'})
export class ToastService {
  private _deafaultDuration = 3000;
  showToast = signal<boolean>(false);
  private toastQueue = signal<ToastModel[]>([]);

  constructor() {
    effect(() => {
    const toast = this.currentToast();

    if (!toast) return;

    this.showToast.set(true);

    const duration = toast.duration ?? this._deafaultDuration;

    const timer = setTimeout(() => {
      this.showToast.set(false);
      this.toastQueue.update(q => q.slice(1));
    }, duration);

    return () => clearTimeout(timer);
  });
  }

  currentToast = computed(() => {
    const queue = this.toastQueue();
    return queue.length > 0 ? queue[0] : null;
  });

  addToast(toast: ToastModel) {
    this.toastQueue.set([...this.toastQueue(), toast]);
  }
}
