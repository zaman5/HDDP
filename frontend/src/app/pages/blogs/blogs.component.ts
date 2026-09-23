import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService, Blog } from '../../services/api.service';
import { PageHeroComponent } from '../../components/page-hero/page-hero.component';

@Component({
  selector: 'app-blogs',
  standalone: true,
  imports: [CommonModule, RouterLink, PageHeroComponent],
  template: `
  <app-page-hero eyebrow="Insights & News" title="HDDP Blogs">
    <p>Workforce insights, recruitment strategies, and industry trends from the HDDP team.</p>
  </app-page-hero>

  <section class="section">
    <div class="container">
      <div class="grid grid-2" *ngIf="blogs.length; else empty">
        <a *ngFor="let b of blogs" class="card post-card" [routerLink]="['/blogs', b.slug]">
          <div *ngIf="b.coverImage" class="post-cover" [style.background-image]="'url(' + b.coverImage + ')'" role="img" [attr.aria-label]="b.title"></div>
          <div class="post-body">
            <div class="post-meta">
              <span class="tag">Article</span>
              <small class="post-date">{{ b.createdAt | date:'longDate' }}</small>
            </div>
            <h2>{{ b.title }}</h2>
            <p class="post-excerpt">{{ b.excerpt }}</p>
            <div class="post-foot">
              <span class="author">By {{ b.author || 'HDDP Team' }}</span>
              <span class="read-link">Read article →</span>
            </div>
          </div>
        </a>
      </div>
      <ng-template #empty>
        <div class="card center" style="padding: 48px;">
          <p class="muted">No blog posts yet. Check back soon for fresh insights!</p>
        </div>
      </ng-template>
    </div>
  </section>
  `,
  styles: [`
    .post-card {
      text-decoration: none;
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: 0;
      overflow: hidden;
    }
    .post-cover {
      width: 100%;
      height: 200px;
      background-size: cover;
      background-position: center;
      background-color: var(--navy-light);
    }
    .post-body {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      padding: 24px;
    }
    .post-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      gap: 10px;
    }
    .post-date {
      color: var(--slate);
      font-size: .8rem;
    }
    .post-body h2 {
      font-size: 1.25rem;
      margin: 0 0 10px;
      color: var(--navy);
      line-height: 1.35;
    }
    .post-excerpt {
      color: var(--slate);
      font-size: .94rem;
      line-height: 1.6;
      margin: 0 0 18px;
      flex-grow: 1;
    }
    .post-foot {
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
    }
    .read-link {
      color: var(--amber);
      font-weight: 600;
      font-size: .88rem;
    }

    @media (max-width: 640px) {
      .post-body {
        padding: 20px;
      }
      .post-cover {
        height: 170px;
      }
    }
  `]
})
export class BlogsComponent implements OnInit {
  blogs: Blog[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getBlogs().subscribe({
      next: b => this.blogs = b,
      error: () => {}
    });
  }
}
