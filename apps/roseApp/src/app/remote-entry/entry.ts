import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-roseapp-entry',
  template: `<router-outlet/>`,
  standalone: true,
  imports: [RouterOutlet],
})
export class RoseApp { }
