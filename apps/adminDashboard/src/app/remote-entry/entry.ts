import { Component } from '@angular/core';
import { Dashboard } from '../features/dashboard/pages/dashboard/dashboard';

@Component({
  imports: [Dashboard],
  selector: 'app-admin-dashboard-entry',
  template: `<app-dashboard />`,
})
export class RemoteEntry {}
