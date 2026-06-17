import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lib-question-repeat',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './question-repeat.html',
})
export class QuestionRepeatComponent {
  readonly question = input.required<string>();
  readonly answer = input.required<string>();
  readonly routerLink = input<string | string[]>('/');
}
