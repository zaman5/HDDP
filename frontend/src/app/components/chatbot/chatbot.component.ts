import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

interface Msg { from: 'user' | 'bot'; text: string; }

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <!-- Floating Action Button -->
  <button class="fab" (click)="toggle()" [attr.aria-label]="open ? 'Close chat' : 'Open chat'">
    <svg *ngIf="!open" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
    <svg *ngIf="open" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
  </button>

  <!-- Backdrop on mobile -->
  <div class="chat-backdrop" *ngIf="open" (click)="toggle()"></div>

  <!-- Chat Panel -->
  <div class="panel" *ngIf="open">
    <div class="panel-head">
      <div class="panel-title-wrap">
        <div class="bot-avatar">🤖</div>
        <div>
          <strong>HDDP Assistant</strong>
          <div class="status"><span class="dot"></span> Online — ask about our services</div>
        </div>
      </div>
      <button class="close-btn" (click)="toggle()" aria-label="Close chat">✕</button>
    </div>

    <div class="panel-body" #bodyEl>
      <div *ngFor="let m of messages" class="msg" [class.user]="m.from === 'user'">
        <div class="bubble">{{ m.text }}</div>
      </div>
      <div class="msg" *ngIf="loading">
        <div class="bubble typing">
          <span></span><span></span><span></span>
        </div>
      </div>
    </div>

    <div class="quick" *ngIf="messages.length < 3">
      <button *ngFor="let q of quickQuestions" (click)="ask(q)">{{ q }}</button>
    </div>

    <form class="panel-foot" (ngSubmit)="send()">
      <input [(ngModel)]="draft" name="draft" placeholder="Type your question here…" autocomplete="off" />
      <button type="submit" class="send" [disabled]="!draft.trim() || loading" aria-label="Send message">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4 20-7z"/></svg>
      </button>
    </form>
  </div>
  `,
  styles: [`
    .fab {
      position: fixed;
      right: 20px;
      bottom: 20px;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      border: none;
      background: var(--amber);
      color: #fff;
      cursor: pointer;
      box-shadow: 0 8px 24px rgba(232, 137, 29, .45);
      z-index: 90;
      transition: transform .2s ease, background .2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .fab:hover {
      transform: scale(1.08);
      background: var(--amber-hover);
    }

    .chat-backdrop {
      display: none;
    }

    .panel {
      position: fixed;
      right: 20px;
      bottom: 88px;
      width: 370px;
      max-width: calc(100vw - 32px);
      height: 520px;
      max-height: calc(100vh - 110px);
      background: #fff;
      border-radius: 18px;
      box-shadow: 0 18px 50px rgba(14, 42, 71, .28);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      z-index: 90;
      border: 1px solid var(--line);
      animation: popIn .25s ease-out;
    }

    .panel-head {
      background: linear-gradient(135deg, var(--navy-deep), var(--navy));
      color: #fff;
      padding: 14px 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .panel-title-wrap {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .bot-avatar {
      font-size: 1.3rem;
      background: rgba(255, 255, 255, .15);
      width: 34px;
      height: 34px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .status {
      font-size: .74rem;
      color: #8fe3a8;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .dot {
      width: 6px;
      height: 6px;
      background: #8fe3a8;
      border-radius: 50%;
      display: inline-block;
    }
    .close-btn {
      background: none;
      border: none;
      color: #fff;
      font-size: 1.1rem;
      cursor: pointer;
      opacity: .8;
      padding: 4px;
    }
    .close-btn:hover {
      opacity: 1;
    }

    .panel-body {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      background: var(--bg);
      -webkit-overflow-scrolling: touch;
    }
    .msg {
      display: flex;
      margin-bottom: 12px;
    }
    .msg.user {
      justify-content: flex-end;
    }
    .bubble {
      max-width: 82%;
      padding: 10px 14px;
      border-radius: 14px;
      font-size: .88rem;
      white-space: pre-line;
      background: #fff;
      border: 1px solid var(--line);
      line-height: 1.5;
      color: var(--ink);
    }
    .msg.user .bubble {
      background: var(--navy);
      color: #fff;
      border: none;
      border-bottom-right-radius: 4px;
    }
    .msg:not(.user) .bubble {
      border-bottom-left-radius: 4px;
    }

    .typing {
      display: flex;
      gap: 4px;
      padding: 12px 16px;
      align-items: center;
    }
    .typing span {
      width: 6px;
      height: 6px;
      background: var(--slate);
      border-radius: 50%;
      animation: blink 1.2s infinite ease-in-out both;
    }
    .typing span:nth-child(1) { animation-delay: -0.32s; }
    .typing span:nth-child(2) { animation-delay: -0.16s; }

    @keyframes blink {
      0%, 80%, 100% { transform: scale(0); opacity: .4; }
      40% { transform: scale(1); opacity: 1; }
    }

    .quick {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      padding: 8px 14px;
      background: var(--bg);
      border-top: 1px solid var(--line);
    }
    .quick button {
      border: 1px solid var(--line);
      background: #fff;
      border-radius: 999px;
      padding: 6px 12px;
      font-size: .76rem;
      cursor: pointer;
      color: var(--navy);
      font-family: inherit;
      transition: all .2s ease;
    }
    .quick button:hover {
      border-color: var(--amber);
      color: var(--amber);
      background: var(--amber-soft);
    }

    .panel-foot {
      display: flex;
      border-top: 1px solid var(--line);
      background: #fff;
    }
    .panel-foot input {
      flex: 1;
      border: none;
      padding: 14px 16px;
      font-family: inherit;
      font-size: 16px;
      color: var(--ink);
      background: #fff;
    }
    .panel-foot input:focus {
      outline: none;
    }
    .send {
      border: none;
      background: var(--amber);
      color: #fff;
      width: 54px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background .2s ease;
    }
    .send:hover:not(:disabled) {
      background: var(--amber-hover);
    }
    .send:disabled {
      opacity: .5;
      cursor: not-allowed;
    }

    @keyframes popIn {
      from { opacity: 0; transform: translateY(12px) scale(.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    /* Mobile Sheet Mode */
    @media (max-width: 520px) {
      .chat-backdrop {
        display: block;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, .4);
        z-index: 85;
      }
      .panel {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        max-width: 100%;
        height: 84vh;
        max-height: 84vh;
        border-radius: 20px 20px 0 0;
        border: none;
        z-index: 95;
      }
      .fab {
        right: 16px;
        bottom: 16px;
      }
    }
  `]
})
export class ChatbotComponent {
  @ViewChild('bodyEl') bodyEl?: ElementRef<HTMLDivElement>;

  open = false;
  draft = '';
  loading = false;
  messages: Msg[] = [];
  quickQuestions = [
    'What services do you offer?',
    'Which industries do you serve?',
    'How can I apply for a job?',
    'How do I contact you?'
  ];

  constructor(private api: ApiService) {}

  toggle() {
    this.open = !this.open;
    if (this.open && !this.messages.length) {
      this.messages.push({
        from: 'bot',
        text: 'Hello! Welcome to HDDP Consultants. I can answer questions about our services, industries, recruitment process, careers, and contact details. How can I help you today?'
      });
    }
  }

  ask(q: string) {
    this.draft = q;
    this.send();
  }

  send() {
    const text = this.draft.trim();
    if (!text || this.loading) return;
    this.messages.push({ from: 'user', text });
    this.draft = '';
    this.loading = true;
    this.api.chat(text).subscribe({
      next: res => {
        this.messages.push({ from: 'bot', text: res.reply });
        this.loading = false;
        this.scrollToBottom();
      },
      error: () => {
        this.messages.push({
          from: 'bot',
          text: 'Sorry, I could not reach the server. Please try again or call +1 (480) 712-2224.'
        });
        this.loading = false;
      }
    });
    this.scrollToBottom();
  }

  private scrollToBottom() {
    setTimeout(() => {
      if (this.bodyEl) {
        this.bodyEl.nativeElement.scrollTop = this.bodyEl.nativeElement.scrollHeight;
      }
    }, 60);
  }
}
