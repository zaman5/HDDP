import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Blog {
  id: number; slug: string; title: string; excerpt: string; content?: string;
  coverImage: string; author: string; published: boolean; createdAt: string; updatedAt: string;
}
export interface QaItem { id: number; question: string; answer: string; category: string; published: boolean; order: number; }
export interface Job {
  id: number; title: string; department: string; location: string; type: string;
  description: string; open: boolean; postedAt: string; updatedAt: string;
}
export interface LiveJob {
  uuid: string; jobTitle: string; location: string; city: string[]; jobType: string; jobNature: string;
  closingDate: string | null; salary: string; currency: string; rate: string; industryType: string;
  detailedJobDescription: string; jobLink: string; uniqueCustomId: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  // Auth
  login(email: string, password: string): Observable<any> { return this.http.post('/api/auth/login', { email, password }); }
  changePassword(currentPassword: string, newPassword: string) { return this.http.post('/api/auth/change-password', { currentPassword, newPassword }); }

  // Blogs
  getBlogs(all = false): Observable<Blog[]> { return this.http.get<Blog[]>('/api/blogs' + (all ? '?all=1' : '')); }
  getBlog(slugOrId: string): Observable<Blog> { return this.http.get<Blog>('/api/blogs/' + slugOrId); }
  createBlog(b: Partial<Blog>) { return this.http.post<Blog>('/api/blogs', b); }
  updateBlog(id: number, b: Partial<Blog>) { return this.http.put<Blog>(`/api/blogs/${id}`, b); }
  deleteBlog(id: number) { return this.http.delete(`/api/blogs/${id}`); }

  // Q&A
  getQa(all = false): Observable<QaItem[]> { return this.http.get<QaItem[]>('/api/qa' + (all ? '?all=1' : '')); }
  createQa(q: Partial<QaItem>) { return this.http.post<QaItem>('/api/qa', q); }
  updateQa(id: number, q: Partial<QaItem>) { return this.http.put<QaItem>(`/api/qa/${id}`, q); }
  deleteQa(id: number) { return this.http.delete(`/api/qa/${id}`); }

  // Chatbot
  chat(message: string): Observable<{ reply: string }> { return this.http.post<{ reply: string }>('/api/chatbot', { message }); }

  // Contact
  sendContact(data: any) { return this.http.post('/api/contact', data); }

  // Jobs
  getJobs(all = false): Observable<Job[]> { return this.http.get<Job[]>('/api/careers/jobs' + (all ? '?all=1' : '')); }
  createJob(j: Partial<Job>) { return this.http.post<Job>('/api/careers/jobs', j); }
  updateJob(id: number, j: Partial<Job>) { return this.http.put<Job>(`/api/careers/jobs/${id}`, j); }
  deleteJob(id: number) { return this.http.delete(`/api/careers/jobs/${id}`); }

  // Live job openings (Accelerec careers portal)
  getLiveJobs(): Observable<LiveJob[]> { return this.http.get<LiveJob[]>('/api/careers/live-jobs'); }

  // Admin
  getStats() { return this.http.get<any>('/api/admin/stats'); }
  getMessages() { return this.http.get<any[]>('/api/contact'); }
  markMessageRead(id: number) { return this.http.put(`/api/contact/${id}/read`, {}); }
  deleteMessage(id: number) { return this.http.delete(`/api/contact/${id}`); }
  getApplications() { return this.http.get<any[]>('/api/careers'); }
  setApplicationStatus(id: number, status: string) { return this.http.put(`/api/careers/${id}/status`, { status }); }
  deleteApplication(id: number) { return this.http.delete(`/api/careers/${id}`); }
  getChatlogs() { return this.http.get<any[]>('/api/admin/chatlogs'); }
}
