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
      <h1 class="hero-title">{{ slides[slide] }}</h1>
      <p class="hero-sub">From executive search to large-scale staffing — smart, flexible, and scalable HR solutions designed to power your business forward.</p>
      <div class="hero-actions">
        <a routerLink="/get-in-touch" class="btn btn-primary btn-hero">Get in Touch</a>
        <a routerLink="/how-we-work" class="btn btn-light btn-hero">How We Work</a>
      </div>
      <div class="dots" role="tablist" aria-label="Hero slider navigation">
        <button *ngFor="let s of slides; let i = index"
          [class.on]="i === slide"
          (click)="slide = i"
          [attr.aria-label]="'Slide ' + (i+1)"
          [attr.aria-selected]="i === slide"
          role="tab">
        </button>
      </div>
    </div>
  </section>
  `,
  styles: [`
    .hero {
      background: linear-gradient(rgba(8, 42, 79, .55), rgba(8, 42, 79, .55)), url('/assets/img/home-hero-bg.jpg') center/cover no-repeat;
      color: #fff;
      padding: clamp(64px, 8vw, 130px) 0 clamp(54px, 7vw, 100px);
      position: relative;
      overflow: hidden;
      width: 100%;
    }
    .hero::before {
      content: 'HDDP';
      position: absolute;
      right: -20px;
      bottom: -40px;
      font-family: var(--font-display);
      font-size: clamp(6rem, 18vw, 16rem);
      font-weight: 800;
      color: rgba(255, 255, 255, .04);
      letter-spacing: -.04em;
      pointer-events: none;
      line-height: 1;
      user-select: none;
    }
    .hero-inner {
      position: relative;
      max-width: min(960px, 100%);
      z-index: 2;
    }
    @media (min-width: 1600px) {
      .hero-inner {
        max-width: 1140px;
      }
    }
    .hero .eyebrow {
      color: var(--amber);
      font-size: clamp(0.78rem, 1vw, 0.9rem);
      letter-spacing: .2em;
    }
    .hero-title {
      color: #fff;
      font-size: clamp(1.85rem, 4.4vw, 3.4rem);
      margin: 0 0 18px;
      line-height: 1.2;
      font-weight: 700;
      min-height: 2.3em;
      display: flex;
      align-items: center;
      transition: opacity .3s ease;
    }
    .hero-sub {
      color: #dce7f3;
      font-size: clamp(1rem, 1.6vw, 1.22rem);
      margin: 0 0 32px;
      line-height: 1.65;
      max-width: min(820px, 100%);
    }
    .hero-actions {
      display: flex;
      gap: 14px;
      flex-wrap: wrap;
    }
    .btn-hero {
      padding: 14px 30px;
      font-size: clamp(0.92rem, 1.2vw, 1.05rem);
      min-height: 48px;
    }
    .dots {
      margin-top: 36px;
      display: flex;
      gap: 8px;
    }
    .dots button {
      width: 28px;
      height: 7px;
      border-radius: 999px;
      border: none;
      background: rgba(255, 255, 255, .35);
      cursor: pointer;
      padding: 0;
      transition: all .25s ease;
    }
    .dots button.on {
      background: var(--amber);
      width: 44px;
    }

    @media (max-width: 768px) {
      .hero-title {
        min-height: 3.2em;
      }
      .hero-sub {
        margin-bottom: 24px;
      }
      .dots {
        margin-top: 26px;
      }
    }

    @media (max-width: 480px) {
      .hero-actions {
        flex-direction: column;
        width: 100%;
        gap: 12px;
      }
      .btn-hero {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class HomeHeroComponent implements OnInit, OnDestroy {
  slides = HERO_SLIDES;
  slide = 0;
  private timer: any;
  private zone = inject(NgZone);
  private platformId = inject(PLATFORM_ID);

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.zone.runOutsideAngular(() => {
      this.timer = setInterval(() => {
        this.zone.run(() => this.slide = (this.slide + 1) % this.slides.length);
      }, 5000);
    });
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }
}
