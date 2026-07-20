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
    <div class="container center" style="max-width: 840px;">
      <p class="eyebrow">FAQ</p>
      <h2 class="section-title">{{ heading }}</h2>
      <div class="faq" *ngFor="let q of items" style="text-align: left;">
        <button class="q" (click)="openId = openId === q.id ? 0 : q.id" [attr.aria-expanded]="openId === q.id">
          <span>{{ q.question }}</span>
          <span class="chev">{{ openId === q.id ? '−' : '+' }}</span>
        </button>
        <div class="a" *ngIf="openId === q.id"><p>{{ q.answer }}</p></div>
      </div>
      <a routerLink="/qa" class="btn btn-outline" style="margin-top: 10px;">See all questions</a>
    </div>
  </section>
  `,
  styles: [`
    .faq { border: 1px solid var(--line); border-radius: 12px; margin-bottom: 12px; overflow: hidden; background: #fff; }
    .q { width: 100%; display: flex; justify-content: space-between; align-items: center; gap: 14px; background: none; border: none; padding: 18px 20px; font-family: var(--font-display); font-weight: 600; font-size: .98rem; color: var(--navy); cursor: pointer; text-align: left; }
    .q:hover { color: var(--amber); }
    .chev { font-size: 1.3rem; color: var(--amber); flex-shrink: 0; }
    .a { padding: 0 20px 18px; color: var(--slate); }
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
      next: q => { this.items = this.category ? q.filter(x => x.category === this.category) : q; },
      error: () => {}
    });
  }
}
