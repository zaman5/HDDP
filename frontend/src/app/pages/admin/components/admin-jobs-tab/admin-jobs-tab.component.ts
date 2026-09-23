import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Job } from '../../../../services/api.service';

@Component({
  selector: 'app-admin-jobs-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="head-row">
    <h1>Jobs Manager</h1>
    <button class="btn btn-primary" (click)="newJob()" *ngIf="!editing">+ Add New Job</button>
  </div>

  <div class="panel" *ngIf="editing">
    <h3 style="margin-top:0">{{ isNew ? 'New Job Position' : 'Edit Job Position' }}</h3>
    <div class="field">
      <label>Job Title *</label>
      <input [(ngModel)]="editing.title" name="jt" placeholder="e.g. Senior Nurse / Full-Stack Engineer">
    </div>
    <div class="row-2">
      <div class="field">
        <label>Department / Industry</label>
        <input [(ngModel)]="editing.department" name="jd" placeholder="e.g. Healthcare, IT">
      </div>
      <div class="field">
        <label>Location</label>
        <input [(ngModel)]="editing.location" name="jl" placeholder="e.g. Phoenix, AZ / Remote">
      </div>
    </div>
    <div class="field">
      <label>Employment Type</label>
      <input [(ngModel)]="editing.type" name="jty" placeholder="e.g. Full-time / Contract">
    </div>
    <div class="field">
      <label>Job Description</label>
      <textarea [(ngModel)]="editing.description" name="jde" rows="4" placeholder="Responsibilities and requirements..."></textarea>
    </div>
    <label class="pub-toggle">
      <input type="checkbox" [(ngModel)]="editing.open" name="jo"> Open for applications
    </label>
    <div class="form-actions">
      <button class="btn btn-primary" (click)="saveJob()">Save Job</button>
      <button class="btn btn-outline" (click)="editing = null">Cancel</button>
    </div>
  </div>

  <div class="table-responsive" *ngIf="!editing">
    <table class="table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Department</th>
          <th>Location</th>
          <th>Status</th>
          <th style="min-width: 150px;">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let j of jobs">
          <td><strong>{{ j.title }}</strong></td>
          <td>{{ j.department || '—' }}</td>
          <td>{{ j.location || '—' }}</td>
          <td><span class="badge" [class.pub]="j.open">{{ j.open ? 'Open' : 'Closed' }}</span></td>
          <td>
            <button class="mini" (click)="editJob(j)">Edit</button>
            <button class="mini danger" (click)="deleteJob(j)">Delete</button>
          </td>
        </tr>
        <tr *ngIf="!jobs.length">
          <td colspan="5" class="muted" style="text-align: center; padding: 24px;">No internal jobs listed yet.</td>
        </tr>
      </tbody>
    </table>
  </div>
  `,
  styles: [`
    h1 { margin-top: 0; }
    .head-row { display: flex; justify-content: space-between; align-items: center; gap: 14px; flex-wrap: wrap; }
    .panel { background: #fff; border: 1px solid var(--line); border-radius: 14px; padding: 26px; margin-top: 18px; }
    .table { width: 100%; border-collapse: collapse; background: #fff; min-width: 600px; }
    .table th { background: var(--navy); color: #fff; text-align: left; padding: 12px 16px; font-family: var(--font-display); font-size: .8rem; letter-spacing: .05em; }
    .table td { padding: 14px 16px; border-top: 1px solid var(--line); vertical-align: middle; font-size: .92rem; }
    .badge { background: #eef1f5; color: var(--slate); border-radius: 999px; padding: 3px 12px; font-size: .74rem; font-weight: 600; }
    .badge.pub { background: #e7f6ec; color: #146c2e; }
    .mini { border: 1px solid var(--line); background: #fff; border-radius: 8px; padding: 6px 12px; font-size: .8rem; cursor: pointer; margin: 2px 4px 2px 0; color: var(--navy); font-family: inherit; font-weight: 500; transition: all .15s ease; }
    .mini:hover { border-color: var(--amber); color: var(--amber); }
    .mini.danger:hover { border-color: #e04646; color: #e04646; }
    .pub-toggle { display: inline-flex; align-items: center; gap: 8px; font-size: .92rem; color: var(--navy); font-weight: 600; cursor: pointer; margin-top: 6px; }
    .row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .form-actions { margin-top: 18px; display: flex; gap: 10px; flex-wrap: wrap; }

    @media (max-width: 640px) {
      .row-2 { grid-template-columns: 1fr; }
      .panel { padding: 18px; }
      .form-actions .btn { width: 100%; justify-content: center; }
    }
  `]
})
export class AdminJobsTabComponent implements OnInit {
  @Output() changed = new EventEmitter<void>();

  jobs: Job[] = [];
  editing: Partial<Job> | null = null;
  isNew = false;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getJobs(true).subscribe({
      next: j => this.jobs = j,
      error: () => {}
    });
  }

  newJob() {
    this.isNew = true;
    this.editing = { title: '', department: '', location: '', type: 'Full-time', description: '', open: true };
  }

  editJob(j: Job) {
    this.isNew = false;
    this.editing = { ...j };
  }

  saveJob() {
    if (!this.editing?.title?.trim()) return;
    const done = () => {
      this.editing = null;
      this.api.getJobs(true).subscribe(j => this.jobs = j);
      this.changed.emit();
    };
    if (this.isNew) this.api.createJob(this.editing).subscribe(done);
    else this.api.updateJob(this.editing.id!, this.editing).subscribe(done);
  }

  deleteJob(j: Job) {
    if (!confirm('Delete this job?')) return;
    this.api.deleteJob(j.id).subscribe(() => {
      this.jobs = this.jobs.filter(x => x.id !== j.id);
      this.changed.emit();
    });
  }
}
