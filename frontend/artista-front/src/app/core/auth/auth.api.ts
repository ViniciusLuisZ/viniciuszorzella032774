import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_BASE_URL } from '../api/api.config';


export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
};

@Injectable({ providedIn: 'root' })
export class AuthApi {
  constructor(private http: HttpClient) {}

  login(nome: string) {
    return this.http.post<{ accessToken: string; refreshToken: string }>(
      `${API_BASE_URL}/auth/login`,
      { nome }
    );
  }


  refresh(refreshToken: string) {
    return this.http.post<LoginResponse>(
      `${API_BASE_URL}/auth/refresh`,
      null,
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );
  }

}
