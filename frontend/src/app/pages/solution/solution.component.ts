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
      <div class="container prose" style="max-width: 880px;">
        <p *ngFor="let p of s.paragraphs">{{ p }}</p>

        <h3 class="list-heading">{{ s.listTitle }}</h3>
        <ul class="checks">
          <li *ngFor="let item of s.list">{{ item }}</li>
        </ul>

        <p class="closing-text"><strong>{{ s.closing }}</strong></p>

        <div class="actions-row">
          <a routerLink="/get-in-touch" class="btn btn-primary">Partner with us</a>
          <a routerLink="/how-we-work" class="btn btn-outline">How we work</a>
        </div>
      </div>
    </section>

    <section class="section alt">
      <div class="container center">
        <p class="eyebrow">More Services</p>
        <h2 class="section-title">Explore Our Other Solutions</h2>
        <div class="grid grid-3">
          <a *ngFor="let o of others" class="card other-card" [routerLink]="'/' + o.slug">
            <h3>{{ o.title }}</h3>
            <p class="muted">“{{ o.quote }}”</p>
            <span class="learn-link">Learn more →</span>
          </a>
        </div>
      </div>
    </section>

    <app-page-qa category="Services" heading="Questions About Our Services"></app-page-qa>
  </ng-container>
  `,
  styles: [`
    .list-heading {
      font-size: 1.3rem;
      margin-top: 28px;
      margin-bottom: 14px;
      color: var(--navy);
    }
    .checks {
      list-style: none;
      padding: 0;
      margin: 16px 0 28px;
    }
    .checks li {
      padding: 10px 0 10px 32px;
      position: relative;
      border-bottom: 1px dashed var(--line);
      font-size: 1rem;
      line-height: 1.55;
    }
    .checks li::before {
      content: '✔';
      position: absolute;
      left: 0;
      top: 10px;
      color: var(--amber);
      font-weight: 700;
      font-size: 1.1rem;
    }
    .closing-text {
      margin-top: 24px;
      font-size: 1.05rem;
      color: var(--navy);
    }
    .actions-row {
      margin-top: 32px;
      display: flex;
      gap: 14px;
      flex-wrap: wrap;
    }
    .other-card {
      text-decoration: none;
      text-align: left;
      height: 100%;
      padding: 24px;
    }
    .other-card h3 {
      font-size: 1.05rem;
      margin: 0 0 8px;
      color: var(--navy);
    }
    .other-card p {
      font-style: italic;
      font-size: .88rem;
      margin: 0 0 14px;
      flex-grow: 1;
    }
    .learn-link {
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
export class SolutionComponent implements OnInit {
  s: any;
  others: any[] = [];

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
