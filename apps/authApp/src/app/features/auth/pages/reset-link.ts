import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-reset-link',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './reset-link.html'
})
export class ResetLink {
    email = 'user@example.com';
}
