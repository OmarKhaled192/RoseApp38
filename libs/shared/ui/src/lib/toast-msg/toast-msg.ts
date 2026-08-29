import { Component } from '@angular/core';
import { ToastMessageOptions } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'lib-app-toast-msg',
  standalone: true,
  imports: [ToastModule],
  template: `
    <p-toast
      key="main"
      position="top-right"
      [breakpoints]="{ '640px': { width: 'calc(100vw - 2rem)', right: '1rem' } }"
    >
      <ng-template #headless let-message let-closeFn="closeFn">
        <article class="rose-toast" [class]="'rose-toast rose-toast--' + (message.severity || 'info')">
          <div class="rose-toast__icon" aria-hidden="true">
            <i class="pi" [class]="iconClass(message)"></i>
          </div>

          <div class="rose-toast__content">
            <p class="rose-toast__summary">{{ message.summary }}</p>
            <p class="rose-toast__detail">{{ message.detail }}</p>
          </div>

          @if (message.closable !== false) {
            <button
              type="button"
              class="rose-toast__close"
              (click)="closeFn($event)"
              aria-label="Close notification"
            >
              <i class="pi pi-times" aria-hidden="true"></i>
            </button>
          }
        </article>
      </ng-template>
    </p-toast>
  `,
  styles: [`
    :host ::ng-deep .p-toast { width: 24rem; }

    .rose-toast {
      --toast-accent: #e65073;
      --toast-icon-background: #fbe8ed;
      display: grid;
      grid-template-columns: auto 1fr auto;
      gap: .75rem;
      align-items: flex-start;
      width: 100%;
      padding: 1rem;
      border: 1px solid #f1d7df;
      border-left: 4px solid var(--toast-accent);
      border-radius: .875rem;
      background: #fff;
      box-shadow: 0 14px 32px rgb(116 28 33 / 16%);
    }

    .rose-toast--success { --toast-accent: #21835b; --toast-icon-background: #e7f6ef; }
    .rose-toast--error { --toast-accent: #a6252a; --toast-icon-background: #fbeaea; }
    .rose-toast--warn { --toast-accent: #bf6b11; --toast-icon-background: #fff3df; }
    .rose-toast--info { --toast-accent: #e65073; --toast-icon-background: #fbe8ed; }

    .rose-toast__icon {
      display: grid;
      width: 2.25rem;
      height: 2.25rem;
      place-items: center;
      border-radius: 9999px;
      background: var(--toast-icon-background);
      color: var(--toast-accent);
      font-size: 1.125rem;
    }

    .rose-toast__content { min-width: 0; padding-top: .125rem; }
    .rose-toast__summary { margin: 0; color: #741c21; font-size: .875rem; font-weight: 700; }
    .rose-toast__detail { margin: .25rem 0 0; color: #6b7280; font-size: .8125rem; line-height: 1.35; }

    .rose-toast__close {
      display: grid;
      width: 1.75rem;
      height: 1.75rem;
      place-items: center;
      border: 0;
      border-radius: .375rem;
      background: transparent;
      color: #9ca3af;
      cursor: pointer;
    }

    .rose-toast__close:hover { background: #f9fafb; color: #741c21; }
  `]
})
export class ToastMsg {
  iconClass(message: ToastMessageOptions): string {
    switch (message.severity) {
      case 'success':
        return 'pi-check-circle';
      case 'error':
        return 'pi-times-circle';
      case 'warn':
        return 'pi-exclamation-triangle';
      default:
        return 'pi-info-circle';
    }
  }
}
