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
        <h2>Our Vision</h2>
        <p>To lead the way in transforming workplaces by connecting exceptional talent with meaningful opportunities across every industry.</p>
      </div>
      <div class="vcard">
        <h2>Our Mission</h2>
        <p>To connect people and opportunities helping individuals realize their potential and businesses achieve their goals through the power of the right talent.</p>
      </div>
    </div>
    <div class="container center motto">
      <h3>“People. Performance. Possibilities.”</h3>
      <a routerLink="/get-in-touch" class="btn btn-primary">Get in touch →</a>
    </div>
  </section>
  `,
  styles: [`
    .vision { background: var(--navy-deep); }
    .vcard { background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1); border-radius: var(--radius); padding: 34px; }
    .vcard h2 { color: var(--amber); margin-top: 0; }
    .vcard p { color: #d4e0ee; }
    .motto { margin-top: 44px; }
    .motto h3 { color: #fff; font-size: 1.5rem; margin-bottom: 20px; }
  `]
})
export class VisionSectionComponent {}
