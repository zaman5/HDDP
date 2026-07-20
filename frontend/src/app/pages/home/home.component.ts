import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Blog } from '../../services/api.service';
import { HomeHeroComponent } from './components/home-hero/home-hero.component';
import { ServicesSectionComponent } from './components/services-section/services-section.component';
import { IndustriesSectionComponent } from './components/industries-section/industries-section.component';
import { VisionSectionComponent } from './components/vision-section/vision-section.component';
import { LatestBlogsSectionComponent } from './components/latest-blogs-section/latest-blogs-section.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HomeHeroComponent,
    ServicesSectionComponent,
    IndustriesSectionComponent,
    VisionSectionComponent,
    LatestBlogsSectionComponent
  ],
  template: `
  <app-home-hero></app-home-hero>
  <app-services-section></app-services-section>
  <app-industries-section></app-industries-section>
  <app-vision-section></app-vision-section>
  <app-latest-blogs-section [blogs]="blogs"></app-latest-blogs-section>
  `
})
export class HomeComponent implements OnInit {
  blogs: Blog[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getBlogs().subscribe({ next: b => this.blogs = b.slice(0, 2), error: () => {} });
  }
}
