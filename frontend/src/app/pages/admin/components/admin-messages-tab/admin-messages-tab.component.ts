import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-admin-messages-tab',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="head-row">
    <h1>Contact Messages</h1>
    <span class="count-tag" *ngIf="messages.length">{{ messages.length }} Messages</span>
  </div>

  <div class="msg-list">
    <div class="msg-card" *ngFor="let m of messages" [class.unread]="!m.read">
      <div class="msg-head">
        <div class="sender-info">
          <strong>{{ m.name }}</strong>
          <span class="email-link">· <a href="mailto:{{ m.email }}">{{ m.email }}</a></span>
          <span *ngIf="m.phone" class="phone-link">· <a href="tel:{{ m.phone }}">{{ m.phone }}</a></span>
        </div>
        <div class="msg-meta">
          <span class="unread-badge" *ngIf="!m.read">New</span>
          <span class="when">{{ m.createdAt | date:'medium' }}</span>
        </div>
      </div>

      <div class="msg-subj" *ngIf="m.subject">
        <span class="subj-label">Subject:</span> {{ m.subject }}
      </div>

      <p class="msg-body">{{ m.message }}</p>

      <div class="msg-actions">
        <button class="mini" *ngIf="!m.read" (click)="markRead(m)">Mark as read</button>
        <button class="mini danger" (click)="deleteMessage(m)">Delete</button>
      </div>
    </div>

    <div class="card center" *ngIf="!messages.length" style="padding: 36px;">
      <p class="muted">No messages received yet.</p>
    </div>
  </div>
  `,
  styles: [`
    h1 { margin-top: 0; margin-bottom: 0; }
    .head-row { display: flex; justify-content: space-between; align-items: center; gap: 14px; flex-wrap: wrap; margin-bottom: 18px; }
    .count-tag { background: var(--amber); color: #fff; border-radius: 999px; padding: 4px 14px; font-size: .8rem; font-weight: 700; }
    .msg-list { display: flex; flex-direction: column; gap: 14px; }
    .msg-card { background: #fff; border: 1px solid var(--line); border-radius: var(--radius); padding: 20px 24px; transition: border-color .2s; }
    .msg-card.unread { border-left: 5px solid var(--amber); background: #fffdf9; }
    .msg-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; flex-wrap: wrap; margin-bottom: 8px; }
    .sender-info { font-size: .95rem; color: var(--navy); }
    .sender-info a { color: var(--navy); }
    .sender-info a:hover { color: var(--amber); }
    .msg-meta { display: flex; align-items: center; gap: 8px; }
    .unread-badge { background: #e04646; color: #fff; border-radius: 999px; font-size: .7rem; font-weight: 700; padding: 2px 8px; }
    .when { color: var(--slate); font-size: .8rem; }
    .msg-subj { font-weight: 600; margin: 8px 0; font-size: .94rem; color: var(--navy); }
    .subj-label { color: var(--amber); }
    .msg-body { margin: 10px 0 16px; font-size: .94rem; line-height: 1.6; color: var(--ink); white-space: pre-line; background: var(--bg); padding: 12px 16px; border-radius: 8px; }
    .msg-actions { display: flex; gap: 8px; }
    .mini { border: 1px solid var(--line); background: #fff; border-radius: 8px; padding: 6px 14px; font-size: .8rem; cursor: pointer; color: var(--navy); font-family: inherit; font-weight: 500; transition: all .15s ease; }
    .mini:hover { border-color: var(--amber); color: var(--amber); }
    .mini.danger:hover { border-color: #e04646; color: #e04646; }

    @media (max-width: 640px) {
      .msg-card { padding: 16px; }
      .msg-head { flex-direction: column; gap: 6px; }
    }
  `]
})
export class AdminMessagesTabComponent implements OnInit {
  @Output() changed = new EventEmitter<void>();

  messages: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getMessages().subscribe({
      next: m => this.messages = m,
      error: () => {}
    });
  }

  markRead(m: any) {
    this.api.markMessageRead(m.id).subscribe(() => {
      m.read = true;
      this.changed.emit();
    });
  }

  deleteMessage(m: any) {
    if (!confirm('Delete this message?')) return;
    this.api.deleteMessage(m.id).subscribe(() => {
      this.messages = this.messages.filter(x => x.id !== m.id);
      this.changed.emit();
    });
  }
}
