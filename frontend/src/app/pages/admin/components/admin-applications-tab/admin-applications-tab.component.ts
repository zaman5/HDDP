import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-admin-applications-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="head-row">
    <h1>Job Applications</h1>
    <span class="pill" *ngIf="applications.length">{{ applications.length }} Total</span>
  </div>

  <div class="table-responsive">
    <table class="table">
      <thead>
        <tr>
          <th>Candidate</th>
          <th>Position</th>
          <th>Profile Link</th>
          <th>Status</th>
          <th style="min-width: 120px;">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let a of applications">
          <td>
            <strong>{{ a.name }}</strong><br>
            <small class="muted">{{ a.email }}</small>
            <small class="muted" *ngIf="a.phone"> · {{ a.phone }}</small>
          </td>
          <td>{{ a.position || 'General Application' }}</td>
          <td>
            <a *ngIf="a.linkedin" [href]="a.linkedin" target="_blank" rel="noopener" class="profile-link">
              View Profile ↗
            </a>
            <span class="muted" *ngIf="!a.linkedin">—</span>
          </td>
          <td>
            <select class="status-select" [ngModel]="a.status" (ngModelChange)="setStatus(a, $event)">
              <option value="new">New</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="interview">Interview</option>
              <option value="hired">Hired</option>
              <option value="rejected">Rejected</option>
            </select>
          </td>
          <td>
            <button class="mini danger" (click)="deleteApplication(a)">Delete</button>
          </td>
        </tr>
        <tr *ngIf="!applications.length">
          <td colspan="5" class="muted" style="text-align: center; padding: 24px;">No candidate applications received yet.</td>
        </tr>
      </tbody>
    </table>
  </div>
  `,
  styles: [`
    h1 { margin-top: 0; margin-bottom: 0; }
    .head-row { display: flex; justify-content: space-between; align-items: center; gap: 14px; flex-wrap: wrap; margin-bottom: 18px; }
    .pill { background: var(--amber); color: #fff; border-radius: 999px; padding: 4px 14px; font-size: .8rem; font-weight: 700; }
    .table { width: 100%; border-collapse: collapse; background: #fff; min-width: 650px; }
    .table th { background: var(--navy); color: #fff; text-align: left; padding: 12px 16px; font-family: var(--font-display); font-size: .8rem; letter-spacing: .05em; }
    .table td { padding: 14px 16px; border-top: 1px solid var(--line); vertical-align: middle; font-size: .92rem; }
    .profile-link { color: var(--amber); font-weight: 600; font-size: .85rem; text-decoration: none; }
    .profile-link:hover { text-decoration: underline; }
    .status-select { padding: 7px 12px; border: 1.5px solid var(--line); border-radius: 8px; font-family: inherit; font-size: .88rem; background: #fff; color: var(--navy); font-weight: 500; cursor: pointer; }
    .status-select:focus { outline: none; border-color: var(--amber); }
    .mini { border: 1px solid var(--line); background: #fff; border-radius: 8px; padding: 6px 12px; font-size: .8rem; cursor: pointer; color: var(--navy); font-family: inherit; font-weight: 500; transition: all .15s ease; }
    .mini.danger:hover { border-color: #e04646; color: #e04646; }
  `]
})
export class AdminApplicationsTabComponent implements OnInit {
  applications: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getApplications().subscribe({
      next: a => this.applications = a,
      error: () => {}
    });
  }

  setStatus(a: any, status: string) {
    this.api.setApplicationStatus(a.id, status).subscribe(() => a.status = status);
  }

  deleteApplication(a: any) {
    if (!confirm('Delete this application?')) return;
    this.api.deleteApplication(a.id).subscribe(() => {
      this.applications = this.applications.filter(x => x.id !== a.id);
    });
  }
}
