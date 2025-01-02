import { Component, OnInit } from '@angular/core';
import axios, { AxiosError } from 'axios';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false,
})
export class LoginComponent implements OnInit {
  private _http = axios.create({
    baseURL: environment.apiUrl,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  // Credential
  username: string | null = null;
  password: string | null = null;

  // General
  isLogging: boolean = false;
  errorMessage: string | null = null;

  constructor(private _router: Router) {}

  ngOnInit(): void {}

  async login() {
    const body = {
      username: this.username,
      password: this.password,
    };

    this.isLogging = true;

    try {
      const response = await this._http.post('auth/login', body);
      const data = response.data;

      window.localStorage.setItem(
        environment.apiTokenIdentifier,
        data.data.token
      );

      setTimeout(() => {
        this._router.navigateByUrl('/dashboard');
      }, 50);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.status == 400) {
          let errorMessage: any = error.response?.data.message;

          if (Array.isArray(errorMessage)) {
            errorMessage = errorMessage.join('\n');
          }

          this.errorMessage = errorMessage;
        }
      }

      setTimeout(() => {
        this.errorMessage = null;
      }, 3000);
    }
  }
}
