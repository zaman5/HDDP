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
      <p class="section-lead">Latest workforce strategies, hiring insights, and market trends.</p>
      <div class="grid grid-2">
        <a *ngFor="let b of blogs" class="card blog-card" [routerLink]="['/blogs', b.slug]">
          <div class="card-top">
            <span class="tag">Blog</span>
            <small class="blog-date">{{ b.createdAt | date:'longDate' }}</small>
          </div>
          <h3>{{ b.title }}</h3>
          <p class="excerpt">{{ b.excerpt }}</p>
          <div class="card-bottom">
            <span class="author">By {{ b.author || 'HDDP Consultants' }}</span>
            <span class="read-more">Read article →</span>
          </div>
        </a>
      </div>
      <div style="margin-top: 36px;">
        <a routerLink="/blogs" class="btn btn-outline">View all blogs</a>
      </div>
    </div>
  </section>
  `,
  styles: [`
    .blog-card {
      text-align: left;
      text-decoration: none;
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: 28px;
    }
    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      gap: 10px;
    }
    .blog-date {
      color: var(--slate);
      font-size: .8rem;
    }
    .blog-card h3 {
      margin: 0 0 10px;
      font-size: 1.2rem;
      color: var(--navy);
      line-height: 1.35;
    }
    .excerpt {
      color: var(--slate);
      font-size: .94rem;
      line-height: 1.55;
      margin: 0 0 18px;
      flex-grow: 1;
    }
    .card-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid var(--line);
      padding-top: 14px;
      margin-top: auto;
      gap: 10px;
    }
    .author {
      color: var(--slate);
      font-size: .82rem;
      font-weight: 500;
    }
    .read-more {
      color: var(--amber);
      font-weight: 600;
      font-size: .88rem;
    }

    @media (max-width: 640px) {
      .blog-card {
        padding: 20px;
      }
    }
  `]
})
export class LatestBlogsSectionComponent {
  @Input() blogs: Blog[] = [];
}
