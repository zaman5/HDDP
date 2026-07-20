import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ChatbotComponent } from './components/chatbot/chatbot.component';
import { SeoService } from './services/seo.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent, ChatbotComponent],
  template: `
    <app-header *ngIf="!isAdmin"></app-header>
    <main>
      <router-outlet></router-outlet>
    </main>
    <app-footer *ngIf="!isAdmin"></app-footer>
    <app-chatbot *ngIf="!isAdmin"></app-chatbot>
  `
})
export class AppComponent {
  isAdmin = false;
  constructor(router: Router, seo: SeoService) {
    router.events.subscribe(e => {
      if (e instanceof NavigationEnd) this.isAdmin = e.urlAfterRedirects.toLowerCase().startsWith('/admin');
    });
    seo.init();
  }
}
