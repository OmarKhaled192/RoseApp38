import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-userAavatar',
  imports: [CommonModule],
  templateUrl: './user-avatar.html',
})
export class UserAvatar {
  @Input() name: string | null | undefined = '';
  @Input() email: string | null | undefined = '';
  @Input() photoUrl: string | null | undefined = null;
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
    const name = this.name?.trim();
    if (!name) return '?';

    const parts = name.split(/\s+/).filter(Boolean);

    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }

    const first = parts[0].charAt(0).toUpperCase();
    const last = parts[parts.length - 1].charAt(0).toUpperCase();

    return `${first}${last}`;
  }

  get avatarColor(): string {
    const seed = this.name || this.email || '';
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
