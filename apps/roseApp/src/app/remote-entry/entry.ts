import { Component } from '@angular/core';
import { InputComponent } from '../shared/ui/input/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  imports: [InputComponent, ReactiveFormsModule],
  selector: 'app-roseApp-entry',
  template: `
    <div class="flex flex-col gap-4 p-8 max-w-md">
    <app-input
      label="First Name"
      placeholder="Enter your name"
      [formControl]="nameControl"
    />
    <app-input
      label="Password"
      placeholder="Enter your password"
      type="password"
      [formControl]="passwordControl"
    />
   
  `,
})
export class RemoteEntry {
  nameControl = new FormControl('');
  passwordControl = new FormControl('');
}
