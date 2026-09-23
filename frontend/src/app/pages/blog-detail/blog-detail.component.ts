import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml, Title, Meta } from '@angular/platform-browser';
import { ApiService, Blog } from '../../services/api.service';
import { PageHeroComponent } from '../../components/page-hero/page-hero.component';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, PageHeroComponent],
  template: `
  <ng-container *ngIf="blog">
    <app-page-hero eyebrow="Blog" [title]="blog.title">
      <p>{{ blog.createdAt | date:'longDate' }} · By {{ blog.author || 'HDDP Consultants' }}</p>
    </app-page-hero>

    <section class="section">
      <div class="container prose article-container">
        <div class="cover-wrap" *ngIf="blog.coverImage">
          <img [src]="blog.coverImage" [alt]="blog.title" class="article-cover">
        </div>

        <div class="article-body" [innerHTML]="content"></div>

        <div class="article-nav">
          <a routerLink="/blogs" class="btn btn-outline">← Back to all blogs</a>
          <a routerLink="/get-in-touch" class="btn btn-primary">Contact our team</a>
        </div>
      </div>
    </section>
  </ng-container>

  <section class="section" *ngIf="notFound">
    <div class="container center" style="padding: 60px 0;">
      <h2>Blog post not found</h2>
      <p class="muted">The article you are looking for might have been moved or unpublished.</p>
      <a routerLink="/blogs" class="btn btn-primary" style="margin-top: 14px;">View all blogs</a>
    </div>
  </section>
  `,
  styles: [`
    .article-container {
      max-width: 860px;
      margin: 0 auto;
    }
    .cover-wrap {
      margin-bottom: 30px;
      border-radius: var(--radius);
      overflow: hidden;
      box-shadow: var(--shadow);
    }
    .article-cover {
      width: 100%;
      max-height: 420px;
      object-fit: cover;
      display: block;
    }
    .article-body {
      font-size: 1.05rem;
      line-height: 1.8;
      color: var(--ink);
    }
    .article-body ::ng-deep img {
      max-width: 100%;
      height: auto;
      border-radius: var(--radius);
      margin: 20px 0;
    }
    .article-body ::ng-deep h2 {
      font-size: 1.55rem;
      margin-top: 1.8em;
      margin-bottom: .6em;
    }
    .article-body ::ng-deep h3 {
      font-size: 1.25rem;
      margin-top: 1.5em;
      margin-bottom: .5em;
    }
    .article-body ::ng-deep p {
      margin-bottom: 1.2em;
    }
    .article-nav {
      margin-top: 48px;
      padding-top: 24px;
      border-top: 1px solid var(--line);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 14px;
      flex-wrap: wrap;
    }

    @media (max-width: 540px) {
      .article-nav {
        flex-direction: column;
      }
      .article-nav .btn {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class BlogDetailComponent implements OnInit {
  blog?: Blog;
  content: SafeHtml = '';
  notFound = false;
  private document = inject(DOCUMENT);

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private sanitizer: DomSanitizer,
    private title: Title,
    private meta: Meta
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(p => {
      const slug = p.get('slug') || '';
      this.api.getBlog(slug).subscribe({
        next: b => {
          this.blog = b;
          this.content = this.sanitizer.bypassSecurityTrustHtml(b.content || '');
          this.title.setTitle(b.title + ' – HDDP Consultants');
          this.meta.updateTag({ name: 'description', content: b.excerpt });
          this.injectArticleSchema(b, slug);
        },
        error: () => this.notFound = true
      });
    });
  }

  private injectArticleSchema(b: Blog, slug: string) {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: b.title,
      description: b.excerpt,
      image: b.coverImage ? `https://hddpconsultants.com/${b.coverImage}` : undefined,
      author: { '@type': 'Organization', name: b.author || 'HDDP Consultants' },
      publisher: { '@type': 'Organization', name: 'HDDP Consultants', logo: { '@type': 'ImageObject', url: 'https://hddpconsultants.com/assets/img/logo.png' } },
      datePublished: b.createdAt,
      dateModified: b.updatedAt || b.createdAt,
      mainEntityOfPage: `https://hddpconsultants.com/blogs/${slug}`
    };
    const existing = this.document.getElementById('article-schema');
    if (existing) existing.remove();
    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'article-schema';
    script.text = JSON.stringify(schema);
    this.document.head.appendChild(script);
  }
}
