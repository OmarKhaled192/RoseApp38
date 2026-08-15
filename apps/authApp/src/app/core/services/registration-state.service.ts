import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RegistrationStateService {
  private readonly _email = signal<string>('');

  readonly email = this._email.asReadonly();

  setEmail(email: string): void {
    this._email.set(email);
  }

  clear(): void {
    this._email.set('');
  }
}
