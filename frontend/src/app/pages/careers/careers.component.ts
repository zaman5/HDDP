import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService, LiveJob } from '../../services/api.service';
import { PageHeroComponent } from '../../components/page-hero/page-hero.component';

@Component({
  selector: 'app-careers',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, PageHeroComponent],
  template: `
  <app-page-hero eyebrow="Careers & Opportunities" title="Current Career Opportunities">
    <p>Explore active openings across our client network. All positions are synchronized live with the Accelerec ATS platform. Review role details below and apply directly via the official Accelerec application portal.</p>
  </app-page-hero>

  <section class="section careers-section">
    <div class="container" style="max-width: 1080px;">

      <!-- Live ATS Sync Banner -->
      <div class="ats-status-strip">
        <div class="status-left">
          <span class="pulse-indicator"></span>
          <div>
            <div class="status-title-row">
              <strong>Accelerec ATS Live Job Board</strong>
              <span class="live-pill">Live Active</span>
            </div>
            <span class="sub-text">Current vacancies synchronized in real-time. Click any role to apply via the official Accelerec application form.</span>
          </div>
        </div>
        <div class="status-right">
          <span class="badge-count" *ngIf="!loading && jobs.length">
            <strong>{{ jobs.length }}</strong> Open Position{{ jobs.length === 1 ? '' : 's' }}
          </span>
          <a routerLink="/get-in-touch" class="btn btn-outline btn-sm">
            <span>Contact Recruitment Team →</span>
          </a>
        </div>
      </div>

      <!-- Search & Filters Card -->
      <div class="filters-card">
        <div class="search-input-wrap">
          <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            type="text"
            class="search-input"
            [(ngModel)]="searchQuery"
            (ngModelChange)="applyFilters()"
            placeholder="Search roles by title, skill, or keyword (e.g. Accounts Payable, AR Executive, IT Support, AI Engineer)..."
            aria-label="Search open roles"
          />
          <button *ngIf="searchQuery" class="clear-search" (click)="clearSearch()" aria-label="Clear search">✕</button>
        </div>

        <div class="filter-chips">
          <button
            class="chip"
            [class.active]="selectedNature === 'ALL'"
            (click)="setNatureFilter('ALL')">
            All Types ({{ jobs.length }})
          </button>
          <button
            class="chip"
            [class.active]="selectedNature === 'Onsite'"
            (click)="setNatureFilter('Onsite')">
            Onsite
          </button>
          <button
            class="chip"
            [class.active]="selectedNature === 'Remote'"
            (click)="setNatureFilter('Remote')">
            Remote
          </button>
          <button
            class="chip"
            [class.active]="selectedNature === 'Hybrid'"
            (click)="setNatureFilter('Hybrid')">
            Hybrid
          </button>
        </div>
      </div>

      <!-- Results Count Bar -->
      <div class="results-header" *ngIf="!loading && !error && jobs.length">
        <p class="muted">
          Showing <strong>{{ filteredJobs.length }}</strong> of <strong>{{ jobs.length }}</strong> open position{{ jobs.length === 1 ? '' : 's' }}
        </p>
        <button *ngIf="searchQuery || selectedNature !== 'ALL'" class="reset-filter-link" (click)="resetAllFilters()">Reset filters</button>
      </div>

      <!-- Job Cards List -->
      <div class="job-list" *ngIf="!loading && !error && filteredJobs.length">
        <article class="job-card" *ngFor="let j of filteredJobs; trackBy: trackByUuid">
          <div class="job-card-top">
            <div class="job-header">
              <div class="title-wrap">
                <h2 class="job-title">
                  <a [href]="j.jobLink" target="_blank" rel="noopener" class="title-link" title="Apply for this position">
                    {{ cleanTitle(j.jobTitle) }}
                  </a>
                </h2>
                <div class="badge-row">
                  <span class="badge badge-success">Open Position</span>
                  <span class="badge badge-subtle" *ngIf="j.uniqueCustomId">ID: {{ j.uniqueCustomId }}</span>
                  <span class="badge badge-neutral" *ngIf="j.industryType">{{ j.industryType }}</span>
                </div>
              </div>

              <!-- Top Primary Action on Desktop -->
              <div class="desktop-action">
                <a class="btn btn-primary btn-apply" [href]="j.jobLink" target="_blank" rel="noopener">
                  <span>Apply</span>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                </a>
              </div>
            </div>

            <!-- Key Meta Row -->
            <div class="meta-row">
              <span *ngIf="getLocationString(j)" class="meta-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {{ getLocationString(j) }}
              </span>

              <span *ngIf="j.jobNature" class="meta-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                {{ j.jobNature }}
              </span>

              <span *ngIf="j.jobType" class="meta-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                {{ j.jobType }}
              </span>

              <span *ngIf="j.experience" class="meta-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                {{ j.experience }}+ Year{{ j.experience === '1' ? '' : 's' }} Experience
              </span>

              <span *ngIf="j.degreeName && j.degreeName.length" class="meta-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                {{ j.degreeName.join(', ') }}
              </span>
            </div>

            <!-- Salary Highlight -->
            <div class="salary-box" *ngIf="j.salary">
              <span class="salary-label">Compensation:</span>
              <span class="salary-amount">{{ formatSalary(j.salary, j.currency) }}</span>
              <span class="salary-rate" *ngIf="j.rate">/ {{ j.rate }}</span>
            </div>

            <!-- Skills & Tools Tag Cloud -->
            <div class="skills-wrap" *ngIf="j.toolsHandlingExperience && j.toolsHandlingExperience.length">
              <span class="skills-label">Required Skills &amp; Tools:</span>
              <div class="skills-list">
                <span class="skill-tag" *ngFor="let tool of j.toolsHandlingExperience">{{ tool }}</span>
              </div>
            </div>

            <!-- Benefits Pills -->
            <div class="benefits-wrap" *ngIf="j.benefits && j.benefits.length">
              <span class="benefits-pill" *ngFor="let b of j.benefits">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                {{ b }}
              </span>
            </div>
          </div>

          <!-- Accordion Toggle Bar -->
          <div class="job-card-footer">
            <button
              type="button"
              class="btn-toggle-details"
              (click)="toggleExpand(j.uuid)"
              [attr.aria-expanded]="isExpanded(j.uuid)">
              <span>{{ isExpanded(j.uuid) ? 'Hide Job Details' : 'View Full Job Description & Requirements' }}</span>
              <svg class="chevron" [class.rotated]="isExpanded(j.uuid)" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
            </button>

            <!-- Mobile Apply Button -->
            <div class="mobile-action">
              <a class="btn btn-primary btn-apply" [href]="j.jobLink" target="_blank" rel="noopener">
                <span>Apply</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </a>
            </div>
          </div>

          <!-- Expandable Details Content -->
          <div class="job-details-drawer" *ngIf="isExpanded(j.uuid)">
            <div class="job-details-inner" [innerHTML]="j.detailedJobDescription"></div>
            <div class="drawer-action-row">
              <a class="btn btn-primary" [href]="j.jobLink" target="_blank" rel="noopener">
                <span>Apply</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </a>
              <button class="btn btn-outline" type="button" (click)="toggleExpand(j.uuid)">Close Details</button>
            </div>
          </div>
        </article>
      </div>

      <!-- Loading Skeletons -->
      <div class="loading-state" *ngIf="loading">
        <div class="skeleton-card" *ngFor="let s of [1, 2, 3]">
          <div class="skeleton line title"></div>
          <div class="skeleton line subtitle"></div>
          <div class="skeleton line meta"></div>
        </div>
      </div>

      <!-- Error State -->
      <div class="card center error-card" *ngIf="!loading && error">
        <div class="error-icon">⚠️</div>
        <h3>Unable to load live jobs from Accelerec</h3>
        <p class="muted">We could not retrieve active job records at this moment. You can still submit your profile directly using our Candidate Application Form.</p>
        <div class="error-actions">
          <button class="btn btn-primary" (click)="loadJobs()">Retry Loading Jobs</button>
          <a routerLink="/get-in-touch" class="btn btn-outline">Contact Us →</a>
        </div>
      </div>

      <!-- Filtered Empty State (when search has no match) -->
      <div class="card center empty-card" *ngIf="!loading && !error && jobs.length > 0 && !filteredJobs.length">
        <div class="empty-icon">🔍</div>
        <h3>No matching jobs found</h3>
        <p class="muted">
          No open roles match your current search criteria. Try clearing your filters or search keywords.
        </p>
        <div style="margin-top: 18px; display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
          <button class="btn btn-primary" (click)="resetAllFilters()">Reset All Filters</button>
          <a routerLink="/get-in-touch" class="btn btn-outline">Inquire with Recruiters</a>
        </div>
      </div>

      <!-- Zero Jobs State -->
      <div class="card center empty-card" *ngIf="!loading && !error && !jobs.length">
        <div class="empty-icon">📋</div>
        <h3>No Active Openings Right Now</h3>
        <p class="muted">
          There are currently no open positions listed on the job board. New vacancies are added regularly. Submit your profile below to join our talent network.
        </p>
        <div style="margin-top: 18px;">
          <a routerLink="/get-in-touch" class="btn btn-primary">Connect With Recruiters →</a>
        </div>
      </div>

      <!-- Talent Pool Callout -->
      <div class="talent-banner">
        <div class="talent-content">
          <span class="eyebrow-accent">Executive Search &amp; Placement</span>
          <h3>Looking for a specific executive placement or confidential role?</h3>
          <p>Our recruitment consultants match top professionals with premium client networks across Healthcare, IT, Banking &amp; Finance, and Supply Chain.</p>
        </div>
        <div class="talent-cta">
          <a routerLink="/get-in-touch" class="btn btn-primary">Connect With Recruiters →</a>
        </div>
      </div>

    </div>
  </section>
  `,
  styles: [`
    .careers-section {
      padding-top: clamp(24px, 4vw, 44px);
      padding-bottom: clamp(48px, 6vw, 80px);
    }

    /* ATS Live Status Strip */
    .ats-status-strip {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
      background: #ffffff;
      border: 1px solid var(--line);
      border-left: 4px solid #16a34a;
      border-radius: 12px;
      padding: 16px 20px;
      margin-bottom: 24px;
      box-shadow: 0 4px 18px rgba(15, 23, 42, 0.04);
    }

    .status-left {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .status-title-row {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 2px;
    }

    .status-title-row strong {
      color: var(--navy);
      font-size: 1rem;
    }

    .live-pill {
      background: #e7f6ec;
      color: #146c2e;
      font-size: .72rem;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 999px;
      text-transform: uppercase;
      letter-spacing: .05em;
    }

    .sub-text {
      display: block;
      color: var(--slate);
      font-size: .84rem;
    }

    .status-right {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    .badge-count {
      background: #f1f5f9;
      color: var(--navy);
      padding: 6px 14px;
      border-radius: 999px;
      font-size: .84rem;
      font-weight: 600;
    }

    .badge-count strong {
      color: var(--amber);
      font-weight: 700;
    }

    .btn-sm {
      padding: 7px 14px;
      font-size: .84rem;
    }

    .pulse-indicator {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #16a34a;
      box-shadow: 0 0 0 0 rgba(22, 163, 74, 0.7);
      animation: pulse-ring 2s infinite;
      flex-shrink: 0;
    }

    @keyframes pulse-ring {
      0% { box-shadow: 0 0 0 0 rgba(22, 163, 74, 0.7); }
      70% { box-shadow: 0 0 0 8px rgba(22, 163, 74, 0); }
      100% { box-shadow: 0 0 0 0 rgba(22, 163, 74, 0); }
    }

    /* Filters Card */
    .filters-card {
      background: #ffffff;
      border: 1px solid var(--line);
      border-radius: 14px;
      padding: 18px 20px;
      margin-bottom: 20px;
      box-shadow: 0 4px 18px rgba(0, 0, 0, 0.03);
    }

    .search-input-wrap {
      position: relative;
      display: flex;
      align-items: center;
      margin-bottom: 14px;
    }

    .search-icon {
      position: absolute;
      left: 14px;
      color: var(--slate);
      pointer-events: none;
    }

    .search-input {
      width: 100%;
      padding: 12px 38px 12px 42px;
      font-size: .95rem;
      border: 1px solid var(--line);
      border-radius: 10px;
      background: #fafbfe;
      color: var(--navy);
      outline: none;
      transition: all .2s ease;
      font-family: inherit;
      box-sizing: border-box;
    }

    .search-input:focus {
      background: #ffffff;
      border-color: var(--amber);
      box-shadow: 0 0 0 3px rgba(232, 137, 29, 0.15);
    }

    .clear-search {
      position: absolute;
      right: 12px;
      background: none;
      border: none;
      color: var(--slate);
      cursor: pointer;
      font-size: 1rem;
      padding: 4px 8px;
    }

    .filter-chips {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .chip {
      background: #f1f5f9;
      border: 1px solid transparent;
      padding: 6px 14px;
      border-radius: 999px;
      font-size: .82rem;
      font-weight: 600;
      color: var(--slate);
      cursor: pointer;
      transition: all .15s ease;
      font-family: inherit;
    }

    .chip:hover {
      background: #e2e8f0;
      color: var(--navy);
    }

    .chip.active {
      background: var(--navy);
      color: #ffffff;
      border-color: var(--navy);
    }

    /* Results Header */
    .results-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      padding: 0 4px;
    }

    .results-header p {
      margin: 0;
      font-size: .92rem;
    }

    .reset-filter-link {
      background: none;
      border: none;
      color: var(--amber);
      font-size: .85rem;
      font-weight: 600;
      cursor: pointer;
      padding: 0;
      font-family: inherit;
    }

    .reset-filter-link:hover {
      text-decoration: underline;
    }

    /* Job Card */
    .job-card {
      background: #ffffff;
      border: 1px solid var(--line);
      border-radius: 16px;
      padding: 24px clamp(20px, 3vw, 32px);
      margin-bottom: 20px;
      box-shadow: 0 4px 20px rgba(15, 23, 42, 0.04);
      transition: transform .2s ease, box-shadow .2s ease;
    }

    .job-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 28px rgba(15, 23, 42, 0.08);
      border-color: rgba(232, 137, 29, 0.35);
    }

    .job-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 18px;
      margin-bottom: 14px;
    }

    .title-wrap {
      flex: 1;
    }

    .job-title {
      font-size: 1.3rem;
      color: var(--navy);
      margin: 0 0 8px;
      font-weight: 700;
      line-height: 1.35;
    }

    .title-link {
      color: var(--navy);
      text-decoration: none;
      transition: color .2s ease;
    }

    .title-link:hover {
      color: var(--amber);
    }

    .badge-row {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      padding: 3px 10px;
      border-radius: 6px;
      font-size: .75rem;
      font-weight: 600;
    }

    .badge-success {
      background: #e7f6ec;
      color: #146c2e;
    }

    .badge-subtle {
      background: #f1f5f9;
      color: var(--slate);
    }

    .badge-neutral {
      background: #eef2ff;
      color: #3730a3;
    }

    .desktop-action {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 6px;
      flex-shrink: 0;
    }

    .btn-apply {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 18px;
      font-size: .92rem;
      font-weight: 700;
      border-radius: 10px;
      background: var(--amber);
      color: var(--navy);
      border: 1px solid var(--amber);
      text-decoration: none;
      transition: all .2s ease;
    }

    .btn-apply:hover {
      background: var(--navy);
      color: #ffffff;
      border-color: var(--navy);
      box-shadow: 0 4px 14px rgba(10, 25, 47, 0.2);
    }

    .btn-apply svg {
      transition: transform .2s ease;
    }

    .btn-apply:hover svg {
      transform: translateX(3px) translateY(-1px);
    }

    .direct-apply-sublink {
      font-size: .78rem;
      color: var(--slate);
      font-weight: 600;
      text-decoration: none;
      transition: color .2s ease;
    }

    .direct-apply-sublink:hover {
      text-decoration: underline;
      color: var(--navy);
    }

    .meta-row {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      font-size: .86rem;
      color: var(--slate);
      margin-bottom: 14px;
    }

    .meta-item {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .meta-item svg {
      color: var(--amber);
      flex-shrink: 0;
    }

    .salary-box {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(232, 137, 29, 0.08);
      padding: 6px 14px;
      border-radius: 8px;
      font-size: .88rem;
      color: var(--navy);
      margin-bottom: 14px;
    }

    .salary-label {
      color: var(--slate);
      font-weight: 500;
    }

    .salary-amount {
      font-weight: 700;
      color: var(--navy);
    }

    .salary-rate {
      color: var(--slate);
      font-size: .8rem;
    }

    .skills-wrap {
      margin-bottom: 12px;
    }

    .skills-label {
      display: block;
      font-size: .78rem;
      text-transform: uppercase;
      letter-spacing: .05em;
      color: var(--slate);
      margin-bottom: 6px;
      font-weight: 600;
    }

    .skills-list {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }

    .skill-tag {
      background: #f1f5f9;
      color: var(--navy);
      padding: 4px 10px;
      border-radius: 6px;
      font-size: .78rem;
      font-weight: 500;
    }

    .benefits-wrap {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-bottom: 14px;
    }

    .benefits-pill {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      background: #fdf6ec;
      color: #92400e;
      padding: 3px 10px;
      border-radius: 999px;
      font-size: .76rem;
      font-weight: 600;
    }

    .job-card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      padding-top: 14px;
      border-top: 1px solid var(--line);
    }

    .btn-toggle-details {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: none;
      border: none;
      color: var(--amber);
      font-size: .88rem;
      font-weight: 600;
      cursor: pointer;
      padding: 4px 0;
      font-family: inherit;
    }

    .btn-toggle-details:hover {
      text-decoration: underline;
    }

    .chevron {
      transition: transform .2s ease;
    }

    .chevron.rotated {
      transform: rotate(180deg);
    }

    .mobile-action {
      display: none;
      flex-direction: column;
      gap: 8px;
    }

    .btn-apply-direct {
      font-size: .85rem;
      padding: 8px 14px;
      text-align: center;
    }

    .job-details-drawer {
      margin-top: 16px;
      padding: 24px;
      background: #fafbfe;
      border-radius: 12px;
      border: 1px solid var(--line);
    }

    .job-details-inner {
      font-size: .93rem;
      line-height: 1.68;
      color: var(--navy);
      word-break: break-word;
      overflow-wrap: break-word;
    }

    .job-details-inner table {
      width: 100% !important;
      display: block;
      overflow-x: auto;
    }

    .job-details-inner h1,
    .job-details-inner h2,
    .job-details-inner h3 {
      color: var(--navy);
      margin-top: 16px;
      margin-bottom: 8px;
    }

    .job-details-inner ul {
      margin: 8px 0 16px 20px;
    }

    .job-details-inner li {
      margin-bottom: 6px;
    }

    .drawer-action-row {
      margin-top: 24px;
      padding-top: 18px;
      border-top: 1px solid var(--line);
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      align-items: center;
    }

    /* Talent Banner */
    .talent-banner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 24px;
      flex-wrap: wrap;
      background: linear-gradient(135deg, var(--navy) 0%, #1a2a3a 100%);
      color: #ffffff;
      padding: clamp(28px, 4vw, 44px);
      border-radius: 18px;
      box-shadow: 0 10px 30px rgba(15, 23, 42, 0.12);
      margin-top: 40px;
    }

    .talent-content {
      flex: 1;
      min-width: 280px;
    }

    .eyebrow-accent {
      display: inline-block;
      color: var(--amber);
      font-size: .78rem;
      text-transform: uppercase;
      letter-spacing: .08em;
      font-weight: 700;
      margin-bottom: 8px;
    }

    .talent-banner h3 {
      color: #ffffff;
      margin: 0 0 10px;
      font-size: clamp(1.2rem, 2.2vw, 1.55rem);
    }

    .talent-banner p {
      color: rgba(255, 255, 255, 0.82);
      margin: 0;
      font-size: .94rem;
      line-height: 1.55;
    }

    .talent-cta {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      align-items: center;
    }

    .talent-cta .btn-primary {
      background: var(--amber);
      color: var(--navy);
      border-color: var(--amber);
      font-weight: 700;
      padding: 12px 24px;
    }

    .talent-cta .btn-primary:hover {
      background: #ffffff;
      color: var(--navy);
      border-color: #ffffff;
    }

    .talent-contact-btn {
      border-color: rgba(255, 255, 255, 0.35);
      color: #ffffff;
      padding: 12px 20px;
      font-size: .92rem;
    }

    .talent-contact-btn:hover {
      background: rgba(255, 255, 255, 0.12);
      border-color: #ffffff;
      color: #ffffff;
    }

    /* Skeleton Shimmer */
    .skeleton-card {
      background: #ffffff;
      border: 1px solid var(--line);
      border-radius: 14px;
      padding: 24px;
      margin-bottom: 16px;
    }

    .skeleton.line {
      height: 14px;
      background: linear-gradient(90deg, #f0f3f6 25%, #e6ebef 50%, #f0f3f6 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 6px;
      margin-bottom: 10px;
    }

    .skeleton.line.title {
      width: 45%;
      height: 20px;
      margin-bottom: 14px;
    }

    .skeleton.line.subtitle {
      width: 70%;
    }

    .skeleton.line.meta {
      width: 30%;
    }

    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    /* Error & Empty Card */
    .error-card, .empty-card {
      padding: 48px 24px;
      text-align: center;
    }

    .error-icon, .empty-icon {
      font-size: 2.5rem;
      margin-bottom: 12px;
    }

    .error-actions {
      display: flex;
      gap: 12px;
      justify-content: center;
      margin-top: 18px;
      flex-wrap: wrap;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .ats-status-strip {
        flex-direction: column;
        align-items: flex-start;
      }
      .status-right {
        width: 100%;
        justify-content: space-between;
      }
      .desktop-action {
        display: none;
      }
      .mobile-action {
        display: flex;
        flex-direction: column;
        gap: 8px;
        width: 100%;
      }
      .mobile-action .btn-apply,
      .mobile-action .btn-apply-direct {
        width: 100%;
        justify-content: center;
      }
      .job-card-footer {
        flex-direction: column;
        align-items: stretch;
      }
      .drawer-action-row {
        flex-direction: column;
        align-items: stretch;
      }
      .drawer-action-row .btn {
        width: 100%;
        justify-content: center;
      }
      .talent-banner {
        flex-direction: column;
        align-items: flex-start;
      }
      .talent-cta {
        width: 100%;
      }
      .talent-cta .btn {
        width: 100%;
        justify-content: center;
      }
    }

    @media (max-width: 540px) {
      .job-card {
        padding: 18px 16px;
        border-radius: 12px;
      }
      .job-title {
        font-size: 1.15rem;
      }
      .meta-row {
        gap: 10px;
        font-size: .82rem;
      }
      .salary-box {
        width: 100%;
        justify-content: flex-start;
      }
      .filter-chips {
        gap: 6px;
      }
      .chip {
        padding: 5px 12px;
        font-size: .78rem;
      }
      .ats-status-strip {
        padding: 14px 16px;
      }
      .job-details-drawer {
        padding: 16px;
      }
    }
  `]
})
export class CareersComponent implements OnInit {
  jobs: LiveJob[] = [];
  filteredJobs: LiveJob[] = [];
  loading = true;
  error = false;
  searchQuery = '';
  selectedNature = 'ALL';
  expandedJobUuids = new Set<string>();

