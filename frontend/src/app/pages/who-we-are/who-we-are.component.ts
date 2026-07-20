import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PageHeroComponent } from '../../components/page-hero/page-hero.component';
import { PageQaComponent } from '../../components/page-qa/page-qa.component';

@Component({
  selector: 'app-who-we-are',
  standalone: true,
  imports: [CommonModule, RouterLink, PageHeroComponent, PageQaComponent],
  template: `
  <app-page-hero eyebrow="About Us" title="Who We Are">
    <p>For over 25 years, we have been at the forefront of connecting talent, strategy, and business insight to deliver transformative workforce solutions.</p>
  </app-page-hero>

  <section class="section">
    <div class="container grid grid-2" style="align-items: center;">
      <div class="prose">
        <h2 class="section-title">About Us</h2>
        <p>By aligning people with purpose, we empower organizations to navigate complexity, drive performance, and unlock growth in a fast changing business landscape.</p>
        <p>At HDDP Consultants, our leadership team comprising seasoned recruitment professionals and industry experts delivers tailored talent solutions that fuel business success.</p>
        <p>We go beyond traditional staffing offering scalable, future focused strategies that attract, retain, and develop top tier talent across industries. Our client centric approach ensures organizations stay competitive by building agile, high performing teams.</p>
        <p>With a commitment to excellence, adaptability, and partnership, we don't just recruit we collaborate, innovate, and elevate.</p>
        <p><strong>Let's shape the future of workforce solutions, together.</strong></p>
        <a routerLink="/get-in-touch" class="btn btn-primary">Get in Touch</a>
      </div>
      <div>
        <div class="about-panel">
          <img src="assets/img/about-us-icon.png" alt="About HDDP Consultants" class="about-img">
        </div>
        <div class="stats grid grid-2">
          <div class="stat"><span>25+</span>Years of Experience</div>
          <div class="stat"><span>6+</span>Industries Served</div>
          <div class="stat"><span>4</span>Core Solutions</div>
          <div class="stat"><span>∞</span>Possibilities</div>
        </div>
      </div>
    </div>
  </section>

  <app-page-qa category="About Us" heading="Questions About HDDP"></app-page-qa>
  `,
  styles: [`
    .about-panel { background: var(--bg); border-radius: var(--radius); padding: 36px; display: flex; justify-content: center; margin-bottom: 22px; }
    .about-img { width: 180px; max-width: 100%; margin-left: 40px; }
    .stat { background: var(--bg); border-radius: var(--radius); padding: 28px 20px; text-align: center; color: var(--slate); font-weight: 500; }
    .stat span { display: block; font-family: var(--font-display); font-size: 2.2rem; font-weight: 800; color: var(--navy); }
  `]
})
export class WhoWeAreComponent {}
