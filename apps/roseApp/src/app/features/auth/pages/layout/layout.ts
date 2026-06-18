import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Footer } from '../../../../core/components/footer/footer';
import { Header } from '../../../../core/components/header/header';

@Component({
  selector: 'rose-layout',
  standalone: true,
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './layout.html',
  styleUrls: ['./layout.css'],
})
export class Layout { }
