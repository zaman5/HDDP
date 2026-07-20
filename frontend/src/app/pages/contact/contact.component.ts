import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { SITE } from '../../services/site-content';
import { PageHeroComponent } from '../../components/page-hero/page-hero.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeroComponent],
  template: `
  <app-page-hero eyebrow="Contact Us" title="Get in Touch">
    <p>Tell us about your hiring needs or ask us anything — our team responds promptly.</p>
  </app-page-hero>

  <section class="section">
    <div class="container grid grid-2" style="align-items: start;">
      <div class="card">
        <h2 style="margin-top: 0;">Send us a message</h2>
        <div class="alert ok" *ngIf="sent">✔ Thank you! Your message has been received. We'll get back to you shortly.</div>
        <div class="alert err" *ngIf="error">{{ error }}</div>
        <form (ngSubmit)="submit()" *ngIf="!sent">
          <div class="field"><label>Full Name *</label><input [(ngModel)]="form.name" name="name" required></div>
          <div class="field"><label>Email *</label><input [(ngModel)]="form.email" name="email" type="email" required></div>
          <div class="field"><label>Phone</label><input [(ngModel)]="form.phone" name="phone"></div>
          <div class="field"><label>Subject</label><input [(ngModel)]="form.subject" name="subject"></div>
          <div class="field"><label>Message *</label><textarea [(ngModel)]="form.message" name="message" rows="5" required></textarea></div>
          <button class="btn btn-primary" type="submit" [disabled]="busy">{{ busy ? 'Sending…' : 'Send message' }}</button>
        </form>
      </div>
      <div>
        <div class="card info">
          <h3 style="margin-top:0;">Office</h3>
          <p>{{ site.address }}</p>
          <h3>Phone</h3>
          <p><a href="tel:+14807122224">{{ site.phone }}</a></p>
          <h3>Email</h3>
          <p><a [href]="'mailto:' + site.email">{{ site.email }}</a></p>
          <h3>Follow us</h3>
          <p>
            <a [href]="site.social.linkedin" target="_blank" rel="noopener">LinkedIn</a> ·
            <a [href]="site.social.facebook" target="_blank" rel="noopener">Facebook</a> ·
            <a [href]="site.social.instagram" target="_blank" rel="noopener">Instagram</a>
          </p>
        </div>
        <div class="map">
          <iframe title="HDDP Consultants location map" width="100%" height="280" style="border:0; border-radius: 14px;" loading="lazy"
            src="https://www.google.com/maps?q=808+N+4th+Ave+Phoenix+AZ+85003&output=embed"></iframe>
        </div>
      </div>
    </div>
  </section>
  `,
  styles: [`.info h3 { font-size: .95rem; } .map { margin-top: 22px; }`]
})
export class ContactComponent {
  site = SITE;
  form: any = { name: '', email: '', phone: '', subject: '', message: '' };
  sent = false; busy = false; error = '';
  constructor(private api: ApiService) {}
  submit() {
    this.error = '';
    if (!this.form.name || !this.form.email || !this.form.message) { this.error = 'Please fill in name, email and message.'; return; }
    this.busy = true;
    this.api.sendContact(this.form).subscribe({
      next: () => { this.sent = true; this.busy = false; },
      error: () => { this.error = 'Could not send your message. Please try again.'; this.busy = false; }
    });
  }
}
