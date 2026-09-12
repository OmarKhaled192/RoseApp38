import { Component } from '@angular/core';
import { AdminAccountStore } from '../account/state/account.store';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './navbar/navbar';
import { Sidebar } from './sidebar/sidebar';

@Component({
  selector: 'app-dashboard-layout',
  imports: [RouterOutlet, Navbar, Sidebar],
  providers: [AdminAccountStore],
  templateUrl: './dashboard-layout.html',
})
export class DashboardLayout {}
