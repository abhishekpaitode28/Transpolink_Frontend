import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'tl-toast',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <div class="tl-toast-container">
      @for (toast of notify.toasts(); track toast.id) {
        <div class="tl-toast tl-toast--{{ toast.type }}">
          <mat-icon class="tl-toast__icon">{{ icons[toast.type] }}</mat-icon>
          <span class="tl-toast__message">{{ toast.message }}</span>
          <button mat-icon-button class="tl-toast__close"
                  (click)="notify.dismiss(toast.id)">
            <mat-icon style="font-size:16px; width:16px; height:16px;">
              close
            </mat-icon>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .tl-toast-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      z-index: 9999;
      pointer-events: none;
    }

    .tl-toast {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 14px;
      border-radius: 10px;
      font-size: 13px;
      min-width: 280px;
      max-width: 420px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.12);
      pointer-events: all;
      animation: slideIn 0.2s ease-out;
    }

    .tl-toast--success { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
    .tl-toast--error   { background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; }
    .tl-toast--info    { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
    .tl-toast--warning { background: #fffbeb; color: #92400e; border: 1px solid #fde68a; }

    .tl-toast__icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      flex-shrink: 0;
    }

    .tl-toast__message {
      flex: 1;
      line-height: 1.4;
    }

    .tl-toast__close {
      width: 24px !important;
      height: 24px !important;
      flex-shrink: 0;
      opacity: 0.6;
      &:hover { opacity: 1; }
    }

    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to   { transform: translateX(0);    opacity: 1; }
    }
  `],
})
export class ToastComponent {
  notify = inject(NotificationService);

  icons: Record<string, string> = {
    success: 'check_circle',
    error:   'error',
    info:    'info',
    warning: 'warning',
  };
}