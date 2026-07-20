import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export type AdminTab = 'dashboard' | 'blogs' | 'qa' | 'jobs' | 'messages' | 'applications' | 'chatlogs' | 'settings';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
  <aside class="side">
    <a routerLink="/" class="brand">
      <span class="logo-box"><img src="assets/img/logo.jpg" alt="HDDP Consultants" class="brand-logo"></span>
      <span class="admin-badge">ADMIN</span>
    </a>
    <nav>
      <button [class.on]="tab==='dashboard'" (click)="tabChange.emit('dashboard')">📊 Dashboard</button>
      <button [class.on]="tab==='blogs'" (click)="tabChange.emit('blogs')">📝 Blogs</button>
      <button [class.on]="tab==='qa'" (click)="tabChange.emit('qa')">❓ Q&amp;A</button>
      <button [class.on]="tab==='jobs'" (click)="tabChange.emit('jobs')">💼 Jobs</button>
      <button [class.on]="tab==='messages'" (click)="tabChange.emit('messages')">✉️ Messages <span class="pill" *ngIf="stats?.unreadMessages">{{ stats.unreadMessages }}</span></button>
      <button [class.on]="tab==='applications'" (click)="tabChange.emit('applications')">👤 Applications</button>
      <button [class.on]="tab==='chatlogs'" (click)="tabChange.emit('chatlogs')">💬 Chatbot Logs</button>
      <button [class.on]="tab==='settings'" (click)="tabChange.emit('settings')">⚙️ Settings</button>
    </nav>
    <div class="side-foot">
      <div class="who">{{ userName }}<br><small>{{ userEmail }}</small></div>
      <button class="logout" (click)="logout.emit()">Log out</button>
    </div>
  </aside>
  `,
  styles: [`
    .side { width: 240px; background: var(--navy-deep); color: #c8d6e6; display: flex; flex-direction: column; padding: 22px 14px; position: sticky; top: 0; height: 100vh; }
    .brand { display: flex; align-items: center; gap: 10px; text-decoration: none; }
    .side .brand { margin-bottom: 26px; padding-left: 8px; }
    .logo-box { background: #fff; border-radius: 6px; padding: 4px 8px; display: inline-flex; }
    .brand-logo { height: 26px; width: auto; display: block; }
    .admin-badge { color: var(--amber); font-family: var(--font-display); font-weight: 800; font-size: .8rem; letter-spacing: .25em; }
    .side nav { display: flex; flex-direction: column; gap: 4px; flex: 1; }
    .side nav button { background: none; border: none; color: #c8d6e6; text-align: left; padding: 11px 12px; border-radius: 10px; font: inherit; font-size: .9rem; cursor: pointer; display: flex; align-items: center; gap: 8px; }
    .side nav button:hover { background: rgba(255,255,255,.08); }
    .side nav button.on { background: var(--amber); color: #fff; font-weight: 600; }
    .pill { background: #e04646; color: #fff; border-radius: 999px; font-size: .68rem; padding: 1px 7px; margin-left: auto; }
    .side-foot { border-top: 1px solid rgba(255,255,255,.12); padding-top: 14px; font-size: .82rem; }
    .who small { color: #7e93a9; }
    .logout { margin-top: 10px; width: 100%; background: rgba(255,255,255,.1); color: #fff; border: none; border-radius: 8px; padding: 9px; cursor: pointer; }
    .logout:hover { background: #e04646; }
    @media (max-width: 860px) {
      .side { width: 100%; height: auto; position: static; flex-direction: row; flex-wrap: wrap; align-items: center; }
      .side nav { flex-direction: row; flex-wrap: wrap; }
      .side-foot { border: none; padding: 0; margin-left: auto; display: flex; gap: 10px; align-items: center; }
    }
  `]
})
export class AdminSidebarComponent {
  @Input() tab: AdminTab = 'dashboard';
  @Input() stats: any = null;
  @Input() userName = '';
  @Input() userEmail = '';
  @Output() tabChange = new EventEmitter<AdminTab>();
  @Output() logout = new EventEmitter<void>();
}
