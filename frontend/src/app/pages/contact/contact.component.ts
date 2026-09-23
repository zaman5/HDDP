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
    <div class="container contact-grid">
      <!-- Contact Form Card -->
      <div class="card form-card">
        <h2 class="form-title">Send us a message</h2>
        <p class="muted form-sub">Fill out the form below and an HDDP consultant will get in touch with you.</p>

        <div class="alert ok" *ngIf="sent">
          <strong>✔ Thank you!</strong> Your message has been received. We'll get back to you shortly.
        </div>
        <div class="alert err" *ngIf="error">{{ error }}</div>

        <form (ngSubmit)="submit()" *ngIf="!sent">
          <div class="field">
            <label for="c-name">Full Name *</label>
            <input id="c-name" [(ngModel)]="form.name" name="name" placeholder="Your name" required>
          </div>
          <div class="field">
            <label for="c-email">Email Address *</label>
            <input id="c-email" [(ngModel)]="form.email" name="email" type="email" placeholder="you@company.com" required>
          </div>
          <div class="field">
            <label for="c-phone">Phone Number</label>
            <input id="c-phone" [(ngModel)]="form.phone" name="phone" placeholder="+1 (xxx) xxx-xxxx">
          </div>
          <div class="field">
            <label for="c-subject">Subject</label>
            <input id="c-subject" [(ngModel)]="form.subject" name="subject" placeholder="e.g. Healthcare Staffing Inquiry">
          </div>
          <div class="field">
            <label for="c-msg">Message *</label>
            <textarea id="c-msg" [(ngModel)]="form.message" name="message" rows="5" placeholder="How can we help your organization?" required></textarea>
          </div>
          <button class="btn btn-primary btn-mobile-full" type="submit" [disabled]="busy">
            {{ busy ? 'Sending message…' : 'Send message' }}
          </button>
        </form>
      </div>

      <!-- Contact Info & Map -->
      <div class="info-sidebar">
        <div class="card info-card">
          <h3 class="info-heading">Our Office</h3>
          <p class="info-text">{{ site.address }}</p>

          <h3 class="info-heading">Phone</h3>
          <p class="info-text"><a href="tel:+14807122224">{{ site.phone }}</a></p>

          <h3 class="info-heading">Email</h3>
          <p class="info-text"><a [href]="'mailto:' + site.email">{{ site.email }}</a></p>

          <h3 class="info-heading">Connect On Social</h3>
          <div class="social-pills">
            <a [href]="site.social.linkedin" target="_blank" rel="noopener">LinkedIn</a>
            <a [href]="site.social.facebook" target="_blank" rel="noopener">Facebook</a>
            <a [href]="site.social.instagram" target="_blank" rel="noopener">Instagram</a>
          </div>
        </div>

        <div class="map-wrap">
          <iframe
            title="HDDP Consultants office location map"
            width="100%"
            height="290"
            style="border:0; border-radius: var(--radius); display: block;"
            loading="lazy"
            src="https://www.google.com/maps?q=808+N+4th+Ave+Phoenix+AZ+85003&output=embed">
          </iframe>
        </div>
      </div>
    </div>
  </section>
  `,
  styles: [`
    .contact-grid {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 36px;
      align-items: start;
    }
    .form-card {
      padding: 34px;
    }
    .form-title {
      font-size: 1.5rem;
      margin: 0 0 6px;
      color: var(--navy);
    }
    .form-sub {
      margin: 0 0 24px;
      font-size: .94rem;
    }
    .info-card {
      padding: 30px;
    }
    .info-heading {
      font-size: .92rem;
      text-transform: uppercase;
      letter-spacing: .08em;
      color: var(--amber);
      margin: 18px 0 6px;
      font-weight: 700;
    }
    .info-heading:first-child {
      margin-top: 0;
    }
    .info-text {
      margin: 0;
      font-size: 1.02rem;
      color: var(--navy);
    }
    .info-text a {
      color: var(--navy);
      font-weight: 500;
    }
    .info-text a:hover {
      color: var(--amber);
    }
    .social-pills {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-top: 8px;
    }
    .social-pills a {
      background: var(--bg);
      border: 1px solid var(--line);
      padding: 5px 14px;
      border-radius: 999px;
      font-size: .82rem;
      font-weight: 500;
      color: var(--navy);
      transition: all .2s ease;
    }
    .social-pills a:hover {
      background: var(--amber);
      border-color: var(--amber);
      color: #fff;
    }
    .map-wrap {
      margin-top: 24px;
      border-radius: var(--radius);
      overflow: hidden;
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--line);
    }

    @media (max-width: 900px) {
      .contact-grid {
        grid-template-columns: 1fr;
        gap: 28px;
      }
      .form-card {
        padding: 24px;
      }
    }
  `]
})
export class ContactComponent {
  site = SITE;
  form: any = { name: '', email: '', phone: '', subject: '', message: '' };
  sent = false;
  busy = false;
  error = '';

  constructor(private api: ApiService) {}

  submit() {
    this.error = '';
    if (!this.form.name || !this.form.email || !this.form.message) {
      this.error = 'Please fill in name, email and message.';
      return;
    }
    this.busy = true;
    this.api.sendContact(this.form).subscribe({
      next: () => {
        this.sent = true;
        this.busy = false;
      },
      error: () => {
        this.error = 'Could not send your message. Please try again.';
        this.busy = false;
      }
    });
  }
}
