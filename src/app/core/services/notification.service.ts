import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id:      number;
  type:    'success' | 'error' | 'info' | 'warning';
  message: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {

  private _toasts = signal<ToastMessage[]>([]);
  readonly toasts = this._toasts.asReadonly();  // ← this is what toast.component reads
  private counter = 0;

  success(message: string): void { this.add('success', message); }
  error(message: string):   void { this.add('error',   message); }
  info(message: string):    void { this.add('info',    message); }
  warning(message: string): void { this.add('warning', message); }

  dismiss(id: number): void {
    this._toasts.update(all => all.filter(t => t.id !== id));
  }

  private add(type: ToastMessage['type'], message: string): void {
    const id = ++this.counter;
    this._toasts.update(all => [...all, { id, type, message }]);
    setTimeout(() => this.dismiss(id), 4000);
  }
}