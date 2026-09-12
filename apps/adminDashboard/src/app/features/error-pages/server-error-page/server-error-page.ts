import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-server-error-page',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './server-error-page.html',
})
export class ServerErrorPage {
  tryAgain(): void {
    window.location.reload();
  }
}