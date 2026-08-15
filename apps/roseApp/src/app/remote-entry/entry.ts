import { Component } from '@angular/core';
import { Layout } from '../features/layout/layout';

@Component({
  selector: 'app-roseapp-entry',
  template: `<app-layout></app-layout>`,
  standalone: true,
  imports: [Layout]
})
export class RoseApp { }
