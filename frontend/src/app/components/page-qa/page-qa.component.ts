import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService, QaItem } from '../../services/api.service';

@Component({
  selector: 'app-page-qa',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
  <section class="section alt page-qa" *ngIf="items.length">
    <div class="container center faq-container">
      <p class="eyebrow">FAQ</p>
      <h2 class="section-title">{{ heading }}</h2>
      <p class="section-lead" style="margin-bottom: 30px;">Find quick answers to common questions.</p>

      <div class="faq-list">
        <div class="faq-item" *ngFor="let q of items" [class.expanded]="openId === q.id">
          <button class="faq-question" (click)="openId = openId === q.id ? 0 : q.id" [attr.aria-expanded]="openId === q.id">
            <span>{{ q.question }}</span>
            <span class="faq-chevron">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
            </span>
          </button>
          <div class="faq-answer" *ngIf="openId === q.id">
            <p>{{ q.answer }}</p>
          </div>
        </div>
      </div>

      <div style="margin-top: 28px;">
        <a routerLink="/qa" class="btn btn-outline">See all questions</a>
      </div>
    </div>
  </section>
  `,
  styles: [`
    .faq-container {
      max-width: 880px;
    }
    .faq-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      text-align: left;
    }
    .faq-item {
      border: 1px solid var(--line);
      border-radius: 12px;
      overflow: hidden;
      background: #fff;
      transition: border-color .2s, box-shadow .2s;
    }
    .faq-item.expanded {
      border-color: rgba(232, 137, 29, .4);
      box-shadow: 0 4px 16px rgba(14, 42, 71, .06);
    }
    .faq-question {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      background: none;
      border: none;
      padding: 18px 22px;
      font-family: var(--font-display);
      font-weight: 600;
      font-size: 1rem;
      color: var(--navy);
      cursor: pointer;
      text-align: left;
      line-height: 1.35;
      transition: color .2s ease;
    }
    .faq-question:hover {
      color: var(--amber);
    }
    .faq-chevron {
      color: var(--amber);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: transform .25s ease;
    }
    .faq-item.expanded .faq-chevron {
      transform: rotate(180deg);
    }
    .faq-answer {
      padding: 0 22px 18px;
      color: var(--slate);
      font-size: .95rem;
      line-height: 1.6;
    }
    .faq-answer p {
      margin: 0;
    }

    @media (max-width: 640px) {
      .faq-question {
        padding: 16px 18px;
        font-size: .95rem;
      }
      .faq-answer {
        padding: 0 18px 16px;
        font-size: .92rem;
      }
    }
  `]
})
export class PageQaComponent implements OnInit {
  @Input() category = '';
  @Input() heading = 'Frequently Asked Questions';
  items: QaItem[] = [];
  openId = 0;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getQa().subscribe({
      next: q => {
        this.items = this.category ? q.filter(x => x.category === this.category) : q;
      },
      error: () => {}
    });
  }
}
