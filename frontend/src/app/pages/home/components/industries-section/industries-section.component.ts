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
          <div class="ind-img" [style.background-image]="'url(' + ind.img + ')'" role="img" [attr.aria-label]="ind.title"></div>
          <div class="ind-body">
            <h3>{{ ind.title }}</h3>
            <p class="quote">{{ ind.tag }}</p>
            <span class="explore-link">Explore industry →</span>
          </div>
        </a>
      </div>
    </div>
  </section>
  `,
  styles: [`
    .ind {
      text-decoration: none;
      background: #fff;
      border-radius: var(--radius);
      overflow: hidden;
      border: 1px solid var(--line);
      transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
      display: flex;
      flex-direction: column;
      height: 100%;
      text-align: left;
    }
    .ind:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow);
      border-color: rgba(232, 137, 29, .3);
    }
    .ind-img {
      height: 170px;
      background: linear-gradient(135deg, var(--navy), #16406b);
      background-size: cover;
      background-position: center;
      transition: transform .3s ease;
    }
    .ind:hover .ind-img {
      transform: scale(1.03);
    }
    .ind-body {
      padding: 22px 24px;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }
    .ind-body h3 {
      margin: 0 0 8px;
      font-size: 1.06rem;
      color: var(--navy);
    }
    .quote {
      color: var(--slate);
      font-style: italic;
      font-size: .88rem;
      line-height: 1.5;
      margin: 0 0 16px;
      flex-grow: 1;
    }
    .explore-link {
      color: var(--amber);
      font-weight: 600;
      font-size: .86rem;
      margin-top: auto;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
  `]
})
export class IndustriesSectionComponent {
  industries = INDUSTRIES;
}
