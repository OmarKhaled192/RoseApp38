import { Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { SubNav } from '../sub-nav/sub-nav';

@Component({
  selector: 'app-header',
  imports: [Navbar, SubNav],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {}
