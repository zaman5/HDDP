import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-admin-applications-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <h1>Job Applications</h1>
  <table class="table">
    <thead><tr><th>Candidate</th><th>Position</th><th>Links</th><th>Status</th><th style="width:120px">Actions</th></tr></thead>
    <tbody>
      <tr *ngFor="let a of applications">
        <td><strong>{{ a.name }}</strong><br><small>{{ a.email }} <span *ngIf="a.phone">· {{ a.phone }}</span></small></td>
        <td>{{ a.position || '—' }}</td>
        <td><a *ngIf="a.linkedin" [href]="a.linkedin" target="_blank" rel="noopener">Profile</a></td>
        <td>
          <select [ngModel]="a.status" (ngModelChange)="setStatus(a, $event)">
            <option value="new">New</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="interview">Interview</option>
            <option value="hired">Hired</option>
            <option value="rejected">Rejected</option>
          </select>
        </td>
        <td><button class="mini danger" (click)="deleteApplication(a)">Delete</button></td>
      </tr>
      <tr *ngIf="!applications.length"><td colspan="5" class="muted">No applications yet.</td></tr>
    </tbody>
  </table>
  `,
  styles: [`
    h1 { margin-top: 0; }
    .table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 14px; overflow: hidden; border: 1px solid var(--line); margin-top: 18px; }
    .table th { background: var(--navy); color: #fff; text-align: left; padding: 12px 14px; font-family: var(--font-display); font-size: .78rem; letter-spacing: .05em; }
    .table td { padding: 12px 14px; border-top: 1px solid var(--line); vertical-align: top; font-size: .9rem; }
    .mini { border: 1px solid var(--line); background: #fff; border-radius: 8px; padding: 5px 12px; font-size: .78rem; cursor: pointer; margin: 2px 4px 2px 0; color: var(--navy); }
    .mini.danger:hover { border-color: #e04646; color: #e04646; }
    select { padding: 7px 10px; border: 1.5px solid var(--line); border-radius: 8px; font: inherit; font-size: .85rem; }
  `]
})
export class AdminApplicationsTabComponent implements OnInit {
  applications: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() { this.api.getApplications().subscribe({ next: a => this.applications = a, error: () => {} }); }

  setStatus(a: any, status: string) { this.api.setApplicationStatus(a.id, status).subscribe(() => a.status = status); }
  deleteApplication(a: any) {
    if (!confirm('Delete this application?')) return;
    this.api.deleteApplication(a.id).subscribe(() => this.applications = this.applications.filter(x => x.id !== a.id));
  }
}
