import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-admin-settings-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <h1>Settings</h1>
  <div class="panel" style="max-width: 480px;">
    <h3 style="margin-top:0">Change password</h3>
    <div class="alert ok" *ngIf="pwMsg">{{ pwMsg }}</div>
    <div class="alert err" *ngIf="pwErr">{{ pwErr }}</div>
    <div class="field"><label>Current password</label><input type="password" [(ngModel)]="pw.current" name="pwc"></div>
    <div class="field"><label>New password (min 8 characters)</label><input type="password" [(ngModel)]="pw.next" name="pwn"></div>
    <button class="btn btn-primary" (click)="changePassword()">Update password</button>
  </div>
  `,
  styles: [`
    h1 { margin-top: 0; }
    .panel { background: #fff; border: 1px solid var(--line); border-radius: 14px; padding: 24px; margin-top: 18px; }
  `]
})
export class AdminSettingsTabComponent {
  pw = { current: '', next: '' };
  pwMsg = ''; pwErr = '';

  constructor(private api: ApiService) {}

  changePassword() {
    this.pwMsg = ''; this.pwErr = '';
    this.api.changePassword(this.pw.current, this.pw.next).subscribe({
      next: () => { this.pwMsg = 'Password updated successfully.'; this.pw = { current: '', next: '' }; },
      error: err => this.pwErr = err?.error?.error || 'Could not update password.'
    });
  }
}
