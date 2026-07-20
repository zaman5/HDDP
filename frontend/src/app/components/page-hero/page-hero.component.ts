import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
  <section class="page-hero" [style.background-image]="bgImage">
    <div class="container">
      <p class="eyebrow">{{ eyebrow }}</p>
      <h1>{{ title }}</h1>
      <ng-content></ng-content>
    </div>
  </section>
  `
})
export class PageHeroComponent {
  @Input() eyebrow = '';
  @Input() title = '';
  @Input() bg = '';

  get bgImage(): string | null {
    return this.bg ? `linear-gradient(rgba(8,74,121,.6), rgba(8,74,121,.6)), url('${this.bg}')` : null;
  }
}
