import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-otp-code',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './otp-code.component.html',
  styleUrls: ['./otp-code.component.scss'],
})
export class OtpCodeComponent { }
