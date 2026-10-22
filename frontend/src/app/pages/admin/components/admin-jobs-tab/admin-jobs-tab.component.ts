import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService, LiveJob } from '../../../../services/api.service';

@Component({
  selector: 'app-admin-jobs-tab',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
  <div class="head-row">
    <div>
      <h1>Accelerec Jobs Integration</h1>
      <p class="muted">Live job postings and applications are integrated with the Accelerec Portal ATS.</p>
    </div>
    <div class="head-actions">
      <a class="btn btn-outline" routerLink="/careers" target="_blank">
        View Careers Page ↗
      </a>
      <a class="btn btn-primary" href="https://portal.accelerec.com" target="_blank" rel="noopener">
        Manage on Accelerec Portal ↗
      </a>
      <button class="btn btn-outline" (click)="loadLiveJobs()">Refresh</button>
    </div>
  </div>

  <!-- Status Banner (Connected vs Pending) -->
  <div class="accelerec-status-banner" [class.pending]="apiPending || (!loading && !liveJobs.length)">
    <div class="status-indicator">
      <span class="status-dot" [class.pending]="apiPending || (!loading && !liveJobs.length)"></span>
      <div>
        <strong *ngIf="liveJobs.length">Accelerec API Connected &amp; Active</strong>
        <strong *ngIf="apiPending || (!loading && !liveJobs.length)">Accelerec API Key Pending Support Activation</strong>
        <p class="api-meta">
          Endpoint: <code>https://portal.accelerec.com/api/v1/organization/jobs</code> &middot;
          ATS Provider: <code>Accelerec Portal</code>
        </p>
      </div>
    </div>
    <div class="job-count-pill" [class.pending]="apiPending || (!loading && !liveJobs.length)">
      <strong *ngIf="liveJobs.length">{{ liveJobs.length }} Active Openings (API)</strong>
      <strong *ngIf="apiPending || (!loading && !liveJobs.length)">Standby Mode</strong>
    </div>
  </div>

  <!-- Pending Key Guide Notice -->
  <div class="api-guide-card" *ngIf="!loading && (apiPending || !liveJobs.length)">
    <div class="guide-header">
      <div class="guide-icon">🔑</div>
      <div>
        <h3>Step 1: Obtain API Key from Accelerec Support</h3>
        <p class="muted">
          Your portal currently displays <code>SECRET_API_KEY</code> as a placeholder. Once Accelerec support issues your organization's API key, add it to your server configuration.
        </p>
      </div>
    </div>

    <div class="config-instructions">
      <div class="step-item">
        <strong>Backend (Node.js / Express):</strong>
        <p>Set the environment variable in <code>backend/.env</code> or hosting config:</p>
        <pre><code>ACCELEREC_API_KEY=YOUR_ACTUAL_API_KEY</code></pre>
      </div>
      <div class="step-item">
        <strong>cPanel / Apache (PHP Option):</strong>
        <p>Set <code>$apiKey</code> in <code>jobs.php</code> or define the environment variable.</p>
      </div>
    </div>

    <div class="iframe-badge-box">
      <span class="live-tag">✓ No Downtime</span>
      <p>
        The Careers page automatically displays your live positions using the Accelerec embedded iFrame until your API key is activated.
      </p>
      <a routerLink="/careers" class="btn btn-sm btn-outline">Preview Careers iFrame Board →</a>
    </div>
  </div>

  <!-- Jobs Table (Active When API Has Records) -->
  <div class="table-responsive" *ngIf="liveJobs.length">
    <table class="table">
      <thead>
        <tr>
          <th>Role / Position</th>
          <th>Location</th>
          <th>Type &amp; Nature</th>
          <th>Compensation</th>
          <th>Custom ID</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let j of liveJobs">
          <td>
            <strong>{{ j.jobTitle.trim() }}</strong>
            <div class="sub-industry" *ngIf="j.industryType">{{ j.industryType }}</div>
          </td>
          <td>{{ (j.city && j.city.length ? j.city.join(', ') : j.location) || 'United Kingdom' }}</td>
          <td>
            <span class="badge pub">{{ j.jobType || 'Permanent' }}</span>
            <span class="badge" *ngIf="j.jobNature">{{ j.jobNature }}</span>
          </td>
          <td>
            <strong *ngIf="j.salary">{{ j.currency }} {{ j.salary }}</strong>
            <span class="muted" *ngIf="j.rate"> / {{ j.rate }}</span>
            <span class="muted" *ngIf="!j.salary">—</span>
          </td>
          <td><code>{{ j.uniqueCustomId || '—' }}</code></td>
          <td>
            <a class="mini link-btn" [href]="j.jobLink" target="_blank" rel="noopener">
              View on Accelerec ↗
            </a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div *ngIf="loading" class="card center" style="padding: 32px; text-align: center;">
    <p class="muted">Checking Accelerec API connection...</p>
  </div>
  `,
  styles: [`
    h1 { margin-top: 0; margin-bottom: 4px; }
    .head-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; flex-wrap: wrap; margin-bottom: 20px; }
    .head-actions { display: flex; gap: 10px; flex-wrap: wrap; }
    
    .accelerec-status-banner {
      background: #f0f7f2;
      border: 1px solid #b7dfc3;
      border-radius: 12px;
      padding: 16px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
      margin-bottom: 24px;
    }
    .accelerec-status-banner.pending {
      background: #fffbeb;
      border-color: #fde68a;
    }
    .status-indicator {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .status-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #146c2e;
      box-shadow: 0 0 0 3px rgba(20, 108, 46, 0.2);
    }
    .status-dot.pending {
      background: #d97706;
      box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.2);
    }
    .api-meta {
      margin: 2px 0 0;
      font-size: .84rem;
      color: #2e593a;
    }
    .accelerec-status-banner.pending .api-meta {
      color: #92400e;
    }
    .api-meta code {
      background: rgba(0, 0, 0, 0.05);
      padding: 2px 6px;
      border-radius: 4px;
    }
    .job-count-pill {
      font-size: .88rem;
      color: #146c2e;
      background: #fff;
      padding: 6px 14px;
      border-radius: 999px;
      border: 1px solid #b7dfc3;
    }
    .job-count-pill.pending {
      color: #92400e;
      border-color: #fde68a;
      background: #ffffff;
    }

    .api-guide-card {
      background: #ffffff;
      border: 1px solid var(--line);
      border-radius: 14px;
      padding: 24px;
      margin-bottom: 24px;
      box-shadow: 0 4px 18px rgba(0, 0, 0, 0.03);
    }
    .guide-header {
      display: flex;
      gap: 16px;
      align-items: flex-start;
      margin-bottom: 20px;
    }
    .guide-icon {
      font-size: 2rem;
      line-height: 1;
    }
    .guide-header h3 {
      margin: 0 0 6px;
      color: var(--navy);
      font-size: 1.15rem;
    }
    .guide-header p {
      margin: 0;
      line-height: 1.5;
    }
    .config-instructions {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 16px;
      margin-bottom: 20px;
    }
    .step-item {
      background: #f8fafc;
      padding: 16px;
      border-radius: 10px;
      border: 1px solid var(--line);
    }
    .step-item strong {
      display: block;
      color: var(--navy);
      margin-bottom: 6px;
      font-size: .9rem;
    }
    .step-item p {
      margin: 0 0 8px;
      font-size: .84rem;
      color: var(--slate);
    }
    .step-item pre {
      margin: 0;
      background: #0f172a;
      color: #f8fafc;
      padding: 10px 12px;
      border-radius: 6px;
      font-size: .82rem;
      overflow-x: auto;
    }
    .iframe-badge-box {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 10px;
      padding: 14px 18px;
    }
    .live-tag {
      background: #15803d;
      color: #fff;
      font-size: .75rem;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 6px;
    }
    .iframe-badge-box p {
      margin: 0;
      flex: 1;
      font-size: .86rem;
      color: #166534;
      min-width: 240px;
    }
    .btn-sm {
      padding: 6px 12px;
      font-size: .82rem;
    }

    .table { width: 100%; border-collapse: collapse; background: #fff; min-width: 650px; }
    .table th { background: var(--navy); color: #fff; text-align: left; padding: 12px 16px; font-family: var(--font-display); font-size: .8rem; letter-spacing: .05em; }
    .table td { padding: 14px 16px; border-top: 1px solid var(--line); vertical-align: middle; font-size: .92rem; }
    .sub-industry { font-size: .78rem; color: var(--slate); margin-top: 2px; }
    .badge { background: #eef1f5; color: var(--slate); border-radius: 999px; padding: 3px 10px; font-size: .74rem; font-weight: 600; margin-right: 4px; }
    .badge.pub { background: #e7f6ec; color: #146c2e; }
    .mini { border: 1px solid var(--line); background: #fff; border-radius: 8px; padding: 6px 12px; font-size: .8rem; cursor: pointer; color: var(--navy); font-weight: 500; text-decoration: none; display: inline-flex; align-items: center; gap: 4px; transition: all .15s ease; }
    .mini:hover { border-color: var(--amber); color: var(--amber); }

    @media (max-width: 640px) {
      .head-actions { width: 100%; }
      .head-actions .btn { width: 100%; justify-content: center; }
    }
  `]
})
export class AdminJobsTabComponent implements OnInit {
  @Output() changed = new EventEmitter<void>();

  liveJobs: LiveJob[] = [];
  loading = true;
  apiPending = false;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadLiveJobs();
  }

  loadLiveJobs() {
    this.loading = true;
    this.apiPending = false;
    this.api.getLiveJobs().subscribe({
      next: (res: any) => {
        if (res && res.pendingKey) {
          this.apiPending = true;
          this.liveJobs = [];
        } else if (Array.isArray(res)) {
          this.liveJobs = res;
        } else if (res && Array.isArray(res.data)) {
          this.liveJobs = res.data;
        } else {
          this.liveJobs = [];
        }
        this.loading = false;
        this.changed.emit();
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
