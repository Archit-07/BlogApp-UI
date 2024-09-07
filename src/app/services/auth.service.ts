import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface Blog {
    _id: string;
    user: string;
    blogName: string;
    category: string;
    article: string;
    authorName: string;
    createdAt: string;
    updatedAt: string;
  }

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = 'http://localhost:5000/api/v/1.0/blogsite'; // Replace with your actual API URL
  private readonly TOKEN_KEY = 'jwtTokenBlogApp';
  private user: any;
  constructor(private http: HttpClient) {}

  register(registerData: any): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, registerData);
  }

  login(loginData: { loginId: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/login`, loginData).pipe(
      tap((response) => {
        if (response.token) {
            this.setUser(response);
          this.setToken(response.token);
        }
      })
    );
  }

  patchPassword(loginId: string, email: string, password: string): Observable<any> {
    const url = `${this.API_URL}/forgot`;
    const body = { loginId, email, password };

    return this.http.patch(url, body);
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    return !!token;
  }

  logout(): void {
    // Remove the token from localStorage
    localStorage.removeItem('jwtTokenBlogApp');
    localStorage.removeItem('user');
  }

  getAllBlog(): Observable<Blog[]>{
    return this.http.get<Blog[]>(`${this.API_URL}/blogs/getall`);
  }

  addBlog(blogData: any) {
    const token = localStorage.getItem('jwtTokenBlogApp');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const userData = this.getUser();
    return this.http.post(`${this.API_URL}/${userData.loginId}/add`, blogData, { headers });
  }

  updateBlog(blogData: any) {
    const token = localStorage.getItem('jwtTokenBlogApp'); // Get the JWT token from localStorage

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const userData = this.getUser();
    return this.http.put(`${this.API_URL}/${userData.loginId}/update/${blogData._id}`, blogData, { headers });
  }

  deleteBlog(blogData: any) {
    const token = localStorage.getItem('jwtTokenBlogApp');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const userData = this.getUser();
    return this.http.delete(`${this.API_URL}/${userData.loginId}/delete/${blogData._id}`, { headers });
  }

  private setUser(data: any) {
    localStorage.setItem("user", JSON.stringify(data));
  }

    getUser() {
    const data = localStorage.getItem("user") || "{}";
    return JSON.parse(data);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

}
