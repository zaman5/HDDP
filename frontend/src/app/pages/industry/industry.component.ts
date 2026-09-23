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
      <div class="container prose" style="max-width: 1040px;">
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

        <div class="actions-row">
          <a routerLink="/get-in-touch" class="btn btn-primary">Discuss your hiring needs</a>
          <a routerLink="/apply-now" class="btn btn-outline">Apply as a candidate</a>
        </div>
      </div>
    </section>

    <section class="section alt">
      <div class="container center">
        <p class="eyebrow">Explore</p>
        <h2 class="section-title">Other Industries</h2>
        <p class="section-lead">Discover our specialized talent recruitment services across diverse sectors.</p>
        <div class="grid grid-3">
          <a *ngFor="let o of others" class="card industry-card" [routerLink]="'/' + o.slug">
            <div class="industry-card-img" [style.background-image]="'url(' + o.img + ')'" role="img" [attr.aria-label]="o.title"></div>
            <div class="industry-card-body">
              <h3>{{ o.title }}</h3>
              <p class="muted">{{ o.tag }}</p>
              <span class="explore-link">Learn more →</span>
            </div>
          </a>
        </div>
      </div>
    </section>

    <app-page-qa category="Industries" heading="Industry Hiring — Frequently Asked Questions"></app-page-qa>
  </ng-container>
  `,
  styles: [`
    .intro-row {
      display: flex;
      gap: 36px;
      align-items: flex-start;
    }
    .intro-row.has-img .intro-text {
      flex: 1 1 auto;
      min-width: 0;
    }
    .intro-img {
      flex: 0 0 280px;
      width: 280px;
      height: auto;
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      border: 1px solid var(--line);
    }
    @media (max-width: 860px) {
      .intro-row {
        flex-direction: column-reverse;
      }
      .intro-img {
        width: 100%;
        flex-basis: auto;
        margin-bottom: 20px;
      }
    }

    .role-groups {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin: 24px 0;
    }
    @media (max-width: 680px) {
      .role-groups {
        grid-template-columns: 1fr;
      }
    }
    .role-group {
      background: var(--bg);
      border-radius: var(--radius-sm);
      padding: 18px 20px;
      border: 1px solid var(--line);
    }
    .role-group h3 {
      font-size: 1rem;
      margin: 0 0 10px;
      color: var(--navy);
      border-bottom: 2px solid var(--amber);
      padding-bottom: 6px;
      display: inline-block;
    }
    .role-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .role-list li {
      font-size: .88rem;
      color: var(--slate);
      padding: 5px 0 5px 16px;
      position: relative;
      border-bottom: 1px dashed var(--line);
      line-height: 1.45;
    }
    .role-list li:last-child {
      border-bottom: none;
    }
    .role-list li::before {
      content: '•';
      position: absolute;
      left: 0;
      color: var(--amber);
      font-weight: 700;
    }

    .checks {
      list-style: none;
      padding: 0;
      margin: 20px 0;
    }
    .checks li {
      padding: 10px 0 10px 32px;
      position: relative;
      border-bottom: 1px dashed var(--line);
      font-size: .98rem;
      line-height: 1.55;
    }
    .checks li::before {
      content: '✔';
      position: absolute;
      left: 0;
      top: 10px;
      color: var(--amber);
      font-weight: 700;
      font-size: 1.05rem;
    }
    .closing {
      margin-top: 22px;
      font-size: 1.02rem;
    }

    .actions-row {
      margin-top: 32px;
      display: flex;
      gap: 14px;
      flex-wrap: wrap;
    }

    .industry-card {
      padding: 0;
      overflow: hidden;
      text-decoration: none;
      text-align: left;
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .industry-card-img {
      width: 100%;
      height: 150px;
      background-size: cover;
      background-position: center;
    }
    .industry-card-body {
      padding: 20px 22px;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }
    .industry-card-body h3 {
      font-size: 1.05rem;
      margin: 0 0 6px;
      color: var(--navy);
    }
    .industry-card-body p {
      font-style: italic;
      font-size: .88rem;
      margin: 0 0 14px;
      flex-grow: 1;
    }
    .explore-link {
      color: var(--amber);
      font-weight: 600;
      font-size: .86rem;
      margin-top: auto;
    }

    @media (max-width: 480px) {
      .actions-row {
        flex-direction: column;
      }
      .actions-row .btn {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class IndustryComponent implements OnInit {
  ind: any;
  others: any[] = [];

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
