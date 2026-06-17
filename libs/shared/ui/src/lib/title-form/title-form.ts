import { Component, input } from '@angular/core';

@Component({
  selector: 'lib-title-form',
  standalone: true,
  templateUrl: './title-form.html'
})
export class TitleFormComponent {
  title = input.required<string>();
}
