import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SOLUTIONS } from '../../services/site-content';
import { PageHeroComponent } from '../../components/page-hero/page-hero.component';
import { PageQaComponent } from '../../components/page-qa/page-qa.component';

@Component({
  selector: 'app-solution',
  standalone: true,
  imports: [CommonModule, RouterLink, PageHeroComponent, PageQaComponent],
  template: `
  <ng-container *ngIf="s">
    <app-page-hero eyebrow="Our Solutions" [title]="s.heroTitle">
      <p>{{ s.heroSub }}</p>
    </app-page-hero>

    <section class="section">
      <div class="container prose" style="max-width: 860px;">
        <p *ngFor="let p of s.paragraphs">{{ p }}</p>
        <h3>{{ s.listTitle }}</h3>
        <ul class="checks">
          <li *ngFor="let item of s.list">{{ item }}</li>
        </ul>
        <p><strong>{{ s.closing }}</strong></p>
        <div style="margin-top: 26px; display: flex; gap: 12px; flex-wrap: wrap;">
          <a routerLink="/get-in-touch" class="btn btn-primary">Partner with us</a>
          <a routerLink="/how-we-work" class="btn btn-outline">How we work</a>
        </div>
      </div>
    </section>

    <section class="section alt">
      <div class="container center">
        <h2 class="section-title">Explore Our Other Solutions</h2>
        <div class="grid grid-3">
          <a *ngFor="let o of others" class="card" [routerLink]="'/' + o.slug" style="text-decoration:none; text-align:left;">
            <h3 style="font-size: 1rem; margin-top: 0;">{{ o.title }}</h3>
            <p class="muted" style="font-style: italic; font-size: .85rem;">"{{ o.quote }}"</p>
          </a>
        </div>
      </div>
    </section>

    <app-page-qa category="Services" heading="Questions About Our Services"></app-page-qa>
  </ng-container>
  `,
  styles: [`
    .checks { list-style: none; padding: 0; }
    .checks li { padding: 10px 0 10px 34px; position: relative; border-bottom: 1px dashed var(--line); }
    .checks li::before { content: '✔'; position: absolute; left: 0; color: var(--amber); font-weight: 700; }
  `]
})
export class SolutionComponent implements OnInit {
  s: any; others: any[] = [];
  constructor(private route: ActivatedRoute, private router: Router) {}
  ngOnInit() {
    this.router.events.subscribe(() => this.load());
    this.load();
  }
  private load() {
    const slug = this.router.url.split('?')[0].replace('/', '');
    this.s = SOLUTIONS.find(x => x.slug === slug);
    this.others = SOLUTIONS.filter(x => x.slug !== slug);
  }
}
