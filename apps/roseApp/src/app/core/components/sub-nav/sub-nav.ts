import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sub-nav',
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './sub-nav.html',
  styleUrl: './sub-nav.css',
})
export class SubNav {}
