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
      <p>{{ blog.createdAt | date:'longDate' }} · by {{ blog.author }}</p>
    </app-page-hero>
    <section class="section">
      <div class="container prose" style="max-width: 800px;">
        <img *ngIf="blog.coverImage" [src]="blog.coverImage" [alt]="blog.title" style="width: 100%; max-height: 380px; object-fit: cover; border-radius: var(--radius); margin-bottom: 24px;">
        <div [innerHTML]="content"></div>
        <a routerLink="/blogs" class="btn btn-outline" style="margin-top: 30px;">← Back to all blogs</a>
      </div>
    </section>
  </ng-container>
  <section class="section" *ngIf="notFound">
    <div class="container center">
      <h2>Blog not found</h2>
      <a routerLink="/blogs" class="btn btn-primary">View all blogs</a>
    </div>
  </section>
  `
})
export class BlogDetailComponent implements OnInit {
  blog?: Blog; content: SafeHtml = ''; notFound = false;
  private document = inject(DOCUMENT);
  constructor(private route: ActivatedRoute, private api: ApiService, private sanitizer: DomSanitizer, private title: Title, private meta: Meta) {}
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
