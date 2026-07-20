import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { AdminSidebarComponent, AdminTab } from './components/admin-sidebar/admin-sidebar.component';
import { AdminDashboardTabComponent } from './components/admin-dashboard-tab/admin-dashboard-tab.component';
import { AdminBlogsTabComponent } from './components/admin-blogs-tab/admin-blogs-tab.component';
import { AdminQaTabComponent } from './components/admin-qa-tab/admin-qa-tab.component';
import { AdminJobsTabComponent } from './components/admin-jobs-tab/admin-jobs-tab.component';
import { AdminMessagesTabComponent } from './components/admin-messages-tab/admin-messages-tab.component';
import { AdminApplicationsTabComponent } from './components/admin-applications-tab/admin-applications-tab.component';
import { AdminChatlogsTabComponent } from './components/admin-chatlogs-tab/admin-chatlogs-tab.component';
import { AdminSettingsTabComponent } from './components/admin-settings-tab/admin-settings-tab.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    AdminLoginComponent,
    AdminSidebarComponent,
    AdminDashboardTabComponent,
    AdminBlogsTabComponent,
    AdminQaTabComponent,
    AdminJobsTabComponent,
    AdminMessagesTabComponent,
    AdminApplicationsTabComponent,
    AdminChatlogsTabComponent,
    AdminSettingsTabComponent
  ],
  template: `
  <app-admin-login *ngIf="!auth.isLoggedIn" [error]="loginError" [busy]="busy" (login)="login($event)"></app-admin-login>

  <div class="admin" *ngIf="auth.isLoggedIn">
    <app-admin-sidebar
      [tab]="tab"
      [stats]="stats"
      [userName]="auth.user?.name || ''"
      [userEmail]="auth.user?.email || ''"
      (tabChange)="tab = $event"
      (logout)="logout()">
    </app-admin-sidebar>

    <main class="main">
      <app-admin-dashboard-tab *ngIf="tab==='dashboard'"
        [stats]="stats" [userName]="auth.user?.name || ''"
        (navigate)="tab = $event" (quickNewBlog)="quickNewBlog()" (quickNewQa)="quickNewQa()">
      </app-admin-dashboard-tab>

      <app-admin-blogs-tab *ngIf="tab==='blogs'" (changed)="refreshStats()"></app-admin-blogs-tab>
      <app-admin-qa-tab *ngIf="tab==='qa'" (changed)="refreshStats()"></app-admin-qa-tab>
      <app-admin-jobs-tab *ngIf="tab==='jobs'" (changed)="refreshStats()"></app-admin-jobs-tab>
      <app-admin-messages-tab *ngIf="tab==='messages'" (changed)="refreshStats()"></app-admin-messages-tab>
      <app-admin-applications-tab *ngIf="tab==='applications'"></app-admin-applications-tab>
      <app-admin-chatlogs-tab *ngIf="tab==='chatlogs'"></app-admin-chatlogs-tab>
      <app-admin-settings-tab *ngIf="tab==='settings'"></app-admin-settings-tab>
    </main>
  </div>
  `,
  styles: [`
    .admin { display: flex; min-height: 100vh; background: var(--bg); }
    .main { flex: 1; padding: 34px 38px; max-width: 1100px; }
    @media (max-width: 860px) {
      .admin { flex-direction: column; }
      .main { padding: 22px 16px; }
    }
  `]
})
export class AdminComponent implements OnInit {
  @ViewChild(AdminBlogsTabComponent) blogsTab?: AdminBlogsTabComponent;
  @ViewChild(AdminQaTabComponent) qaTab?: AdminQaTabComponent;

  loginForm = { email: '', password: '' };
  loginError = '';
  busy = false;

  tab: AdminTab = 'dashboard';
  stats: any = null;

  constructor(public auth: AuthService, private api: ApiService) {}

  ngOnInit() { if (this.auth.isLoggedIn) this.refreshStats(); }

  login(credentials: { email: string; password: string }) {
    this.loginError = '';
    this.busy = true;
    this.api.login(credentials.email, credentials.password).subscribe({
      next: res => { this.auth.save(res.token, res.user); this.busy = false; this.refreshStats(); },
      error: err => { this.loginError = err?.error?.error || 'Login failed'; this.busy = false; }
    });
  }
  logout() { this.auth.logout(); this.tab = 'dashboard'; }

  refreshStats() { this.api.getStats().subscribe({ next: s => this.stats = s, error: () => {} }); }

  quickNewBlog() { this.tab = 'blogs'; setTimeout(() => this.blogsTab?.newBlog()); }
  quickNewQa() { this.tab = 'qa'; setTimeout(() => this.qaTab?.newQa()); }
}
