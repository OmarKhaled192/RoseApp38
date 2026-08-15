import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Footer } from '../../core/components/footer/footer';
import { Header } from '../../core/components/header/header';
import { ToastMsg } from '@org/ui';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, Header, Footer, ToastMsg],
  templateUrl: './layout.html',
  styleUrls: ['./layout.css'],
})
export class Layout { }
