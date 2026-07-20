import { Injectable, inject } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { filter, map } from 'rxjs';

const SITE_URL = 'https://hddpconsultants.com';
const SITE_NAME = 'HDDP Consultants';
const DEFAULT_IMAGE = `${SITE_URL}/assets/img/hero-skyscraper.jpg`;

@Injectable({ providedIn: 'root' })
export class SeoService {
  private meta = inject(Meta);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private document = inject(DOCUMENT);

  init() {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(() => {
        let r = this.route.firstChild;
        while (r?.firstChild) r = r.firstChild;
        return r;
      })
    ).subscribe(r => {
      const data = r?.snapshot.data ?? {};
      const title = r?.snapshot.title ?? SITE_NAME;
      const description: string = data['description'] ?? '';
      const noIndex: boolean = !!data['noIndex'];
      const url = `${SITE_URL}${this.router.url === '/' ? '' : this.router.url}`;

      this.setTag('description', description);
      this.setTag('robots', noIndex ? 'noindex, nofollow' : 'index, follow');

      this.setProperty('og:type', 'website');
      this.setProperty('og:site_name', SITE_NAME);
      this.setProperty('og:title', title);
      this.setProperty('og:description', description);
      this.setProperty('og:url', url);
      this.setProperty('og:image', DEFAULT_IMAGE);

      this.setTag('twitter:card', 'summary_large_image');
      this.setTag('twitter:title', title);
      this.setTag('twitter:description', description);
      this.setTag('twitter:image', DEFAULT_IMAGE);

      this.setCanonical(url);
    });
  }

  private setTag(name: string, content: string) {
    if (!content) return;
    this.meta.updateTag({ name, content });
  }

  private setProperty(property: string, content: string) {
    if (!content) return;
    this.meta.updateTag({ property, content });
  }

  private setCanonical(url: string) {
    let link: HTMLLinkElement | null = this.document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
}
