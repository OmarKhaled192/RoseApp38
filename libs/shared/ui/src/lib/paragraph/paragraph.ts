import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lib-paragraph',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './paragraph.html',
  host: {
    class: 'block'
  }
})
export class ParagraphComponent {
  readonly header = input<string>();

  readonly descriptionBeforeLink = input<string>();

  readonly linkText = input<string>();

  readonly linkRoute = input<string | readonly string[]>();

  readonly descriptionAfterLink = input<string>();
}
