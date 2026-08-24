import { DashboardLayout } from './../features/dashboard-layout/dashboard-layout';
import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nx-welcome',
  imports: [CommonModule, DashboardLayout],
  template: `
   <app-dashboard-layout />
  `,
  styles: [],
  encapsulation: ViewEncapsulation.None,
})
export class NxWelcome {}
