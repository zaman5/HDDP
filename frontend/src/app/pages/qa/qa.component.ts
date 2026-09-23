import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService, QaItem } from '../../services/api.service';
import { PageHeroComponent } from '../../components/page-hero/page-hero.component';

@Component({
  selector: 'app-qa',
  standalone: true,
  imports: [CommonModule, RouterLink, PageHeroComponent],
  template: `
  <app-page-hero eyebrow="Help Center" title="Questions & Answers">
    <p>Everything you need to know about HDDP Consultants — our services, process, industries, and careers.</p>
  </app-page-hero>

  <section class="section">
    <div class="container faq-container">
      <div class="cats-scroll-wrap">
        <div class="cats">
          <button [class.on]="cat === ''" (click)="cat = ''">All Questions</button>
          <button *ngFor="let c of categories" [class.on]="cat === c" (click)="cat = c">{{ c }}</button>
        </div>
      </div>

      <div class="faq-list">
        <div class="faq-item" *ngFor="let q of filtered()" [class.expanded]="openId === q.id">
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

      <div class="card center cta-card">
        <h3>Still have a question?</h3>
        <p class="muted">Ask our interactive chatbot (bottom-right corner) or send us a direct inquiry.</p>
        <div style="margin-top: 16px;">
          <a routerLink="/get-in-touch" class="btn btn-primary btn-mobile-full">Contact our team</a>
        </div>
      </div>
    </div>
  </section>
  `,
  styles: [`
    .faq-container {
      max-width: 880px;
    }
    .cats-scroll-wrap {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      padding-bottom: 6px;
      margin-bottom: 24px;
    }
    .cats {
      display: flex;
      gap: 8px;
      flex-wrap: nowrap;
      min-width: min-content;
    }
    .cats button {
      border: 1.5px solid var(--line);
      background: #fff;
      border-radius: 999px;
      padding: 8px 18px;
      font-family: var(--font-display);
      font-size: .84rem;
      font-weight: 600;
      color: var(--navy);
      cursor: pointer;
      white-space: nowrap;
      transition: all .2s ease;
    }
    .cats button:hover {
      border-color: var(--amber);
      color: var(--amber);
    }
    .cats button.on {
      background: var(--navy);
      color: #fff;
      border-color: var(--navy);
    }

    .faq-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
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
      padding: 20px 22px;
      font-family: var(--font-display);
      font-weight: 600;
      font-size: 1.02rem;
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
      padding: 0 22px 20px;
      color: var(--slate);
      font-size: .98rem;
      line-height: 1.65;
    }
    .faq-answer p {
      margin: 0;
    }

    .cta-card {
      margin-top: 48px;
      padding: 36px;
    }
    .cta-card h3 {
      font-size: 1.3rem;
      margin: 0 0 8px;
      color: var(--navy);
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
      .cta-card {
        padding: 24px;
      }
    }
  `]
})
export class QaComponent implements OnInit {
  items: QaItem[] = [];
  categories: string[] = [];
  cat = '';
  openId = 0;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getQa().subscribe({
      next: q => {
        this.items = q;
        this.categories = [...new Set(q.map(x => x.category))];
      },
      error: () => {}
    });
  }

  filtered() {
    return this.cat ? this.items.filter(i => i.category === this.cat) : this.items;
  }
}
