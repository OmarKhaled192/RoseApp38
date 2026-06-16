import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lib-paragraph',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './paragraph.html',
  styleUrls: ['./paragraph.scss']
})
export class ParagraphComponent {
  @Input() header?: string;

  @Input() descriptionBeforeLink?: string;

  @Input() linkText?: string;

  @Input() linkRoute?: string | any[];

  @Input() descriptionAfterLink?: string;
}
