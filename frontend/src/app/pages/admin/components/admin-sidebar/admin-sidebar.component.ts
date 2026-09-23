import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export type AdminTab = 'dashboard' | 'blogs' | 'qa' | 'jobs' | 'messages' | 'applications' | 'chatlogs' | 'settings';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
  <!-- Top header bar for mobile -->
  <div class="mobile-topbar">
    <a routerLink="/" class="brand">
      <span class="logo-box"><img src="assets/img/logo.png" alt="HDDP" class="brand-logo"></span>
      <span class="admin-badge">ADMIN</span>
    </a>
    <button class="menu-toggle" (click)="mobileNavOpen = !mobileNavOpen" aria-label="Toggle admin menu">
      <span>{{ mobileNavOpen ? '✕ Close' : '☰ Menu' }}</span>
    </button>
  </div>

  <aside class="side" [class.mobile-open]="mobileNavOpen">
    <a routerLink="/" class="brand desktop-brand">
      <span class="logo-box"><img src="assets/img/logo.png" alt="HDDP" class="brand-logo"></span>
      <span class="admin-badge">ADMIN</span>
    </a>

    <nav>
      <button [class.on]="tab==='dashboard'" (click)="selectTab('dashboard')">
        <span class="icon">📊</span>
        <span>Dashboard</span>
      </button>
      <button [class.on]="tab==='blogs'" (click)="selectTab('blogs')">
        <span class="icon">📝</span>
        <span>Blogs</span>
      </button>
      <button [class.on]="tab==='qa'" (click)="selectTab('qa')">
        <span class="icon">❓</span>
        <span>Q&amp;A</span>
      </button>
      <button [class.on]="tab==='jobs'" (click)="selectTab('jobs')">
        <span class="icon">💼</span>
        <span>Jobs</span>
      </button>
      <button [class.on]="tab==='messages'" (click)="selectTab('messages')">
        <span class="icon">✉️</span>
        <span>Messages</span>
        <span class="pill" *ngIf="stats?.unreadMessages">{{ stats.unreadMessages }}</span>
      </button>
      <button [class.on]="tab==='applications'" (click)="selectTab('applications')">
        <span class="icon">👤</span>
        <span>Applications</span>
      </button>
      <button [class.on]="tab==='chatlogs'" (click)="selectTab('chatlogs')">
        <span class="icon">💬</span>
        <span>Chat Logs</span>
      </button>
      <button [class.on]="tab==='settings'" (click)="selectTab('settings')">
        <span class="icon">⚙️</span>
        <span>Settings</span>
      </button>
    </nav>

    <div class="side-foot">
      <div class="who">
        <strong>{{ userName || 'Admin' }}</strong>
        <small>{{ userEmail }}</small>
      </div>
      <button class="logout" (click)="logout.emit()">Log out</button>
    </div>
  </aside>
  `,
  styles: [`
    .mobile-topbar {
      display: none;
      background: var(--navy-deep);
      padding: 12px 18px;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(255, 255, 255, .1);
      position: sticky;
      top: 0;
      z-index: 60;
    }
    .menu-toggle {
      background: rgba(255, 255, 255, .12);
      border: 1px solid rgba(255, 255, 255, .2);
      color: #fff;
      padding: 7px 14px;
      border-radius: 8px;
      font-size: .88rem;
      font-weight: 600;
      cursor: pointer;
    }

    .side {
      width: 250px;
      background: var(--navy-deep);
      color: #c8d6e6;
      display: flex;
      flex-direction: column;
      padding: 24px 16px;
      position: sticky;
      top: 0;
      height: 100vh;
      overflow-y: auto;
      flex-shrink: 0;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
    }
    .desktop-brand {
      margin-bottom: 28px;
      padding-left: 6px;
    }
    .logo-box {
      background: #fff;
      border-radius: 6px;
      padding: 4px 8px;
      display: inline-flex;
    }
    .brand-logo {
      height: 24px;
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

    .side nav {
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex: 1;
    }
    .side nav button {
      background: none;
      border: none;
      color: #c8d6e6;
      text-align: left;
      padding: 11px 14px;
      border-radius: 10px;
      font-family: inherit;
      font-size: .92rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 10px;
      transition: background .18s ease, color .18s ease;
      width: 100%;
    }
    .side nav button .icon {
      font-size: 1.1rem;
    }
    .side nav button:hover {
      background: rgba(255, 255, 255, .08);
      color: #fff;
    }
    .side nav button.on {
      background: var(--amber);
      color: #fff;
      font-weight: 600;
    }
    .pill {
      background: #e04646;
      color: #fff;
      border-radius: 999px;
      font-size: .72rem;
      font-weight: 700;
      padding: 2px 8px;
      margin-left: auto;
    }

    .side-foot {
      border-top: 1px solid rgba(255, 255, 255, .12);
      padding-top: 16px;
      margin-top: 16px;
    }
    .who {
      font-size: .84rem;
      line-height: 1.4;
      margin-bottom: 10px;
      color: #fff;
    }
    .who small {
      display: block;
      color: #8fa5bd;
      word-break: break-all;
    }
    .logout {
      width: 100%;
      background: rgba(255, 255, 255, .1);
      color: #fff;
      border: none;
      border-radius: 8px;
      padding: 9px;
      cursor: pointer;
      font-family: inherit;
      font-weight: 500;
      transition: background .2s ease;
    }
    .logout:hover {
      background: #e04646;
    }

    @media (max-width: 860px) {
      .mobile-topbar {
        display: flex;
      }
      .desktop-brand {
        display: none;
      }
      .side {
        display: none;
        width: 100%;
        height: auto;
        position: static;
        box-shadow: 0 10px 25px rgba(0, 0, 0, .2);
      }
      .side.mobile-open {
        display: flex;
      }
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

  mobileNavOpen = false;

  selectTab(tab: AdminTab) {
    this.tabChange.emit(tab);
    this.mobileNavOpen = false;
  }
}
