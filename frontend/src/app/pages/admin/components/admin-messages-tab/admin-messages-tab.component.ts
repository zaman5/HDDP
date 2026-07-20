import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-admin-messages-tab',
  standalone: true,
  imports: [CommonModule],
  template: `
  <h1>Contact Messages</h1>
  <div class="msg-card" *ngFor="let m of messages" [class.unread]="!m.read">
    <div class="msg-head">
      <strong>{{ m.name }}</strong> · <a href="mailto:{{ m.email }}">{{ m.email }}</a>
      <span *ngIf="m.phone"> · {{ m.phone }}</span>
      <span class="when">{{ m.createdAt | date:'medium' }}</span>
    </div>
    <div class="msg-subj" *ngIf="m.subject">Subject: {{ m.subject }}</div>
    <p>{{ m.message }}</p>
    <div>
      <button class="mini" *ngIf="!m.read" (click)="markRead(m)">Mark as read</button>
      <button class="mini danger" (click)="deleteMessage(m)">Delete</button>
    </div>
  </div>
  <p class="muted" *ngIf="!messages.length">No messages yet.</p>
  `,
  styles: [`
    h1 { margin-top: 0; }
    .msg-card { background: #fff; border: 1px solid var(--line); border-radius: 14px; padding: 18px 20px; margin-top: 14px; }
    .msg-card.unread { border-left: 4px solid var(--amber); }
    .msg-head { font-size: .88rem; }
    .msg-head .when { float: right; color: var(--slate); font-size: .78rem; }
    .msg-subj { font-weight: 600; margin-top: 6px; font-size: .9rem; }
    .msg-card p { margin: 8px 0; font-size: .92rem; }
    .mini { border: 1px solid var(--line); background: #fff; border-radius: 8px; padding: 5px 12px; font-size: .78rem; cursor: pointer; margin: 2px 4px 2px 0; color: var(--navy); }
    .mini:hover { border-color: var(--amber); color: var(--amber); }
    .mini.danger:hover { border-color: #e04646; color: #e04646; }
  `]
})
export class AdminMessagesTabComponent implements OnInit {
  @Output() changed = new EventEmitter<void>();

  messages: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() { this.api.getMessages().subscribe({ next: m => this.messages = m, error: () => {} }); }

  markRead(m: any) {
    this.api.markMessageRead(m.id).subscribe(() => { m.read = true; this.changed.emit(); });
  }
  deleteMessage(m: any) {
    if (!confirm('Delete this message?')) return;
    this.api.deleteMessage(m.id).subscribe(() => {
      this.messages = this.messages.filter(x => x.id !== m.id);
      this.changed.emit();
    });
  }
}
