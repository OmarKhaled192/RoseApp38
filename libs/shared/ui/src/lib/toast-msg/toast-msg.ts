import { Component } from '@angular/core';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'lib-app-toast-msg',
  standalone: true,
  imports: [ToastModule],
  template: `<p-toast key="main" position="top-right" />`,
  styles: [`
    :host ::ng-deep .p-toast-message {
      border: 0;
      border-left: 4px solid #E65073;
      border-radius: 12px;
      box-shadow: 0 12px 30px rgb(116 28 33 / 18%);
      overflow: hidden;
    }

    :host ::ng-deep .p-toast-message-success { border-left-color: #2f9e6e; }
    :host ::ng-deep .p-toast-message-error { border-left-color: #A6252A; }
    :host ::ng-deep .p-toast-message-warn { border-left-color: #d97706; }
    :host ::ng-deep .p-toast-summary { color: #741C21; font-weight: 700; }
    :host ::ng-deep .p-toast-detail { color: #4b5563; margin-top: .25rem; }
  `]
})
export class ToastMsg {}
