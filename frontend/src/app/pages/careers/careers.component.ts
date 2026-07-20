import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { ApiService, LiveJob } from '../../services/api.service';
import { PageHeroComponent } from '../../components/page-hero/page-hero.component';

@Component({
  selector: 'app-careers',
  standalone: true,
  imports: [CommonModule, PageHeroComponent],
  template: `
  <app-page-hero eyebrow="Careers" title="Job Openings">
    <p>Explore current opportunities across our client network. Apply directly on the role that fits you.</p>
  </app-page-hero>

  <section class="section">
    <div class="container" style="max-width: 900px;">
      <p class="muted" *ngIf="!loading && !error">Showing {{ jobs.length }} of {{ jobs.length }} jobs</p>

      <div class="job" *ngFor="let j of jobs">
        <div class="job-main">
          <h3>{{ j.jobTitle }}</h3>
          <p class="meta">
            <span *ngIf="j.city.length || j.location" class="meta-item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {{ (j.city.length ? j.city.join(', ') : j.location) }}
            </span>
            <span *ngIf="j.jobNature"> · {{ j.jobNature }}</span>
            <span *ngIf="j.jobType"> · {{ j.jobType }}</span>
          </p>
          <p class="desc meta-item" *ngIf="j.salary">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v10M9.5 9.5c0-1.1 1.1-2 2.5-2s2.5.7 2.5 1.75-.9 1.5-2.5 1.75-2.5.7-2.5 1.75.9 1.75 2.5 1.75 2.5-.9 2.5-2"/></svg>
            {{ j.salary }} {{ j.currency }} / {{ j.rate }}
          </p>
          <span class="badge">Open position</span>
        </div>
        <a class="btn btn-primary" [href]="j.jobLink" target="_blank" rel="noopener">Apply Now →</a>
      </div>

      <div class="card center" *ngIf="loading">
        <p class="muted">Loading open positions…</p>
      </div>
      <div class="card center" *ngIf="!loading && error">
        <p class="muted">We couldn't load live openings right now. Please check back shortly.</p>
      </div>
      <div class="card center" *ngIf="!loading && !error && !jobs.length">
        <p class="muted">No open positions right now. Check back soon for new opportunities.</p>
      </div>
    </div>
  </section>
  `,
  styles: [`
    .job { display: flex; justify-content: space-between; align-items: center; gap: 20px; background: #fff; border: 1px solid var(--line); border-radius: 14px; padding: 22px 24px; margin-bottom: 16px; }
    .job h3 { margin: 0 0 4px; }
    .meta { color: var(--amber); font-family: var(--font-display); font-size: .8rem; font-weight: 600; letter-spacing: .03em; margin: 0 0 8px; }
    .desc { color: var(--slate); margin: 0 0 8px; font-size: .92rem; }
    .meta-item { display: inline-flex; align-items: center; gap: 5px; }
    .badge { background: #e7f6ec; color: #146c2e; border-radius: 999px; padding: 3px 12px; font-size: .74rem; font-weight: 600; }
    .job .btn { flex-shrink: 0; }
    @media (max-width: 640px) { .job { flex-direction: column; align-items: flex-start; } }
  `]
})
export class CareersComponent implements OnInit {
  jobs: LiveJob[] = [];
  loading = true;
  error = false;
  private document = inject(DOCUMENT);
  constructor(private api: ApiService) {}
  ngOnInit() {
    this.api.getLiveJobs().subscribe({
      next: j => { this.jobs = j; this.loading = false; this.injectJobPostingSchema(j); },
      error: () => { this.loading = false; this.error = true; }
    });
  }

  private injectJobPostingSchema(jobs: LiveJob[]) {
    if (!jobs.length) return;
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: jobs.map((j, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'JobPosting',
          title: j.jobTitle,
          description: j.detailedJobDescription || j.jobTitle,
          datePosted: j.closingDate,
          employmentType: (j.jobType || 'FULL_TIME').toUpperCase().replace(/[\s-]+/g, '_'),
          hiringOrganization: { '@type': 'Organization', name: 'HDDP Consultants', sameAs: 'https://hddpconsultants.com/' },
          jobLocation: {
            '@type': 'Place',
            address: { '@type': 'PostalAddress', addressLocality: (j.city.length ? j.city.join(', ') : j.location), addressCountry: 'PK' }
          },
          ...(j.salary ? { baseSalary: { '@type': 'MonetaryAmount', currency: j.currency || 'PKR', value: { '@type': 'QuantitativeValue', value: j.salary, unitText: (j.rate || 'MONTH').toUpperCase() } } } : {}),
          directApply: true,
          url: j.jobLink
        }
      }))
    };
    const existing = this.document.getElementById('job-posting-schema');
    if (existing) existing.remove();
    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'job-posting-schema';
    script.text = JSON.stringify(schema);
    this.document.head.appendChild(script);
  }
}
