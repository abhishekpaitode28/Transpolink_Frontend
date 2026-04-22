import { Injectable } from '@angular/core';

// TODO: import signal from '@angular/core'

// TODO: Define the ToastMessage interface
// Fields: id (number), type ('success' | 'error' | 'info' | 'warning'), message (string)
export interface ToastMessage {}

@Injectable({ providedIn: 'root' })
export class NotificationService {

  // TODO: Create a private signal holding a ToastMessage array (starts empty)
  // TODO: Expose it as a readonly signal called 'toasts'
  // TODO: Declare a private counter (number) to generate unique IDs

  success(message: string): void {
    // TODO: call this.add('success', message)
  }

  error(message: string): void {
    // TODO: call this.add('error', message)
  }

  info(message: string): void {
    // TODO: call this.add('info', message)
  }

  warning(message: string): void {
    // TODO: call this.add('warning', message)
  }

  dismiss(id: number): void {
    // TODO: update the toasts signal — filter out the toast with matching id
  }

  private add(type: string, message: string): void {
    // TODO: increment counter, create a ToastMessage, add it to the signal
    // TODO: use setTimeout to auto-dismiss after 4000ms
  }
}
