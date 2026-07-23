import { Component, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SITE, SOLUTIONS, INDUSTRIES } from '../../services/site-content';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
  <div class="topbar">
    <div class="container topbar-inner">
      <a class="phone" href="tel:+14807122224">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        {{ site.phone }}
      </a>
      <span class="socials">
        <a [href]="site.social.linkedin" target="_blank" rel="noopener" aria-label="LinkedIn">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.45-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM3.56 20.45h3.56V9H3.56v11.45z"/></svg>
        </a>
        <a [href]="site.social.facebook" target="_blank" rel="noopener" aria-label="Facebook">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-7.5h2.5l.5-3h-3V8.25c0-.87.24-1.46 1.5-1.46h1.6V3.35A21 21 0 0 0 14 3.2c-2.44 0-4.11 1.49-4.11 4.22V10.5H7.4v3h2.49V21h3.61z"/></svg>
        </a>
        <a [href]="site.social.instagram" target="_blank" rel="noopener" aria-label="Instagram">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none"/></svg>
        </a>
      </span>
    </div>
  </div>
  <header class="header">
    <div class="container header-inner">
      <a routerLink="/" class="brand" (click)="open=false">
        <img src="assets/img/logo.png" alt="HDDP Consultants" class="brand-logo">
      </a>
      <button class="burger" (click)="open=!open" aria-label="Toggle menu">☰</button>
      <nav [class.open]="open">
        <a routerLink="/who-we-are" routerLinkActive="active" (click)="open=false">WHO WE ARE</a>
        <div class="dropdown">
          <button class="drop-btn" (click)="toggleDropdown('solutions'); $event.stopPropagation()">SOLUTIONS ▾</button>
          <div class="drop-menu" [class.show]="dropdownOpen==='solutions'">
            <a *ngFor="let s of solutions" [routerLink]="'/' + s.slug" (click)="open=false; dropdownOpen=null">{{ s.title }}</a>
          </div>
        </div>
        <div class="dropdown">
          <button class="drop-btn" (click)="toggleDropdown('industries'); $event.stopPropagation()">INDUSTRIES ▾</button>
          <div class="drop-menu" [class.show]="dropdownOpen==='industries'">
            <a *ngFor="let i of industries" [routerLink]="'/' + i.slug" (click)="open=false; dropdownOpen=null">{{ i.title }}</a>
          </div>
        </div>
        <a routerLink="/how-we-work" routerLinkActive="active" (click)="open=false">HOW WE WORK</a>
        <a routerLink="/blogs" routerLinkActive="active" (click)="open=false">BLOGS</a>
        <a routerLink="/get-in-touch" routerLinkActive="active" (click)="open=false">CONTACT US</a>
        <a routerLink="/apply-now" class="btn btn-primary apply" (click)="open=false">Apply Now</a>
      </nav>
    </div>
  </header>
  `,
  styles: [`
    .topbar { background: var(--navy-deep); color: #c8d6e6; font-size: .82rem; }
    .topbar-inner { display: flex; justify-content: space-between; align-items: center; padding-top: 7px; padding-bottom: 7px; }
    .phone { display: inline-flex; align-items: center; gap: 7px; color: #c8d6e6; text-decoration: none; }
    .phone:hover { color: #fff; }
    .socials { display: flex; align-items: center; }
    .socials a { color: #fff; background: rgba(255,255,255,.12); border-radius: 50%; width: 26px; height: 26px; display: inline-flex; align-items: center; justify-content: center; margin-left: 8px; text-decoration: none; }
    .socials a:hover { background: var(--amber); }
    .header { background: #fff; position: sticky; top: 0; z-index: 60; box-shadow: 0 2px 14px rgba(14,42,71,.08); }
    .header-inner { display: flex; align-items: center; justify-content: space-between; height: 96px; }
    .brand { display: flex; align-items: center; text-decoration: none; }
    .brand-logo { height: 84px; width: auto; display: block; }
    nav { display: flex; align-items: center; gap: 20px; }
    nav a { text-decoration: none; font-family: var(--font-display); font-size: .8rem; font-weight: 600; color: var(--navy); letter-spacing: .04em; }
    nav a.active, nav a:hover { color: var(--amber); }
    .dropdown { position: relative; display: flex; align-items: center; }
    .drop-btn { background: none; border: none; font: inherit; font-family: var(--font-display); font-size: .8rem; font-weight: 600; color: var(--navy); cursor: pointer; letter-spacing: .04em; padding: 0; margin: 0; }
    .drop-menu { position: absolute; top: 130%; left: 0; background: #fff; border: 1px solid var(--line); border-radius: 10px; box-shadow: var(--shadow); min-width: 260px; padding: 8px 0; display: none; }
    .drop-menu.show { display: block; }
    .drop-menu a { display: block; padding: 9px 18px; font-size: .78rem; }
    .drop-menu a:hover { background: var(--amber-soft); }
    .apply { padding: 9px 20px !important; color: #fff !important; }
    .burger { display: none; background: none; border: none; font-size: 1.6rem; color: var(--navy); cursor: pointer; }
    @media (max-width: 1020px) {
      .burger { display: block; }
      nav { display: none; position: absolute; top: 96px; left: 0; right: 0; background: #fff; flex-direction: column; align-items: flex-start; padding: 18px 22px; gap: 14px; box-shadow: var(--shadow); }
      nav.open { display: flex; }
      .drop-menu { position: static; display: block; box-shadow: none; border: none; padding-left: 12px; }
    }
  `]
})
export class HeaderComponent {
  site = SITE; solutions = SOLUTIONS; industries = INDUSTRIES; open = false;
  dropdownOpen: 'solutions' | 'industries' | null = null;

  constructor(private elRef: ElementRef) {}

  toggleDropdown(name: 'solutions' | 'industries') {
    this.dropdownOpen = this.dropdownOpen === name ? null : name;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.dropdownOpen && !this.elRef.nativeElement.contains(event.target)) {
      this.dropdownOpen = null;
    }
  }
}
