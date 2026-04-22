import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'tl-confirm-dialog',
  standalone: true,
  template: `
    @if (visible) {
      <div class="tl-dialog-backdrop">
        <div class="tl-dialog">
          <p>{{ message }}</p>
          <div class="tl-dialog__actions">
            <button (click)="confirmed.emit(false)">Cancel</button>
            <button class="tl-btn--danger" (click)="confirmed.emit(true)">Confirm</button>
          </div>
        </div>
      </div>
    }
  `,
})
export class ConfirmDialogComponent {
  @Input() visible = false;
  @Input() message = 'Are you sure?';
  @Output() confirmed = new EventEmitter<boolean>();
}
