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
    <p>A streamlined, results-driven recruitment process designed to connect organizations with top-tier talent efficiently and effectively.</p>
  </app-page-hero>

  <section class="section">
    <div class="container center">
      <p class="eyebrow">Solutions</p>
      <h2 class="section-title">Our Solution Offerings</h2>
      <p class="section-lead">We provide customized workforce solutions tailored to your business needs:</p>

      <div class="lifecycle-wrap">
        <img src="assets/img/how-we-work-lifecycle.png" alt="HDDP full life cycle recruitment process" class="lifecycle-img">
      </div>

      <div class="grid grid-3">
        <div class="card offering-card" *ngFor="let o of offerings">
          <h3>{{ o.title }}</h3>
          <p class="muted">{{ o.desc }}</p>
        </div>
      </div>
    </div>
  </section>

  <section class="section alt">
    <div class="container">
      <div class="center">
        <p class="eyebrow">Step by Step</p>
        <h2 class="section-title">Our Recruitment Process</h2>
        <p class="section-lead">From requirement analysis to post-placement support, our structured workflow ensures quality and transparency.</p>
      </div>

      <div class="steps">
        <div class="step" *ngFor="let st of steps">
          <div class="num">{{ st.n }}</div>
          <div class="step-content">
            <h3>{{ st.title }}</h3>
            <p class="muted">{{ st.desc }}</p>
          </div>
        </div>
      </div>

      <div class="center" style="margin-top: 40px;">
        <a routerLink="/get-in-touch" class="btn btn-primary btn-mobile-full">Start hiring with HDDP</a>
      </div>
    </div>
  </section>

  <app-page-qa category="Process" heading="Questions About Our Process"></app-page-qa>
  `,
  styles: [`
    .lifecycle-wrap {
      max-width: 620px;
      margin: 0 auto 40px;
    }
    .lifecycle-img {
      width: 100%;
      height: auto;
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      border: 1px solid var(--line);
    }
    .offering-card {
      text-align: left;
      height: 100%;
      padding: 24px;
    }
    .offering-card h3 {
      font-size: 1.05rem;
      margin: 0 0 8px;
      color: var(--navy);
    }
    .offering-card p {
      font-size: .92rem;
      line-height: 1.55;
      margin: 0;
    }

    .steps {
      max-width: 840px;
      margin: 0 auto;
    }
    .step {
      display: flex;
      gap: 22px;
      padding: 24px 0;
      border-bottom: 1px dashed var(--line);
      align-items: flex-start;
    }
    .step:last-child {
      border-bottom: none;
    }
    .num {
      flex: 0 0 50px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: var(--navy);
      color: var(--amber);
      font-family: var(--font-display);
      font-weight: 800;
      font-size: 1.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(14, 42, 71, .15);
    }
    .step-content {
      flex: 1;
    }
    .step h3 {
      margin: 4px 0 8px;
      font-size: 1.15rem;
      color: var(--navy);
    }
    .step p {
      margin: 0;
      font-size: .95rem;
      line-height: 1.6;
    }

    @media (max-width: 560px) {
      .step {
        gap: 16px;
        padding: 18px 0;
      }
      .num {
        flex: 0 0 42px;
        width: 42px;
        height: 42px;
        font-size: 1.1rem;
      }
      .step h3 {
        font-size: 1.05rem;
      }
    }
  `]
})
export class HowWeWorkComponent {
  steps = PROCESS_STEPS;
  offerings = OFFERINGS;
}
