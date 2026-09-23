import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, QaItem } from '../../../../services/api.service';

@Component({
  selector: 'app-admin-qa-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="head-row">
    <h1>Q&amp;A Manager</h1>
    <button class="btn btn-primary" (click)="newQa()" *ngIf="!qaEditing">+ Add Q&amp;A Item</button>
  </div>

  <div class="panel" *ngIf="qaEditing">
    <h3 style="margin-top:0">{{ qaIsNew ? 'New Q&A item' : 'Edit Q&A item' }}</h3>
    <div class="field">
      <label>Question *</label>
      <input [(ngModel)]="qaEditing.question" name="qq" placeholder="e.g. What industries do you serve?">
    </div>
    <div class="field">
      <label>Answer *</label>
      <textarea [(ngModel)]="qaEditing.answer" name="qa" rows="4" placeholder="Comprehensive answer..."></textarea>
    </div>
    <div class="row-2">
      <div class="field">
        <label>Category</label>
        <input [(ngModel)]="qaEditing.category" name="qc" placeholder="e.g. Services, About Us, Process">
      </div>
      <div class="field">
        <label>Display Order</label>
        <input [(ngModel)]="qaEditing.order" name="qo" type="number">
      </div>
    </div>
    <label class="pub-toggle">
      <input type="checkbox" [(ngModel)]="qaEditing.published" name="qp"> Published (visible on website)
    </label>
    <div class="form-actions">
      <button class="btn btn-primary" (click)="saveQa()">Save Q&amp;A</button>
      <button class="btn btn-outline" (click)="qaEditing = null">Cancel</button>
    </div>
  </div>

  <div class="table-responsive" *ngIf="!qaEditing">
    <table class="table">
      <thead>
        <tr>
          <th style="width: 50px;">#</th>
          <th>Question &amp; Answer</th>
          <th>Category</th>
          <th>Status</th>
          <th style="min-width: 150px;">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let q of qaItems">
          <td><strong>{{ q.order }}</strong></td>
          <td>
            <strong>{{ q.question }}</strong><br>
            <small class="muted">{{ q.answer | slice:0:100 }}…</small>
          </td>
          <td><span class="tag">{{ q.category }}</span></td>
          <td><span class="badge" [class.pub]="q.published">{{ q.published ? 'Live' : 'Hidden' }}</span></td>
          <td>
            <button class="mini" (click)="editQa(q)">Edit</button>
            <button class="mini danger" (click)="deleteQa(q)">Delete</button>
          </td>
        </tr>
        <tr *ngIf="!qaItems.length">
          <td colspan="5" class="muted" style="text-align: center; padding: 24px;">No Q&A items yet.</td>
        </tr>
      </tbody>
    </table>
  </div>
  `,
  styles: [`
    h1 { margin-top: 0; }
    .head-row { display: flex; justify-content: space-between; align-items: center; gap: 14px; flex-wrap: wrap; }
    .panel { background: #fff; border: 1px solid var(--line); border-radius: 14px; padding: 26px; margin-top: 18px; }
    .table { width: 100%; border-collapse: collapse; background: #fff; min-width: 650px; }
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
export class AdminQaTabComponent implements OnInit {
  @Output() changed = new EventEmitter<void>();

  qaItems: QaItem[] = [];
  qaEditing: Partial<QaItem> | null = null;
  qaIsNew = false;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getQa(true).subscribe({
      next: q => this.qaItems = q,
      error: () => {}
    });
  }

  newQa() {
    this.qaIsNew = true;
    this.qaEditing = { question: '', answer: '', category: 'General', published: true, order: this.qaItems.length + 1 };
  }

  editQa(q: QaItem) {
    this.qaIsNew = false;
    this.qaEditing = { ...q };
  }

  saveQa() {
    if (!this.qaEditing?.question?.trim() || !this.qaEditing?.answer?.trim()) return;
    const done = () => {
      this.qaEditing = null;
      this.api.getQa(true).subscribe(q => this.qaItems = q);
      this.changed.emit();
    };
    if (this.qaIsNew) this.api.createQa(this.qaEditing).subscribe(done);
    else this.api.updateQa(this.qaEditing.id!, this.qaEditing).subscribe(done);
  }

  deleteQa(q: QaItem) {
    if (!confirm('Delete this Q&A item?')) return;
    this.api.deleteQa(q.id).subscribe(() => {
      this.qaItems = this.qaItems.filter(x => x.id !== q.id);
      this.changed.emit();
    });
  }
}