  private api = inject(ApiService);
  private document = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadJobs();
    }
  }

  loadJobs() {
    this.loading = true;
    this.error = false;

    this.api.getLiveJobs().subscribe({
      next: (res: any) => {
        if (Array.isArray(res)) {
          this.jobs = res;
        } else if (res && Array.isArray(res.data)) {
          this.jobs = res.data;
        } else {
          this.jobs = [];
        }
        this.applyFilters();
        if (isPlatformBrowser(this.platformId) && this.jobs.length) {
          this.injectJobPostingSchema(this.jobs);
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('[Careers API error]', err);
        this.loading = false;
        this.error = true;
      }
    });
  }

  cleanTitle(title: string): string {
    return (title || '').trim();
  }

  getLocationString(j: LiveJob): string {
    if (j.city && j.city.length) {
      return `${j.city.join(', ')}, ${j.location || 'Pakistan'}`;
    }
    return j.location || 'Pakistan';
  }

  formatSalary(amount: string, currency: string): string {
    if (!amount) return '';
    const str = amount.trim();
    if (/market|competitive|negotiable/i.test(str)) {
      return str;
    }
    const curr = currency || 'PKR';
    if (str.includes('to') || str.includes('-')) {
      const parts = str.split(/\s*to\s*|\s*-\s*/i);
      const formattedParts = parts.map(p => {
        const n = Number(p.replace(/,/g, '').trim());
        return !isNaN(n) && n > 0 ? n.toLocaleString() : p.trim();
      });
      return `${curr} ${formattedParts.join(' – ')}`;
    }
    const num = Number(str.replace(/,/g, ''));
    return !isNaN(num) && num > 0 ? `${curr} ${num.toLocaleString()}` : `${curr} ${str}`;
  }

  applyFilters() {
    const q = (this.searchQuery || '').trim().toLowerCase();
    this.filteredJobs = this.jobs.filter(j => {
      // Nature filter
      if (this.selectedNature !== 'ALL') {
        const nature = (j.jobNature || '').toLowerCase();
        if (!nature.includes(this.selectedNature.toLowerCase())) {
          return false;
        }
      }

      // Keyword query
      if (q) {
        const titleMatch = (j.jobTitle || '').toLowerCase().includes(q);
        const locMatch = (j.location || '').toLowerCase().includes(q) || (j.city || []).some(c => c.toLowerCase().includes(q));
        const indMatch = (j.industryType || '').toLowerCase().includes(q);
        const toolsMatch = (j.toolsHandlingExperience || []).some(t => t.toLowerCase().includes(q));
        const descMatch = (j.detailedJobDescription || '').toLowerCase().includes(q);
        if (!titleMatch && !locMatch && !indMatch && !toolsMatch && !descMatch) {
          return false;
        }
      }

      return true;
    });
  }

  setNatureFilter(nature: string) {
    this.selectedNature = nature;
    this.applyFilters();
  }

  clearSearch() {
    this.searchQuery = '';
    this.applyFilters();
  }

  resetAllFilters() {
    this.searchQuery = '';
    this.selectedNature = 'ALL';
    this.applyFilters();
  }

  toggleExpand(uuid: string) {
    if (this.expandedJobUuids.has(uuid)) {
      this.expandedJobUuids.delete(uuid);
    } else {
      this.expandedJobUuids.add(uuid);
    }
  }

  isExpanded(uuid: string): boolean {
    return this.expandedJobUuids.has(uuid);
  }

  trackByUuid(_: number, item: LiveJob): string {
    return item.uuid;
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
          title: this.cleanTitle(j.jobTitle),
          description: j.detailedJobDescription || j.jobTitle,
          datePosted: j.closingDate || new Date().toISOString(),
          employmentType: (j.jobType || 'FULL_TIME').toUpperCase().replace(/[\s-]+/g, '_'),
          hiringOrganization: { '@type': 'Organization', name: 'HDDP Consultants', sameAs: 'https://hddpconsultants.com/' },
          jobLocation: {
            '@type': 'Place',
            address: {
              '@type': 'PostalAddress',
              addressLocality: (j.city && j.city.length ? j.city.join(', ') : j.location || 'Lahore'),
              addressCountry: j.location === 'Pakistan' ? 'PK' : 'GB'
            }
          },
          ...(j.salary ? {
            baseSalary: {
              '@type': 'MonetaryAmount',
              currency: j.currency || 'PKR',
              value: { '@type': 'QuantitativeValue', value: j.salary, unitText: (j.rate || 'MONTH').toUpperCase() }
            }
          } : {}),
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
