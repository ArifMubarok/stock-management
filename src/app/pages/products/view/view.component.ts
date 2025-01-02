import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import axios, { AxiosError } from 'axios';
import { environment } from '../../../../environments/environment';
import { Product } from '../../../../types/product';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss',
  standalone: false,
})
export class ViewComponent implements OnInit {
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
  modelId: string | null = null;
  errorMessage: string | null = null;
  isLoading: boolean = false;

  // Data
  product!: Product;

  constructor(private _router: Router, private _route: ActivatedRoute) {
    this.modelId = this._route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.getProductDetail();
  }

  viewEdit() {
    this._router.navigateByUrl(`/settings/products/edit/${this.modelId}`);
  }

  async getProductDetail() {
    this.isLoading = true;

    try {
      const response = await this._http.get(`${this.modelId}`);
      const data = response.data;

      this.product = data.data;
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
    }
  }
}
