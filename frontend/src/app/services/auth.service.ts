import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private key = 'hddp_token';
  private userKey = 'hddp_user';

  get token(): string | null { return localStorage.getItem(this.key); }
  get user(): any { const u = localStorage.getItem(this.userKey); return u ? JSON.parse(u) : null; }
  get isLoggedIn(): boolean { return !!this.token; }

  save(token: string, user: any) {
    localStorage.setItem(this.key, token);
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }
  logout() {
    localStorage.removeItem(this.key);
    localStorage.removeItem(this.userKey);
  }
}
