import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminTab } from '../admin-sidebar/admin-sidebar.component';

@Component({
  selector: 'app-admin-dashboard-tab',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="dash-head">
    <h1>Dashboard</h1>
    <p class="muted">Welcome back, {{ userName || 'Admin' }}. Here's the latest summary of your website activity.</p>
  </div>

  <div class="stat-grid" *ngIf="stats">
    <div class="stat" (click)="navigate.emit('blogs')">
      <div class="stat-icon">📝</div>
      <span>{{ stats.blogs }}</span>
      <div class="stat-label">Blog Posts</div>
    </div>
    <div class="stat" (click)="navigate.emit('qa')">
      <div class="stat-icon">❓</div>
      <span>{{ stats.qa }}</span>
      <div class="stat-label">Q&amp;A Items</div>
    </div>
    <div class="stat" (click)="navigate.emit('jobs')">
      <div class="stat-icon">💼</div>
      <span>{{ stats.jobs }}</span>
      <div class="stat-label">Open Jobs</div>
    </div>
    <div class="stat" (click)="navigate.emit('messages')">
      <div class="stat-icon">✉️</div>
      <span>{{ stats.messages }}</span>
      <div class="stat-label">
        Messages <small class="unread-pill" *ngIf="stats.unreadMessages">{{ stats.unreadMessages }} new</small>
      </div>
    </div>
    <div class="stat" (click)="navigate.emit('applications')">
      <div class="stat-icon">👤</div>
      <span>{{ stats.applications }}</span>
      <div class="stat-label">Applications</div>
    </div>
    <div class="stat" (click)="navigate.emit('chatlogs')">
      <div class="stat-icon">💬</div>
      <span>{{ stats.chats }}</span>
      <div class="stat-label">Visitor Chats</div>
    </div>
  </div>

  <div class="panel actions-panel">
    <h3>Quick Management Actions</h3>
    <div class="actions-buttons">
      <button class="btn btn-primary" (click)="quickNewBlog.emit()">+ Write New Blog Post</button>
      <button class="btn btn-outline" (click)="quickNewQa.emit()">+ Add Q&amp;A Item</button>
    </div>
  </div>
  `,
  styles: [`
    .dash-head h1 {
      margin-top: 0;
      margin-bottom: 6px;
      font-size: 1.8rem;
    }
    .stat-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 16px;
      margin: 24px 0;
    }
    .stat {
      background: #fff;
      border: 1px solid var(--line);
      border-radius: var(--radius);
      padding: 22px 20px;
      color: var(--slate);
      cursor: pointer;
      transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
      display: flex;
      flex-direction: column;
    }
    .stat:hover {
      box-shadow: var(--shadow);
      transform: translateY(-3px);
      border-color: rgba(232, 137, 29, .4);
    }
    .stat-icon {
      font-size: 1.5rem;
      margin-bottom: 8px;
    }
    .stat span {
      display: block;
      font-family: var(--font-display);
      font-size: 2.1rem;
      font-weight: 800;
      color: var(--navy);
      line-height: 1.1;
      margin-bottom: 4px;
    }
    .stat-label {
      font-size: .88rem;
      font-weight: 600;
      color: var(--slate);
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }
    .unread-pill {
      background: #e04646;
      color: #fff;
      padding: 1px 6px;
      border-radius: 999px;
      font-size: .7rem;
    }
    .panel {
      background: #fff;
      border: 1px solid var(--line);
      border-radius: var(--radius);
      padding: 26px;
      margin-top: 20px;
    }
    .actions-panel h3 {
      margin-top: 0;
      margin-bottom: 16px;
      font-size: 1.15rem;
      color: var(--navy);
    }
    .actions-buttons {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    @media (max-width: 480px) {
      .stat-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
      }
      .stat {
        padding: 16px;
      }
      .stat span {
        font-size: 1.6rem;
      }
      .actions-buttons .btn {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class AdminDashboardTabComponent {
  @Input() stats: any = null;
  @Input() userName = '';
  @Output() navigate = new EventEmitter<AdminTab>();
  @Output() quickNewBlog = new EventEmitter<void>();
  @Output() quickNewQa = new EventEmitter<void>();
}
