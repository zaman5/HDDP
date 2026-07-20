import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-admin-chatlogs-tab',
  standalone: true,
  imports: [CommonModule],
  template: `
  <h1>Chatbot Conversations</h1>
  <p class="muted">Last {{ chatlogs.length }} visitor questions — useful for adding new Q&amp;A items.</p>
  <div class="msg-card" *ngFor="let c of chatlogs">
    <div class="msg-head"><span class="when">{{ c.at | date:'medium' }}</span></div>
    <p><strong>Visitor:</strong> {{ c.message }}</p>
    <p class="muted"><strong>Bot:</strong> {{ c.reply }}</p>
  </div>
  <p class="muted" *ngIf="!chatlogs.length">No chats yet.</p>
  `,
  styles: [`
    h1 { margin-top: 0; }
    .msg-card { background: #fff; border: 1px solid var(--line); border-radius: 14px; padding: 18px 20px; margin-top: 14px; }
    .msg-head { font-size: .88rem; }
    .msg-head .when { float: right; color: var(--slate); font-size: .78rem; }
    .msg-card p { margin: 8px 0; font-size: .92rem; }
  `]
})
export class AdminChatlogsTabComponent implements OnInit {
  chatlogs: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() { this.api.getChatlogs().subscribe({ next: c => this.chatlogs = c, error: () => {} }); }
}
