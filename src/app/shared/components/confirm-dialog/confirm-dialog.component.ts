import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'tl-confirm-dialog',
  standalone: true,
  imports: [],
  template: `
    <!-- TODO: Show a modal overlay only when 'visible' is true (@if)
         Structure:
           <div class="tl-dialog-backdrop">
             <div class="tl-dialog">
               <p>{{ message }}</p>
               <div class="tl-dialog__actions">
                 - Cancel button → emits confirmed.emit(false)
                 - Confirm button (danger style) → emits confirmed.emit(true)
               </div>
             </div>
           </div> -->
  `,
})
export class ConfirmDialogComponent {
  // TODO: @Input() visible = false
  // TODO: @Input() message = 'Are you sure?'
  // TODO: @Output() confirmed = new EventEmitter<boolean>()
}
