import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'lib-title-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './title-section.html',
  styleUrl: './title-section.css',
})
export class TitleSection {
  title = input.required<string>();
  subtitle = input.required<string>();

  // left | center | right
  align = input<'left' | 'center' | 'right'>('center');

  // font sizes
  titleSize = input<number>(36);
  subtitleSize = input<number>(16);

  // Highlight
  highlightWidth = input<string>('75%');
  highlightHeight = input<string>('40%');

  // Underline
  underlineWidth = input<string>('25%');
  underlineHeight = input<string>('2px');
}
