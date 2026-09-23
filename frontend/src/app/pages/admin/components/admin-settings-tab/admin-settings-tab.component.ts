import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-admin-settings-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="head-row">
    <h1>Admin Settings</h1>
  </div>

  <div class="panel settings-card">
    <h3 class="panel-title">Change Admin Password</h3>
    <p class="muted">Ensure your admin account uses a strong, secure password.</p>

    <div class="alert ok" *ngIf="pwMsg">{{ pwMsg }}</div>
    <div class="alert err" *ngIf="pwErr">{{ pwErr }}</div>

    <div class="field">
      <label for="pwc">Current Password</label>
      <input id="pwc" type="password" [(ngModel)]="pw.current" name="pwc" placeholder="••••••••">
    </div>

    <div class="field">
      <label for="pwn">New Password (minimum 8 characters)</label>
      <input id="pwn" type="password" [(ngModel)]="pw.next" name="pwn" placeholder="••••••••">
    </div>

    <button class="btn btn-primary" (click)="changePassword()" style="margin-top: 8px;">
      Update Password
    </button>
  </div>
  `,
  styles: [`
    h1 { margin-top: 0; margin-bottom: 20px; }
    .settings-card {
      max-width: 520px;
      background: #fff;
      border: 1px solid var(--line);
      border-radius: var(--radius);
      padding: 30px;
    }
    .panel-title {
      margin-top: 0;
      margin-bottom: 6px;
      font-size: 1.2rem;
      color: var(--navy);
    }

    @media (max-width: 640px) {
      .settings-card {
        padding: 20px;
      }
      .settings-card .btn {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class AdminSettingsTabComponent {
  pw = { current: '', next: '' };
  pwMsg = '';
  pwErr = '';

  constructor(private api: ApiService) {}

  changePassword() {
    this.pwMsg = '';
    this.pwErr = '';
    this.api.changePassword(this.pw.current, this.pw.next).subscribe({
      next: () => {
        this.pwMsg = 'Password updated successfully.';
        this.pw = { current: '', next: '' };
      },
      error: err => {
        this.pwErr = err?.error?.error || 'Could not update password.';
      }
    });
  }
}
