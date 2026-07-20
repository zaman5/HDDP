import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { WhoWeAreComponent } from './pages/who-we-are/who-we-are.component';
import { SolutionComponent } from './pages/solution/solution.component';
import { IndustryComponent } from './pages/industry/industry.component';
import { HowWeWorkComponent } from './pages/how-we-work/how-we-work.component';
import { ContactComponent } from './pages/contact/contact.component';
import { CareersComponent } from './pages/careers/careers.component';
import { BlogsComponent } from './pages/blogs/blogs.component';
import { BlogDetailComponent } from './pages/blog-detail/blog-detail.component';
import { QaComponent } from './pages/qa/qa.component';
import { AdminComponent } from './pages/admin/admin.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'HDDP Consultants – Hiring, Development & Deployment Process Consultants',
    data: { description: 'HDDP Consultants delivers Hiring, Development & Deployment Process solutions — recruitment, HR managed services, organizational restructuring and corporate training across every industry.' } },
  { path: 'who-we-are', component: WhoWeAreComponent, title: 'Who We Are – HDDP Consultants',
    data: { description: 'For over 25 years HDDP Consultants has connected talent, strategy and business insight to deliver transformative workforce solutions across 6+ industries.' } },

  // Solutions (data-driven by slug)
  { path: 'recruitment-placement-services', component: SolutionComponent, title: 'Recruitment & Placement Services – HDDP Consultants',
    data: { description: 'Expert headhunting and recruitment & placement services from HDDP Consultants — tailored strategies to source, screen and place top-tier talent fast.' } },
  { path: 'organizational-restructuring', component: SolutionComponent, title: 'Organizational Restructuring – HDDP Consultants',
    data: { description: 'HDDP Consultants helps organizations realign structures, optimize efficiency and manage change — data-driven, people-centered organizational restructuring.' } },
  { path: 'corporate-training-solutions', component: SolutionComponent, title: 'Corporate Training Solutions – HDDP Consultants',
    data: { description: 'Customized corporate training programs from HDDP Consultants — leadership development, communication, compliance and performance training that inspires results.' } },
  { path: 'hr-managed-services', component: SolutionComponent, title: 'HR Managed Services – HDDP Consultants',
    data: { description: 'End-to-end HR Managed Services from HDDP Consultants — payroll, RPO, performance management, benefits administration and HR technology integration.' } },

  // Industries
  { path: 'healthcare', component: IndustryComponent, title: 'Healthcare – HDDP Consultants',
    data: { description: 'HDDP Consultants staffs healthcare organizations with credentialed clinical, allied health, administration and healthcare IT professionals — placements in days.' } },
  { path: 'information-technology', component: IndustryComponent, title: 'Information Technology – HDDP Consultants',
    data: { description: 'HDDP Consultants recruits software engineers, cloud, data, cybersecurity and IT leadership talent for on-site, remote and hybrid teams.' } },
  { path: 'banking-financial-services', component: IndustryComponent, title: 'Banking & Financial Services – HDDP Consultants',
    data: { description: 'HDDP Consultants places trusted banking and financial services professionals combining regulatory precision with performance.' } },
  { path: 'consumer-goods-retail', component: IndustryComponent, title: 'Consumer Goods & Retail – HDDP Consultants',
    data: { description: 'HDDP Consultants powers consumer goods and retail brands with agile talent across store operations, supply chain and e-commerce.' } },
  { path: 'travel-transportation', component: IndustryComponent, title: 'Travel & Transportation – HDDP Consultants',
    data: { description: 'HDDP Consultants connects the travel and transportation industry with skilled logistics, operations and customer experience professionals.' } },
  { path: 'industries-we-serve', component: IndustryComponent, title: 'Industries We Serve – HDDP Consultants',
    data: { description: 'HDDP Consultants delivers tailored HR and staffing solutions across construction, manufacturing, education, energy, public sector and more.' } },

  { path: 'how-we-work', component: HowWeWorkComponent, title: 'How We Work – HDDP Consultants',
    data: { description: 'HDDP Consultants’ 4-step recruitment process — Talent Sourcing, Screening & Assessment, Selection & Placement, and Ongoing Partnership.' } },
  { path: 'get-in-touch', component: ContactComponent, title: 'Get in Touch – HDDP Consultants',
    data: { description: 'Contact HDDP Consultants to discuss your hiring needs or workforce strategy — call, email, or send us a message and our team responds promptly.' } },
  { path: 'careers', component: CareersComponent, title: 'Careers – HDDP Consultants',
    data: { description: 'Explore current job openings across HDDP Consultants’ client network and apply directly to the role that fits you.' } },
  { path: 'apply-now', component: CareersComponent, title: 'Apply Now – HDDP Consultants',
    data: { description: 'Apply now for open positions across HDDP Consultants’ client network — permanent, contract, remote and hybrid roles.' } },
  { path: 'blogs', component: BlogsComponent, title: 'Blogs – HDDP Consultants',
    data: { description: 'Workforce insights, recruitment strategy and industry trends from the HDDP Consultants team.' } },
  { path: 'blogs/:slug', component: BlogDetailComponent, title: 'Blog – HDDP Consultants',
    data: { description: 'Workforce insights, recruitment strategy and industry trends from the HDDP Consultants team.' } },
  { path: 'qa', component: QaComponent, title: 'Q&A – HDDP Consultants',
    data: { description: 'Answers to common questions about HDDP Consultants’ services, industries, recruitment process and careers.' } },

  // Admin panel (both /admin and /Admin work)
  { path: 'admin', component: AdminComponent, title: 'Admin – HDDP Consultants',
    data: { description: 'HDDP Consultants admin panel.', noIndex: true } },
  { path: 'Admin', redirectTo: 'admin' },

  { path: '**', redirectTo: '' }
];
