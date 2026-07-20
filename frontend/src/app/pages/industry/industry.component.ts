import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { INDUSTRIES } from '../../services/site-content';
import { PageHeroComponent } from '../../components/page-hero/page-hero.component';
import { PageQaComponent } from '../../components/page-qa/page-qa.component';

@Component({
  selector: 'app-industry',
  standalone: true,
  imports: [CommonModule, RouterLink, PageHeroComponent, PageQaComponent],
  template: `
  <ng-container *ngIf="ind">
    <app-page-hero eyebrow="Industries We Serve" [title]="ind.title" [bg]="ind.img">
      <p><em>{{ ind.tag }}</em></p>
    </app-page-hero>

    <section class="section">
      <div class="container prose" style="max-width: 1000px;">
        <div class="intro-row" [class.has-img]="ind.inlineImg">
          <div class="intro-text">
            <p>{{ ind.desc }}</p>
            <p *ngIf="ind.subDesc"><strong>{{ ind.subDesc }}</strong></p>

            <ng-container *ngIf="ind.groups">
              <div class="role-groups">
                <div class="role-group" *ngFor="let g of ind.groups">
                  <h3>{{ g.title }}</h3>
                  <ul class="role-list">
                    <li *ngFor="let item of g.items">{{ item }}</li>
                  </ul>
                </div>
              </div>
            </ng-container>

            <ul class="checks" *ngIf="ind.list">
              <li *ngFor="let item of ind.list">{{ item }}</li>
            </ul>

            <p class="closing"><strong>{{ ind.closing }}</strong></p>
          </div>
          <img *ngIf="ind.inlineImg" [src]="ind.inlineImg" [alt]="ind.title + ' recruitment at HDDP'" class="intro-img">
        </div>

        <div style="margin-top: 26px; display: flex; gap: 12px; flex-wrap: wrap;">
          <a routerLink="/get-in-touch" class="btn btn-primary">Discuss your hiring needs</a>
          <a routerLink="/apply-now" class="btn btn-outline">Apply as a candidate</a>
        </div>
      </div>
    </section>

    <section class="section alt">
      <div class="container center">
        <h2 class="section-title">Other Industries</h2>
        <div class="grid grid-3">
          <a *ngFor="let o of others" class="card industry-card" [routerLink]="'/' + o.slug">
            <img [src]="o.img" [alt]="o.title" class="industry-card-img">
            <div class="industry-card-body">
              <h3>{{ o.title }}</h3>
              <p class="muted">{{ o.tag }}</p>
            </div>
          </a>
        </div>
      </div>
    </section>

    <app-page-qa category="Industries" heading="Industry Hiring — Frequently Asked Questions"></app-page-qa>
  </ng-container>
  `,
  styles: [`
    .intro-row { display: flex; gap: 34px; align-items: flex-start; }
    .intro-row.has-img .intro-text { flex: 1 1 auto; min-width: 0; }
    .intro-img { flex: 0 0 260px; width: 260px; border-radius: var(--radius); box-shadow: var(--shadow); }
    @media (max-width: 800px) { .intro-row { flex-direction: column-reverse; } .intro-img { width: 100%; flex-basis: auto; } }

    .role-groups { display: grid; grid-template-columns: repeat(2, 1fr); gap: 22px; margin: 20px 0; }
    @media (max-width: 640px) { .role-groups { grid-template-columns: 1fr; } }
    .role-group h3 { font-size: .98rem; margin: 0 0 8px; color: var(--navy); }
    .role-list { list-style: none; padding: 0; margin: 0; }
    .role-list li { font-size: .88rem; color: var(--slate); padding: 5px 0 5px 18px; position: relative; border-bottom: 1px dashed var(--line); }
    .role-list li::before { content: '•'; position: absolute; left: 0; color: var(--amber); font-weight: 700; }

    .checks { list-style: none; padding: 0; margin: 16px 0; }
    .checks li { padding: 10px 0 10px 34px; position: relative; border-bottom: 1px dashed var(--line); font-size: .95rem; }
    .checks li::before { content: '✔'; position: absolute; left: 0; color: var(--amber); font-weight: 700; }
    .closing { margin-top: 18px; }

    .industry-card { padding: 0; overflow: hidden; text-decoration: none; text-align: left; display: block; }
    .industry-card-img { width: 100%; height: 140px; object-fit: cover; display: block; }
    .industry-card-body { padding: 18px 20px; }
    .industry-card-body h3 { font-size: 1rem; margin: 0 0 4px; }
    .industry-card-body p { font-style: italic; font-size: .85rem; margin: 0; }
  `]
})
export class IndustryComponent implements OnInit {
  ind: any; others: any[] = [];
  constructor(private router: Router) {}
  ngOnInit() {
    this.router.events.subscribe(() => this.load());
    this.load();
  }
  private load() {
    const slug = this.router.url.split('?')[0].replace('/', '');
    this.ind = INDUSTRIES.find(x => x.slug === slug);
    this.others = INDUSTRIES.filter(x => x.slug !== slug);
  }
}
