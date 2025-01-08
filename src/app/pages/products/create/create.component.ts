import { Component, OnInit } from '@angular/core';
import axios, { AxiosError } from 'axios';
import { environment } from '../../../../environments/environment';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss',
  standalone: false,
})
export class CreateComponent implements OnInit {
  // General
  private _http = axios.create({
    baseURL: `${environment.apiUrl}/products`,
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem(
        environment.apiTokenIdentifier
      )}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
  errorMessage: string | null = null;
  isCreating: boolean = false;

  // form
  name: string | null = null;
  sku: string | null = null;
  description: string | null = null;
  initialStock: number = 0;

  constructor(private _router: Router) {}

  ngOnInit(): void {}

  async createProduct() {
    if (this.isCreating) return;

    this.isCreating = true;

    const body = {
      name: this.name,
      sku: this.sku,
      description: this.description,
      initialStock: this.initialStock,
    };

    try {
      await this._http.post('', body);

      await Swal.fire({
        icon: 'success',
        title: 'Products created successfully',
        timer: 1000,
      });
      this._router.navigateByUrl('/settings/products');
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.status == 400) {
          let errorMessage: any = error.response?.data.message;

          if (Array.isArray(errorMessage)) {
            errorMessage = errorMessage.join(', ');
          }

          this.errorMessage = errorMessage;
        }
      }

      setTimeout(() => {
        this.errorMessage = null;
      }, 3000);
    } finally {
      this.isCreating = false;
    }
  }
}
