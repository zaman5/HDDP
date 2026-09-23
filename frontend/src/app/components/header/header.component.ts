import { Component, ElementRef, HostListener, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
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
        <span>{{ site.phone }}</span>
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
      <a routerLink="/" class="brand" (click)="closeMenu()">
        <img src="assets/img/logo.png" alt="HDDP Consultants" class="brand-logo">
      </a>

      <!-- Mobile Hamburger Button -->
      <button class="burger" [class.active]="open" (click)="toggleMenu()" [attr.aria-expanded]="open" aria-label="Toggle navigation menu">
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
      </button>

      <!-- Backdrop for mobile menu -->
      <div class="backdrop" [class.show]="open" (click)="closeMenu()"></div>

      <!-- Navigation links -->
      <nav [class.open]="open">
        <a routerLink="/who-we-are" routerLinkActive="active" (click)="closeMenu()">WHO WE ARE</a>

        <!-- Solutions Dropdown / Accordion -->
        <div class="dropdown" [class.is-open]="dropdownOpen === 'solutions'">
          <button class="drop-btn" (click)="toggleDropdown('solutions'); $event.stopPropagation()" aria-haspopup="true" [attr.aria-expanded]="dropdownOpen === 'solutions'">
            <span>SOLUTIONS</span>
            <svg class="chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
          </button>
          <div class="drop-menu" [class.show]="dropdownOpen === 'solutions'">
            <a *ngFor="let s of solutions" [routerLink]="'/' + s.slug" (click)="closeMenu()">{{ s.title }}</a>
          </div>
        </div>

        <!-- Industries Dropdown / Accordion -->
        <div class="dropdown" [class.is-open]="dropdownOpen === 'industries'">
          <button class="drop-btn" (click)="toggleDropdown('industries'); $event.stopPropagation()" aria-haspopup="true" [attr.aria-expanded]="dropdownOpen === 'industries'">
            <span>INDUSTRIES</span>
            <svg class="chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
          </button>
          <div class="drop-menu" [class.show]="dropdownOpen === 'industries'">
            <a *ngFor="let i of industries" [routerLink]="'/' + i.slug" (click)="closeMenu()">{{ i.title }}</a>
          </div>
        </div>

        <a routerLink="/how-we-work" routerLinkActive="active" (click)="closeMenu()">HOW WE WORK</a>
        <a routerLink="/blogs" routerLinkActive="active" (click)="closeMenu()">BLOGS</a>
        <a routerLink="/qa" routerLinkActive="active" (click)="closeMenu()">Q&amp;A</a>
        <a routerLink="/get-in-touch" routerLinkActive="active" (click)="closeMenu()">CONTACT US</a>
        <a routerLink="/apply-now" class="btn btn-primary apply" (click)="closeMenu()">Apply Now</a>
      </nav>
    </div>
  </header>
  `,
  styles: [`
    .topbar {
      background: var(--navy-deep);
      color: #c8d6e6;
      font-size: .82rem;
      border-bottom: 1px solid rgba(255, 255, 255, .08);
    }
    .topbar-inner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 6px;
      padding-bottom: 6px;
      gap: 12px;
    }
    .phone {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      color: #c8d6e6;
      text-decoration: none;
      font-weight: 500;
    }
    .phone:hover {
      color: #fff;
    }
    .socials {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .socials a {
      color: #fff;
      background: rgba(255, 255, 255, .12);
      border-radius: 50%;
      width: 26px;
      height: 26px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      transition: background .2s ease, transform .2s ease;
    }
    .socials a:hover {
      background: var(--amber);
      transform: translateY(-1px);
    }

    /* Header Main */
    .header {
      background: #fff;
      position: sticky;
      top: 0;
      z-index: 70;
      box-shadow: 0 2px 14px rgba(14, 42, 71, .08);
      transition: height .2s ease;
    }
    .header-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 86px;
    }
    .brand {
      display: flex;
      align-items: center;
      text-decoration: none;
      flex-shrink: 0;
    }
    .brand-logo {
      height: 72px;
      width: auto;
      display: block;
      transition: height .2s ease;
    }

    /* Desktop Navigation */
    nav {
      display: flex;
      align-items: center;
      gap: clamp(16px, 1.4vw, 26px);
    }
    nav a {
      text-decoration: none;
      font-family: var(--font-display);
      font-size: clamp(0.8rem, 0.85vw, 0.92rem);
      font-weight: 600;
      color: var(--navy);
      letter-spacing: .04em;
      transition: color .2s ease;
      white-space: nowrap;
    }
    nav a.active, nav a:hover {
      color: var(--amber);
    }

    /* Dropdowns */
    .dropdown {
      position: relative;
      display: flex;
      align-items: center;
    }
    .drop-btn {
      background: none;
      border: none;
      font: inherit;
      font-family: var(--font-display);
      font-size: clamp(0.8rem, 0.85vw, 0.92rem);
      font-weight: 600;
      color: var(--navy);
      cursor: pointer;
      letter-spacing: .04em;
      padding: 0;
      margin: 0;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      transition: color .2s ease;
      white-space: nowrap;
    }
    .drop-btn:hover, .dropdown.is-open .drop-btn {
      color: var(--amber);
    }
    .chevron {
      transition: transform .2s ease;
    }
    .dropdown.is-open .chevron {
      transform: rotate(180deg);
    }

    .drop-menu {
      position: absolute;
      top: calc(100% + 14px);
      left: 0;
      background: #fff;
      border: 1px solid var(--line);
      border-radius: 12px;
      box-shadow: var(--shadow);
      min-width: 270px;
      padding: 8px 0;
      display: none;
      z-index: 80;
    }
    .drop-menu.show {
      display: block;
      animation: fadeIn .2s ease;
    }
    .drop-menu a {
      display: block;
      padding: 10px 18px;
      font-size: .84rem;
      color: var(--navy);
      font-family: var(--font-body);
      font-weight: 500;
      text-transform: none;
      letter-spacing: 0;
      white-space: normal;
      line-height: 1.4;
    }
    .drop-menu a:hover {
      background: var(--amber-soft);
      color: var(--amber);
    }

    .apply {
      padding: 10px 22px !important;
      color: #fff !important;
      font-size: .85rem !important;
      min-height: 40px;
    }

    /* Mobile Hamburger Icon */
    .burger {
      display: none;
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      width: 40px;
      height: 40px;
      position: relative;
      z-index: 80;
      flex-direction: column;
      justify-content: center;
      gap: 5px;
    }
    .burger .bar {
      display: block;
      width: 24px;
      height: 2.5px;
      background: var(--navy);
      border-radius: 2px;
      transition: transform .3s ease, opacity .3s ease;
    }
    .burger.active .bar:nth-child(1) {
      transform: translateY(7.5px) rotate(45deg);
    }
    .burger.active .bar:nth-child(2) {
      opacity: 0;
    }
    .burger.active .bar:nth-child(3) {
      transform: translateY(-7.5px) rotate(-45deg);
    }

    .backdrop {
      display: none;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-6px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Responsive Mobile Breakpoints */
    @media (max-width: 1040px) {
      .header-inner {
        height: 68px;
      }
      .brand-logo {
        height: 52px;
      }
      .burger {
        display: flex;
      }
      .backdrop.show {
        display: block;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(8, 27, 48, .5);
        backdrop-filter: blur(2px);
        z-index: 65;
      }
      nav {
        display: none;
        position: fixed;
        top: 0;
        right: 0;
        width: 310px;
        max-width: 85vw;
        height: 100vh;
        background: #fff;
        flex-direction: column;
        align-items: stretch;
        padding: 80px 24px 34px;
        gap: 16px;
        box-shadow: -10px 0 30px rgba(0, 0, 0, .2);
        z-index: 75;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
      }
      nav.open {
        display: flex;
        animation: slideLeft .25s ease-out;
      }
      nav a {
        font-size: .95rem;
        padding: 6px 0;
        border-bottom: 1px solid var(--line);
      }
      .dropdown {
        flex-direction: column;
        align-items: stretch;
        border-bottom: 1px solid var(--line);
        padding-bottom: 6px;
      }
      .drop-btn {
        font-size: .95rem;
        justify-content: space-between;
        width: 100%;
        padding: 6px 0;
      }
      .drop-menu {
        position: static;
        box-shadow: none;
        border: none;
        background: var(--bg);
        border-radius: 8px;
        margin-top: 6px;
        padding: 4px 8px;
      }
      .drop-menu.show {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .drop-menu a {
        padding: 8px 10px;
        font-size: .88rem;
        border-bottom: none;
      }
      .apply {
        margin-top: 10px;
        width: 100%;
        text-align: center;
        justify-content: center;
        padding: 13px 20px !important;
      }
    }

    @media (max-width: 480px) {
      .topbar-inner {
        flex-wrap: wrap;
        justify-content: center;
        text-align: center;
        padding-top: 4px;
        padding-bottom: 4px;
      }
      .phone span {
        font-size: .78rem;
      }
    }

    @keyframes slideLeft {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }
  `]
})
export class HeaderComponent implements OnInit, OnDestroy {
  site = SITE;
  solutions = SOLUTIONS;
  industries = INDUSTRIES;
  open = false;
  dropdownOpen: 'solutions' | 'industries' | null = null;
  private routerSub?: Subscription;

  private router = inject(Router);
  private elRef = inject(ElementRef);

  ngOnInit() {
    this.routerSub = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        this.closeMenu();
      });
  }

  ngOnDestroy() {
    this.routerSub?.unsubscribe();
  }

  toggleMenu() {
    this.open = !this.open;
    if (!this.open) {
      this.dropdownOpen = null;
    }
  }

  closeMenu() {
    this.open = false;
    this.dropdownOpen = null;
  }

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
