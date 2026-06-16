import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lib-question-repeat',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './question-repeat.html',
  styleUrls: ['./question-repeat.scss']
})
export class QuestionRepeatComponent {
  @Input() question = '';
  @Input() answer = '';
  @Input() routerLink: string | any[] = '/';
}
