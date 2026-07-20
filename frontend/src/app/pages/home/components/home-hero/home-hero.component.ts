import { Component, OnDestroy, OnInit, NgZone, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HERO_SLIDES } from '../../../../services/site-content';

@Component({
  selector: 'app-home-hero',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
  <section class="hero">
    <div class="container hero-inner">
      <p class="eyebrow">HDDP Consultants</p>
      <h1>{{ slides[slide] }}</h1>
      <p class="hero-sub">From executive search to large scale staffing smart, flexible, and scalable HR solutions designed to power your business forward.</p>
      <div class="hero-actions">
        <a routerLink="/get-in-touch" class="btn btn-primary">Get in Touch</a>
        <a routerLink="/how-we-work" class="btn btn-light">How We Work</a>
      </div>
      <div class="dots">
        <button *ngFor="let s of slides; let i = index" [class.on]="i === slide" (click)="slide = i" [attr.aria-label]="'Slide ' + (i+1)"></button>
      </div>
    </div>
  </section>
  `,
  styles: [`
    .hero { background: linear-gradient(rgba(8,42,79,.45), rgba(8,42,79,.45)), url('/assets/img/home-hero-bg.jpg') center/cover no-repeat; color: #fff; padding: 110px 0 90px; position: relative; overflow: hidden; }
    .hero::before { content: 'HDDP'; position: absolute; right: -40px; bottom: -60px; font-family: var(--font-display); font-size: 16rem; font-weight: 800; color: rgba(255,255,255,.04); letter-spacing: -.04em; pointer-events: none; }
    .hero-inner { position: relative; max-width: 760px; }
    .hero h1 { color: #fff; font-size: clamp(2rem, 4.6vw, 3.2rem); margin: 0 0 18px; min-height: 2.4em; }
    .hero-sub { color: #c8d6e6; font-size: 1.08rem; margin: 0 0 30px; }
    .hero-actions { display: flex; gap: 14px; flex-wrap: wrap; }
    .dots { margin-top: 40px; display: flex; gap: 8px; }
    .dots button { width: 26px; height: 5px; border-radius: 999px; border: none; background: rgba(255,255,255,.25); cursor: pointer; padding: 0; }
    .dots button.on { background: var(--amber); }
  `]
})
export class HomeHeroComponent implements OnInit, OnDestroy {
  slides = HERO_SLIDES;
  slide = 0;
  private timer: any;
  private zone = inject(NgZone);
  private platformId = inject(PLATFORM_ID);

  ngOnInit() {
    // Browser-only, outside the zone: a recurring interval inside the zone
    // keeps the app "unstable" and hangs SSR prerendering indefinitely.
    if (!isPlatformBrowser(this.platformId)) return;
    this.zone.runOutsideAngular(() => {
      this.timer = setInterval(() => {
        this.zone.run(() => this.slide = (this.slide + 1) % this.slides.length);
      }, 4500);
    });
  }
  ngOnDestroy() { clearInterval(this.timer); }
}
