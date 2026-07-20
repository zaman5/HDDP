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
  <app-page-hero eyebrow="Insights & News" title="Blogs">
    <p>Workforce insights, recruitment strategy and industry trends from the HDDP team.</p>
  </app-page-hero>

  <section class="section">
    <div class="container">
      <div class="grid grid-2" *ngIf="blogs.length; else empty">
        <a *ngFor="let b of blogs" class="card post" [routerLink]="['/blogs', b.slug]">
          <img *ngIf="b.coverImage" [src]="b.coverImage" [alt]="b.title" class="post-cover">
          <div class="post-body">
            <span class="tag">Blog</span>
            <h2>{{ b.title }}</h2>
            <p class="muted">{{ b.excerpt }}</p>
            <small class="muted">{{ b.createdAt | date:'longDate' }} · by {{ b.author }}</small>
            <span class="more">Read article →</span>
          </div>
        </a>
      </div>
      <ng-template #empty><p class="center muted">No blog posts yet. Check back soon!</p></ng-template>
    </div>
  </section>
  `,
  styles: [`
    .post { text-decoration: none; display: flex; flex-direction: column; gap: 8px; padding: 0; overflow: hidden; }
    .post-cover { width: 100%; height: 180px; object-fit: cover; border-radius: var(--radius) var(--radius) 0 0; }
    .post-body { display: flex; flex-direction: column; gap: 8px; padding: 22px; }
    .post-body h2 { font-size: 1.25rem; margin: 6px 0 0; }
    .more { color: var(--amber); font-weight: 600; font-size: .88rem; margin-top: 8px; }
  `]
})
export class BlogsComponent implements OnInit {
  blogs: Blog[] = [];
  constructor(private api: ApiService) {}
  ngOnInit() { this.api.getBlogs().subscribe({ next: b => this.blogs = b, error: () => {} }); }
}
