import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SITE } from '../../services/site-content';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
  <footer class="footer">
    <div class="container footer-grid">
      <div class="footer-col">
        <h4>Connect With Us:</h4>
        <p class="about-text">For over 25 years, we have been at the forefront of connecting talent, strategy, and business insight to deliver transformative workforce solutions.</p>
        <a routerLink="/apply-now" class="btn btn-primary" style="margin-top: 14px; margin-bottom: 20px;">Apply Now!</a>
        <div class="socials">
          <a [href]="site.social.linkedin" target="_blank" rel="noopener" aria-label="LinkedIn">LinkedIn</a>
          <a [href]="site.social.facebook" target="_blank" rel="noopener" aria-label="Facebook">Facebook</a>
          <a [href]="site.social.instagram" target="_blank" rel="noopener" aria-label="Instagram">Instagram</a>
        </div>
      </div>

      <div class="footer-col">
        <h4>Useful Links:</h4>
        <ul class="links-list">
          <li><a routerLink="/who-we-are">Who We Are</a></li>
          <li><a routerLink="/how-we-work">How We Work</a></li>
          <li><a routerLink="/recruitment-placement-services">Recruitment &amp; Placement</a></li>
          <li><a routerLink="/healthcare">Healthcare Staffing</a></li>
          <li><a routerLink="/information-technology">IT Staffing</a></li>
          <li><a routerLink="/blogs">Blogs &amp; News</a></li>
          <li><a routerLink="/qa">Q&amp;A Help Center</a></li>
          <li><a [href]="site.careersPortal" target="_blank" rel="noopener">Careers Portal ↗</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h4>Contact Us:</h4>
        <p class="address-text">{{ site.address }}</p>
        <div class="contact-links">
          <p class="contact-line">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            <a href="tel:+14807122224">{{ site.phone }}</a>
          </p>
          <p class="contact-line">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            <a [href]="'mailto:' + site.email">{{ site.email }}</a>
          </p>
        </div>
        <a routerLink="/get-in-touch" class="btn btn-light" style="margin-top: 16px;">Get in Touch</a>
      </div>
    </div>

    <div class="bottom">
      <div class="container bottom-inner">
        <span>© {{ year }} — HDDP Consultants. All rights reserved.</span>
        <span>Powered by <strong>Softech Park</strong></span>
      </div>
    </div>
  </footer>
  `,
  styles: [`
    .footer {
      background: var(--navy-deep);
      color: #b9c9db;
      margin-top: clamp(40px, 6vw, 80px);
      width: 100%;
    }
    .footer-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: clamp(24px, 3vw, 48px);
      padding: clamp(40px, 5vw, 64px) 0 clamp(30px, 4vw, 44px);
    }
    .footer-col {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
    h4 {
      color: #fff;
      font-size: clamp(1.08rem, 1.4vw, 1.25rem);
      margin-top: 0;
      margin-bottom: 14px;
      position: relative;
    }
    .about-text, .address-text {
      font-size: .92rem;
      line-height: 1.65;
      margin: 0 0 12px;
      color: #b9c9db;
    }
    a:not(.btn) {
      color: #dfe9f4;
      text-decoration: none;
      transition: color .2s ease;
    }
    a:not(.btn):hover {
      color: var(--amber);
    }
    .links-list {
      list-style: none;
      padding: 0;
      margin: 0;
      width: 100%;
    }
    .links-list li {
      margin: 8px 0;
    }
    .links-list li a {
      font-size: .92rem;
      display: inline-block;
      padding: 4px 0;
      min-height: 24px;
    }
    .socials {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
    .socials a {
      background: rgba(255, 255, 255, .1);
      padding: 8px 16px;
      border-radius: 999px;
      font-size: .84rem;
      font-weight: 500;
      min-height: 36px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: background .2s ease, color .2s ease;
    }
    .socials a:hover {
      background: var(--amber);
      color: #fff;
    }
    .contact-links {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin: 4px 0 10px;
    }
    .contact-line {
      display: flex;
      align-items: center;
      gap: 9px;
      font-size: .92rem;
      margin: 0;
    }
    .bottom {
      border-top: 1px solid rgba(255, 255, 255, .12);
      padding: 18px 0;
      font-size: .85rem;
      color: #8fa5bd;
    }
    .bottom-inner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
    }

    @media (max-width: 960px) {
      .footer-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 30px;
      }
    }

    @media (max-width: 640px) {
      .footer-grid {
        grid-template-columns: 1fr;
        padding: 40px 0 28px;
        gap: 28px;
      }
      .bottom-inner {
        flex-direction: column;
        text-align: center;
        justify-content: center;
      }
    }
  `]
})
export class FooterComponent {
  site = SITE;
  year = new Date().getFullYear();
}
