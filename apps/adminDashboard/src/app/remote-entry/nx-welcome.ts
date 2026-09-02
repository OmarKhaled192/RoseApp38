import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { DashboardLayout } from "../features/dashboard-layout/dashboard-layout";

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
