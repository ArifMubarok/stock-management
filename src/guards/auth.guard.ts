import {
  ActivatedRouteSnapshot,
  CanActivate,
  GuardResult,
  MaybeAsync,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { environment } from '../environments/environment';
import { Injectable } from '@angular/core';
import axios, { AxiosError } from 'axios';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private _http = axios.create({
    baseURL: `${environment.apiUrl}/auth`,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  constructor(private _router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): MaybeAsync<GuardResult> {
    const token = window.localStorage.getItem(environment.apiTokenIdentifier);
    if (!token || token === null || token === undefined || token.length <= 0) {
      this._router.navigateByUrl('/login');
      return false;
    }

    const url = state.url;

    this._http
      .post(
        'authenticate',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .catch((error) => {
        if (error instanceof AxiosError) {
          if (error.status == 400) {
            let errorMessage: string = error.response?.data.message;

            if (Array.isArray(errorMessage)) {
              errorMessage = errorMessage.join('\n');
            }

            if (errorMessage.includes('Token')) {
              this._http
                .post(
                  'refresh',
                  {},
                  { headers: { Authorization: `Bearer ${token}` } }
                )
                .then((response) => {
                  const data = response.data;

                  window.localStorage.setItem(
                    environment.apiTokenIdentifier,
                    data.data.token
                  );

                  setTimeout(() => {
                    window.location.reload();
                    this._router.navigateByUrl(url);
                  }, 50);
                });
            }
          }
        }
      });

    return true;
  }
}
