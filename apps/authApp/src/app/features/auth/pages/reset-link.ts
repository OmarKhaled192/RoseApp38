import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ParagraphComponent } from '@org/ui';

@Component({
  selector: 'app-reset-link',
  standalone: true,
  imports: [TranslatePipe, ParagraphComponent],
  templateUrl: './reset-link.html'
})
export class ResetLink {
    email = 'user@example.com';
}
