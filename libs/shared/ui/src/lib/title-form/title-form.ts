import { Component, Input } from '@angular/core';

@Component({
  selector: 'lib-title-form',
  standalone: true,
  templateUrl: './title-form.html',
  styleUrls: ['./title-form.scss']
})
export class TitleFormComponent {
  @Input() title = '';
}
