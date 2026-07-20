import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PROCESS_STEPS, OFFERINGS } from '../../services/site-content';
import { PageHeroComponent } from '../../components/page-hero/page-hero.component';
import { PageQaComponent } from '../../components/page-qa/page-qa.component';

@Component({
  selector: 'app-how-we-work',
  standalone: true,
  imports: [CommonModule, RouterLink, PageHeroComponent, PageQaComponent],
  template: `
  <app-page-hero eyebrow="Our Approach" title="How HDDP Works">
    <p>A streamlined, results driven recruitment process designed to connect organizations with top sstier talent efficiently and effectively.</p>
  </app-page-hero>

  <section class="section">
    <div class="container center">
      <h2 class="section-title">Our Solution Offerings</h2>
      <p class="section-lead">We provide customized workforce solutions tailored to your business needs:</p>
      <img src="assets/img/how-we-work-lifecycle.jpg" alt="HDDP full life cycle recruitment process" style="max-width: 420px; margin: 8px auto 36px; border-radius: var(--radius); box-shadow: var(--shadow);">
      <div class="grid grid-3">
        <div class="card" *ngFor="let o of offerings" style="text-align: left;">
          <h3 style="font-size: 1rem; margin-top: 0;">{{ o.title }}</h3>
          <p class="muted" style="font-size: .9rem;">{{ o.desc }}</p>
        </div>
      </div>
    </div>
  </section>

  <section class="section alt">
    <div class="container">
      <div class="center">
        <p class="eyebrow">Step by Step</p>
        <h2 class="section-title">Our Recruitment Process</h2>
      </div>
      <div class="steps">
        <div class="step" *ngFor="let st of steps">
          <div class="num">{{ st.n }}</div>
          <div>
            <h3>{{ st.title }}</h3>
            <p class="muted">{{ st.desc }}</p>
          </div>
        </div>
      </div>
      <div class="center" style="margin-top: 36px;">
        <a routerLink="/get-in-touch" class="btn btn-primary">Start hiring with HDDP</a>
      </div>
    </div>
  </section>

  <app-page-qa category="Process" heading="Questions About Our Process"></app-page-qa>
  `,
  styles: [`
    .steps { max-width: 820px; margin: 0 auto; }
    .step { display: flex; gap: 22px; padding: 24px 0; border-bottom: 1px dashed var(--line); }
    .num { flex: 0 0 52px; height: 52px; border-radius: 50%; background: var(--navy); color: var(--amber); font-family: var(--font-display); font-weight: 800; font-size: 1.3rem; display: flex; align-items: center; justify-content: center; }
    .step h3 { margin: 4px 0 6px; }
  `]
})
export class HowWeWorkComponent {
  steps = PROCESS_STEPS;
  offerings = OFFERINGS;
}
