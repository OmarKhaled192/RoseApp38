import { Component } from '@angular/core';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'lib-app-toast-msg',
  standalone: true,
  imports: [ToastModule],
  template: `<p-toast key="main" />`,
   styles: [`
    :host ::ng-deep   .p-toast-message-success .p-toast-detail {
      color: #2d2d2d;
      margin: 0px;
      padding: 0px;
    }
  `]
})
export class ToastMsg {}
