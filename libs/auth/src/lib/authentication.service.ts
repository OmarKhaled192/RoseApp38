import { computed, Injectable, signal, } from '@angular/core';
import {User} from '@org/ui'
interface DecodedToken {
  sub?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  [key: string]: unknown;
}
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
 private readonly loggedInState = signal<boolean>(this.hasToken());
  private readonly userState = signal<DecodedToken | null>(this.decodeToken(this.getToken()));

  readonly isLoggedIn = this.loggedInState.asReadonly();
  readonly user = this.userState.asReadonly();
   firstName = computed(() => this.userState()?.firstName ?? null);


  setToken(token: string): void {
    this.setCookie('token', token, 7);
    this.loggedInState.set(true);
  }

  getToken(): string | null {
    return this.getCookie('token');
  }

  setUserData(data: User | null): void {
    this.setCookie('data', JSON.stringify(data), 7);
    this.loggedInState.set(true);
  }

 getUserData(): User | null {
  const raw = this.getCookie('data');
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

  removeToken(): void {
    this.deleteCookie('token');
    this.deleteCookie('data');
    this.loggedInState.set(false);
  }

  private setCookie(name: string, value: string, days?: number): void {
    if (typeof document === 'undefined') return;
    let expires = '';
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + (value || '') + expires + '; path=/; SameSite=Strict; Secure';
  }

  private getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  private deleteCookie(name: string): void {
    if (typeof document === 'undefined') return;
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }

   private decodeToken(token: string | null): DecodedToken | null {
    if (!token) return null;
    try {
      const payload = token.split('.')[1];
      if (!payload) return null;
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const json = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
          .join('')
      );
      return JSON.parse(json) as DecodedToken;
    } catch {
      return null;
    }
  }
}
