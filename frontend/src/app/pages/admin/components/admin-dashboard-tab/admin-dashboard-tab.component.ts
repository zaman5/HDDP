import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminTab } from '../admin-sidebar/admin-sidebar.component';

@Component({
  selector: 'app-admin-dashboard-tab',
  standalone: true,
  imports: [CommonModule],
  template: `
  <h1>Dashboard</h1>
  <p class="muted">Welcome back, {{ userName }}. Here's what's happening on your website.</p>
  <div class="stat-grid" *ngIf="stats">
    <div class="stat" (click)="navigate.emit('blogs')"><span>{{ stats.blogs }}</span>Blog posts</div>
    <div class="stat" (click)="navigate.emit('qa')"><span>{{ stats.qa }}</span>Q&amp;A items</div>
    <div class="stat" (click)="navigate.emit('jobs')"><span>{{ stats.jobs }}</span>Open jobs</div>
    <div class="stat" (click)="navigate.emit('messages')"><span>{{ stats.messages }}</span>Messages <small *ngIf="stats.unreadMessages">({{ stats.unreadMessages }} unread)</small></div>
    <div class="stat" (click)="navigate.emit('applications')"><span>{{ stats.applications }}</span>Applications</div>
    <div class="stat" (click)="navigate.emit('chatlogs')"><span>{{ stats.chats }}</span>Chatbot chats</div>
  </div>
  <div class="panel">
    <h3>Quick actions</h3>
    <button class="btn btn-primary" (click)="quickNewBlog.emit()">+ Write new blog</button>
    <button class="btn btn-outline" (click)="quickNewQa.emit()">+ Add Q&amp;A</button>
  </div>
  `,
  styles: [`
    h1 { margin-top: 0; }
    .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 16px; margin: 22px 0; }
    .stat { background: #fff; border: 1px solid var(--line); border-radius: 14px; padding: 22px; color: var(--slate); cursor: pointer; transition: .2s; }
    .stat:hover { box-shadow: var(--shadow); transform: translateY(-3px); }
    .stat span { display: block; font-family: var(--font-display); font-size: 2rem; font-weight: 800; color: var(--navy); }
    .panel { background: #fff; border: 1px solid var(--line); border-radius: 14px; padding: 24px; margin-top: 18px; }
    .panel .btn { margin-right: 10px; }
  `]
})
export class AdminDashboardTabComponent {
  @Input() stats: any = null;
  @Input() userName = '';
  @Output() navigate = new EventEmitter<AdminTab>();
  @Output() quickNewBlog = new EventEmitter<void>();
  @Output() quickNewQa = new EventEmitter<void>();
}
