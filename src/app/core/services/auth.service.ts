import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiLogin = 'http://127.0.0.1:8000/login';
  private apiLogout = 'http://127.0.0.1:8000/logout';

  constructor(private http: HttpClient, private router: Router) {}

  postLogin(credentials: any): Observable<any> {
    return this.http.post(this.apiLogin, credentials, { withCredentials: true });
  }

  logout(): Observable<any> {
    return this.http.post(this.apiLogout, {}, {withCredentials: true});
  }

}
