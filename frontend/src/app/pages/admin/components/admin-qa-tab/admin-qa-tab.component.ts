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
    <button class="btn btn-primary" (click)="newQa()">+ Add Q&amp;A</button>
  </div>

  <div class="panel" *ngIf="qaEditing">
    <h3 style="margin-top:0">{{ qaIsNew ? 'New Q&A item' : 'Edit Q&A item' }}</h3>
    <div class="field"><label>Question *</label><input [(ngModel)]="qaEditing.question" name="qq"></div>
    <div class="field"><label>Answer *</label><textarea [(ngModel)]="qaEditing.answer" name="qa" rows="4"></textarea></div>
    <div class="row-2">
      <div class="field"><label>Category</label><input [(ngModel)]="qaEditing.category" name="qc" placeholder="e.g. Services"></div>
      <div class="field"><label>Order</label><input [(ngModel)]="qaEditing.order" name="qo" type="number"></div>
    </div>
    <label class="pub-toggle"><input type="checkbox" [(ngModel)]="qaEditing.published" name="qp"> Published</label>
    <div style="margin-top:14px">
      <button class="btn btn-primary" (click)="saveQa()">Save</button>
      <button class="btn btn-outline" (click)="qaEditing = null">Cancel</button>
    </div>
  </div>

  <table class="table">
    <thead><tr><th>#</th><th>Question</th><th>Category</th><th>Status</th><th style="width:160px">Actions</th></tr></thead>
    <tbody>
      <tr *ngFor="let q of qaItems">
        <td>{{ q.order }}</td>
        <td><strong>{{ q.question }}</strong><br><small class="muted">{{ q.answer | slice:0:90 }}…</small></td>
        <td>{{ q.category }}</td>
        <td><span class="badge" [class.pub]="q.published">{{ q.published ? 'Live' : 'Hidden' }}</span></td>
        <td>
          <button class="mini" (click)="editQa(q)">Edit</button>
          <button class="mini danger" (click)="deleteQa(q)">Delete</button>
        </td>
      </tr>
    </tbody>
  </table>
  `,
  styles: [`
    h1 { margin-top: 0; }
    .head-row { display: flex; justify-content: space-between; align-items: center; gap: 14px; flex-wrap: wrap; }
    .panel { background: #fff; border: 1px solid var(--line); border-radius: 14px; padding: 24px; margin-top: 18px; }
    .table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 14px; overflow: hidden; border: 1px solid var(--line); margin-top: 18px; }
    .table th { background: var(--navy); color: #fff; text-align: left; padding: 12px 14px; font-family: var(--font-display); font-size: .78rem; letter-spacing: .05em; }
    .table td { padding: 12px 14px; border-top: 1px solid var(--line); vertical-align: top; font-size: .9rem; }
    .badge { background: #eef1f5; color: var(--slate); border-radius: 999px; padding: 3px 12px; font-size: .74rem; font-weight: 600; }
    .badge.pub { background: #e7f6ec; color: #146c2e; }
    .mini { border: 1px solid var(--line); background: #fff; border-radius: 8px; padding: 5px 12px; font-size: .78rem; cursor: pointer; margin: 2px 4px 2px 0; color: var(--navy); }
    .mini:hover { border-color: var(--amber); color: var(--amber); }
    .mini.danger:hover { border-color: #e04646; color: #e04646; }
    .pub-toggle { display: inline-flex; align-items: center; gap: 8px; font-size: .9rem; color: var(--navy); font-weight: 600; }
    .row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    @media (max-width: 860px) { .row-2 { grid-template-columns: 1fr; } }
  `]
})
export class AdminQaTabComponent implements OnInit {
  @Output() changed = new EventEmitter<void>();

  qaItems: QaItem[] = [];
  qaEditing: Partial<QaItem> | null = null;
  qaIsNew = false;

  constructor(private api: ApiService) {}

  ngOnInit() { this.api.getQa(true).subscribe({ next: q => this.qaItems = q, error: () => {} }); }

  newQa() {
    this.qaIsNew = true;
    this.qaEditing = { question: '', answer: '', category: 'General', published: true, order: this.qaItems.length + 1 };
  }
  editQa(q: QaItem) { this.qaIsNew = false; this.qaEditing = { ...q }; }
  saveQa() {
    if (!this.qaEditing?.question || !this.qaEditing?.answer) return;
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
