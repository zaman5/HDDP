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
    <div class="container grid grid-3 footer-grid">
      <div>
        <h4>Connect With Us:</h4>
        <p>For over 25 years, we have been at the forefront of connecting talent, strategy, and business insight to deliver transformative workforce solutions.</p>
        <a routerLink="/apply-now" class="btn btn-primary">Apply Now!</a>
        <div class="socials">
          <a [href]="site.social.linkedin" target="_blank" rel="noopener">LinkedIn</a>
          <a [href]="site.social.facebook" target="_blank" rel="noopener">Facebook</a>
          <a [href]="site.social.instagram" target="_blank" rel="noopener">Instagram</a>
        </div>
      </div>
      <div>
        <h4>Useful Links:</h4>
        <ul>
          <li><a routerLink="/who-we-are">Who We Are</a></li>
          <li><a routerLink="/how-we-work">How We Work</a></li>
          <li><a routerLink="/recruitment-placement-services">Recruitment & Placement</a></li>
          <li><a routerLink="/healthcare">Healthcare</a></li>
          <li><a routerLink="/information-technology">Information Technology</a></li>
          <li><a routerLink="/blogs">Blogs</a></li>
          <li><a routerLink="/qa">Q&A</a></li>
          <li><a [href]="site.careersPortal" target="_blank" rel="noopener">Careers Page</a></li>
        </ul>
      </div>
      <div>
        <h4>Contact Us:</h4>
        <p>{{ site.address }}</p>
        <p class="contact-line">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          <a href="tel:+14807122224">{{ site.phone }}</a>
        </p>
        <p class="contact-line">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v16H4z" opacity="0"/><path d="M22 6 12 13 2 6"/><rect x="2" y="4" width="20" height="16" rx="2"/></svg>
          <a [href]="'mailto:' + site.email">{{ site.email }}</a>
        </p>
        <a routerLink="/get-in-touch" class="btn btn-light">Get in Touch</a>
      </div>
    </div>

    <div class="bottom">
      <div class="container">© {{ year }} — HDDP Consultants. Powered by <strong>Softech Park</strong></div>
    </div>
  </footer>
  `,
  styles: [`
    .footer { background: var(--navy-deep); color: #b9c9db; margin-top: 60px; }
    .footer-grid { padding: 56px 22px 40px; }
    h4 { color: #fff; margin-top: 0; }
    a:not(.btn) { color: #dfe9f4; }
    a:not(.btn):hover { color: var(--amber); }
    ul { list-style: none; padding: 0; margin: 0; }
    li { margin: 7px 0; }
    li a { text-decoration: none; font-size: .92rem; }
    .socials { margin-top: 16px; display: flex; gap: 14px; font-size: .85rem; }
    .contact-line { display: flex; align-items: center; gap: 8px; }
    .btn { margin-top: 10px; }
    .bottom { border-top: 1px solid rgba(255,255,255,.12); padding: 16px 0; font-size: .85rem; }
  `]
})
export class FooterComponent {
  site = SITE;
  year = new Date().getFullYear();
}
