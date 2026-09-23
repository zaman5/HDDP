import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-vision-section',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
  <section class="section vision">
    <div class="container grid grid-2">
      <div class="vcard">
        <div class="vcard-icon">🎯</div>
        <h2>Our Vision</h2>
        <p>To lead the way in transforming workplaces by connecting exceptional talent with meaningful opportunities across every industry.</p>
      </div>
      <div class="vcard">
        <div class="vcard-icon">🚀</div>
        <h2>Our Mission</h2>
        <p>To connect people and opportunities, helping individuals realize their potential and businesses achieve their goals through the power of the right talent.</p>
      </div>
    </div>
    <div class="container center motto">
      <h3>“People. Performance. Possibilities.”</h3>
      <a routerLink="/get-in-touch" class="btn btn-primary">Get in touch →</a>
    </div>
  </section>
  `,
  styles: [`
    .vision {
      background: var(--navy-deep);
      position: relative;
    }
    .vcard {
      background: rgba(255, 255, 255, .05);
      border: 1px solid rgba(255, 255, 255, .1);
      border-radius: var(--radius);
      padding: 36px 30px;
      transition: transform .25s ease, background .25s ease;
    }
    .vcard:hover {
      background: rgba(255, 255, 255, .08);
      transform: translateY(-3px);
    }
    .vcard-icon {
      font-size: 2rem;
      margin-bottom: 12px;
    }
    .vcard h2 {
      color: var(--amber);
      margin-top: 0;
      margin-bottom: 12px;
      font-size: 1.4rem;
    }
    .vcard p {
      color: #d4e0ee;
      font-size: 1.02rem;
      line-height: 1.65;
      margin: 0;
    }
    .motto {
      margin-top: 48px;
    }
    .motto h3 {
      color: #fff;
      font-size: clamp(1.3rem, 2.5vw, 1.75rem);
      margin-bottom: 22px;
      font-style: italic;
    }

    @media (max-width: 640px) {
      .vcard {
        padding: 24px 20px;
      }
      .motto {
        margin-top: 36px;
      }
    }
  `]
})
export class VisionSectionComponent {}
