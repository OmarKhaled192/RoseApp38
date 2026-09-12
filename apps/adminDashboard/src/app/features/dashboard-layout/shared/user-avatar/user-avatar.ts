import {
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { AdminAccountStore } from '../../../account/state/account.store';

@Component({
  selector: 'app-userAavatar',
  templateUrl: './user-avatar.html',
})
export class UserAvatar {
  readonly accountStore = inject(AdminAccountStore);
  readonly size = input(40);

  readonly firstName = computed(
    () => this.accountStore.user()?.firstName ?? '',
  );

  readonly lastName = computed(() => this.accountStore.user()?.lastName ?? '');

  readonly email = computed(() => this.accountStore.user()?.email ?? '');

  readonly photo = computed(() => this.accountStore.user()?.photo ?? '');

  readonly hasPhoto = signal(true);
  constructor() {
    effect(() => {
      this.photo();
      this.hasPhoto.set(true);
    });
  }

  private readonly avatarPalette = [
    '#9E1B41',
    '#1B6F9E',
    '#1B9E6F',
    '#9E7A1B',
    '#6F1B9E',
    '#9E1B7A',
    '#1B9E9E',
    '#7A9E1B',
    '#3A2C9E',
    '#9E3A2C',
    '#2C9E3A',
    '#9E2C6F',
  ];

  readonly userInitial = computed(() => {
    const first = this.firstName().trim().charAt(0).toUpperCase();
    const last = this.lastName().trim().charAt(0).toUpperCase();

    if (first && last) {
      return `${first}${last}`;
    }

    return first || last || '?';
  });

  readonly avatarColor = computed(() => {
    const seed = this.firstName() || this.email();

    const hash = this.hashString(seed);

    const index = hash % this.avatarPalette.length;

    return this.avatarPalette[index];
  });

  onImageError(): void {
    this.hasPhoto.set(false);
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
