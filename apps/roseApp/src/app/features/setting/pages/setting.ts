import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthenticationService } from '@org/auth';

@Component({
  selector: 'app-setting',
  imports: [RouterModule, TranslatePipe],
  templateUrl: './setting.html'
})
export class Setting {
  activeTab = signal<'profile' | 'change-password'>('profile');
  private readonly router = inject(Router);
  readonly authService = inject(AuthenticationService);
  logout(): void {
    this.authService.removeToken();
    this.router.navigateByUrl('/auth/login');
  }

}
