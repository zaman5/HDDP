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
    <p>Explore current opportunities across our client network. Apply directly to the role that fits you.</p>
  </app-page-hero>

  <section class="section">
    <div class="container" style="max-width: 960px;">
      <div class="results-header" *ngIf="!loading && !error">
        <p class="muted">Showing <strong>{{ jobs.length }}</strong> open position{{ jobs.length === 1 ? '' : 's' }}</p>
      </div>

      <div class="job-card" *ngFor="let j of jobs">
        <div class="job-main">
          <div class="job-title-row">
            <h3>{{ j.jobTitle }}</h3>
            <span class="badge">Open position</span>
          </div>

          <div class="meta-wrap">
            <span *ngIf="j.city.length || j.location" class="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {{ (j.city.length ? j.city.join(', ') : j.location) }}
            </span>
            <span *ngIf="j.jobNature" class="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              {{ j.jobNature }}
            </span>
            <span *ngIf="j.jobType" class="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {{ j.jobType }}
            </span>
          </div>

          <p class="salary-tag" *ngIf="j.salary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v10M9.5 9.5c0-1.1 1.1-2 2.5-2s2.5.7 2.5 1.75-.9 1.5-2.5 1.75-2.5.7-2.5 1.75.9 1.75 2.5 1.75 2.5-.9 2.5-2"/></svg>
            {{ j.salary }} {{ j.currency }} / {{ j.rate }}
          </p>
        </div>

        <div class="job-action">
          <a class="btn btn-primary btn-apply" [href]="j.jobLink" target="_blank" rel="noopener">
            Apply Now →
          </a>
        </div>
      </div>

      <div class="card center" *ngIf="loading" style="padding: 40px;">
        <p class="muted">Loading open positions…</p>
      </div>

      <div class="card center" *ngIf="!loading && error" style="padding: 40px;">
        <p class="muted">We couldn't load live openings right now. Please check back shortly.</p>
      </div>

      <div class="card center" *ngIf="!loading && !error && !jobs.length" style="padding: 40px;">
        <p class="muted">No open positions right now. Check back soon for new opportunities or send us your CV via our contact form.</p>
      </div>
    </div>
  </section>
  `,
  styles: [`
    .results-header {
      margin-bottom: 20px;
    }
    .job-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 24px;
      background: #fff;
      border: 1px solid var(--line);
      border-radius: var(--radius);
      padding: 24px 28px;
      margin-bottom: 18px;
      transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
    }
    .job-card:hover {
      transform: translateY(-3px);
      box-shadow: var(--shadow);
      border-color: rgba(232, 137, 29, .3);
    }
    .job-main {
      flex: 1;
    }
    .job-title-row {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 8px;
    }
    .job-title-row h3 {
      margin: 0;
      font-size: 1.22rem;
      color: var(--navy);
    }
    .meta-wrap {
      display: flex;
      gap: 14px;
      flex-wrap: wrap;
      margin: 8px 0 10px;
      color: var(--slate);
      font-size: .88rem;
    }
    .meta-item {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .meta-item svg {
      color: var(--amber);
    }
    .salary-tag {
      color: var(--navy);
      font-family: var(--font-display);
      font-weight: 600;
      font-size: .88rem;
      margin: 0;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: var(--amber-soft);
      padding: 4px 12px;
      border-radius: 6px;
    }
    .salary-tag svg {
      color: var(--amber);
    }
    .badge {
      background: #e7f6ec;
      color: #146c2e;
      border-radius: 999px;
      padding: 3px 12px;
      font-size: .74rem;
      font-weight: 600;
      letter-spacing: .02em;
    }
    .btn-apply {
      padding: 12px 24px;
      font-size: .92rem;
    }

    @media (max-width: 680px) {
      .job-card {
        flex-direction: column;
        align-items: stretch;
        padding: 20px;
        gap: 18px;
      }
      .btn-apply {
        width: 100%;
        justify-content: center;
      }
    }
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
      next: j => {
        this.jobs = j;
        this.loading = false;
        this.injectJobPostingSchema(j);
      },
      error: () => {
        this.loading = false;
        this.error = true;
      }
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
