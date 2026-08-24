import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastMsg } from '@org/ui';
import { Navbar } from "./navbar/navbar";
import { Sidebar } from "./sidebar/sidebar";

@Component({
  selector: 'app-dashboard-layout',
  imports: [RouterOutlet, ToastMsg, Navbar, Sidebar],
  templateUrl: './dashboard-layout.html',
})
export class DashboardLayout {

}
