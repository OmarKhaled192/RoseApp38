import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-unauthorized-page',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './unauthorized-page.html',
})
export class UnauthorizedPage {}