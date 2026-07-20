import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
  <div class="login-wrap">
    <div class="login-card">
      <a routerLink="/" class="brand"><img src="assets/img/logo.jpg" alt="HDDP Consultants" class="brand-logo"><span class="admin-badge">ADMIN</span></a>
      <h1>Admin Panel Login</h1>
      <p class="muted">Control your website — blogs, Q&A, messages & applications.</p>
      <div class="alert err" *ngIf="error">{{ error }}</div>
      <form (ngSubmit)="submit()">
        <div class="field">
          <label>Email</label>
          <input [(ngModel)]="email" name="email" type="email" autocomplete="username" required>
        </div>
        <div class="field">
          <label>Password</label>
          <input [(ngModel)]="password" name="password" type="password" autocomplete="current-password" required>
        </div>
        <button class="btn btn-primary" style="width:100%" [disabled]="busy">{{ busy ? 'Signing in…' : 'Sign in' }}</button>
      </form>
      <a routerLink="/" class="back">← Back to website</a>
    </div>
  </div>
  `,
  styles: [`
    .login-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, var(--navy-deep), var(--navy)); padding: 24px; }
    .login-card { background: #fff; border-radius: 18px; padding: 40px 36px; width: 100%; max-width: 420px; box-shadow: 0 25px 60px rgba(0,0,0,.35); }
    .login-card h1 { font-size: 1.4rem; margin: 18px 0 4px; }
    .brand { display: flex; align-items: center; gap: 10px; text-decoration: none; }
    .brand-logo { height: 40px; width: auto; display: block; }
    .admin-badge { color: var(--amber); font-family: var(--font-display); font-weight: 800; font-size: .8rem; letter-spacing: .25em; }
    .back { display: inline-block; margin-top: 18px; font-size: .85rem; color: var(--slate); }
  `]
})
export class AdminLoginComponent {
  @Input() error = '';
  @Input() busy = false;
  @Output() login = new EventEmitter<{ email: string; password: string }>();

  email = '';
  password = '';

  submit() {
    this.login.emit({ email: this.email, password: this.password });
  }
}
