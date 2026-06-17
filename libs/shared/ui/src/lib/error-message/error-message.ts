import { Component, input } from '@angular/core';

@Component({
  selector: 'lib-error-message',
  imports: [],
  templateUrl: './error-message.html',
  styleUrl: './error-message.css',
})
export class ErrorMessage {
  message = input<string>('');
}
