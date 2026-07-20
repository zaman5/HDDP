import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Blog } from '../../../../services/api.service';

@Component({
  selector: 'app-latest-blogs-section',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
  <section class="section" *ngIf="blogs.length">
    <div class="container center">
      <p class="eyebrow">Insights</p>
      <h2 class="section-title">From Our Blog</h2>
      <div class="grid grid-2">
        <a *ngFor="let b of blogs" class="card blog" [routerLink]="['/blogs', b.slug]">
          <span class="tag">Blog</span>
          <h3>{{ b.title }}</h3>
          <p class="muted">{{ b.excerpt }}</p>
          <small class="muted">{{ b.createdAt | date:'longDate' }} · by {{ b.author }}</small>
        </a>
      </div>
      <a routerLink="/blogs" class="btn btn-outline" style="margin-top: 30px">View all blogs</a>
    </div>
  </section>
  `,
  styles: [`
    .blog { text-align: left; text-decoration: none; }
    .blog h3 { margin: 12px 0 8px; font-size: 1.1rem; }
  `]
})
export class LatestBlogsSectionComponent {
  @Input() blogs: Blog[] = [];
}
