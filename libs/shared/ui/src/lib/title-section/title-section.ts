import { Component, Input } from '@angular/core';

@Component({
  selector: 'lib-title-section',
  standalone: true,
  templateUrl: './title-section.html',
  styleUrl: './title-section.css',
})
export class TitleSection {
  @Input() subtitle = 'Gallery';
  @Input() title = 'Check Out our Wonderful Gallery';
}
