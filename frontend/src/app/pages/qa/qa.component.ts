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
    <p>Everything you need to know about HDDP Consultants — our services, process, industries and careers.</p>
  </app-page-hero>

  <section class="section">
    <div class="container" style="max-width: 840px;">
      <div class="cats">
        <button [class.on]="cat === ''" (click)="cat = ''">All</button>
        <button *ngFor="let c of categories" [class.on]="cat === c" (click)="cat = c">{{ c }}</button>
      </div>
      <div class="faq" *ngFor="let q of filtered()">
        <button class="q" (click)="openId = openId === q.id ? 0 : q.id" [attr.aria-expanded]="openId === q.id">
          <span>{{ q.question }}</span>
          <span class="chev">{{ openId === q.id ? '−' : '+' }}</span>
        </button>
        <div class="a" *ngIf="openId === q.id">
          <p>{{ q.answer }}</p>
        </div>
      </div>
      <div class="card center" style="margin-top: 40px;">
        <h3 style="margin-top:0;">Still have a question?</h3>
        <p class="muted">Ask our chatbot (bottom-right corner) or send us a message directly.</p>
        <a routerLink="/get-in-touch" class="btn btn-primary">Contact us</a>
      </div>
    </div>
  </section>
  `,
  styles: [`
    .cats { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 26px; }
    .cats button { border: 1.5px solid var(--line); background: #fff; border-radius: 999px; padding: 7px 18px; font-family: var(--font-display); font-size: .8rem; font-weight: 600; color: var(--navy); cursor: pointer; }
    .cats button.on { background: var(--navy); color: #fff; border-color: var(--navy); }
    .faq { border: 1px solid var(--line); border-radius: 12px; margin-bottom: 12px; overflow: hidden; background: #fff; }
    .q { width: 100%; display: flex; justify-content: space-between; align-items: center; gap: 14px; background: none; border: none; padding: 18px 20px; font-family: var(--font-display); font-weight: 600; font-size: .98rem; color: var(--navy); cursor: pointer; text-align: left; }
    .q:hover { color: var(--amber); }
    .chev { font-size: 1.3rem; color: var(--amber); }
    .a { padding: 0 20px 18px; color: var(--slate); }
  `]
})
export class QaComponent implements OnInit {
  items: QaItem[] = []; categories: string[] = []; cat = ''; openId = 0;
  constructor(private api: ApiService) {}
  ngOnInit() {
    this.api.getQa().subscribe({
      next: q => { this.items = q; this.categories = [...new Set(q.map(x => x.category))]; },
      error: () => {}
    });
  }
  filtered() { return this.cat ? this.items.filter(i => i.category === this.cat) : this.items; }
}
