import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SOLUTIONS } from '../../../../services/site-content';
import { SafeHtmlPipe } from '../../../../pipes/safe-html.pipe';

@Component({
  selector: 'app-services-section',
  standalone: true,
  imports: [CommonModule, RouterLink, SafeHtmlPipe],
  template: `
  <section class="section">
    <div class="container center">
      <p class="eyebrow">What We Do</p>
      <h2 class="section-title">Services and Solutions</h2>
      <p class="section-lead">From executive search to large-scale staffing, we deliver smart, flexible, and scalable HR solutions designed to power your business forward.</p>
      <div class="grid grid-4">
        <a *ngFor="let s of solutions" class="card svc" [routerLink]="'/' + s.slug">
          <div class="icon-wrap">
            <div class="icon" [innerHTML]="s.icon | safeHtml"></div>
          </div>
          <h3>{{ s.title }}</h3>
          <p class="quote">“{{ s.quote }}”</p>
          <span class="more">Learn more →</span>
        </a>
      </div>
    </div>
  </section>
  `,
  styles: [`
    .svc {
      text-decoration: none;
      text-align: left;
      display: flex;
      flex-direction: column;
      height: 100%;
      border-radius: var(--radius);
      padding: 26px;
    }
    .icon-wrap {
      width: 52px;
      height: 52px;
      border-radius: 12px;
      background: var(--amber-soft);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
    }
    .icon {
      color: var(--amber);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .svc h3 {
      font-size: 1.08rem;
      margin: 0 0 8px;
      color: var(--navy);
      line-height: 1.35;
    }
    .quote {
      color: var(--slate);
      font-style: italic;
      font-size: .88rem;
      line-height: 1.5;
      margin: 0 0 16px;
      flex-grow: 1;
    }
    .more {
      color: var(--amber);
      font-weight: 600;
      font-size: .88rem;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      margin-top: auto;
      transition: transform .2s ease;
    }
    .svc:hover .more {
      transform: translateX(3px);
    }
  `]
})
export class ServicesSectionComponent {
  solutions = SOLUTIONS;
}
