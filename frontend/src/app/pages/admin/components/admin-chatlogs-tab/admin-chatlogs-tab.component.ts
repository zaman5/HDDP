import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-admin-chatlogs-tab',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="head-row">
    <h1>Chatbot Conversations</h1>
    <span class="count-tag" *ngIf="chatlogs.length">{{ chatlogs.length }} Interactions</span>
  </div>
  <p class="muted subtitle">Visitor questions logged from the interactive chatbot — great for identifying new FAQ items.</p>

  <div class="chat-list">
    <div class="chat-card" *ngFor="let c of chatlogs">
      <div class="chat-head">
        <span class="visitor-tag">👤 Website Visitor</span>
        <span class="when">{{ c.at | date:'medium' }}</span>
      </div>
      <div class="exchange">
        <p class="visitor-msg"><strong>Q:</strong> {{ c.message }}</p>
        <p class="bot-msg"><strong>Bot Reply:</strong> {{ c.reply }}</p>
      </div>
    </div>

    <div class="card center" *ngIf="!chatlogs.length" style="padding: 36px;">
      <p class="muted">No chatbot conversations recorded yet.</p>
    </div>
  </div>
  `,
  styles: [`
    h1 { margin-top: 0; margin-bottom: 0; }
    .head-row { display: flex; justify-content: space-between; align-items: center; gap: 14px; flex-wrap: wrap; margin-bottom: 4px; }
    .count-tag { background: var(--amber); color: #fff; border-radius: 999px; padding: 4px 14px; font-size: .8rem; font-weight: 700; }
    .subtitle { margin-top: 0; margin-bottom: 20px; font-size: .92rem; }
    .chat-list { display: flex; flex-direction: column; gap: 12px; }
    .chat-card { background: #fff; border: 1px solid var(--line); border-radius: var(--radius); padding: 18px 22px; }
    .chat-head { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 10px; }
    .visitor-tag { font-size: .82rem; font-weight: 600; color: var(--navy); }
    .when { color: var(--slate); font-size: .78rem; }
    .exchange { display: flex; flex-direction: column; gap: 6px; }
    .visitor-msg { margin: 0; font-size: .95rem; color: var(--navy); }
    .bot-msg { margin: 0; font-size: .9rem; color: var(--slate); line-height: 1.5; background: var(--bg); padding: 10px 14px; border-radius: 8px; }

    @media (max-width: 640px) {
      .chat-card { padding: 14px 16px; }
    }
  `]
})
export class AdminChatlogsTabComponent implements OnInit {
  chatlogs: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getChatlogs().subscribe({
      next: c => this.chatlogs = c,
      error: () => {}
    });
  }
}
