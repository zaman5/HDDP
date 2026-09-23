import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Blog } from '../../../../services/api.service';

@Component({
  selector: 'app-admin-blogs-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="head-row">
    <h1>Blogs Manager</h1>
    <button class="btn btn-primary" (click)="newBlog()" *ngIf="!editing">+ New Blog Post</button>
  </div>

  <!-- Blog list -->
  <div class="table-responsive" *ngIf="!editing">
    <table class="table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Status</th>
          <th>Updated</th>
          <th style="min-width: 200px;">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let b of blogs">
          <td>
            <strong>{{ b.title }}</strong><br>
            <small class="muted">/blogs/{{ b.slug }}</small>
          </td>
          <td>
            <span class="badge" [class.pub]="b.published">{{ b.published ? 'Published' : 'Draft' }}</span>
          </td>
          <td><small>{{ b.updatedAt | date:'medium' }}</small></td>
          <td>
            <button class="mini" (click)="editBlog(b)">Edit</button>
            <button class="mini" (click)="togglePublish(b)">{{ b.published ? 'Unpublish' : 'Publish' }}</button>
            <button class="mini danger" (click)="deleteBlog(b)">Delete</button>
          </td>
        </tr>
        <tr *ngIf="!blogs.length">
          <td colspan="4" class="muted" style="text-align: center; padding: 24px;">No blogs yet — create your first article!</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Blog editor -->
  <div class="panel" *ngIf="editing">
    <div class="head-row" style="margin-bottom: 20px;">
      <h2 style="margin:0">{{ isNew ? 'Create Article' : 'Edit Article' }}</h2>
      <button class="mini" (click)="closeEditor()">← Back to list</button>
    </div>

    <div class="alert ok" *ngIf="saveMsg">{{ saveMsg }}</div>

    <div class="field">
      <label>Article Title *</label>
      <input [(ngModel)]="editing.title" name="btitle" placeholder="e.g. Navigating Healthcare Staffing in 2026">
    </div>

    <div class="field">
      <label>Excerpt (short summary shown on blog cards)</label>
      <textarea [(ngModel)]="editing.excerpt" name="bexcerpt" rows="2" placeholder="Brief summary of the article..."></textarea>
    </div>

    <div class="field">
      <label>Cover Image URL (optional)</label>
      <input [(ngModel)]="editing.coverImage" name="bcover" placeholder="assets/img/… or https://…">
    </div>

    <label class="field-label">Article Content</label>
    <div class="toolbar">
      <button type="button" (click)="formatBlock('H2')" title="Heading">H2</button>
      <button type="button" (click)="formatBlock('H3')" title="Subheading">H3</button>
      <button type="button" (click)="formatBlock('P')" title="Paragraph">¶</button>
      <span class="sep"></span>
      <button type="button" (click)="exec('bold')" title="Bold"><b>B</b></button>
      <button type="button" (click)="exec('italic')" title="Italic"><i>I</i></button>
      <button type="button" (click)="exec('underline')" title="Underline"><u>U</u></button>
      <span class="sep"></span>
      <button type="button" (click)="exec('insertUnorderedList')" title="Bullet list">• List</button>
      <button type="button" (click)="exec('insertOrderedList')" title="Numbered list">1. List</button>
      <span class="sep"></span>
      <button type="button" (click)="insertLink()" title="Insert link">🔗 Link</button>
      <button type="button" (click)="insertImage()" title="Insert image">🖼 Image</button>
      <button type="button" (click)="exec('removeFormat')" title="Clear formatting">✖ Clear</button>
    </div>
    <div #editor class="rte prose" contenteditable="true"></div>

    <div class="editor-actions">
      <label class="pub-toggle">
        <input type="checkbox" [(ngModel)]="editing.published" name="bpub"> Published (visible to website visitors)
      </label>
      <div class="btn-group">
        <button class="btn btn-outline" (click)="saveBlog(false)">Save draft</button>
        <button class="btn btn-primary" (click)="saveBlog(true)">Save &amp; publish</button>
      </div>
    </div>
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
    .field-label { display: block; font-weight: 600; font-size: .88rem; margin: 12px 0 6px; color: var(--navy); }
    .toolbar { display: flex; flex-wrap: wrap; gap: 4px; background: var(--navy); border-radius: 10px 10px 0 0; padding: 8px 10px; }
    .toolbar button { background: rgba(255,255,255,.12); color: #fff; border: none; border-radius: 6px; padding: 6px 12px; font-size: .82rem; cursor: pointer; transition: background .15s ease; }
    .toolbar button:hover { background: var(--amber); }
    .toolbar .sep { width: 1px; background: rgba(255,255,255,.25); margin: 2px 4px; }
    .rte { min-height: 280px; max-height: 60vh; overflow-y: auto; border: 1.5px solid var(--line); border-top: none; border-radius: 0 0 10px 10px; padding: 18px 20px; background: #fff; outline: none; font-size: 1rem; }
    .rte:focus { border-color: var(--amber); }
    .editor-actions { display: flex; justify-content: space-between; align-items: center; gap: 14px; margin-top: 20px; flex-wrap: wrap; }
    .btn-group { display: flex; gap: 10px; flex-wrap: wrap; }
    .pub-toggle { display: inline-flex; align-items: center; gap: 8px; font-size: .92rem; color: var(--navy); font-weight: 600; cursor: pointer; }

    @media (max-width: 640px) {
      .panel { padding: 18px; }
      .editor-actions { flex-direction: column; align-items: stretch; }
      .btn-group { flex-direction: column; width: 100%; }
      .btn-group .btn { width: 100%; justify-content: center; }
    }
  `]
})
export class AdminBlogsTabComponent implements OnInit {
  @ViewChild('editor') editor?: ElementRef<HTMLDivElement>;
  @Output() changed = new EventEmitter<void>();

  blogs: Blog[] = [];
  editing: Partial<Blog> | null = null;
  isNew = false;
  saveMsg = '';

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getBlogs(true).subscribe({
      next: b => this.blogs = b,
      error: () => {}
    });
  }

  newBlog() {
    this.isNew = true;
    this.editing = { title: '', excerpt: '', content: '', coverImage: '', published: false };
    this.saveMsg = '';
    setTimeout(() => this.setEditorHtml(''));
  }

  editBlog(b: Blog) {
    this.isNew = false;
    this.saveMsg = '';
    this.api.getBlog(String(b.id)).subscribe(full => {
      this.editing = { ...full };
      setTimeout(() => this.setEditorHtml(full.content || ''));
    });
  }

  private setEditorHtml(html: string) {
    if (this.editor) this.editor.nativeElement.innerHTML = html;
  }

  exec(cmd: string, value?: string) {
    document.execCommand(cmd, false, value);
    this.editor?.nativeElement.focus();
  }

  insertLink() {
    const url = prompt('Enter URL (https://…):');
    if (url) this.exec('createLink', url);
  }

  insertImage() {
    const url = prompt('Enter image URL:');
    if (url) this.exec('insertImage', url);
  }

  formatBlock(tag: string) {
    this.exec('formatBlock', tag);
  }

  saveBlog(publish?: boolean) {
    if (!this.editing) return;
    if (!this.editing.title?.trim()) {
      this.saveMsg = 'Title is required.';
      return;
    }
    const content = this.editor?.nativeElement.innerHTML || '';
    const payload: Partial<Blog> = { ...this.editing, content };
    if (publish !== undefined) payload.published = publish;
    const done = (b: Blog) => {
      this.saveMsg = payload.published ? 'Saved & published ✔' : 'Saved as draft ✔';
      this.editing = { ...b };
      this.isNew = false;
      this.api.getBlogs(true).subscribe(list => this.blogs = list);
      this.changed.emit();
    };
    if (this.isNew) {
      this.api.createBlog(payload).subscribe({ next: done, error: () => this.saveMsg = 'Save failed.' });
    } else {
      this.api.updateBlog(this.editing.id!, payload).subscribe({ next: done, error: () => this.saveMsg = 'Save failed.' });
    }
  }

  togglePublish(b: Blog) {
    this.api.updateBlog(b.id, { published: !b.published }).subscribe(() => {
      this.api.getBlogs(true).subscribe(list => this.blogs = list);
      this.changed.emit();
    });
  }

  deleteBlog(b: Blog) {
    if (!confirm(`Delete blog "${b.title}"? This cannot be undone.`)) return;
    this.api.deleteBlog(b.id).subscribe(() => {
      this.blogs = this.blogs.filter(x => x.id !== b.id);
      if (this.editing?.id === b.id) this.editing = null;
      this.changed.emit();
    });
  }

  closeEditor() {
    this.editing = null;
  }
}
