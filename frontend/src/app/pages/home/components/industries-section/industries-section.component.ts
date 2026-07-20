import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { INDUSTRIES } from '../../../../services/site-content';

@Component({
  selector: 'app-industries-section',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
  <section class="section alt">
    <div class="container center">
      <p class="eyebrow">Where We Work</p>
      <h2 class="section-title">Industries We Serve</h2>
      <p class="section-lead">Our expertise spans all sectors, empowering organizations with the talent and strategies they need to grow.</p>
      <div class="grid grid-3">
        <a *ngFor="let ind of industries" class="ind" [routerLink]="'/' + ind.slug">
          <div class="ind-img" [style.background-image]="'url(' + ind.img + ')'"></div>
          <div class="ind-body">
            <h3>{{ ind.title }}</h3>
            <p class="quote">{{ ind.tag }}</p>
          </div>
        </a>
      </div>
    </div>
  </section>
  `,
  styles: [`
    .quote { color: var(--slate); font-style: italic; font-size: .88rem; }
    .ind { text-decoration: none; background: #fff; border-radius: var(--radius); overflow: hidden; border: 1px solid var(--line); transition: .25s; display: block; text-align: left; }
    .ind:hover { transform: translateY(-5px); box-shadow: var(--shadow); }
    .ind-img { height: 160px; background: linear-gradient(135deg, var(--navy), #16406b); background-size: cover; background-position: center; }
    .ind-body { padding: 20px 22px; }
    .ind-body h3 { margin: 0 0 6px; font-size: 1.02rem; }
  `]
})
export class IndustriesSectionComponent {
  industries = INDUSTRIES;
}
