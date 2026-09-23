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
      <a routerLink="/" class="brand">
        <span class="logo-box"><img src="assets/img/logo.png" alt="HDDP Consultants" class="brand-logo"></span>
        <span class="admin-badge">ADMIN</span>
      </a>
      <h1>Admin Panel Login</h1>
      <p class="muted">Manage your website content — blogs, Q&amp;A, jobs, messages, and applications.</p>

      <div class="alert err" *ngIf="error">{{ error }}</div>

      <form (ngSubmit)="submit()">
        <div class="field">
          <label for="admin-email">Admin Email</label>
          <input id="admin-email" [(ngModel)]="email" name="email" type="email" autocomplete="username" placeholder="admin@hddpconsultants.com" required>
        </div>
        <div class="field">
          <label for="admin-pw">Password</label>
          <input id="admin-pw" [(ngModel)]="password" name="password" type="password" autocomplete="current-password" placeholder="••••••••" required>
        </div>
        <button class="btn btn-primary" style="width:100%; margin-top: 10px;" [disabled]="busy">
          {{ busy ? 'Signing in…' : 'Sign In to Admin Panel' }}
        </button>
      </form>

      <a routerLink="/" class="back">← Back to public website</a>
    </div>
  </div>
  `,
  styles: [`
    .login-wrap {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--navy-deep), var(--navy));
      padding: 24px 16px;
    }
    .login-card {
      background: #fff;
      border-radius: 18px;
      padding: 40px 36px;
      width: 100%;
      max-width: 440px;
      box-shadow: 0 25px 60px rgba(0, 0, 0, .35);
    }
    .login-card h1 {
      font-size: 1.45rem;
      margin: 18px 0 6px;
      color: var(--navy);
    }
    .login-card .muted {
      font-size: .9rem;
      margin-bottom: 20px;
      line-height: 1.5;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
    }
    .logo-box {
      background: #fff;
      border: 1px solid var(--line);
      border-radius: 6px;
      padding: 4px 8px;
      display: inline-flex;
    }
    .brand-logo {
      height: 32px;
      width: auto;
      display: block;
    }
    .admin-badge {
      color: var(--amber);
      font-family: var(--font-display);
      font-weight: 800;
      font-size: .8rem;
      letter-spacing: .2em;
    }
    .back {
      display: inline-block;
      margin-top: 22px;
      font-size: .88rem;
      color: var(--slate);
      font-weight: 500;
      transition: color .2s;
    }
    .back:hover {
      color: var(--amber);
    }

    @media (max-width: 480px) {
      .login-card {
        padding: 28px 20px;
      }
      .login-card h1 {
        font-size: 1.25rem;
      }
    }
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
