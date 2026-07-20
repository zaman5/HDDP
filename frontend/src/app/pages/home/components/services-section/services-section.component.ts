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
      <p class="section-lead">From executive search to large scale staffing, we deliver smart, flexible, and scalable HR solutions designed to power your business forward.</p>
      <div class="grid grid-4">
        <a *ngFor="let s of solutions" class="card svc" [routerLink]="'/' + s.slug">
          <div class="icon" [innerHTML]="s.icon | safeHtml"></div>
          <h3>{{ s.title }}</h3>
          <p class="quote">“{{ s.quote }}”</p>
          <span class="more">Learn more →</span>
        </a>
      </div>
    </div>
  </section>
  `,
  styles: [`
    .svc { text-decoration: none; text-align: left; }
    .icon { color: var(--amber); margin-bottom: 12px; }
    .svc h3 { font-size: 1.05rem; margin: 0 0 8px; }
    .quote { color: var(--slate); font-style: italic; font-size: .88rem; }
    .more { color: var(--amber); font-weight: 600; font-size: .85rem; }
  `]
})
export class ServicesSectionComponent {
  solutions = SOLUTIONS;
}
