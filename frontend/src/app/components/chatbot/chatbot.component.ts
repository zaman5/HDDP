import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

interface Msg { from: 'user' | 'bot'; text: string; }

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <button class="fab" (click)="toggle()" [attr.aria-label]="open ? 'Close chat' : 'Open chat'">
    <svg *ngIf="!open" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
    <svg *ngIf="open" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
  </button>

  <div class="panel" *ngIf="open">
    <div class="panel-head">
      <div>
        <strong>HDDP Assistant</strong>
        <div class="status">● Online — ask about our services</div>
      </div>
    </div>
    <div class="panel-body" #body>
      <div *ngFor="let m of messages" class="msg" [class.user]="m.from === 'user'">
        <div class="bubble">{{ m.text }}</div>
      </div>
      <div class="msg" *ngIf="loading"><div class="bubble typing">Typing…</div></div>
    </div>
    <div class="quick" *ngIf="messages.length < 2">
      <button *ngFor="let q of quickQuestions" (click)="ask(q)">{{ q }}</button>
    </div>
    <form class="panel-foot" (ngSubmit)="send()">
      <input [(ngModel)]="draft" name="draft" placeholder="Type your question…" autocomplete="off" />
      <button type="submit" class="send" [disabled]="!draft.trim() || loading" aria-label="Send">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4 20-7z"/></svg>
      </button>
    </form>
  </div>
  `,
  styles: [`
    .fab { position: fixed; right: 22px; bottom: 22px; width: 58px; height: 58px; border-radius: 50%; border: none; background: var(--amber); color: #fff; cursor: pointer; box-shadow: 0 8px 24px rgba(232,137,29,.45); z-index: 90; transition: .2s; display: flex; align-items: center; justify-content: center; }
    .fab:hover { transform: scale(1.07); }
    .panel { position: fixed; right: 22px; bottom: 92px; width: 350px; max-width: calc(100vw - 32px); height: 480px; max-height: 70vh; background: #fff; border-radius: 18px; box-shadow: 0 18px 50px rgba(14,42,71,.28); display: flex; flex-direction: column; overflow: hidden; z-index: 90; }
    .panel-head { background: linear-gradient(135deg, var(--navy-deep), var(--navy)); color: #fff; padding: 14px 18px; }
    .status { font-size: .74rem; color: #8fe3a8; }
    .panel-body { flex: 1; overflow-y: auto; padding: 14px; background: var(--bg); }
    .msg { display: flex; margin-bottom: 10px; }
    .msg.user { justify-content: flex-end; }
    .bubble { max-width: 82%; padding: 10px 14px; border-radius: 14px; font-size: .88rem; white-space: pre-line; background: #fff; border: 1px solid var(--line); }
    .msg.user .bubble { background: var(--navy); color: #fff; border: none; }
    .typing { color: var(--slate); font-style: italic; }
    .quick { display: flex; flex-wrap: wrap; gap: 6px; padding: 0 12px 8px; background: var(--bg); }
    .quick button { border: 1px solid var(--line); background: #fff; border-radius: 999px; padding: 5px 12px; font-size: .74rem; cursor: pointer; color: var(--navy); }
    .quick button:hover { border-color: var(--amber); color: var(--amber); }
    .panel-foot { display: flex; border-top: 1px solid var(--line); }
    .panel-foot input { flex: 1; border: none; padding: 14px; font: inherit; }
    .panel-foot input:focus { outline: none; }
    .send { border: none; background: var(--amber); color: #fff; width: 52px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
    .send:disabled { opacity: .5; cursor: default; }
  `]
})
export class ChatbotComponent {
  open = false;
  draft = '';
  loading = false;
  messages: Msg[] = [];
  quickQuestions = ['What services do you offer?', 'Which industries do you serve?', 'How can I apply for a job?', 'How do I contact you?'];

  constructor(private api: ApiService) {}

  toggle() {
    this.open = !this.open;
    if (this.open && !this.messages.length) {
      this.messages.push({ from: 'bot', text: 'Hello! Welcome to HDDP Consultants. I can answer questions about our services, industries, recruitment process, careers and contact details. How can I help you today?' });
    }
  }

  ask(q: string) { this.draft = q; this.send(); }

  send() {
    const text = this.draft.trim();
    if (!text || this.loading) return;
    this.messages.push({ from: 'user', text });
    this.draft = '';
    this.loading = true;
    this.api.chat(text).subscribe({
      next: res => { this.messages.push({ from: 'bot', text: res.reply }); this.loading = false; this.scroll(); },
      error: () => { this.messages.push({ from: 'bot', text: 'Sorry, I could not reach the server. Please try again or call +1 (480) 712-2224.' }); this.loading = false; }
    });
    this.scroll();
  }

  private scroll() {
    setTimeout(() => {
      const el = document.querySelector('.panel-body');
      if (el) el.scrollTop = el.scrollHeight;
    }, 60);
  }
}
