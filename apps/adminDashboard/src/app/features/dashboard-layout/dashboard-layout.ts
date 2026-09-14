import { Component } from '@angular/core';
import { AdminAccountStore } from '../account/state/account.store';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './navbar/navbar';
import { Sidebar } from './sidebar/sidebar';
import { ToastMsg } from '@org/ui';

@Component({
  selector: 'app-dashboard-layout',
  imports: [RouterOutlet, Navbar, Sidebar],
  providers: [AdminAccountStore],
  imports: [RouterOutlet, Navbar, Sidebar, ToastMsg],
  templateUrl: './dashboard-layout.html',
})
export class DashboardLayout {}
