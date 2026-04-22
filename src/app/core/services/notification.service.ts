import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: number;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private _toasts = signal<ToastMessage[]>([]);
  readonly toasts = this._toasts.asReadonly();
  private counter = 0;

  success(message: string) { this.add('success', message); }
  error(message: string)   { this.add('error', message); }
  info(message: string)    { this.add('info', message); }
  warning(message: string) { this.add('warning', message); }

  dismiss(id: number) {
    this._toasts.update((t) => t.filter((x) => x.id !== id));
  }

  private add(type: ToastMessage['type'], message: string) {
    const id = ++this.counter;
    this._toasts.update((t) => [...t, { id, type, message }]);
    setTimeout(() => this.dismiss(id), 4000);
  }
}
