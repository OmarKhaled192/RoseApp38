import { Component, inject } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './footer.html',
})
export class Footer {
  translate = inject(TranslateService);

  email = '';



  onSubscribe(): void {
    if (this.email && this.email.includes('@')) {
      this.email = '';
    } else {
      alert('Please enter a valid email address.');
    }
  }
}
