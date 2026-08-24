import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { AuthenticationService } from '@org/auth';


@Component({
  selector: 'app-userAavatar',
  imports: [CommonModule],
  templateUrl: './user-avatar.html',
})
export class UserAvatar {
  readonly authService = inject(AuthenticationService);
  firstName = this.authService.getUserData()?.firstName || '';
  lastName = this.authService.getUserData()?.lastName || '';
  email = this.authService.getUserData()?.email || '';
  photo = this.authService.getUserData()?.photo || '';
  @Input() size = 40;

  hasPhoto = true;

  private readonly avatarPalette: string[] = [
    '#9E1B41', '#1B6F9E', '#1B9E6F', '#9E7A1B',
    '#6F1B9E', '#9E1B7A', '#1B9E9E', '#7A9E1B',
    '#3A2C9E', '#9E3A2C', '#2C9E3A', '#9E2C6F'
  ];

  ngOnChanges(): void {
    this.hasPhoto = true;

  }

  get userInitial(): string {
    const first = this.firstName?.trim()?.charAt(0)?.toUpperCase() || '';
    const last = this.lastName?.trim()?.charAt(0)?.toUpperCase() || '';

    if (first && last) {
      return `${first}${last}`;
    }

    return first || last || '?';
  }

  get avatarColor(): string {
    const seed = this.firstName || this.email || '';
    const hash = this.hashString(seed);
    const index = hash % this.avatarPalette.length;
    return this.avatarPalette[index];
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
      hash |= 0;
    }
    return Math.abs(hash);
  }

}
